# Mobile Setup for EventHub

This guide will help you set up the React Native mobile app for EventHub.

## Project Structure

```
eventhub-app/
├── packages/
│   ├── shared/          # 🔄 Shared code between web and mobile
│   │   ├── src/
│   │   │   ├── api/     # API calls to Go backend
│   │   │   ├── hooks/   # Shared React hooks
│   │   │   └── utils/   # Validation and utilities
│   │   └── package.json
│   ├── web/             # 🌐 React web app (existing)
│   └── mobile/          # 📱 React Native mobile app (new)
├── platform/            # Go backend
└── package.json         # Root monorepo config
```

## Installation

### 1. Install Dependencies

From the project root:

```bash
# Install all packages
npm run install:all

# Or install individually
npm run install:shared
npm run install:web  
npm run install:mobile
```

### 2. Mobile Development Prerequisites

**For iOS:**
- Xcode (latest version)
- iOS Simulator
- CocoaPods: `sudo gem install cocoapods`

**For Android:**
- Android Studio
- Android SDK
- Java Development Kit (JDK)
- Android emulator or physical device

### 3. iOS Setup

```bash
cd packages/mobile/ios
pod install
cd ..
```

### 4. Environment Configuration

Create `.env` file in `packages/mobile/`:

```env
REACT_APP_API_URL=http://localhost:3000
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-mobile-auth0-client-id
```

## Running the Apps

### Start Backend
```bash
# In project root
go run main.go
# or with hot reload
air
```

### Start Web App
```bash
npm run dev:web
```

### Start Mobile App
```bash
# Start Metro bundler
npm run start:mobile

# In separate terminals:
npm run ios       # For iOS
npm run android   # For Android
```

## Code Sharing

### What's Shared (70% of code):
- ✅ API calls to Go backend
- ✅ Business logic and validation
- ✅ Custom hooks (useEvents, useAuth)
- ✅ Utility functions
- ✅ Data types and interfaces

### What's Platform-Specific:
- ❌ UI Components (React vs React Native)
- ❌ Navigation (React Router vs React Navigation)
- ❌ Styling (CSS vs StyleSheet)
- ❌ Platform-specific features

## Example Usage

### In Web App:
```jsx
import { useEvents, validateEvent } from '@eventhub/shared';

// Same business logic and API calls
const { events, loading } = useEvents();
```

### In Mobile App:
```jsx
import { useEvents, validateEvent } from '@eventhub/shared';

// Same business logic and API calls  
const { events, loading } = useEvents();
```

## Features Implemented

- [x] Shared API integration with Go backend
- [x] Event listing with shared hooks
- [x] Shared validation logic
- [x] Navigation setup
- [ ] Auth0 authentication (coming next)
- [ ] Event creation/editing
- [ ] Maps integration
- [ ] Image handling
- [ ] Push notifications

## Next Steps

1. **Install dependencies**: `npm run install:all`
2. **Test mobile app**: `npm run ios` or `npm run android`
3. **Add Auth0 mobile authentication**
4. **Implement remaining screens**
5. **Add platform-specific features**

## Troubleshooting

### Metro bundler issues:
```bash
cd packages/mobile
npx react-native start --reset-cache
```

### iOS build issues:
```bash
cd packages/mobile/ios
pod install --repo-update
```

### Android build issues:
```bash
cd packages/mobile/android
./gradlew clean
```

## Scripts Reference

From project root:

- `npm run install:all` - Install all dependencies
- `npm run dev:web` - Start web development
- `npm run start:mobile` - Start mobile bundler
- `npm run ios` - Run iOS app
- `npm run android` - Run Android app
- `npm run lint` - Lint all packages 