package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"net/url"
	"os"

	"01-Login/platform/authenticator"
	"01-Login/platform/services"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CallbackHandler for our callback.
func CallbackHandler(auth *authenticator.Authenticator) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		session := sessions.Default(ctx)

		// Get the state parameter (Gin already URL-decodes query parameters)
		stateParam := ctx.Query("state")

		// Get stored state from session
		storedState := session.Get("state")

		// Debug logging
		log.Printf("Received state: %s", stateParam)
		log.Printf("Stored state: %v", storedState)
		log.Printf("Session ID: %s", session.ID())

		// Compare with stored state
		if stateParam != storedState {
			log.Printf("State mismatch - Received: %s, Stored: %v", stateParam, storedState)
			ctx.String(http.StatusBadRequest, "Invalid state parameter.")
			return
		}

		log.Printf("State validation successful")

		// Exchange an authorization code for a token.
		token, err := auth.Exchange(ctx.Request.Context(), ctx.Query("code"))
		if err != nil {
			log.Printf("Token exchange error: %v", err)
			ctx.String(http.StatusUnauthorized, "Failed to convert an authorization code into a token.")
			return
		}

		idToken, err := auth.VerifyIDToken(ctx.Request.Context(), token)
		if err != nil {
			log.Printf("ID Token verification error: %v", err)
			ctx.String(http.StatusInternalServerError, "Failed to verify ID Token.")
			return
		}

		var profile map[string]interface{}
		if err := idToken.Claims(&profile); err != nil {
			log.Printf("Claims extraction error: %v", err)
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Create or update user in database
		userService := services.NewUserService()
		authID := profile["sub"].(string)

		// Safely extract profile fields with fallbacks
		email := ""
		if emailVal, ok := profile["email"]; ok && emailVal != nil {
			if emailStr, ok := emailVal.(string); ok {
				email = emailStr
			}
		}

		name := ""
		if nameVal, ok := profile["name"]; ok && nameVal != nil {
			if nameStr, ok := nameVal.(string); ok {
				name = nameStr
			}
		}

		// Use nickname as fallback for name
		if name == "" {
			if nicknameVal, ok := profile["nickname"]; ok && nicknameVal != nil {
				if nicknameStr, ok := nicknameVal.(string); ok {
					name = nicknameStr
				}
			}
		}

		// Use email as fallback for name if still empty
		if name == "" && email != "" {
			name = email
		}

		picture := ""
		if pictureVal, ok := profile["picture"]; ok && pictureVal != nil {
			if pictureStr, ok := pictureVal.(string); ok {
				picture = pictureStr
			}
		}

		// Ensure we have at least authID
		if authID == "" {
			log.Printf("No auth ID found in profile")
			ctx.String(http.StatusInternalServerError, "Invalid user profile.")
			return
		}

		user, err := userService.CreateOrUpdateUserFromAuth(authID, email, name, picture)
		if err != nil {
			log.Printf("Failed to create/update user in database: %v", err)
			ctx.String(http.StatusInternalServerError, "Failed to create user profile.")
			return
		}

		log.Printf("User created/updated in database: %s (ID: %s)", user.Email, user.ID.String())

		// Add the database user_id to the profile
		profile["user_id"] = user.ID.String()

		session.Set("access_token", token.AccessToken)
		session.Set("profile", profile)
		if err := session.Save(); err != nil {
			log.Printf("Session save error: %v", err)
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		log.Printf("Login successful for user: %v", profile["email"])
		// Redirect to logged in page.
		ctx.Redirect(http.StatusTemporaryRedirect, "/user")
	}
}

// CreateEventHandler for the create event page.
func CreateEventHandler(ctx *gin.Context) {
	session := sessions.Default(ctx)
	profile := session.Get("profile")

	// If no profile, redirect to login
	if profile == nil {
		ctx.Redirect(http.StatusTemporaryRedirect, "/login")
		return
	}

	// Extract user data for the template
	profileMap := profile.(map[string]interface{})
	authID := profileMap["sub"].(string)

	// Get user from database using Auth ID
	userService := services.NewUserService()
	user, err := userService.GetUserByAuthID(authID)
	if err != nil {
		// This should never happen now since user is created during login
		ctx.String(http.StatusInternalServerError, "User profile not found. Please try logging in again.")
		return
	}

	// Create template data with user info
	templateData := map[string]interface{}{
		"user_id": user.ID.String(), // Use database user ID
		"email":   user.Email,
		"name":    user.Name,
		"picture": user.Picture,
	}

	ctx.HTML(http.StatusOK, "create-event.html", templateData)
}

// EditEventHandler for the edit event page.
func EditEventHandler(ctx *gin.Context) {
	session := sessions.Default(ctx)
	profile := session.Get("profile")

	// If no profile, redirect to login
	if profile == nil {
		ctx.Redirect(http.StatusTemporaryRedirect, "/login")
		return
	}

	// Get event ID from URL parameter
	eventIDParam := ctx.Param("id")
	eventID, err := uuid.Parse(eventIDParam)
	if err != nil {
		ctx.String(http.StatusBadRequest, "Invalid event ID")
		return
	}

	// Extract user data for the template
	profileMap := profile.(map[string]interface{})
	authID := profileMap["sub"].(string)

	// Get user from database using Auth ID
	userService := services.NewUserService()
	user, err := userService.GetUserByAuthID(authID)
	if err != nil {
		ctx.String(http.StatusInternalServerError, "User profile not found. Please try logging in again.")
		return
	}

	// Get event from database
	eventService := services.NewEventService()
	event, err := eventService.GetEventByID(eventID)
	if err != nil {
		ctx.String(http.StatusNotFound, "Event not found")
		return
	}

	// Check if user is the owner of the event
	if event.UserID != user.ID {
		ctx.String(http.StatusForbidden, "You can only edit your own events")
		return
	}

	// Serialize event data to JSON for the template
	var jsEventData template.JS
	eventBytes, err := json.Marshal(event)
	if err != nil {
		log.Printf("Error marshalling event to JSON: %v", err)
		jsEventData = template.JS("null")
	} else {
		jsEventData = template.JS(string(eventBytes))
	}

	// Create template data with user info and event data
	templateData := map[string]interface{}{
		"user_id":  user.ID.String(),
		"email":    user.Email,
		"name":     user.Name,
		"picture":  user.Picture,
		"event_id": event.ID.String(),
		"event":    jsEventData,
	}

	// Debug logging
	log.Printf("Edit event template data: %+v", templateData)
	log.Printf("Event data: %+v", event)

	ctx.HTML(http.StatusOK, "edit-event.html", templateData)
}

