package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RSVPResponse string

const (
	RSVPResponseYes   RSVPResponse = "yes"
	RSVPResponseNo    RSVPResponse = "no"
	RSVPResponseMaybe RSVPResponse = "maybe"
)

type RSVP struct {
	ID        uuid.UUID    `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID    uuid.UUID    `json:"user_id" gorm:"type:uuid;not null;index"`
	EventID   uuid.UUID    `json:"event_id" gorm:"type:uuid;not null;index"`
	Response  RSVPResponse `json:"response" gorm:"type:varchar(10);not null"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`

	// Relationships
	User  User  `json:"user" gorm:"foreignKey:UserID"`
	Event Event `json:"event" gorm:"foreignKey:EventID"`
}

func (rsvp *RSVP) BeforeCreate(tx *gorm.DB) (err error) {
	if rsvp.ID == uuid.Nil {
		rsvp.ID = uuid.New()
	}
	return
}

// TableName overrides the table name used by GORM
func (RSVP) TableName() string {
	return "rsvps"
}
