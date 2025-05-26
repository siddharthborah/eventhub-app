package services

import (
	"errors"
	"time"

	"01-Login/platform/database"
	"01-Login/platform/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EventService struct {
	db *gorm.DB
}

// NewEventService creates a new event service
func NewEventService() *EventService {
	return &EventService{
		db: database.GetDB(),
	}
}

// CreateEvent creates a new event
func (s *EventService) CreateEvent(event *models.Event) error {
	if err := s.db.Create(event).Error; err != nil {
		return err
	}
	return nil
}

// GetEventByID retrieves an event by ID with user information
func (s *EventService) GetEventByID(id uuid.UUID) (*models.Event, error) {
	var event models.Event
	if err := s.db.Preload("User").First(&event, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("event not found")
		}
		return nil, err
	}
	return &event, nil
}

// GetAllEvents retrieves all events with pagination and optional filtering
func (s *EventService) GetAllEvents(page, pageSize int, eventType, status string, userID *uuid.UUID) ([]models.Event, int64, error) {
	var events []models.Event
	var total int64

	query := s.db.Model(&models.Event{})

	// Apply filters
	if eventType != "" {
		query = query.Where("event_type = ?", eventType)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results with user information
	offset := (page - 1) * pageSize
	if err := query.Preload("User").Order("event_date ASC").Offset(offset).Limit(pageSize).Find(&events).Error; err != nil {
		return nil, 0, err
	}

	return events, total, nil
}

// GetEventsByUser retrieves all events for a specific user
func (s *EventService) GetEventsByUser(userID uuid.UUID, page, pageSize int) ([]models.Event, int64, error) {
	var events []models.Event
	var total int64

	// Count total records for user
	if err := s.db.Model(&models.Event{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset := (page - 1) * pageSize
	if err := s.db.Preload("User").Where("user_id = ?", userID).Order("event_date ASC").Offset(offset).Limit(pageSize).Find(&events).Error; err != nil {
		return nil, 0, err
	}

	return events, total, nil
}

// GetPublicEvents retrieves only public events
func (s *EventService) GetPublicEvents(page, pageSize int, eventType string) ([]models.Event, int64, error) {
	var events []models.Event
	var total int64

	query := s.db.Model(&models.Event{}).Where("is_public = ? AND status = ?", true, "published")

	// Apply event type filter if provided
	if eventType != "" {
		query = query.Where("event_type = ?", eventType)
	}

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results with user information
	offset := (page - 1) * pageSize
	if err := query.Preload("User").Order("event_date ASC").Offset(offset).Limit(pageSize).Find(&events).Error; err != nil {
		return nil, 0, err
	}

	return events, total, nil
}

// GetUpcomingEvents retrieves events that are scheduled for the future
func (s *EventService) GetUpcomingEvents(page, pageSize int, eventType string, userID *uuid.UUID) ([]models.Event, int64, error) {
	var events []models.Event
	var total int64

	query := s.db.Model(&models.Event{}).Where("event_date > ? AND status = ?", time.Now(), "published")

	// Apply filters
	if eventType != "" {
		query = query.Where("event_type = ?", eventType)
	}
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results with user information
	offset := (page - 1) * pageSize
	if err := query.Preload("User").Order("event_date ASC").Offset(offset).Limit(pageSize).Find(&events).Error; err != nil {
		return nil, 0, err
	}

	return events, total, nil
}

// SearchEvents searches events by title or description
func (s *EventService) SearchEvents(searchTerm string, page, pageSize int) ([]models.Event, int64, error) {
	var events []models.Event
	var total int64

	query := s.db.Model(&models.Event{}).Where(
		"(title ILIKE ? OR description ILIKE ?) AND status = ?",
		"%"+searchTerm+"%",
		"%"+searchTerm+"%",
		"published",
	)

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results with user information
	offset := (page - 1) * pageSize
	if err := query.Preload("User").Order("event_date ASC").Offset(offset).Limit(pageSize).Find(&events).Error; err != nil {
		return nil, 0, err
	}

	return events, total, nil
}

// UpdateEvent updates an existing event
func (s *EventService) UpdateEvent(id uuid.UUID, updates map[string]interface{}) (*models.Event, error) {
	var event models.Event

	// Check if event exists
	if err := s.db.First(&event, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("event not found")
		}
		return nil, err
	}

	// Update event
	if err := s.db.Model(&event).Updates(updates).Error; err != nil {
		return nil, err
	}

	// Return updated event with user information
	return s.GetEventByID(id)
}

// DeleteEvent deletes an event
func (s *EventService) DeleteEvent(id uuid.UUID) error {
	result := s.db.Delete(&models.Event{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("event not found")
	}
	return nil
}

// GetEventsByDateRange retrieves events within a specific date range
func (s *EventService) GetEventsByDateRange(startDate, endDate time.Time, page, pageSize int, userID *uuid.UUID) ([]models.Event, int64, error) {
	var events []models.Event
	var total int64

	query := s.db.Model(&models.Event{}).Where("event_date BETWEEN ? AND ? AND status = ?", startDate, endDate, "published")

	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results with user information
	offset := (page - 1) * pageSize
	if err := query.Preload("User").Order("event_date ASC").Offset(offset).Limit(pageSize).Find(&events).Error; err != nil {
		return nil, 0, err
	}

	return events, total, nil
}
