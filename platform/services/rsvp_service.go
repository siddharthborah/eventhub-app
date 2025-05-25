package services

import (
	"errors"

	"01-Login/platform/database"
	"01-Login/platform/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RSVPService struct {
	db *gorm.DB
}

func NewRSVPService() *RSVPService {
	return &RSVPService{
		db: database.GetDB(),
	}
}

// CreateOrUpdateRSVP creates a new RSVP or updates existing one
func (s *RSVPService) CreateOrUpdateRSVP(userID, eventID uuid.UUID, response models.RSVPResponse) (*models.RSVP, error) {
	var rsvp models.RSVP

	// Check if RSVP already exists
	err := s.db.Where("user_id = ? AND event_id = ?", userID, eventID).First(&rsvp).Error

	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// Create new RSVP
		rsvp = models.RSVP{
			UserID:   userID,
			EventID:  eventID,
			Response: response,
		}
		err = s.db.Create(&rsvp).Error
	} else {
		// Update existing RSVP
		rsvp.Response = response
		err = s.db.Save(&rsvp).Error
	}

	if err != nil {
		return nil, err
	}

	// Load relationships
	err = s.db.Preload("User").Preload("Event").First(&rsvp, rsvp.ID).Error
	return &rsvp, err
}

// GetRSVP gets a user's RSVP for a specific event
func (s *RSVPService) GetRSVP(userID, eventID uuid.UUID) (*models.RSVP, error) {
	var rsvp models.RSVP
	err := s.db.Where("user_id = ? AND event_id = ?", userID, eventID).
		Preload("User").Preload("Event").First(&rsvp).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil // Return nil if no RSVP found (not an error)
	}

	return &rsvp, err
}

// GetEventRSVPs gets all RSVPs for a specific event
func (s *RSVPService) GetEventRSVPs(eventID uuid.UUID) ([]models.RSVP, error) {
	var rsvps []models.RSVP
	err := s.db.Where("event_id = ?", eventID).
		Preload("User").Preload("Event").Find(&rsvps).Error
	return rsvps, err
}

// GetUserRSVPs gets all RSVPs for a specific user
func (s *RSVPService) GetUserRSVPs(userID uuid.UUID) ([]models.RSVP, error) {
	var rsvps []models.RSVP
	err := s.db.Where("user_id = ?", userID).
		Preload("User").Preload("Event.User").Find(&rsvps).Error
	return rsvps, err
}

// GetUserRSVPsByResponse gets user's RSVPs filtered by response type
func (s *RSVPService) GetUserRSVPsByResponse(userID uuid.UUID, response models.RSVPResponse) ([]models.RSVP, error) {
	var rsvps []models.RSVP
	err := s.db.Where("user_id = ? AND response = ?", userID, response).
		Preload("User").Preload("Event.User").Find(&rsvps).Error
	return rsvps, err
}

// DeleteRSVP removes an RSVP
func (s *RSVPService) DeleteRSVP(userID, eventID uuid.UUID) error {
	return s.db.Where("user_id = ? AND event_id = ?", userID, eventID).Delete(&models.RSVP{}).Error
}

// GetRSVPCounts gets count of RSVPs by response type for an event
func (s *RSVPService) GetRSVPCounts(eventID uuid.UUID) (map[string]int64, error) {
	counts := make(map[string]int64)

	responses := []models.RSVPResponse{
		models.RSVPResponseYes,
		models.RSVPResponseNo,
		models.RSVPResponseMaybe,
	}

	for _, response := range responses {
		var count int64
		err := s.db.Model(&models.RSVP{}).
			Where("event_id = ? AND response = ?", eventID, response).
			Count(&count).Error
		if err != nil {
			return nil, err
		}
		counts[string(response)] = count
	}

	return counts, nil
}
