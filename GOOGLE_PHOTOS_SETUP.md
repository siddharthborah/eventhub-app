# Google Photos Integration Setup

This guide explains how to set up Google Photos integration for automatic album creation during event creation.

## Overview

When users create events with Google Photos integration enabled, the application will:
1. Check if the user has enabled the "Add Google Photo Album" toggle for the event
2. Verify the user has connected their Google Photos account
3. Create a shared Google Photos album named "[Event Title] - Photos"
4. Make the album collaborative (attendees can add photos)
5. Make the album commentable
6. Store the album ID and shareable URL in the event record
7. Display the album link on the event detail page

## Prerequisites

1. A Google Cloud Project with Photos Library API enabled
2. OAuth 2.0 credentials configured
3. ngrok or a public HTTPS domain for OAuth callbacks

## Google Cloud Setup

### 1. Enable Google Photos Library API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to "APIs & Services" > "Library"
4. Search for "Photos Library API"
5. Click on it and press "Enable"

### 2. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - Application name: Your app name
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `https://www.googleapis.com/auth/photoslibrary.sharing`
   - `https://www.googleapis.com/auth/photoslibrary.appendonly`
5. Add test users (your email and any other testers)

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - For local development: `https://your-ngrok-domain.ngrok-free.app/api/oauth/google/callback`
   - For production: `https://your-domain.com/api/oauth/google/callback`
5. Save and note the Client ID and Client Secret

## Environment Variables

Add these variables to your `.env` file:

```env
# Google Photos OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.ngrok-free.app/api/oauth/google/callback
FRONTEND_REDIRECT_BASE_URL=https://your-domain.ngrok-free.app
```

## Frontend Configuration

Update your frontend environment variables for the OAuth flow:

```env
# In your frontend .env or configuration
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_GOOGLE_REDIRECT_URI=https://your-domain.ngrok-free.app/api/oauth/google/callback
```

## Local Development with ngrok

Since Google OAuth requires HTTPS, use ngrok for local development:

```bash
# Install ngrok
npm install -g ngrok

# Start your app
go run main.go

# In another terminal, expose your app
ngrok http 3000

# Note the HTTPS URL (e.g., https://abc123.ngrok-free.app)
# Update your Google OAuth settings and environment variables with this URL
```

## Database Migration

The new Google Photos fields are automatically added to the events table via GORM AutoMigrate:
- `google_photos_album_id` (string) - Stores the Google Photos album ID
- `google_photos_album_url` (string) - Stores the shareable URL for the album

## How It Works

### 1. User Connects Google Photos
1. User goes to Create Event page
2. Enables "Add Google Photo Album" setting
3. If not connected, clicks "Connect Google Photos"
4. Gets redirected to Google OAuth consent screen
5. After approval, returns to Create Event page with connection confirmed

### 2. Album Creation During Event Creation
1. User fills out event details and enables "Add Google Photo Album" toggle
2. User submits the event form
3. Backend creates the event in database with `google_photos_enabled: true`
4. Backend checks if user requested Google Photos album (`event.GooglePhotosEnabled`)
5. If requested, checks if user has connected Google Photos
6. If both conditions are met, creates a shared album using Google Photos API
7. Updates the event record with album ID and URL
8. Returns complete event data to frontend

### 3. Album Display
1. Event detail pages show a "Event Photos Album - View & Add Photos" link
2. Link opens the Google Photos album in a new tab
3. Attendees can view and add photos to the shared album

## API Endpoints

### Google Photos Status
- `GET /api/user/google-photos-status` - Check if user has connected Google Photos

### OAuth Callback
- `GET /api/oauth/google/callback` - Handle Google OAuth callback and store tokens

## Error Handling

The system gracefully handles errors:
- If Google Photos album creation fails, the event is still created without the album
- Users see error messages during OAuth flow if something goes wrong
- Albums are only created for users who have successfully connected Google Photos

## Security Considerations

1. Google Photos tokens are stored securely in the database with `json:"-"` tags
2. OAuth flow uses state parameter validation
3. HTTPS is required for OAuth callbacks
4. Scopes are limited to only necessary permissions:
   - `photoslibrary.sharing` - Create and share albums
   - `photoslibrary.appendonly` - Allow adding photos to albums

## Testing

1. Connect Google Photos account on Create Event page
2. Create a new event with Google Photos enabled
3. Check that album is created in Google Photos
4. Verify album link appears on event detail page
5. Test that album is shareable and collaborative

## Troubleshooting

### "User has not connected Google Photos" Error
- Ensure user completed OAuth flow successfully
- Check that tokens are stored in database
- Verify OAuth callback URL matches Google Cloud configuration

### "Failed to create album" Error
- Check Google Photos Library API is enabled
- Verify OAuth scopes include required permissions
- Ensure tokens haven't expired (refresh token should handle this)

### OAuth Callback Errors
- Verify redirect URI matches exactly (including protocol)
- Check that ngrok URL hasn't changed
- Ensure session configuration allows cross-site cookies

## Production Deployment

1. Replace ngrok URLs with your production domain
2. Update Google Cloud OAuth settings with production URLs
3. Ensure production environment has all required environment variables
4. Consider implementing token refresh logic for long-term usage
5. Monitor API quotas and usage in Google Cloud Console 