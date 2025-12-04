# Cookie Storage Documentation

## Overview

The Authorization Code (AC) is stored in a browser cookie that persists for 30 days (1 month). This provides a secure, persistent way to maintain user authentication across browser sessions.

## Implementation

### Location
- **File**: `src/utils/storage.js`
- **Functions**: `setAuthCode()`, `getAuthCode()`, `removeAuthCode()`

### Cookie Details

| Property | Value |
|----------|-------|
| **Cookie Name** | `authCode` |
| **Expiration** | 30 days (2,592,000 seconds) |
| **Path** | `/` (available site-wide) |
| **SameSite** | `Lax` |
| **Secure** | Inherited from page context |

### Cookie Helper Functions

#### `setCookie(name, value, days)`
Sets a cookie with the specified name, value, and expiration.

**Parameters:**
- `name` (string): Cookie name
- `value` (string): Cookie value
- `days` (number): Number of days until expiration

**Example:**
```javascript
setCookie('authCode', '4d4f60a5-b591-4a7e-a1d5-072e117aa904', 30)
```

#### `getCookie(name)`
Retrieves a cookie value by name.

**Parameters:**
- `name` (string): Cookie name to retrieve

**Returns:**
- `string | null`: Cookie value or null if not found

**Example:**
```javascript
const ac = getCookie('authCode')
// Returns: '4d4f60a5-b591-4a7e-a1d5-072e117aa904' or null
```

#### `deleteCookie(name)`
Deletes a cookie by setting its expiration to a past date.

**Parameters:**
- `name` (string): Cookie name to delete

**Example:**
```javascript
deleteCookie('authCode')
```

## API Functions

### `setAuthCode(code)`
Stores the Authorization Code in a cookie with 30-day expiration.

**Parameters:**
- `code` (string): The Authorization Code to store

**Usage:**
```javascript
import { setAuthCode } from '../utils/storage'

// After successful AuthorizeDeviceID
const ac = res?.parsed?.Auth || res?.parsed?.auth || ''
if (ac) {
  setAuthCode(ac)
}
```

**Behavior:**
- Stores the AC in a cookie named `authCode`
- Cookie expires in 30 days
- Also stores in localStorage for backward compatibility during transition

### `getAuthCode()`
Retrieves the Authorization Code from the cookie.

**Returns:**
- `Promise<string | null>`: The Authorization Code or null if not found

**Usage:**
```javascript
import { getAuthCode } from '../utils/storage'

const ac = await getAuthCode()
if (ac) {
  // Use the authorization code
}
```

**Behavior:**
- Reads from cookie first
- Falls back to localStorage if cookie doesn't exist (backward compatibility)

### `removeAuthCode()`
Removes the Authorization Code from both cookie and localStorage.

**Usage:**
```javascript
import { removeAuthCode } from '../utils/storage'

// On logout or authentication failure
await removeAuthCode()
```

**Behavior:**
- Deletes the `authCode` cookie
- Removes from localStorage (backward compatibility)

## Flow

### 1. User Login Flow

```
User enters credentials
    ↓
AuthorizeUser API call
    ↓
SMS code sent to user
    ↓
User enters 6-digit code
    ↓
AuthorizeDeviceID API call
    ↓
Response contains <Auth> tag with AC
    ↓
AC stored in cookie (30 days)
    ↓
User redirected to Dashboard
```

### 2. Subsequent API Calls

```
API call initiated
    ↓
getAuthCode() reads from cookie
    ↓
AC included in API request
    ↓
Request sent to server
```

### 3. Logout Flow

```
User logs out or session expires
    ↓
removeAuthCode() called
    ↓
Cookie deleted
    ↓
User redirected to login
```

## API Response Format

The Authorization Code is extracted from the `AuthorizeDeviceID` API response:

```xml
<ResultInfo>
  <ErrorNumber>0</ErrorNumber>
  <Result>Success</Result>
  <Message>Security code accepted</Message>
  <Auth>4d4f60a5-b591-4a7e-a1d5-072e117aa904</Auth>
</ResultInfo>
```

The code extracts the AC from the `<Auth>` tag (case-insensitive):
- `res?.parsed?.Auth`
- `res?.parsed?.auth`
- `res?.parsed?.AC` (fallback)
- `res?.parsed?.ac` (fallback)

## Security Considerations

### SameSite Attribute
- Set to `Lax` to prevent CSRF attacks while allowing normal navigation
- Cookies are sent with top-level navigations but not with cross-site requests

### Path Attribute
- Set to `/` to make the cookie available site-wide
- Ensures the AC is accessible from all routes

### Expiration
- 30-day expiration balances security and user convenience
- Users need to re-authenticate monthly
- Reduces risk of long-term unauthorized access

### Cookie vs LocalStorage
- Cookies are automatically sent with HTTP requests (useful for server-side)
- Cookies can be httpOnly (not accessible via JavaScript) - not implemented here
- Cookies have built-in expiration management
- LocalStorage persists until explicitly cleared

## Browser Compatibility

The cookie implementation uses standard JavaScript and works in all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Opera

## Testing

### Check Cookie in Browser DevTools

1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Navigate to **Cookies** → Your domain
4. Look for `authCode` cookie
5. Verify:
   - Value is the Authorization Code
   - Expires date is ~30 days from now
   - Path is `/`

### Manual Testing

```javascript
// In browser console
// Check if cookie exists
document.cookie.includes('authCode=')

// Get cookie value
document.cookie.split(';').find(c => c.trim().startsWith('authCode='))

// Delete cookie manually
document.cookie = 'authCode=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
```

## Troubleshooting

### Cookie Not Being Set
- Check browser console for errors
- Verify cookies are enabled in browser settings
- Check if browser is in private/incognito mode (cookies may be restricted)

### Cookie Expired
- Cookie expires after 30 days
- User needs to re-authenticate via login flow
- New AC will be stored in a new cookie

### Cookie Not Found
- Cookie may have been deleted
- Browser may have cleared cookies
- User may be in a different browser/device
- Fallback to localStorage may provide the AC (during transition period)

## Migration Notes

During the transition from localStorage to cookies:
- Both storage methods are used for backward compatibility
- New logins will use cookies
- Existing localStorage values will still work
- Eventually, localStorage fallback can be removed

## Future Enhancements

Potential improvements:
1. **HttpOnly Flag**: Make cookie httpOnly for better security (requires server-side changes)
2. **Secure Flag**: Add secure flag for HTTPS-only transmission
3. **Refresh Token**: Implement token refresh mechanism
4. **Cookie Encryption**: Encrypt the AC value before storing
5. **Multiple Device Support**: Track multiple devices per user

