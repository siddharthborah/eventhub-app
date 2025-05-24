package services

import (
	"errors"

	"01-Login/platform/database"
	"01-Login/platform/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ItemService struct {
	db *gorm.DB
}

// NewItemService creates a new item service
func NewItemService() *ItemService {
	return &ItemService{
		db: database.GetDB(),
	}
}

// CreateItem creates a new item
func (s *ItemService) CreateItem(item *models.Item) error {
	if err := s.db.Create(item).Error; err != nil {
		return err
	}
	return nil
}

// GetItemByID retrieves an item by ID with user information
func (s *ItemService) GetItemByID(id uuid.UUID) (*models.Item, error) {
	var item models.Item
	if err := s.db.Preload("User").First(&item, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("item not found")
		}
		return nil, err
	}
	return &item, nil
}

// GetAllItems retrieves all items with pagination and optional filtering
func (s *ItemService) GetAllItems(page, pageSize int, category string, userID *uuid.UUID) ([]models.Item, int64, error) {
	var items []models.Item
	var total int64

	query := s.db.Model(&models.Item{})

	// Apply filters
	if category != "" {
		query = query.Where("category = ?", category)
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
	if err := query.Preload("User").Offset(offset).Limit(pageSize).Find(&items).Error; err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

// GetItemsByUser retrieves all items for a specific user
func (s *ItemService) GetItemsByUser(userID uuid.UUID, page, pageSize int) ([]models.Item, int64, error) {
	var items []models.Item
	var total int64

	// Count total records for user
	if err := s.db.Model(&models.Item{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset := (page - 1) * pageSize
	if err := s.db.Where("user_id = ?", userID).Offset(offset).Limit(pageSize).Find(&items).Error; err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

// UpdateItem updates an existing item
func (s *ItemService) UpdateItem(id uuid.UUID, updates map[string]interface{}) (*models.Item, error) {
	var item models.Item

	// Check if item exists
	if err := s.db.First(&item, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("item not found")
		}
		return nil, err
	}

	// Update item
	if err := s.db.Model(&item).Updates(updates).Error; err != nil {
		return nil, err
	}

	// Return updated item with user information
	return s.GetItemByID(id)
}

// DeleteItem deletes an item
func (s *ItemService) DeleteItem(id uuid.UUID) error {
	result := s.db.Delete(&models.Item{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("item not found")
	}
	return nil
}

// GetAvailableItems retrieves only available items
func (s *ItemService) GetAvailableItems(page, pageSize int, category string) ([]models.Item, int64, error) {
	var items []models.Item
	var total int64

	query := s.db.Model(&models.Item{}).Where("is_available = ?", true)

	// Apply category filter if provided
	if category != "" {
		query = query.Where("category = ?", category)
	}

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results with user information
	offset := (page - 1) * pageSize
	if err := query.Preload("User").Offset(offset).Limit(pageSize).Find(&items).Error; err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

// SearchItems searches items by name or description
func (s *ItemService) SearchItems(searchTerm string, page, pageSize int) ([]models.Item, int64, error) {
	var items []models.Item
	var total int64

	query := s.db.Model(&models.Item{}).Where(
		"name ILIKE ? OR description ILIKE ?",
		"%"+searchTerm+"%",
		"%"+searchTerm+"%",
	)

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results with user information
	offset := (page - 1) * pageSize
	if err := query.Preload("User").Offset(offset).Limit(pageSize).Find(&items).Error; err != nil {
		return nil, 0, err
	}

	return items, total, nil
}
