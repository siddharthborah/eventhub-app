package middleware

import (
	"net/http"

	"01-Login/platform/services"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// IsAuthenticated is a middleware that checks if
// the user has already been authenticated previously.
func IsAuthenticated(ctx *gin.Context) {
	if sessions.Default(ctx).Get("profile") == nil {
		ctx.Redirect(http.StatusSeeOther, "/")
	} else {
		ctx.Next()
	}
}

// IsAuthenticatedAPI is a middleware for API routes that checks authentication
// and returns JSON responses instead of redirecting. It also sets the user in context.
func IsAuthenticatedAPI(ctx *gin.Context) {
	session := sessions.Default(ctx)
	profile := session.Get("profile")

	if profile == nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
		ctx.Abort()
		return
	}

	// Extract user info from session and get from database
	profileMap := profile.(map[string]interface{})
	authID := profileMap["sub"].(string)

	userService := services.NewUserService()
	user, err := userService.GetUserByAuthID(authID)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		ctx.Abort()
		return
	}

	// Set user in context for controllers to use
	ctx.Set("user", *user)
	ctx.Next()
}
