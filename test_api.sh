#!/bin/bash

# Test script for the CRUD API endpoints
BASE_URL="http://localhost:3000/api"

echo "🧪 Testing CRUD API Endpoints"
echo "================================"

# Test 1: Create a user
echo "📝 Creating a test user..."
USER_RESPONSE=$(curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
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

# Test 3: Create an item
echo "📝 Creating a test item..."
ITEM_RESPONSE=$(curl -s -X POST $BASE_URL/items \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Item\",
    \"description\": \"A test item for verification\",
    \"price\": 29.99,
    \"category\": \"electronics\",
    \"user_id\": \"$USER_ID\"
  }")

echo "Response: $ITEM_RESPONSE"
ITEM_ID=$(echo $ITEM_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Created item with ID: $ITEM_ID"
echo

# Test 4: Get all items
echo "📋 Getting all items..."
curl -s "$BASE_URL/items" | python3 -m json.tool
echo

# Test 5: Get available items
echo "📋 Getting available items..."
curl -s "$BASE_URL/items/available" | python3 -m json.tool
echo

# Test 6: Search items
echo "🔍 Searching for 'test'..."
curl -s "$BASE_URL/items/search?q=test" | python3 -m json.tool
echo

# Test 7: Update item
echo "✏️ Updating item..."
UPDATE_RESPONSE=$(curl -s -X PUT $BASE_URL/items/$ITEM_ID \
  -H "Content-Type: application/json" \
  -d '{
    "price": 39.99,
    "description": "Updated test item"
  }')

echo "Response: $UPDATE_RESPONSE"
echo

# Test 8: Get user items
echo "📋 Getting items for user..."
curl -s "$BASE_URL/users/$USER_ID/items" | python3 -m json.tool
echo

echo "✅ API tests completed!"
echo "💡 Remember to set up your database environment variables in .env" 