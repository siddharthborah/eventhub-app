package controllers

import (
	"net/http"

	"01-Login/platform/models"
	"01-Login/platform/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type RSVPController struct {
	rsvpService  *services.RSVPService
	eventService *services.EventService
}

func NewRSVPController() *RSVPController {
	return &RSVPController{
		rsvpService:  services.NewRSVPService(),
		eventService: services.NewEventService(),
	}
}

type RSVPRequest struct {
	Response string `json:"response" binding:"required"`
}

// SubmitRSVP handles RSVP submission
func (rc *RSVPController) SubmitRSVP(c *gin.Context) {
	// Get event ID from URL
	eventIDStr := c.Param("id")
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}

	// Get user from context (set by auth middleware)
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	user := userInterface.(models.User)

	// Parse request body
	var req RSVPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate response
	response := models.RSVPResponse(req.Response)
	if response != models.RSVPResponseYes && response != models.RSVPResponseNo && response != models.RSVPResponseMaybe {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid response. Must be 'yes', 'no', or 'maybe'"})
		return
	}

	// Check if event exists
	event, err := rc.eventService.GetEventByID(eventID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	// Check if user is not the organizer
	if event.UserID == user.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event organizers cannot RSVP to their own events"})
		return
	}

	// Create or update RSVP
	rsvp, err := rc.rsvpService.CreateOrUpdateRSVP(user.ID, eventID, response)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit RSVP"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "RSVP submitted successfully",
		"rsvp":    rsvp,
	})
}

// GetEventRSVPs gets all RSVPs for an event (organizer only)
func (rc *RSVPController) GetEventRSVPs(c *gin.Context) {
	// Get event ID from URL
	eventIDStr := c.Param("id")
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}

	// Get user from context
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	user := userInterface.(models.User)

	// Check if event exists and user is organizer
	event, err := rc.eventService.GetEventByID(eventID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	if event.UserID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only event organizers can view RSVPs"})
		return
	}

	// Get RSVPs
	rsvps, err := rc.rsvpService.GetEventRSVPs(eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get RSVPs"})
		return
	}

	// Get RSVP counts
	counts, err := rc.rsvpService.GetRSVPCounts(eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get RSVP counts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"rsvps":  rsvps,
		"counts": counts,
	})
}

// GetUserRSVP gets a user's RSVP for a specific event
func (rc *RSVPController) GetUserRSVP(c *gin.Context) {
	// Get event ID from URL
	eventIDStr := c.Param("id")
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event ID"})
		return
	}

	// Get user from context
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	user := userInterface.(models.User)

	// Get user's RSVP for this event
	rsvp, err := rc.rsvpService.GetRSVP(user.ID, eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get RSVP"})
		return
	}

	if rsvp == nil {
		c.JSON(http.StatusOK, gin.H{"rsvp": nil})
		return
	}

	c.JSON(http.StatusOK, gin.H{"rsvp": rsvp})
}

// GetUserRSVPs gets all RSVPs for the authenticated user
func (rc *RSVPController) GetUserRSVPs(c *gin.Context) {
	// Get user from context
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	user := userInterface.(models.User)

	// Get response filter from query parameter
	responseFilter := c.Query("response")

	var rsvps []models.RSVP
	var err error

	if responseFilter != "" {
		response := models.RSVPResponse(responseFilter)
		if response != models.RSVPResponseYes && response != models.RSVPResponseNo && response != models.RSVPResponseMaybe {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid response filter"})
			return
		}
		rsvps, err = rc.rsvpService.GetUserRSVPsByResponse(user.ID, response)
	} else {
		rsvps, err = rc.rsvpService.GetUserRSVPs(user.ID)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get RSVPs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"rsvps": rsvps})
}
