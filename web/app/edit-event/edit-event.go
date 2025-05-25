package editevent

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"

	"01-Login/platform/services"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Handler for the edit event page.
func Handler(ctx *gin.Context) {
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
