
# Giftology Web - Verify Page

A responsive ReactJS web application for the Giftology verification page.

## Features

- Responsive design that works on desktop, tablet, and mobile devices
- Exact match to the design specifications
- Clean, modern UI with subtle background patterns
- 6-digit code verification input
- Loading states and error handling

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
  components/
    Verify.jsx      # Main verify component
    Verify.css      # Styles for verify component
  utils/
    api.js          # API utility functions
    storage.js      # LocalStorage utility functions
  App.jsx           # Main app component with routing
  main.jsx          # Entry point
  index.css         # Global styles
```

## API Configuration

Update the API endpoint in `src/utils/api.js` to match your backend API.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
