package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Event represents an event in the system (birthday, anniversary, house party, etc.)
type Event struct {
	ID           uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Title        string    `json:"title" gorm:"not null"`
	Description  string    `json:"description"`
	Venue        string    `json:"venue"`
	EventDate    time.Time `json:"event_date" gorm:"not null"`
	Image        string    `json:"image"`
	EventType    string    `json:"event_type"` // birthday, anniversary, house_party, wedding, etc.
	IsPublic     bool      `json:"is_public" gorm:"default:true"`
	MaxAttendees int       `json:"max_attendees" gorm:"default:0"` // 0 means unlimited
	Status       string    `json:"status" gorm:"default:'draft'"`  // draft, published, cancelled
	UserID       uuid.UUID `json:"user_id" gorm:"type:uuid"`
	User         User      `json:"user" gorm:"foreignKey:UserID"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// BeforeCreate hook to generate UUID
func (e *Event) BeforeCreate(tx *gorm.DB) (err error) {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return
}
