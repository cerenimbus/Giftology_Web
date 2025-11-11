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
