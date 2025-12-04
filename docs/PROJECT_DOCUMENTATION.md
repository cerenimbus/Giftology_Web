# Giftology Relationship Radar - Complete Project Documentation

A modern, responsive React web application for the Giftology Relationship Radar platform. This application provides a comprehensive interface for managing relationships, tasks, contacts, and CRM integrations.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Overview

Giftology Relationship Radar is a web-based relationship management platform that helps users track and manage their professional relationships, tasks, and interactions. The application integrates with the Giftology RRService API and provides features for:

- User authentication with two-factor authentication (2FA)
- Dashboard with relationship insights and metrics
- Task management
- Contact management
- Date of Value (DOV) tracking
- Reports and analytics
- CRM integration setup
- Feedback submission

## Features

### Core Features

- **User Authentication**
  - Username/password login
  - Two-factor authentication via SMS
  - Secure session management with cookie-based Authorization Code storage
  - 30-day persistent authentication

- **Dashboard**
  - Best referral partners overview
  - Current runaway relationships
  - Task overview
  - DOV (Date of Value) metrics
  - Outcomes tracking (introductions, referrals, partners)
  - Referral revenue visualization

- **Task Management**
  - View all tasks
  - Mark tasks as complete
  - Task filtering and organization

- **Contact Management**
  - View all contacts
  - Contact status tracking
  - Potential partners identification

- **DOV & Dates**
  - Harmless starters tracking
  - Greenlight questions
  - Clarity conversations
  - Date-based organization

- **Reports**
  - Comprehensive reporting interface
  - Analytics and insights

- **CRM Integration**
  - KEAP (Infusionsoft) setup
  - Automatic tag synchronization
  - Subscriber serial management

- **Feedback System**
  - User feedback submission
  - Response preferences
  - Update notifications

### Technical Features

- **Responsive Design**
  - Mobile-first approach
  - Desktop and tablet optimization
  - Adaptive layouts

- **Security**
  - SHA-1 hash-based request signing
  - Device ID tracking
  - Secure cookie storage
  - CORS protection

- **Performance**
  - Fast page loads
  - Optimized API calls
  - Efficient state management

## Technology Stack

### Core Technologies

- **React 18.2.0** - UI library
- **React Router DOM 6.20.0** - Client-side routing
- **Vite 5.0.8** - Build tool and dev server

### Key Dependencies

- **crypto-js 4.1.1** - SHA-1 hashing for API security
- **fast-xml-parser 4.0.12** - XML response parsing

### Development Tools

- **@vitejs/plugin-react** - Vite React plugin
- **ESLint** - Code linting (if configured)

## Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher (or **yarn** / **pnpm**)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Giftology_Web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (if needed)
   ```bash
   # Create .env file for custom API base URL
   VITE_API_BASE=https://radar.Giftologygroup.com/RRService
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The app will be available at the configured base path

### First Time Setup

1. Navigate to the login page
2. Enter your username and password
3. Accept the terms and privacy policy
4. Complete two-factor authentication with SMS code
5. You'll be redirected to the dashboard

## Project Structure

```
Giftology_Web/
├── docs/                          # Documentation
│   ├── API.md                    # API integration guide
│   ├── ARCHITECTURE.md           # Architecture overview
│   ├── COOKIE_STORAGE.md         # Cookie storage documentation
│   ├── DEVELOPMENT.md            # Development guide
│   ├── PROJECT_DOCUMENTATION.md  # This file
│   └── QUICK_START.md            # Quick reference guide
├── src/
│   ├── components/               # Reusable components
│   │   ├── ErrorBoundary.jsx    # Error boundary component
│   │   └── Icons.jsx            # Icon components
│   ├── screens/                  # Page components
│   │   ├── assets/              # Screen-specific assets
│   │   ├── Contacts.jsx         # Contacts page
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── DOV.jsx              # DOV & Dates page
│   │   ├── Feedback.jsx         # Feedback page
│   │   ├── ForgotPassword.jsx   # Password reset
│   │   ├── helpscreen.jsx       # Help page
│   │   ├── loading.jsx          # Loading screen
│   │   ├── login.jsx            # Login page
│   │   ├── Reports.jsx          # Reports page
│   │   ├── Setup.jsx            # CRM setup page
│   │   ├── Tasks.jsx            # Tasks page
│   │   └── Verify.jsx           # 2FA verification
│   ├── utils/                    # Utility functions
│   │   ├── api.js               # API client and functions
│   │   ├── debug.js             # Debug utilities
│   │   ├── storage.js           # Cookie/localStorage utilities
│   │   └── timeoutHandler.js    # API timeout handling
│   ├── App.jsx                   # Main app component with routing
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles
├── dist/                         # Production build output
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
└── README.md                     # Quick start guide
```

## API Integration

The application integrates with the Giftology RRService API. All API calls are handled through the centralized API client in `src/utils/api.js`.

### Base URL

- **Production**: `https://radar.Giftologygroup.com/RRService`
- **Development**: Proxied through Vite dev server to avoid CORS issues

