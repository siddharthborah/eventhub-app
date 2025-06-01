package events

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// DetailHandler for the event detail page - serves template like other pages
func DetailHandler(ctx *gin.Context) {
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
