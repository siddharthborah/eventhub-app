package callback

import (
	"log"
	"net/http"
	"net/url"

	"01-Login/platform/services"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"01-Login/platform/authenticator"
)

// Handler for our callback.
func Handler(auth *authenticator.Authenticator) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		session := sessions.Default(ctx)

		// Get and decode the state parameter
		stateParam, err := url.QueryUnescape(ctx.Query("state"))
		if err != nil {
			log.Printf("State parameter encoding error: %v", err)
			ctx.String(http.StatusBadRequest, "Invalid state parameter encoding.")
			return
		}

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
		email := profile["email"].(string)
		name := profile["name"].(string)
		picture, _ := profile["picture"].(string)

		user, err := userService.CreateOrUpdateUserFromAuth(authID, email, name, picture)
		if err != nil {
			log.Printf("Failed to create/update user in database: %v", err)
			ctx.String(http.StatusInternalServerError, "Failed to create user profile.")
			return
		}

		log.Printf("User created/updated in database: %s (ID: %s)", user.Email, user.ID.String())

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