### API Endpoints

See [API Documentation](API.md) for complete API endpoint documentation.

### Key API Functions

- `AuthorizeUser()` - Initial user authentication
- `AuthorizeDeviceID()` - Two-factor authentication
- `GetDashboard()` - Dashboard data
- `GetTaskList()` - Task list
- `GetTask()` - Individual task details
- `UpdateTask()` - Update task status
- `GetDOVDateList()` - DOV dates
- `GetContactList()` - Contact list
- `GetContact()` - Individual contact
- `ResetPassword()` - Password reset
- `GetHelp()` - Help content
- `UpdateFeedback()` - Submit feedback

### Request Security

All API requests (except initial authentication) include:
- **DeviceID**: Unique device identifier
- **Date**: Current date/time (MM/DD/YYYY-HH:mm)
- **Key**: SHA-1 hash for request signing
- **AC**: Authorization Code from cookie

See [API Documentation](API.md) for detailed security implementation.

## Authentication

### Authentication Flow

1. **Login** (`AuthorizeUser`)
   - User enters username and password
   - Server validates credentials
   - SMS code sent to user's phone

2. **Verification** (`AuthorizeDeviceID`)
   - User enters 6-digit SMS code
   - Server validates code
   - Authorization Code (AC) returned in `<Auth>` tag

3. **Session Management**
   - AC stored in cookie (30-day expiration)
   - AC included in all subsequent API requests
   - Session persists across browser restarts

### Cookie Storage

The Authorization Code is stored in a browser cookie:
- **Name**: `authCode`
- **Expiration**: 30 days
- **Path**: `/` (site-wide)
- **SameSite**: `Lax`

See [Cookie Storage Documentation](COOKIE_STORAGE.md) for details.

## Development

### Development Server

```bash
npm run dev
```

The development server runs on `http://localhost:5173` with:
- Hot Module Replacement (HMR)
- API proxy for CORS-free development
- Source maps for debugging

### Proxy Configuration

The Vite dev server proxies API requests to avoid CORS issues:

- `/RRService/*` → `https://radar.Giftologygroup.com/RRService/*`
- `/api/KEAP/*` → `https://radar.giftologygroup.com/api/KEAP/*`

### Code Style

- Use functional components with hooks
- Follow React best practices
- Maintain consistent file structure
- Add JSDoc comments for functions

### Debugging

Enable debug mode by setting a flag in localStorage:
```javascript
localStorage.setItem('debug', 'true')
```

Debug utilities are available in `src/utils/debug.js`.

## Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Build Configuration

- **Base Path**: `/dev/` (configured in `vite.config.js`)
- **Output Directory**: `dist/`
- **Asset Optimization**: Enabled
- **Code Splitting**: Automatic

### Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` directory to your web server

3. Configure your web server to:
   - Serve static files from the `dist/` directory
   - Handle client-side routing (SPA fallback)
   - Set appropriate cache headers

### Server Configuration Examples

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /dev/ {
        alias /path/to/dist/;
        try_files $uri $uri/ /dev/index.html;
    }
}
```

#### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /dev/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /dev/index.html [L]
</IfModule>
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Custom API base URL (optional)
VITE_API_BASE=https://radar.Giftologygroup.com/RRService
```

### Vite Configuration

Key settings in `vite.config.js`:

- **Base Path**: `/dev/` - Base URL for the application
- **Proxy**: Configured for API endpoints
- **React Plugin**: Enabled for JSX support

### API Configuration

API settings are configured in `src/utils/api.js`:

- Default remote URL
- Development proxy paths
- Request timeout (30 seconds)
- Key generation algorithms

## Documentation

### Available Documentation

- **[API Documentation](API.md)** - Complete API integration guide
- **[Architecture Documentation](ARCHITECTURE.md)** - Application architecture overview
- **[Cookie Storage](COOKIE_STORAGE.md)** - Cookie-based authentication storage
- **[Development Guide](DEVELOPMENT.md)** - Development best practices
- **[Quick Start Guide](QUICK_START.md)** - Quick reference guide

## Browser Support

### Supported Browsers

- **Chrome** (latest 2 versions)
- **Firefox** (latest 2 versions)
- **Safari** (latest 2 versions)
- **Edge** (latest 2 versions)

### Mobile Support

- **iOS Safari** (iOS 12+)
- **Chrome Mobile** (Android 8+)
- **Samsung Internet** (latest)

### Features Used

- ES6+ JavaScript
- CSS Grid and Flexbox
- Fetch API
- LocalStorage and Cookies
- React Hooks

## Contributing

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### Code Standards

- Follow existing code style
- Add comments for complex logic
- Update documentation as needed
- Test on multiple browsers

## License

[Add your license information here]

## Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: 2025

