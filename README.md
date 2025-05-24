# Events Management App

A modern events management web application with authentication using Auth0, built with Go and React.

## Features

- **User Authentication**: Secure login/logout with Auth0 OAuth
- **Events Management**: Full CRUD operations for events
- **Modern UI**: Clean, responsive design with Material-UI
- **Event Types**: Support for birthdays, anniversaries, weddings, and more
- **Search & Filter**: Advanced event discovery capabilities
- **Mobile-Friendly**: Responsive design that works on all devices
- **Real-time Updates**: Dynamic event creation and management

## Tech Stack

- **Backend**: Go with Gin framework
- **Frontend**: React with Material-UI
- **Database**: PostgreSQL with GORM
- **Authentication**: Auth0 OAuth
- **Build Tool**: Webpack for frontend bundling

## Prerequisites

- Go 1.16 or higher
- Node.js 14 or higher
- PostgreSQL database
- Auth0 account
- ngrok (for local development)

## Quick Start

### 1. Database Setup
```bash
# Using Docker (recommended)
docker-compose up -d

# Or install PostgreSQL locally
# See DATABASE_SETUP.md for detailed instructions
```

### 2. Backend Setup
```bash
# Install Go dependencies
go mod download

# Create environment file
cp .env.example .env
# Edit .env with your Auth0 and database credentials
```

### 3. Frontend Setup
```bash
cd web
npm install
npm run build
```

### 4. Run the Application
```bash
# Start the server
go run main.go

# For development with Auth0
ngrok http 3000
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_CALLBACK_URL=http://localhost:3000/callback

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=loginapp
DB_SSLMODE=disable
```

## API Endpoints

### Events API
- `GET /api/events` - List all events with pagination
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/events/public` - List public events
- `GET /api/events/upcoming` - List upcoming events
- `GET /api/events/search?q=term` - Search events

### User API
- `GET /api/users` - List users
- `GET /api/users/:id/events` - Get user's events

## Project Structure

```
.
├── main.go                    # Application entry point
├── platform/                 # Core business logic
│   ├── controllers/          # HTTP request handlers
│   ├── services/            # Business logic layer
│   ├── models/              # Data models
│   ├── database/            # Database configuration
│   ├── authenticator/       # Auth0 integration
│   ├── middleware/          # HTTP middleware
│   └── router/              # Route definitions
├── web/                     # Frontend application
│   ├── app/                # Go web handlers
│   ├── static/js/          # React components
│   ├── template/           # HTML templates
│   └── package.json        # Frontend dependencies
├── test_events_api.sh       # API testing script
└── docker-compose.yml       # Database setup
```

## Development

### Backend Development
```bash
# Run with hot reload (install air: go install github.com/cosmtrek/air@latest)
air

# Or run normally
go run main.go
```

### Frontend Development
```bash
cd web
npm run dev  # Watch mode for development
npm run build  # Production build
```

### Testing
```bash
# Test the Events API
./test_events_api.sh

# Manual testing with curl
curl -X GET "http://localhost:3000/api/events"
```

## Features Overview

### Event Management
- Create events with title, description, date, venue
- Choose from various event types (birthday, wedding, etc.)
- Set events as public or private
- Manage attendee limits
- Upload event images

### User Experience
- Secure authentication flow
- Intuitive event creation form
- Mobile-responsive event listings
- Search and filter capabilities
- User dashboard with event management

### Technical Features
- Clean Architecture pattern
- RESTful API design
- Database migrations
- Session management
- Error handling and validation

## Security

- OAuth authentication with Auth0
- Secure session management
- Protected API endpoints
- Input validation and sanitization
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
