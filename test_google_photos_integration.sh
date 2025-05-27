#!/bin/bash

# Test script for Google Photos Integration
BASE_URL="http://localhost:3000/api"

echo "🌟 Testing Google Photos Integration"
echo "===================================="

# Test 1: Check Google Photos status endpoint
echo "📷 Testing Google Photos status endpoint..."
PHOTOS_STATUS_RESPONSE=$(curl -s -X GET $BASE_URL/user/google-photos-status \
  -H "Content-Type: application/json")

echo "Response: $PHOTOS_STATUS_RESPONSE"
echo

# Test 2: Create an event and verify Google Photos fields are included
echo "🎉 Testing event creation with Google Photos fields..."

# First create a user (needed for events)
echo "Creating test user..."
USER_RESPONSE=$(curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "googleuser@example.com",
    "name": "Google Photos User",
    "auth_id": "google123"
  }')

USER_ID=$(echo $USER_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Created user with ID: $USER_ID"

# Create event with Google Photos enabled
echo "Creating event with Google Photos enabled..."
EVENT_RESPONSE=$(curl -s -X POST $BASE_URL/events \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Birthday Party with Photos\",
    \"description\": \"John's 30th birthday celebration with Google Photos album\",
    \"venue\": \"Central Park\",
    \"event_date\": \"2024-06-15T18:00:00Z\",
    \"image\": \"https://example.com/party.jpg\",
    \"event_type\": \"birthday\",
    \"is_public\": true,
    \"max_attendees\": 50,
    \"status\": \"published\",
    \"user_id\": \"$USER_ID\",
    \"google_photos_enabled\": true
  }")

echo "Event creation response: $EVENT_RESPONSE"
EVENT_ID=$(echo $EVENT_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Created event with ID: $EVENT_ID"
echo

# Test 3: Get the event and check for Google Photos fields
echo "📄 Getting event details to verify Google Photos fields..."
GET_EVENT_RESPONSE=$(curl -s -X GET $BASE_URL/events/$EVENT_ID)

echo "Event details response: $GET_EVENT_RESPONSE"

# Check if Google Photos fields are present in the response structure
if echo $GET_EVENT_RESPONSE | grep -q "google_photos_enabled"; then
    echo "✅ google_photos_enabled field is present in event model"
else
    echo "❌ google_photos_enabled field is missing from event model"
fi

if echo $GET_EVENT_RESPONSE | grep -q "google_photos_album_id"; then
    echo "✅ google_photos_album_id field is present in event model"
else
    echo "❌ google_photos_album_id field is missing from event model"
fi

if echo $GET_EVENT_RESPONSE | grep -q "google_photos_album_url"; then
    echo "✅ google_photos_album_url field is present in event model"
else
    echo "❌ google_photos_album_url field is missing from event model"
fi

# Test creating event WITHOUT Google Photos enabled
echo
echo "🎉 Testing event creation WITHOUT Google Photos enabled..."
EVENT2_RESPONSE=$(curl -s -X POST $BASE_URL/events \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Simple Party\",
    \"description\": \"Party without Google Photos\",
    \"venue\": \"Local Venue\",
    \"event_date\": \"2024-07-15T19:00:00Z\",
    \"event_type\": \"house_party\",
    \"is_public\": true,
    \"status\": \"published\",
    \"user_id\": \"$USER_ID\",
    \"google_photos_enabled\": false
  }")

EVENT2_ID=$(echo $EVENT2_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Created event without Google Photos: $EVENT2_ID"

# Verify this event doesn't have Google Photos fields populated
if echo $EVENT2_RESPONSE | grep -q '"google_photos_enabled":false'; then
    echo "✅ Event correctly created without Google Photos enabled"
else
    echo "❌ Event creation issue with Google Photos toggle"
fi

echo
echo "Note: For full testing of Google Photos album creation:"
echo "1. Set up Google Cloud credentials in .env file"
echo "2. Connect Google Photos account through the frontend"
echo "3. Create an event with a connected user"
echo "4. Verify album is created in Google Photos"
echo "5. Check that album URL is populated in event details" 