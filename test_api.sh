#!/bin/bash

# Test script for the Events Management API endpoints
BASE_URL="http://localhost:3000/api"

echo "🧪 Testing Events Management API"
echo "================================"

# Test 1: Create a user
echo "📝 Creating a test user..."
USER_RESPONSE=$(curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "name": "Test User",
    "auth_id": "test123"
  }')

echo "Response: $USER_RESPONSE"
USER_ID=$(echo $USER_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Created user with ID: $USER_ID"
echo

# Test 2: Get all users
echo "📋 Getting all users..."
curl -s "$BASE_URL/users" | python3 -m json.tool
echo

# Test 3: Get user by ID
echo "👤 Getting user by ID..."
curl -s "$BASE_URL/users/$USER_ID" | python3 -m json.tool
echo

# Test 4: Create an event
echo "📝 Creating a test event..."
EVENT_RESPONSE=$(curl -s -X POST $BASE_URL/events \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Test Birthday Party\",
    \"description\": \"A test event for API verification\",
    \"venue\": \"Test Venue\",
    \"event_date\": \"2024-12-25T18:00:00Z\",
    \"event_type\": \"birthday\",
    \"is_public\": true,
    \"max_attendees\": 50,
    \"status\": \"published\",
    \"user_id\": \"$USER_ID\"
  }")

echo "Response: $EVENT_RESPONSE"
EVENT_ID=$(echo $EVENT_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Created event with ID: $EVENT_ID"
echo

# Test 5: Get all events
echo "📋 Getting all events..."
curl -s "$BASE_URL/events" | python3 -m json.tool
echo

# Test 6: Get public events
echo "🌍 Getting public events..."
curl -s "$BASE_URL/events/public" | python3 -m json.tool
echo

# Test 7: Get upcoming events
echo "📅 Getting upcoming events..."
curl -s "$BASE_URL/events/upcoming" | python3 -m json.tool
echo

# Test 8: Search events
echo "🔍 Searching for 'birthday'..."
curl -s "$BASE_URL/events/search?q=birthday" | python3 -m json.tool
echo

# Test 9: Update event
echo "✏️ Updating event..."
UPDATE_RESPONSE=$(curl -s -X PUT $BASE_URL/events/$EVENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Birthday Party",
    "description": "Updated test event description",
    "max_attendees": 75
  }')

echo "Response: $UPDATE_RESPONSE"
echo

# Test 10: Get user events
echo "📋 Getting events for user..."
curl -s "$BASE_URL/users/$USER_ID/events" | python3 -m json.tool
echo

# Test 11: Get event by ID
echo "🎉 Getting event by ID..."
curl -s "$BASE_URL/events/$EVENT_ID" | python3 -m json.tool
echo

# Test 12: Test pagination
echo "📄 Testing pagination (page 1, 2 events per page)..."
curl -s "$BASE_URL/events?page=1&page_size=2" | python3 -m json.tool
echo

echo "✅ API tests completed!"
echo "💡 Note: Some tests may fail if the database is empty or if the server is not running"
echo "🚀 To run the comprehensive events API test, use: ./test_events_api.sh" 