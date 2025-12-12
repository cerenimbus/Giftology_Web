/**
 * Cookie helper functions for managing browser cookies
 * 
 * @see docs/COOKIE_STORAGE.md for complete documentation
 */

/**
 * Sets a cookie with the specified name, value, and expiration
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration
 */
function setCookie(name, value, days) {
  try {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`
    // Set cookie with path=/ (site-wide) and SameSite=Lax (CSRF protection)
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`
  } catch (error) {
    console.error('Error setting cookie:', error)
  }
}

/**
 * Retrieves a cookie value by name
 * @param {string} name - Cookie name to retrieve
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
  try {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  } catch (error) {
    console.error('Error getting cookie:', error)
    return null
  }
}

/**
 * Deletes a cookie by setting its expiration to a past date
 * @param {string} name - Cookie name to delete
 */
function deleteCookie(name) {
  try {
    // Set expiration to epoch time (Jan 1, 1970) to delete the cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  } catch (error) {
    console.error('Error deleting cookie:', error)
  }
}

/**
 * Storage utility functions for web
 * 
 * Authorization Code (AC) is stored in a browser cookie that expires in 30 days (1 month).
 * This provides persistent authentication across browser sessions.
 * 
 * @see docs/COOKIE_STORAGE.md for complete documentation
 */

/**
 * Retrieves the Authorization Code from the cookie
 * @returns {Promise<string|null>} The Authorization Code or null if not found
 * 
 * @example
 * const ac = await getAuthCode()
 * if (ac) {
 *   // Use the authorization code
 * }
 */
export const getAuthCode = async () => {
  try {
    return getCookie('authCode') || null
  } catch (error) {
    return null
  }
}

// Save login credentials
export const saveLoginCredentials = async (email, password) => {
  localStorage.setItem('login_email', email);
  localStorage.setItem('login_password', password);
};

// Retrieve login credentials
export const getLoginCredentials = async () => {
  return {
    email: localStorage.getItem('login_email') || '',
    password: localStorage.getItem('login_password') || '',
  };
};

// Clear if needed later (optional)
export const clearLoginCredentials = async () => {
  localStorage.removeItem('login_email');
  localStorage.removeItem('login_password');
};

/**
 * Removes the Authorization Code from both cookie and localStorage
 * Used when user logs out or authentication fails
 * 
 * @example
 * await removeAuthCode()
 */
export const removeAuthCode = async () => {
  try {
    deleteCookie('authCode')
    // Also remove from localStorage if it exists (for backward compatibility)
    localStorage.removeItem('authCode')
  } catch (error) {
    console.error('Error removing auth code:', error)
  }
}

/**
 * Stores the Authorization Code in a cookie with 30-day expiration
 * 
 * The AC comes from the AuthorizeDeviceID API response in the <Auth> tag.
 * Cookie details:
 * - Name: 'authCode'
 * - Expiration: 30 days (2,592,000 seconds)
 * - Path: '/' (site-wide)
 * - SameSite: 'Lax' (CSRF protection)
 * 
 * @param {string} code - The Authorization Code to store
 * 
 * @example
 * // After successful AuthorizeDeviceID
 * const ac = res?.parsed?.Auth || res?.parsed?.auth || ''
 * if (ac) {
 *   setAuthCode(ac)
 * }
 */
export const setAuthCode = (code) => {
  try {
    // Store in cookie with 30 days expiration (approximately 1 month)
    setCookie('authCode', code, 30)
    // Also keep in localStorage for backward compatibility during transition
    localStorage.setItem('authCode', code)
  } catch (error) {
    console.error('Error setting auth code:', error)
  }
}

// Return a device id persisted in localStorage. Generates a simple alphanumeric
// identifier if none exists (keeps <= 60 characters). This is used to sign
// requests per the RRService API.
export const getDeviceId = async () => {
  try {
    let id = localStorage.getItem('deviceId')
    if (!id) {
      // create a compact random id (36 chars) made from base36 pieces
      id = `${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36).slice(-12)}`.slice(0, 60)
      localStorage.setItem('deviceId', id)
    }
    return id
  } catch (error) {
    return null
  }
}
