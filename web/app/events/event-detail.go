package events

import (
	"net/http"

	"01-Login/platform/services"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// DetailHandler for the event detail page.
func DetailHandler(ctx *gin.Context) {
	eventIDStr := ctx.Param("id")

	// Parse UUID
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		ctx.HTML(http.StatusBadRequest, "event-not-found.html", gin.H{
			"error": "Invalid event ID",
		})
		return
	}

	// Get event from database
	eventService := services.NewEventService()
	event, err := eventService.GetEventByID(eventID)
	if err != nil {
		ctx.HTML(http.StatusNotFound, "event-not-found.html", gin.H{
			"error": "Event not found",
		})
		return
	}

	// Check if user is authenticated
	session := sessions.Default(ctx)
	profile := session.Get("profile")

	var isAuthenticated bool
	var userID string
	var isOwner bool

	if profile != nil {
		isAuthenticated = true
		profileMap := profile.(map[string]interface{})
		authID := profileMap["sub"].(string)

		// Get user from database using Auth ID
		userService := services.NewUserService()
		user, err := userService.GetUserByAuthID(authID)
		if err == nil {
			userID = user.ID.String()
			isOwner = user.ID.String() == event.UserID.String()
		}
	}

	// Create template data
	templateData := map[string]interface{}{
		"event":           event,
		"isAuthenticated": isAuthenticated,
		"userID":          userID,
		"isOwner":         isOwner,
		"shareURL":        ctx.Request.Host + "/events/" + eventIDStr,
	}

	ctx.HTML(http.StatusOK, "event-detail.html", templateData)
}
