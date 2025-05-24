package services

import (
	"errors"

	"01-Login/platform/database"
	"01-Login/platform/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

// NewUserService creates a new user service
func NewUserService() *UserService {
	return &UserService{
		db: database.GetDB(),
	}
}

// CreateUser creates a new user
func (s *UserService) CreateUser(user *models.User) error {
	if err := s.db.Create(user).Error; err != nil {
		return err
	}
	return nil
}

// GetUserByID retrieves a user by ID
func (s *UserService) GetUserByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	if err := s.db.First(&user, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail retrieves a user by email
func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := s.db.First(&user, "email = ?", email).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// GetUserByAuthID retrieves a user by Auth0 ID
func (s *UserService) GetUserByAuthID(authID string) (*models.User, error) {
	var user models.User
	if err := s.db.First(&user, "auth_id = ?", authID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// GetAllUsers retrieves all users with pagination
func (s *UserService) GetAllUsers(page, pageSize int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	// Count total records
	if err := s.db.Model(&models.User{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	offset := (page - 1) * pageSize
	if err := s.db.Offset(offset).Limit(pageSize).Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// UpdateUser updates an existing user
func (s *UserService) UpdateUser(id uuid.UUID, updates map[string]interface{}) (*models.User, error) {
	var user models.User

	// Check if user exists
	if err := s.db.First(&user, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	// Update user
	if err := s.db.Model(&user).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

// DeleteUser deletes a user (soft delete)
func (s *UserService) DeleteUser(id uuid.UUID) error {
	result := s.db.Delete(&models.User{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("user not found")
	}
	return nil
}

// CreateOrUpdateUserFromAuth creates or updates user from authentication data
func (s *UserService) CreateOrUpdateUserFromAuth(authID, email, name, picture string) (*models.User, error) {
	// Try to find existing user by auth ID
	user, err := s.GetUserByAuthID(authID)
	if err == nil {
		// Update existing user
		updates := map[string]interface{}{
			"email":   email,
			"name":    name,
			"picture": picture,
		}
		return s.UpdateUser(user.ID, updates)
	}

	// Create new user
	newUser := &models.User{
		AuthID:   authID,
		Email:    email,
		Name:     name,
		Picture:  picture,
		Role:     "user",
		IsActive: true,
	}

	if err := s.CreateUser(newUser); err != nil {
		return nil, err
	}

	return newUser, nil
}
