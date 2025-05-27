package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Event represents an event in the system (birthday, anniversary, house party, etc.)
type Event struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Venue       string    `json:"venue"`
	// Enhanced venue fields for Google Places integration
	VenueName    string    `json:"venue_name"`     // Business name from Google Places
	VenuePlaceID string    `json:"venue_place_id"` // Google Place ID for unique identification
	VenueLat     float64   `json:"venue_lat"`      // Latitude for mapping
	VenueLng     float64   `json:"venue_lng"`      // Longitude for mapping
	EventDate    time.Time `json:"event_date" gorm:"not null"`
	Image        string    `json:"image"`
	EventType    string    `json:"event_type"` // birthday, anniversary, house_party, wedding, etc.
	IsPublic     bool      `json:"is_public" gorm:"default:true"`
	MaxAttendees int       `json:"max_attendees" gorm:"default:0"` // 0 means unlimited
	Status       string    `json:"status" gorm:"default:'draft'"`  // draft, published, cancelled

	// Google Photos integration
	GooglePhotosEnabled  bool   `json:"google_photos_enabled"`   // User wants Google Photos album for this event
	GooglePhotosAlbumID  string `json:"google_photos_album_id"`  // Google Photos album ID
	GooglePhotosAlbumURL string `json:"google_photos_album_url"` // Shareable URL for the album

	UserID    uuid.UUID `json:"user_id" gorm:"type:uuid"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// BeforeCreate hook to generate UUID
func (e *Event) BeforeCreate(tx *gorm.DB) (err error) {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return
}
