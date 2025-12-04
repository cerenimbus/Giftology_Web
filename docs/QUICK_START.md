# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:5173`

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

## Project Structure Quick Reference

```
src/
├── components/      # Reusable components
├── screens/         # Page components
├── utils/           # Utilities (API, storage, etc.)
├── App.jsx          # Main app with routing
└── main.jsx         # Entry point
```

## Key Files

| File | Purpose |
|------|---------|
| `src/utils/api.js` | API client and endpoints |
| `src/utils/storage.js` | Cookie/localStorage utilities |
| `src/App.jsx` | Routing configuration |
| `vite.config.js` | Build configuration |

## Common Tasks

### Add a New Page

1. Create component in `src/screens/`
2. Add route in `src/App.jsx`
3. Add navigation link

### Add API Endpoint

1. Add function to `src/utils/api.js`
2. Import and use in component

### Debug API Calls

1. Open browser DevTools
2. Check Network tab
3. Enable debug: `localStorage.setItem('debug', 'true')`

## Troubleshooting

**CORS Error?** → Restart dev server (proxy needs restart)

**Cookie Not Working?** → Check browser settings, verify HTTPS

**API Error?** → Check Network tab, verify credentials

## Next Steps

- Read [README.md](../README.md) for full documentation
- Check [API.md](API.md) for API details
- Review [DEVELOPMENT.md](DEVELOPMENT.md) for development guide

