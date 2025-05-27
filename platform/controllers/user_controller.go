package controllers

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"01-Login/platform/models"
	"01-Login/platform/services"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	googlePhotosScopeSharing = "https://www.googleapis.com/auth/photoslibrary.sharing"
	googlePhotosScopeAppend  = "https://www.googleapis.com/auth/photoslibrary.appendonly"

	googleClientID          = os.Getenv("GOOGLE_CLIENT_ID")
	googleClientSecret      = os.Getenv("GOOGLE_CLIENT_SECRET")
	googleRedirectURI       = os.Getenv("GOOGLE_REDIRECT_URI")
	frontendRedirectBaseURL = os.Getenv("FRONTEND_REDIRECT_BASE_URL")
)

type UserController struct {
	userService *services.UserService
	// Add oauth2.Config if you prefer to initialize it once
	googleOAuthConfig *oauth2.Config
}

// NewUserController creates a new user controller
func NewUserController() *UserController {
	return &UserController{
		userService: services.NewUserService(),
		googleOAuthConfig: &oauth2.Config{
			ClientID:     googleClientID,
			ClientSecret: googleClientSecret,
			RedirectURL:  googleRedirectURI,
			Scopes:       []string{googlePhotosScopeSharing, googlePhotosScopeAppend},
			Endpoint:     google.Endpoint,
		},
	}
}

// GoogleOAuthCallback handles the callback from Google OAuth flow
func (uc *UserController) GoogleOAuthCallback(c *gin.Context) {
	session := sessions.Default(c)

	// Debug logging to understand session state
	fmt.Printf("=== DEBUG: Google OAuth Callback ===\n")
	fmt.Printf("Session ID: %v\n", session.ID())
	fmt.Printf("All session keys: %v\n", session.Flashes())

	// Try to get all possible session keys that might contain user info
	profile := session.Get("profile")

	fmt.Printf("profile from session: %v\n", profile)
	fmt.Printf("====================================\n")

	// Extract user_id from profile (as stored by Auth0 callback)
	var userID interface{}
	if profile != nil {
		if profileMap, ok := profile.(map[string]interface{}); ok {
			userID = profileMap["user_id"]
			fmt.Printf("user_id from profile: %v (type: %T)\n", userID, userID)
		}
	}

	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		// Or redirect to login page with an error message
		// c.Redirect(http.StatusTemporaryRedirect, "/login?error=session_expired_for_google_oauth")
		return
	}

	// Parse user_id string to UUID (it's stored as string in Auth0 callback)
	strUserID, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format in session"})
		return
	}
	uuidUserID, parseErr := uuid.Parse(strUserID)
	if parseErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user ID from session"})
		return
	}

	code := c.Query("code")
	if code == "" {
		// User denied access or an error occurred
		errorReason := c.Query("error")
		// Redirect to frontend with error, e.g., /create-event?google_photos_error=access_denied
		redirectURL := fmt.Sprintf("%s/create-event?google_photos_error=%s", frontendRedirectBaseURL, url.QueryEscape(errorReason))
		c.Redirect(http.StatusTemporaryRedirect, redirectURL)
		return
	}

	token, err := uc.googleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		// Redirect to frontend with error
		redirectURL := fmt.Sprintf("%s/create-event?google_photos_error=%s", frontendRedirectBaseURL, url.QueryEscape("token_exchange_failed"))
		c.Redirect(http.StatusTemporaryRedirect, redirectURL)
		return
	}

	// Persist tokens for the user
	updates := map[string]interface{}{
		"google_photos_access_token":  token.AccessToken,
		"google_photos_refresh_token": token.RefreshToken,
		"google_photos_token_expiry":  token.Expiry,
	}

	_, err = uc.userService.UpdateUser(uuidUserID, updates)
	if err != nil {
		// Redirect to frontend with error
		redirectURL := fmt.Sprintf("%s/create-event?google_photos_error=%s", frontendRedirectBaseURL, url.QueryEscape("failed_to_save_tokens"))
		c.Redirect(http.StatusTemporaryRedirect, redirectURL)
		return
	}

	// Redirect to frontend indicating success
	// The frontend should then update its state (e.g., setGooglePhotosConnected(true))
	successRedirectURL := fmt.Sprintf("%s/create-event?google_photos_connected=true", frontendRedirectBaseURL)
	c.Redirect(http.StatusTemporaryRedirect, successRedirectURL)
}

// CreateUser handles POST /api/users
func (uc *UserController) CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := uc.userService.CreateUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": user})
}

// GetUser handles GET /api/users/:id
func (uc *UserController) GetUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := uc.userService.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// GetUsers handles GET /api/users
func (uc *UserController) GetUsers(c *gin.Context) {
	// Parse pagination parameters
	pageStr := c.DefaultQuery("page", "1")
	pageSizeStr := c.DefaultQuery("page_size", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	users, total, err := uc.userService.GetAllUsers(page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": users,
		"pagination": gin.H{
			"page":        page,
			"page_size":   pageSize,
			"total":       total,
			"total_pages": (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}

// UpdateUser handles PUT /api/users/:id
func (uc *UserController) UpdateUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Remove fields that shouldn't be updated directly
	delete(updates, "id")
	delete(updates, "created_at")
	delete(updates, "auth_id")

	user, err := uc.userService.UpdateUser(id, updates)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// DeleteUser handles DELETE /api/users/:id
func (uc *UserController) DeleteUser(c *gin.Context) {
	idParam := c.Param("id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	if err := uc.userService.DeleteUser(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// GetUserByEmail handles GET /api/users/email/:email
func (uc *UserController) GetUserByEmail(c *gin.Context) {
	email := c.Param("email")
	if email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email is required"})
		return
	}

	user, err := uc.userService.GetUserByEmail(email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": user})
}

// GooglePhotosStatus handles GET /api/user/google-photos-status
func (uc *UserController) GooglePhotosStatus(c *gin.Context) {
	session := sessions.Default(c)
	profile := session.Get("profile")

	var userID interface{}
	if profile != nil {
		if profileMap, ok := profile.(map[string]interface{}); ok {
			userID = profileMap["user_id"]
		}
	}

	if userID == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"connected": false, "error": "User not authenticated"})
		return
	}

	strUserID, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"connected": false, "error": "Invalid user ID format in session"})
		return
	}
	uuidUserID, parseErr := uuid.Parse(strUserID)
	if parseErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"connected": false, "error": "Failed to parse user ID from session"})
		return
	}

	user, err := uc.userService.GetUserByID(uuidUserID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"connected": false, "error": "User not found"})
		return
	}

	connected := user.GooglePhotosAccessToken != ""
	c.JSON(http.StatusOK, gin.H{"connected": connected})
}
