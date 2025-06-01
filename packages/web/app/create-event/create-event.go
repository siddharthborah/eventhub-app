package createevent

import (
	"net/http"

	"01-Login/platform/services"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// Handler for the create event page.
func Handler(ctx *gin.Context) {
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
