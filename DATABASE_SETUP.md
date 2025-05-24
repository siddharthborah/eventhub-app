# Database Setup Guide

This application now includes database support with CRUD operations using PostgreSQL and GORM.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=loginapp
```

## PostgreSQL Setup

### Option 1: Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a database:
   ```sql
   CREATE DATABASE loginapp;
   ```
3. Create a user (optional):
   ```sql
   CREATE USER appuser WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE loginapp TO appuser;
   ```

### Option 2: Using Docker

Run PostgreSQL in a Docker container:

```bash
docker run --name postgres-loginapp \
  -e POSTGRES_DB=loginapp \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

## Database Migration

The application will automatically run migrations when it starts. The following tables will be created:

- `users` - User information with Auth0 integration
- `items` - Generic items/products with user relationships
- `events` - Events like birthdays, anniversaries, house parties, etc.

## API Endpoints

### User CRUD Operations

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/:id/items` - Get all items for a user
- `GET /api/users/:id/events` - Get all events for a user

### Item CRUD Operations

- `POST /api/items` - Create a new item
- `GET /api/items` - Get all items (with pagination and filtering)
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/available` - Get only available items
- `GET /api/items/search?q=term` - Search items by name or description

### Event CRUD Operations

- `POST /api/events` - Create a new event
- `GET /api/events` - Get all events (with pagination and filtering)
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/public` - Get only public events
- `GET /api/events/upcoming` - Get upcoming events (future dates)
- `GET /api/events/search?q=term` - Search events by title or description
- `GET /api/events/date-range?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Get events in date range

### Query Parameters

For pagination and filtering:
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 10, max: 100)
- `category` - Filter by category (items)
- `event_type` - Filter by event type (events: birthday, anniversary, house_party, wedding, etc.)
- `status` - Filter by status (events: draft, published, cancelled)
- `user_id` - Filter by user ID

## Example API Usage

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "auth_id": "auth0|123456789"
  }'
```

### Create an Item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Item",
    "description": "A sample item for testing",
    "price": 29.99,
    "category": "electronics",
    "user_id": "user-uuid-here"
  }'
```

### Create an Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Birthday Party",
    "description": "John's 30th birthday celebration",
    "venue": "Central Park",
    "event_date": "2024-06-15T18:00:00Z",
    "image": "https://example.com/party.jpg",
    "event_type": "birthday",
    "is_public": true,
    "max_attendees": 50,
    "status": "published",
    "user_id": "user-uuid-here"
  }'
```

### Get Items with Pagination
```bash
curl "http://localhost:3000/api/items?page=1&page_size=5&category=electronics"
```

### Get Events by Type
```bash
curl "http://localhost:3000/api/events?event_type=birthday&status=published"
```

### Search Events
```bash
curl "http://localhost:3000/api/events/search?q=birthday&page=1&page_size=10"
```

### Get Events in Date Range
```bash
curl "http://localhost:3000/api/events/date-range?start_date=2024-06-01&end_date=2024-08-31"
```

## Features

- **UUID Primary Keys** - All models use UUID for better security and distribution
- **Soft Deletes** - Records are marked as deleted rather than permanently removed
- **Pagination** - All list endpoints support pagination
- **Filtering** - Items can be filtered by category, user, availability; Events by type, status, user
- **Search** - Full-text search on item names/descriptions and event titles/descriptions
- **Relationships** - Foreign key relationships between users and items/events
- **Auto-Migration** - Database schema is automatically created/updated
- **Environment Configuration** - Database connection configurable via environment variables
- **Date Range Queries** - Events can be queried by date ranges
- **Public/Private Events** - Events can be marked as public or private
- **Event Status Management** - Events have draft, published, and cancelled statuses

## Models

### User Model
```go
type User struct {
    ID        uuid.UUID `json:"id"`
    Email     string    `json:"email"`
    Name      string    `json:"name"`
    Picture   string    `json:"picture"`
    AuthID    string    `json:"auth_id"`  // Auth0 user ID
    Role      string    `json:"role"`
    IsActive  bool      `json:"is_active"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}
```

### Item Model
```go
type Item struct {
    ID          uuid.UUID `json:"id"`
    Name        string    `json:"name"`
    Description string    `json:"description"`
    Price       float64   `json:"price"`
    Category    string    `json:"category"`
    IsAvailable bool      `json:"is_available"`
    UserID      uuid.UUID `json:"user_id"`
    User        User      `json:"user"`
    CreatedAt   time.Time `json:"created_at"`
    UpdatedAt   time.Time `json:"updated_at"`
}
```

### Event Model
```go
type Event struct {
    ID           uuid.UUID `json:"id"`
    Title        string    `json:"title"`
    Description  string    `json:"description"`
    Venue        string    `json:"venue"`
    EventDate    time.Time `json:"event_date"`
    Image        string    `json:"image"`
    EventType    string    `json:"event_type"`    // birthday, anniversary, house_party, wedding, etc.
    IsPublic     bool      `json:"is_public"`
    MaxAttendees int       `json:"max_attendees"` // 0 means unlimited
    Status       string    `json:"status"`        // draft, published, cancelled
    UserID       uuid.UUID `json:"user_id"`
    User         User      `json:"user"`
    CreatedAt    time.Time `json:"created_at"`
    UpdatedAt    time.Time `json:"updated_at"`
}
```

## Event Types

Common event types supported:
- `birthday` - Birthday parties
- `anniversary` - Anniversary celebrations
- `house_party` - House parties
- `wedding` - Wedding ceremonies
- `graduation` - Graduation parties
- `corporate` - Corporate events
- `conference` - Conferences and meetings
- `workshop` - Workshops and training
- `social` - General social gatherings

## Event Statuses

- `draft` - Event is being planned but not yet published
- `published` - Event is live and visible to others
- `cancelled` - Event has been cancelled 