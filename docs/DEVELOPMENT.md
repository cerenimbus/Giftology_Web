# Development Guide

## Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher (or yarn/pnpm)
- Code editor (VS Code recommended)
- Git (for version control)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Giftology_Web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:5173`
   - Application should load

## Development Workflow

### File Structure

Follow the existing project structure:

```
src/
├── components/     # Reusable components
├── screens/        # Page components
├── utils/          # Utility functions
├── App.jsx         # Main app
└── main.jsx        # Entry point
```

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement feature**
   - Follow existing code patterns
   - Add appropriate comments
   - Update documentation

3. **Test thoroughly**
   - Test in multiple browsers
   - Test responsive design
   - Test error cases

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: Description of changes"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Standards

### JavaScript/React

#### Component Structure

```javascript
import React, { useState, useEffect } from 'react'

export default function ComponentName() {
  // 1. State declarations
  const [state, setState] = useState(initialValue)
  
  // 2. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies])
  
  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  }
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

#### Naming Conventions

- **Components**: PascalCase (`Dashboard.jsx`)
- **Functions**: camelCase (`getAuthCode`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: Match component/function name

#### Comments

```javascript
/**
 * Function description
 * @param {string} param1 - Parameter description
 * @returns {Promise<string>} Return description
 */
export async function functionName(param1) {
  // Implementation
}
```

### Styling

#### Inline Styles

```javascript
const styles = {
  container: {
    padding: '1rem',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
  }
}
```

#### CSS Files

Use CSS files for complex styles:
- Component-specific styles
- Animations
- Media queries

### API Integration

#### Adding New API Endpoints

1. **Add function to `src/utils/api.js`**

```javascript
export async function NewEndpoint({ param1, param2 }) {
  const params = { param1, param2, Language: 'EN', MobileVersion: '1' }
  const paramOrder = ['DeviceID', 'Date', 'Key', 'AC', 'Language', 'MobileVersion', 'param1', 'param2']
  return callService('NewEndpoint', params, paramOrder)
}
```

2. **Use in component**

```javascript
import { NewEndpoint } from '../utils/api'

const res = await NewEndpoint({ param1: 'value1', param2: 'value2' })
if (res?.success) {
  // Handle success
}
```

## Debugging

### Browser DevTools

1. **Console**
   - Check for errors
   - View debug logs
   - Test API calls

2. **Network Tab**
   - Inspect API requests
   - Check response data
   - Verify headers

3. **Application Tab**
   - Check cookies
   - Inspect localStorage
   - View storage data

### Debug Mode

Enable debug logging:

```javascript
localStorage.setItem('debug', 'true')
```

Debug logs include:
- API request details
- Response data
- Error information
- State changes

### Common Debugging Tasks

#### Check API Response

```javascript
// In browser console
const res = await GetDashboard()
console.log(res)
```

#### Check Cookie

```javascript
// In browser console
document.cookie
```

#### Check Device ID

```javascript
// In browser console
localStorage.getItem('deviceId')
```

## Testing

### Manual Testing Checklist

- [ ] Login flow works
- [ ] 2FA verification works
- [ ] Dashboard loads data
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] Error handling works
- [ ] Responsive design works
- [ ] Cross-browser compatibility

### Testing Different Scenarios

1. **Happy Path**
   - Normal user flow
   - All features working

2. **Error Cases**
   - Invalid credentials
   - Network errors
   - API errors
   - Missing data

3. **Edge Cases**
   - Empty responses
   - Large datasets
   - Slow network
   - Expired sessions

## Performance Optimization

### Best Practices

1. **Avoid Unnecessary Renders**
   ```javascript
   // Use React.memo for expensive components
   export default React.memo(ExpensiveComponent)
   ```

2. **Optimize Effects**
   ```javascript
   // Include all dependencies
   useEffect(() => {
     // Effect logic
   }, [dependency1, dependency2])
   ```

3. **Lazy Load Routes** (if needed)
   ```javascript
   const LazyComponent = React.lazy(() => import('./Component'))
   ```

4. **Optimize Images**
   - Use appropriate formats
   - Compress images
   - Lazy load images

## Common Issues and Solutions

### CORS Errors

**Problem**: CORS errors in development

**Solution**: 
- Check `vite.config.js` proxy configuration
- Restart dev server
- Verify API endpoint URL

### Cookie Not Setting

**Problem**: Cookie not being set

**Solution**:
- Check browser cookie settings
- Verify SameSite attribute
- Check for HTTPS requirement

### API Request Failing

**Problem**: API requests returning errors

**Solution**:
- Check request parameters
- Verify key generation
- Check Authorization Code
- Inspect network tab

### State Not Updating

**Problem**: Component state not updating

**Solution**:
- Check useState usage
- Verify dependencies in useEffect
- Check for stale closures

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring

### Commit Messages

Format: `Type: Description`

Types:
- `Add:` - New feature
- `Fix:` - Bug fix
- `Update:` - Update existing feature
- `Remove:` - Remove feature
- `Docs:` - Documentation
- `Refactor:` - Code refactoring

Examples:
```
Add: User profile page
Fix: Login error handling
Update: Dashboard styling
Docs: API documentation
```

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows project conventions
- [ ] Comments added where needed
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Responsive design tested
- [ ] Cross-browser tested
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Environment Setup

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- React snippets
- GitLens
- Auto Rename Tag

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "javascript.preferences.quoteStyle": "single",
  "typescript.preferences.quoteStyle": "single"
}
```

## Building and Deployment

### Build Process

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Output

- `dist/` directory contains production build
- Optimized and minified
- Ready for deployment

### Deployment Checklist

- [ ] Build succeeds without errors
- [ ] All routes work
- [ ] API endpoints correct
- [ ] Environment variables set
- [ ] Server configuration correct
- [ ] HTTPS enabled
- [ ] Error tracking configured

## Additional Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [API Documentation](API.md)
- [Architecture Documentation](ARCHITECTURE.md)

## Getting Help

- Check existing documentation
- Review code comments
- Check browser console for errors
- Review API responses
- Contact development team

