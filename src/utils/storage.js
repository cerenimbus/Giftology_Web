// Storage utility functions for web (using localStorage)
export const getAuthCode = async () => {
  try {
    return localStorage.getItem('authCode') || null
  } catch (error) {
    return null
  }
}

export const removeAuthCode = async () => {
  try {
    localStorage.removeItem('authCode')
  } catch (error) {
    console.error('Error removing auth code:', error)
  }
}

export const setAuthCode = (code) => {
  try {
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