// EventDetailHandler for the event detail page - serves template like other pages
func EventDetailHandler(ctx *gin.Context) {
	eventID := ctx.Param("id")
	session := sessions.Default(ctx)
	profile := session.Get("profile")

	var jsUserData template.JS
	if profile != nil {
		profileBytes, err := json.Marshal(profile)
		if err == nil {
			jsUserData = template.JS(string(profileBytes))
		} else {
			log.Printf("Error marshalling profile to JSON: %v", err)
			jsUserData = template.JS("null")
		}
	} else {
		jsUserData = template.JS("null")
	}

	googleMapsAPIKey := os.Getenv("GOOGLE_MAPS_API_KEY")

	templateData := gin.H{
		"eventId":          eventID,
		"userData":         jsUserData,
		"googleMapsAPIKey": googleMapsAPIKey,
	}

	ctx.HTML(http.StatusOK, "event-detail.html", templateData)
}

// EventsHandler for the events page.
func EventsHandler(ctx *gin.Context) {
	session := sessions.Default(ctx)
	profile := session.Get("profile")

	// If no profile, redirect to login
	if profile == nil {
		ctx.Redirect(http.StatusTemporaryRedirect, "/login")
		return
	}

	// Extract user data for the template
	profileMap := profile.(map[string]interface{})
	authID := profileMap["sub"].(string)

	// Get user from database using Auth ID
	userService := services.NewUserService()
	user, err := userService.GetUserByAuthID(authID)
	if err != nil {
		// This should never happen now since user is created during login
		ctx.String(http.StatusInternalServerError, "User profile not found. Please try logging in again.")
		return
	}

	// Create template data with user info
	templateData := map[string]interface{}{
		"user_id": user.ID.String(), // Use database user ID
		"email":   user.Email,
		"name":    user.Name,
		"picture": user.Picture,
	}

	ctx.HTML(http.StatusOK, "events.html", templateData)
}

// HomeHandler for our home page.
func HomeHandler(ctx *gin.Context) {
	session := sessions.Default(ctx)
	if session.Get("profile") != nil {
		ctx.Redirect(http.StatusSeeOther, "/user")
		return
	}
	ctx.HTML(http.StatusOK, "home.html", nil)
}

// LoginHandler for our login.
func LoginHandler(auth *authenticator.Authenticator) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		state, err := generateRandomState()
		if err != nil {
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		// Save the state inside the session.
		session := sessions.Default(ctx)
		session.Set("state", state)
		if err := session.Save(); err != nil {
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		ctx.Redirect(http.StatusTemporaryRedirect, auth.AuthCodeURL(state))
	}
}

// LogoutHandler for our logout.
func LogoutHandler(ctx *gin.Context) {
	// Clear the session
	session := sessions.Default(ctx)
	session.Clear()
	session.Save()

	// Construct the Auth0 logout URL
	logoutUrl, err := url.Parse("https://" + os.Getenv("AUTH0_DOMAIN") + "/v2/logout")
	if err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	// Use the ngrok URL as the return URL
	returnTo, err := url.Parse(os.Getenv("AUTH0_CALLBACK_URL"))
	if err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	// Remove the /callback path from the return URL
	returnTo.Path = ""

	parameters := url.Values{}
	parameters.Add("returnTo", returnTo.String())
	parameters.Add("client_id", os.Getenv("AUTH0_CLIENT_ID"))
	logoutUrl.RawQuery = parameters.Encode()

	ctx.Redirect(http.StatusTemporaryRedirect, logoutUrl.String())
}

// SignupHandler for our signup.
func SignupHandler(ctx *gin.Context) {
	// Generate random state
	state, err := generateRandomState()
	if err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	// Save the state inside the session
	session := sessions.Default(ctx)
	session.Set("state", state)
	if err := session.Save(); err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}

	// Construct the Auth0 signup URL with state parameter
	signupURL := "https://" + os.Getenv("AUTH0_DOMAIN") + "/authorize?" +
		"response_type=code" +
		"&client_id=" + os.Getenv("AUTH0_CLIENT_ID") +
		"&redirect_uri=" + os.Getenv("AUTH0_CALLBACK_URL") +
		"&scope=openid%20profile%20email" +
		"&state=" + state +
		"&screen_hint=signup"

	ctx.Redirect(http.StatusTemporaryRedirect, signupURL)
}

// UserHandler for our logged-in user page.
func UserHandler(ctx *gin.Context) {
	session := sessions.Default(ctx)
	profile := session.Get("profile")

	ctx.HTML(http.StatusOK, "user.html", profile)
}

func generateRandomState() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	state := base64.StdEncoding.EncodeToString(b)

	return state, nil
}
