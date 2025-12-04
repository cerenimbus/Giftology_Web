# Architecture Documentation

## Overview

The Giftology Relationship Radar web application is built as a single-page application (SPA) using React, following modern web development best practices. The architecture emphasizes modularity, reusability, and maintainability.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Client                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   React UI   │  │   Router     │  │   State      │  │
│  │  Components  │◄─┤  (React      │◄─┤  Management  │  │
│  │              │  │   Router)    │  │              │  │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘  │
│         │                                    │           │
│         └──────────────┬─────────────────────┘           │
│                        │                                 │
│                 ┌──────▼───────┐                         │
│                 │  API Client  │                         │
│                 │   (api.js)   │                         │
│                 └──────┬───────┘                         │
│                        │                                 │
│                 ┌──────▼───────┐                         │
│                 │   Storage    │                         │
│                 │  (storage.js)│                         │
│                 └──────────────┘                         │
│                                                           │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ HTTPS
                        │
┌───────────────────────▼─────────────────────────────────┐
│              Giftology RRService API                     │
│         https://radar.Giftologygroup.com                │
└─────────────────────────────────────────────────────────┘
```

## Application Structure

### Component Hierarchy

```
App
├── LoadingScreen (initial)
└── Router
    ├── Login
    ├── Verify
    ├── Dashboard
    │   ├── Sidebar (desktop)
    │   ├── Mobile Header
    │   └── Dashboard Content
    ├── Tasks
    ├── DOV
    ├── Contacts
    ├── Reports
    ├── Feedback
    ├── Help
    ├── Setup
    └── ForgotPassword
```

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.jsx
│   └── Icons.jsx
├── screens/            # Page-level components
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── ...
├── utils/              # Utility functions
│   ├── api.js         # API client
│   ├── storage.js     # Storage utilities
│   ├── debug.js       # Debug utilities
│   └── timeoutHandler.js
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Core Modules

### 1. API Client (`src/utils/api.js`)

**Purpose**: Centralized API communication layer

**Responsibilities**:
- Request signing and security
- Parameter formatting
- Response parsing (XML to JSON)
- Error handling
- Timeout management

**Key Functions**:
- `callService()` - Core API call function
- `sha1()` - Hash generation
- `buildUrl()` - URL construction
- Individual endpoint functions

**Dependencies**:
- `crypto-js` - SHA-1 hashing
- `fast-xml-parser` - XML parsing
- `storage.js` - Device ID and AC retrieval

### 2. Storage Utilities (`src/utils/storage.js`)

**Purpose**: Persistent data storage

**Responsibilities**:
- Cookie management (Authorization Code)
- LocalStorage management (Device ID)
- Data persistence across sessions

**Key Functions**:
- `setAuthCode()` - Store AC in cookie
- `getAuthCode()` - Retrieve AC from cookie
- `removeAuthCode()` - Delete AC
- `getDeviceId()` - Get/create Device ID

**Storage Strategy**:
- **Authorization Code**: Cookie (30-day expiration)
- **Device ID**: LocalStorage (persistent)

### 3. Routing (`src/App.jsx`)

**Purpose**: Client-side routing and navigation

**Technology**: React Router DOM v6

**Routes**:
- `/` - Login (default)
- `/login` - Login page
- `/verify` - 2FA verification
- `/dashboard` - Main dashboard
- `/tasks` - Task management
- `/dov` - DOV & Dates
- `/contacts` - Contact list
- `/reports` - Reports
- `/feedback` - Feedback form
- `/help` - Help content
- `/setup` - CRM setup
- `/forgot` - Password reset

**Route Protection**:
- Automatic redirect to login if no AC present
- Protected routes check for valid AC

### 4. State Management

**Approach**: Local component state with React Hooks

**State Patterns**:
- `useState` for component-level state
- `useEffect` for side effects and data fetching
- Props for parent-child communication
- Context (if needed for global state)

**No Global State Library**: The application uses React's built-in state management, keeping the architecture simple and lightweight.

## Data Flow

### Authentication Flow

```
1. User enters credentials
   ↓
2. Login component calls AuthorizeUser()
   ↓
3. API client formats request with DeviceID + Date
   ↓
4. Server validates and sends SMS
   ↓
5. User enters SMS code
   ↓
6. Verify component calls AuthorizeDeviceID()
   ↓
7. Server validates code and returns AC
   ↓
8. AC stored in cookie (30 days)
   ↓
9. User redirected to Dashboard
```

### Data Fetching Flow

```
1. Component mounts
   ↓
2. useEffect triggers data fetch
   ↓
3. API function called (e.g., GetDashboard())
   ↓
4. API client:
   - Retrieves DeviceID from localStorage
   - Retrieves AC from cookie
   - Generates date string
   - Calculates key hash
   - Builds request URL
   ↓
