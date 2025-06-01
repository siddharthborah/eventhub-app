# EventHub - Cross-Platform Events Management App

A modern events management application with authentication using Auth0, built with Go backend and React/React Native frontends. Supports **Web**, **iOS**, **Android**, and **Mobile Web** platforms.

## Features

- **Multi-Platform**: Web app (React), Native mobile apps (React Native), and mobile web
- **User Authentication**: Secure login/logout with Auth0 OAuth
- **Events Management**: Full CRUD operations for events across all platforms
- **Modern UI**: Clean, responsive design with Material-UI (web) and native components (mobile)
- **Event Types**: Support for birthdays, anniversaries, weddings, and more
- **Search & Filter**: Advanced event discovery capabilities
- **Shared Codebase**: 70% code sharing between web and mobile platforms
- **Real-time Updates**: Dynamic event creation and management
- **Native Features**: Camera, maps, push notifications (mobile)

## Tech Stack

### Backend
- **API**: Go with Gin framework
- **Database**: PostgreSQL with GORM
- **Authentication**: Auth0 OAuth

### Frontend (Shared)
- **Shared Package**: Business logic, API calls, hooks, validation
- **Date Handling**: date-fns library

### Web App
- **Framework**: React 18
- **UI Library**: Material-UI
- **Build Tool**: Webpack
- **Styling**: CSS + Material-UI

### Mobile Apps
- **Framework**: React Native 0.79
- **Navigation**: React Navigation
- **UI**: Native components
- **Platforms**: iOS and Android

## Project Structure

```
eventhub-app/
├── packages/                    # 📦 Monorepo packages
│   ├── shared/                 # 🔄 Shared code (70% reuse)
│   │   ├── src/
│   │   │   ├── api/           # API calls to Go backend
│   │   │   ├── hooks/         # React hooks (useEvents, etc.)
│   │   │   └── utils/         # Validation & utilities
│   │   └── package.json
│   ├── web/                   # 🌐 React web application
│   │   ├── static/js/         # React components
│   │   ├── template/          # HTML templates
│   │   └── package.json
│   └── mobile/                # 📱 React Native app
│       ├── src/screens/       # Mobile screens
│       ├── ios/               # iOS project
│       ├── android/           # Android project
│       └── package.json
├── platform/                  # 🔧 Go backend
│   ├── controllers/           # HTTP request handlers
│   ├── services/             # Business logic layer
│   ├── models/               # Data models
│   ├── database/             # Database configuration
│   ├── authenticator/        # Auth0 integration
│   ├── middleware/           # HTTP middleware
│   └── router/               # Route definitions
├── main.go                    # Go application entry point
├── package.json              # Monorepo configuration
├── docker-compose.yml        # Database setup
└── README.md                 # This file
```

## Prerequisites

### Backend Development
- Go 1.16 or higher
- PostgreSQL database
- Auth0 account

### Web Development
- Node.js 18 or higher
- npm or yarn

### Mobile Development
- Node.js 18 or higher
- **For iOS**: macOS, Xcode, iOS Simulator, CocoaPods
- **For Android**: Android Studio, Android SDK, Java Development Kit

### Optional
- Docker (for database)
- ngrok (for Auth0 development)

## Quick Start

### 1. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd eventhub-app

# Install all dependencies (monorepo)
npm install --legacy-peer-deps
```

### 2. Database Setup
```bash
# Using Docker (recommended)
docker-compose up -d

# Or install PostgreSQL locally
# See DATABASE_SETUP.md for detailed instructions
```

### 3. Environment Configuration
Create a `.env` file in the project root:

```env
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_CALLBACK_URL=http://localhost:3000/callback

# Session Configuration
SESSION_SECRET=your-random-session-secret-key

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=loginapp
DB_SSLMODE=disable
```

### 4. Start Development

#### Backend (Required for all platforms)
```bash
# Start Go server with hot reload
air

# Or start normally
go run main.go
```

#### Web Application
```bash
# Start web development server
npm run dev:web

# Access at: http://localhost:3000
```

#### Mobile Application
```bash
# Start Metro bundler
npm run start:mobile

# In separate terminals:
npm run ios       # Run on iOS Simulator
npm run android   # Run on Android Emulator
```

## Development Scripts

### Monorepo Management
```bash
npm run install:all      # Install all package dependencies
npm run install:web      # Install web dependencies only
npm run install:mobile   # Install mobile dependencies only
npm run install:shared   # Install shared dependencies only
```

### Development
```bash
# Backend
go run main.go          # Start Go server
air                     # Start with hot reload

# Web
npm run dev:web         # Start web dev server
npm run build:web       # Build web for production

# Mobile
npm run start:mobile    # Start Metro bundler
npm run ios            # Run iOS app
npm run android        # Run Android app

# Linting
npm run lint           # Lint all packages
npm run lint:web       # Lint web package only
npm run lint:mobile    # Lint mobile package only
```

## Code Sharing Architecture

### Shared Package (`@eventhub/shared`)

**What's Shared (70% of code):**
- ✅ API calls to Go backend
- ✅ Business logic and validation
- ✅ Custom React hooks
- ✅ Utility functions
- ✅ Data types and constants

**Example shared code:**
```javascript
// Both web and mobile use the same hooks
import { useEvents, validateEvent, eventsAPI } from '@eventhub/shared';

const { events, loading, error } = useEvents();
const { isValid, errors } = validateEvent(eventData);
```

**What's Platform-Specific:**
- ❌ UI Components (HTML vs Native)
- ❌ Navigation (React Router vs React Navigation)
- ❌ Styling approaches
- ❌ Platform-specific features

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

### RSVP API
- `POST /api/events/:id/rsvp` - Submit RSVP
- `GET /api/events/:id/rsvp` - Get user's RSVP
- `GET /api/events/:id/rsvps` - Get event RSVPs

## Platform-Specific Features

### Web App
- Material-UI components
- Responsive design
- Web-optimized performance
- Browser-specific features

### Mobile Apps
- Native navigation
- Touch gestures
- Native camera access
- Push notifications (planned)
- Offline support (planned)
- Maps integration (planned)

## Testing

### API Testing
```bash
# Test the Events API
./test_events_api.sh

# Manual testing with curl
curl -X GET "http://localhost:3000/api/events"
```

### Frontend Testing
```bash
# Run web tests
cd packages/web && npm test

# Run mobile tests  
cd packages/mobile && npm test
```

## Deployment

### Backend
```bash
# Build Go binary
go build -o eventhub main.go

# Deploy to your preferred platform
```

### Web App
```bash
# Build for production
npm run build:web

# Deploy static files to CDN/hosting
```

### Mobile Apps
```bash
# iOS
cd packages/mobile/ios
xcodebuild # or use Xcode

# Android
cd packages/mobile/android
./gradlew assembleRelease
```

## Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
cd packages/mobile
npx react-native start --reset-cache
```

**iOS build issues:**
```bash
cd packages/mobile/ios
pod install --repo-update
```

**Dependency conflicts:**
```bash
npm install --legacy-peer-deps
```

**Database connection issues:**
- Check `.env` file configuration
- Ensure PostgreSQL is running
- Verify database credentials

## Mobile Setup Guide

For detailed mobile development setup, see [MOBILE_SETUP.md](MOBILE_SETUP.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile (if applicable)
5. Add tests if applicable
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

## Getting Help

- **Backend Issues**: Check Go server logs and database connection
- **Web Issues**: Check browser console and webpack build
- **Mobile Issues**: Check Metro bundler and native build logs
- **Shared Code Issues**: Check import paths and package dependencies

**Happy Coding! 🚀**
