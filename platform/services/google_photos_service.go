package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"01-Login/platform/database"
	"01-Login/platform/models"

	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

const googlePhotosAPIBase = "https://photoslibrary.googleapis.com/v1"

type GooglePhotosService struct {
	db *gorm.DB
}

// GooglePhotosAlbum represents the structure for creating an album
type GooglePhotosAlbum struct {
	Title string `json:"title"`
}

// CreateAlbumRequest represents the request structure for creating an album
type CreateAlbumRequest struct {
	Album GooglePhotosAlbum `json:"album"`
}

// AlbumResponse represents the response from Google Photos API when creating an album
type AlbumResponse struct {
	ID           string `json:"id"`
	Title        string `json:"title"`
	ProductURL   string `json:"productUrl"`
	ShareableURL string `json:"shareableUrl"`
	IsWriteable  bool   `json:"isWriteable"`
}

// ShareAlbumRequest represents the request to make an album shareable
type ShareAlbumRequest struct {
	SharedAlbumOptions struct {
		IsCollaborative bool `json:"isCollaborative"`
		IsCommentable   bool `json:"isCommentable"`
	} `json:"sharedAlbumOptions"`
}

// ShareAlbumResponse represents the response from sharing an album
type ShareAlbumResponse struct {
	ShareInfo struct {
		ShareableURL string `json:"shareableUrl"`
		IsJoined     bool   `json:"isJoined"`
		IsOwned      bool   `json:"isOwned"`
	} `json:"shareInfo"`
}

func NewGooglePhotosService() *GooglePhotosService {
	return &GooglePhotosService{
		db: database.GetDB(),
	}
}

// CreateSharedAlbum creates a shared album for an event and returns the album ID and shareable URL
func (gps *GooglePhotosService) CreateSharedAlbum(ctx context.Context, userID uuid.UUID, eventTitle string) (albumID, shareableURL string, err error) {
	// Get user with Google Photos tokens
	user, err := gps.getUserWithTokens(userID)
	if err != nil {
		return "", "", fmt.Errorf("failed to get user tokens: %w", err)
	}

	// Check if user has Google Photos connected
	if user.GooglePhotosAccessToken == "" {
		return "", "", fmt.Errorf("user has not connected Google Photos")
	}

	// Create OAuth client with user's tokens
	client, err := gps.createOAuthClient(ctx, user)
	if err != nil {
		return "", "", fmt.Errorf("failed to create OAuth client: %w", err)
	}

	// Create the album
	albumID, err = gps.createAlbum(ctx, client, eventTitle)
	if err != nil {
		return "", "", fmt.Errorf("failed to create album: %w", err)
	}

	// Share the album to get shareable URL
	shareableURL, err = gps.shareAlbum(ctx, client, albumID)
	if err != nil {
		return "", "", fmt.Errorf("failed to share album: %w", err)
	}

	return albumID, shareableURL, nil
}

// getUserWithTokens retrieves user with Google Photos tokens
func (gps *GooglePhotosService) getUserWithTokens(userID uuid.UUID) (*models.User, error) {
	var user models.User
	if err := gps.db.First(&user, "id = ?", userID).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// createOAuthClient creates an authenticated HTTP client using user's tokens
func (gps *GooglePhotosService) createOAuthClient(ctx context.Context, user *models.User) (*http.Client, error) {
	config := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://accounts.google.com/o/oauth2/auth",
			TokenURL: "https://oauth2.googleapis.com/token",
		},
		Scopes: []string{
			"https://www.googleapis.com/auth/photoslibrary.sharing",
			"https://www.googleapis.com/auth/photoslibrary.appendonly",
		},
	}

	token := &oauth2.Token{
		AccessToken:  user.GooglePhotosAccessToken,
		RefreshToken: user.GooglePhotosRefreshToken,
		Expiry:       user.GooglePhotosTokenExpiry,
	}

	// Create token source that will automatically refresh tokens
	tokenSource := config.TokenSource(ctx, token)

	// Get fresh token (this will refresh automatically if expired)
	freshToken, err := tokenSource.Token()
	if err != nil {
		return nil, fmt.Errorf("failed to refresh token: %w", err)
	}

	// If token was refreshed, update it in the database
	if freshToken.AccessToken != user.GooglePhotosAccessToken {
		updates := map[string]interface{}{
			"google_photos_access_token":  freshToken.AccessToken,
			"google_photos_refresh_token": freshToken.RefreshToken,
			"google_photos_token_expiry":  freshToken.Expiry,
		}

		if err := gps.db.Model(&models.User{}).Where("id = ?", user.ID).Updates(updates).Error; err != nil {
			// Log error but don't fail the request
			fmt.Printf("Warning: Failed to update refreshed tokens in database: %v\n", err)
		} else {
			fmt.Printf("Successfully refreshed and updated Google Photos tokens for user %v\n", user.ID)
		}
	}

	return config.Client(ctx, freshToken), nil
}

// createAlbum creates a new album in Google Photos
func (gps *GooglePhotosService) createAlbum(ctx context.Context, client *http.Client, title string) (string, error) {
	albumRequest := CreateAlbumRequest{
		Album: GooglePhotosAlbum{
			Title: title,
		},
	}

	jsonData, err := json.Marshal(albumRequest)
	if err != nil {
		return "", fmt.Errorf("failed to marshal album request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", googlePhotosAPIBase+"/albums", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API request failed with status %d", resp.StatusCode)
	}

	var albumResp AlbumResponse
	if err := json.NewDecoder(resp.Body).Decode(&albumResp); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	return albumResp.ID, nil
}

// shareAlbum makes an album shareable and returns the shareable URL
func (gps *GooglePhotosService) shareAlbum(ctx context.Context, client *http.Client, albumID string) (string, error) {
	shareRequest := ShareAlbumRequest{}
	shareRequest.SharedAlbumOptions.IsCollaborative = true
	shareRequest.SharedAlbumOptions.IsCommentable = true

	jsonData, err := json.Marshal(shareRequest)
	if err != nil {
		return "", fmt.Errorf("failed to marshal share request: %w", err)
	}

	url := fmt.Sprintf("%s/albums/%s:share", googlePhotosAPIBase, albumID)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create share request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to make share request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("share API request failed with status %d", resp.StatusCode)
	}

	var shareResp ShareAlbumResponse
	if err := json.NewDecoder(resp.Body).Decode(&shareResp); err != nil {
		return "", fmt.Errorf("failed to decode share response: %w", err)
	}

	return shareResp.ShareInfo.ShareableURL, nil
}

// CheckUserHasGooglePhotos checks if a user has connected Google Photos
func (gps *GooglePhotosService) CheckUserHasGooglePhotos(userID uuid.UUID) (bool, error) {
	user, err := gps.getUserWithTokens(userID)
	if err != nil {
		return false, fmt.Errorf("failed to get user: %w", err)
	}

	return user.GooglePhotosAccessToken != "", nil
}
