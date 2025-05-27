package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Email     string    `json:"email" gorm:"uniqueIndex:idx_users_email,where:email != ''"`
	Name      string    `json:"name" gorm:"not null"`
	Picture   string    `json:"picture"`
	AuthID    string    `json:"auth_id" gorm:"uniqueIndex"` // Auth0 user ID
	Role      string    `json:"role" gorm:"default:'user'"`
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Google Photos OAuth Tokens
	GooglePhotosAccessToken  string    `json:"-"` // Store securely, don't expose in JSON responses
	GooglePhotosRefreshToken string    `json:"-"` // Store securely, don't expose in JSON responses
	GooglePhotosTokenExpiry  time.Time `json:"-"` // Store securely, don't expose in JSON responses
}

// BeforeCreate hook to generate UUID
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return
}
