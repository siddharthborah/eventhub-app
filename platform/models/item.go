package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Item represents a generic item/product in the system
type Item struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Price       float64   `json:"price" gorm:"default:0"`
	Category    string    `json:"category"`
	IsAvailable bool      `json:"is_available" gorm:"default:true"`
	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid"`
	User        User      `json:"user" gorm:"foreignKey:UserID"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// BeforeCreate hook to generate UUID
func (i *Item) BeforeCreate(tx *gorm.DB) (err error) {
	if i.ID == uuid.Nil {
		i.ID = uuid.New()
	}
	return
}
