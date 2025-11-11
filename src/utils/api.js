// API utility functions
export const AuthorizeUser = async ({ code }) => {
  try {
    // Replace this with your actual API endpoint
    const response = await fetch('/api/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(error.message || 'Network error')
  }
}
