# Platform Directory

This directory contains the core business logic and infrastructure of the Events Management application, organized using Clean Architecture principles.

## Directory Structure

```
platform/
├── authenticator/     # Auth0 authentication integration
├── controllers/       # HTTP request handlers
├── database/         # Database connection and configuration
├── middleware/       # HTTP middleware (authentication, logging, etc.)
├── models/          # Data models and database entities
├── router/          # Route definitions and setup
└── services/        # Business logic and data operations
```

## Architecture Overview

### Models (`models/`)
Data structures representing the core entities:
- **User** (`user.go`) - User profile information from Auth0
- **Event** (`event.go`) - Event data with full CRUD capabilities

### Services (`services/`)
Business logic layer containing:
- **UserService** (`user_service.go`) - User management and operations
- **EventService** (`event_service.go`) - Event CRUD, search, filtering, and business rules

### Controllers (`controllers/`)
HTTP request handlers that:
- Validate input data
- Call appropriate service methods
- Return JSON responses
- Handle pagination and query parameters

### Database (`database/`)
Database connectivity and configuration:
- PostgreSQL connection setup
- Migration management
- Connection pooling

### Authenticator (`authenticator/`)
Auth0 integration for:
- OAuth authentication flow
- Session management
- User profile extraction

### Middleware (`middleware/`)
HTTP middleware for:
- Authentication verification
- Request logging
- CORS handling

### Router (`router/`)
Route configuration and setup:
- API route definitions
- Web route handlers
- Static file serving
- Session configuration

## API Endpoints

### Users API
- `GET /api/users` - List users with pagination
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/:id/events` - Get user's events

### Events API
- `GET /api/events` - List events with pagination and filtering
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/public` - Get public events only
- `GET /api/events/upcoming` - Get future events
- `GET /api/events/search` - Search events by text
- `GET /api/events/date-range` - Filter events by date range

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `auth_id` (String, Unique) - Auth0 user identifier
- `email` (String, Unique)
- `name` (String)
- `picture` (String) - Profile picture URL
- `created_at`, `updated_at` (Timestamps)

### Events Table
- `id` (UUID, Primary Key)
- `title` (String, Required)
- `description` (Text)
- `venue` (String)
- `event_date` (DateTime, Required)
- `image` (String) - Image URL
- `event_type` (String) - birthday, anniversary, etc.
- `is_public` (Boolean)
- `max_attendees` (Integer)
- `status` (String) - draft, published, cancelled
- `user_id` (UUID, Foreign Key)
- `created_at`, `updated_at` (Timestamps)

## Development Notes

### Adding New Features
1. Create/update models in `models/`
2. Add business logic to `services/`
3. Create HTTP handlers in `controllers/`
4. Add routes in `router/`
5. Run migrations if needed

### Code Style
- Follow Go naming conventions
- Use dependency injection for services
- Handle errors appropriately
- Add comments for public functions
- Use UUID for all primary keys

### Testing
- Create test scripts in the root directory
- Test API endpoints with `test_events_api.sh`
- Verify database operations manually or with tools

### Database Migrations
Migrations are run automatically on application startup in `main.go`:
```go
database.Migrate(
    &models.User{},
    &models.Event{},
)
``` 