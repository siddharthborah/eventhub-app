#!/bin/bash

# Test script for the Events CRUD API endpoints
BASE_URL="http://localhost:3000/api"

echo "🎉 Testing Events CRUD API Endpoints"
echo "===================================="

# Test 1: Create a user first (needed for events)
echo "📝 Creating a test user..."
USER_RESPONSE=$(curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "eventuser@example.com",
    "name": "Event User",
    "auth_id": "event123"
  }')

echo "Response: $USER_RESPONSE"
USER_ID=$(echo $USER_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Created user with ID: $USER_ID"
echo

# Test 2: Create an event
echo "🎉 Creating a test event..."
EVENT_RESPONSE=$(curl -s -X POST $BASE_URL/events \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Birthday Party\",
    \"description\": \"John's 30th birthday celebration\",
    \"venue\": \"Central Park\",
    \"event_date\": \"2024-06-15T18:00:00Z\",
    \"image\": \"https://example.com/party.jpg\",
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

# Test 3: Create another event
echo "🎉 Creating another event..."
EVENT2_RESPONSE=$(curl -s -X POST $BASE_URL/events \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"House Party\",
    \"description\": \"Weekend house party with friends\",
    \"venue\": \"123 Main Street\",
    \"event_date\": \"2024-07-20T20:00:00Z\",
    \"event_type\": \"house_party\",
    \"is_public\": false,
    \"max_attendees\": 25,
    \"status\": \"draft\",
    \"user_id\": \"$USER_ID\"
  }")

EVENT2_ID=$(echo $EVENT2_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Created second event with ID: $EVENT2_ID"
echo

# Test 4: Get all events
echo "📋 Getting all events..."
curl -s "$BASE_URL/events" | python3 -m json.tool
echo

# Test 5: Get a specific event
echo "📋 Getting specific event..."
curl -s "$BASE_URL/events/$EVENT_ID" | python3 -m json.tool
echo

# Test 6: Get public events only
echo "🌐 Getting public events..."
curl -s "$BASE_URL/events/public" | python3 -m json.tool
echo

# Test 7: Get upcoming events
echo "⏰ Getting upcoming events..."
curl -s "$BASE_URL/events/upcoming" | python3 -m json.tool
echo

# Test 8: Search events
echo "🔍 Searching for 'birthday'..."
curl -s "$BASE_URL/events/search?q=birthday" | python3 -m json.tool
echo

# Test 9: Get events by date range
echo "📅 Getting events in date range..."
curl -s "$BASE_URL/events/date-range?start_date=2024-06-01&end_date=2024-08-31" | python3 -m json.tool
echo

# Test 10: Filter events by type
echo "🎈 Getting birthday events..."
curl -s "$BASE_URL/events?event_type=birthday" | python3 -m json.tool
echo

# Test 11: Filter events by status
echo "📝 Getting published events..."
curl -s "$BASE_URL/events?status=published" | python3 -m json.tool
echo

# Test 12: Update event
echo "✏️ Updating event..."
UPDATE_RESPONSE=$(curl -s -X PUT $BASE_URL/events/$EVENT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "max_attendees": 75,
    "description": "Updated: Johns 30th birthday celebration - Now with more space!"
  }')

echo "Response: $UPDATE_RESPONSE"
echo

# Test 13: Get user events
echo "📋 Getting events for user..."
curl -s "$BASE_URL/users/$USER_ID/events" | python3 -m json.tool
echo

# Test 14: Test pagination
echo "📄 Testing pagination (page 1, 1 item per page)..."
curl -s "$BASE_URL/events?page=1&page_size=1" | python3 -m json.tool
echo

echo "✅ Events API tests completed!"
echo "💡 Remember to set up your database environment variables in .env"
echo "🎉 Available Event Types: birthday, anniversary, house_party, wedding, etc."
echo "📋 Available Statuses: draft, published, cancelled" 