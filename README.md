# Modern Authentication App

A modern web application with authentication using Auth0, built with Go and React.

## Features

- Clean, modern UI with Material-UI
- Secure authentication with Auth0
- Mobile-friendly design
- Session management
- Protected routes

## Prerequisites

- Go 1.16 or higher
- Node.js 14 or higher
- Auth0 account
- ngrok (for local development)

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install Go dependencies:
```bash
go mod download
```

3. Install Node.js dependencies:
```bash
cd web
npm install
```

4. Create a `.env` file in the root directory with your Auth0 credentials:
```
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_CALLBACK_URL=http://localhost:3000/callback
```

5. Build the React application:
```bash
cd web
npm run build
```

## Running the Application

1. Start the Go server:
```bash
go run main.go
```

2. For local development with Auth0, start ngrok:
```bash
ngrok http 3000
```

3. Update your Auth0 application settings with the ngrok URL:
   - Add `https://your-ngrok-url/callback` to Allowed Callback URLs
   - Add `https://your-ngrok-url` to Allowed Logout URLs
   - Add `https://your-ngrok-url` to Allowed Web Origins

4. Update your `.env` file with the ngrok URL:
```
AUTH0_CALLBACK_URL=https://your-ngrok-url/callback
```

## Development

- Frontend development:
```bash
cd web
npm run dev
```

- Backend development:
```bash
go run main.go
```

## Project Structure

```
.
├── main.go              # Application entry point
├── platform/           # Core platform code
│   ├── authenticator/  # Auth0 authentication
│   ├── middleware/     # HTTP middleware
│   └── router/        # Route definitions
├── web/               # Frontend code
│   ├── app/          # Go handlers
│   ├── static/       # Static assets
│   └── template/     # HTML templates
└── .env              # Environment variables
```

## Security

- All sensitive data is stored in environment variables
- Session management with secure cookies
- CSRF protection with state parameter
- Secure headers and middleware

## License

MIT
