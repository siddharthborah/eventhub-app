# Google Maps API Setup Guide

## Overview
The venue selector in the Create Event page uses Google Maps Places API to provide type-ahead functionality for venue selection.

## Setup Instructions

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
4. Go to **Credentials** and create an **API Key**
5. Optionally, restrict the API key to your domain for security

### 2. Configure the API Key

#### Option 1: Top-Level Environment Variable (Recommended)
Create a `.env` file in the **project root** (same level as main.go):

```bash
# .env (in project root)
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# You can also add other environment variables here:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=loginapp
```

#### Option 2: Web Directory Environment Variable
Create a `.env` file in the `web` directory:

```bash
# web/.env
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

#### Option 3: Direct Configuration
Update the API key directly in `CreateEventPage.js`:

```javascript
const GOOGLE_MAPS_API_KEY = 'your_actual_api_key_here';
```

**Note**: The webpack configuration has been updated to automatically read from the top-level `.env` file, making Option 1 the recommended approach.

### 3. Security Considerations
- **Restrict your API key** to your domain in Google Cloud Console
- **Set usage quotas** to prevent unexpected charges
- **Monitor usage** in the Google Cloud Console

## Features

### What Users Can Do
- **Type-ahead search** for venues, restaurants, parks, etc.
- **Auto-complete** with real business names and addresses
- **Location validation** with accurate address formatting
- **Fallback support** - regular text input if Maps API fails

### Data Stored
When a user selects a venue from Google Places:
- **Venue name** (business name)
- **Full address** (formatted address)
- **Coordinates** (latitude/longitude)
- **Place ID** (Google's unique identifier)

### Fallback Behavior
If Google Maps API is not available:
- Falls back to regular text input
- Users can still manually type venue information
- No loss of functionality

## API Usage and Costs

### Free Tier
Google provides free usage up to certain limits:
- **Places Autocomplete**: 2,500 requests per day free
- **Maps JavaScript API**: 28,000 map loads per month free

### Best Practices
- Implement **session tokens** for cost optimization
- Use **debouncing** to reduce API calls
- Cache results when possible
- Monitor usage in Google Cloud Console

## Troubleshooting

### Common Issues
1. **"Failed to load Google Maps API"**
   - Check your API key is correct
   - Verify Places API is enabled
   - Check internet connection

2. **"Autocomplete not working"**
   - Ensure Maps JavaScript API is enabled
   - Check browser console for errors
   - Verify API key restrictions

3. **"Billing not enabled"**
   - Enable billing in Google Cloud Console
   - Even with free tier, billing must be enabled

### Testing
1. Open browser developer tools
2. Check console for any API errors
3. Test with common venue searches like "McDonald's" or "Central Park"
4. Verify the venue data is being captured correctly

## Development vs Production

### Development
- Use a development API key
- Enable all APIs for testing
- Monitor usage in development

### Production
- Use a production API key
- Restrict to your domain
- Set up proper quotas and alerts
- Monitor costs and usage 