5. Request sent to API
   ↓
6. XML response received
   ↓
7. Response parsed to JSON
   ↓
8. Data returned to component
   ↓
9. Component updates state
   ↓
10. UI re-renders with new data
```

## Security Architecture

### Request Signing

All API requests (except initial auth) are signed using SHA-1 hashing:

```
Key = SHA-1(DeviceID + Date + AC + DeviceID)
```

This ensures:
- Request integrity
- Authentication verification
- Replay attack prevention

### Device Identification

- Unique Device ID generated on first visit
- Stored in localStorage
- Used for request signing
- Tracks device authorization

### Session Management

- Authorization Code stored in secure cookie
- 30-day expiration
- SameSite=Lax for CSRF protection
- Automatic cleanup on logout

## Build System

### Vite Configuration

**Build Tool**: Vite 5.0.8

**Features**:
- Fast HMR (Hot Module Replacement)
- Optimized production builds
- Code splitting
- Asset optimization

**Configuration**:
- Base path: `/dev/`
- React plugin enabled
- Proxy for API endpoints
- Source maps in development

### Build Process

```
Source Files (src/)
    ↓
Vite Build
    ↓
Transpilation (Babel)
    ↓
Bundling
    ↓
Optimization
    ↓
Production Build (dist/)
```

## Styling Architecture

### Approach
- Inline styles (JavaScript objects)
- Component-scoped styles
- CSS files for complex styles (Verify, Contacts, ForgotPassword)

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 480px
  - Tablet: 480px - 900px
  - Desktop: > 900px

### Design System
- Primary color: `#e84b4b` (Giftology red)
- Typography: System fonts (Inter, system-ui)
- Spacing: Consistent padding/margin scale
- Components: Reusable card, button, input styles

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Automatic route-based splitting
   - Lazy loading for routes (if implemented)

2. **Asset Optimization**
   - Image optimization
   - CSS minification
   - JavaScript minification

3. **API Optimization**
   - Request batching (if applicable)
   - Caching strategies
   - Timeout handling

4. **Rendering Optimization**
   - React.memo for expensive components
   - useMemo/useCallback for expensive computations
   - Efficient re-render patterns

## Error Handling

### Error Boundaries

**Component**: `ErrorBoundary.jsx`

**Purpose**: Catch and handle React component errors

**Strategy**:
- Graceful error display
- Error logging
- User-friendly error messages

### API Error Handling

**Location**: `src/utils/api.js`

**Strategy**:
- Try-catch blocks
- Error response parsing
- User-friendly error messages
- Console logging for debugging

### Network Error Handling

- Timeout detection (30 seconds)
- Retry logic (if needed)
- Offline detection
- User notification

## Testing Strategy

### Manual Testing
- Browser DevTools
- Network tab inspection
- Console logging
- User acceptance testing

### Testing Areas
- Authentication flow
- API integration
- State management
- Error handling
- Responsive design
- Cross-browser compatibility

## Deployment Architecture

### Production Build

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── [other assets]
```

### Server Requirements

- Static file serving
- SPA routing support
- HTTPS (recommended)
- Proper cache headers

### Deployment Flow

```
1. npm run build
   ↓
2. dist/ directory created
   ↓
3. Upload to web server
   ↓
4. Configure server routing
   ↓
5. Application live
```

## Future Enhancements

### Potential Improvements

1. **State Management**
   - Consider Redux or Zustand for complex state
   - Global state for user session

2. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright/Cypress)

3. **Performance**
   - Service Worker for offline support
   - Progressive Web App (PWA)
   - Image lazy loading

4. **Security**
   - HttpOnly cookies
   - CSRF tokens
   - Content Security Policy

5. **Monitoring**
   - Error tracking (Sentry)
   - Analytics
   - Performance monitoring

## Dependencies

### Production Dependencies

- `react` - UI library
- `react-dom` - DOM rendering
- `react-router-dom` - Routing
- `crypto-js` - Cryptography
- `fast-xml-parser` - XML parsing

### Development Dependencies

- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin

## Browser Compatibility

### Supported Browsers

- Modern browsers (ES6+ support)
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Polyfills

- None required (modern browser support)
- Fetch API (native)
- Promise (native)
- LocalStorage (native)

## Development Workflow

1. **Development**
   - `npm run dev` - Start dev server
   - Hot reload on file changes
   - Proxy for API calls

2. **Building**
   - `npm run build` - Create production build
   - Optimized and minified output

3. **Preview**
   - `npm run preview` - Preview production build
   - Test before deployment

## Additional Resources

- [API Documentation](API.md)
- [Cookie Storage Documentation](COOKIE_STORAGE.md)
- [Development Guide](DEVELOPMENT.md)

