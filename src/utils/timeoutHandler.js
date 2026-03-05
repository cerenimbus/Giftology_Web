
// Timeout handler for web — called when API requests time out.
// It dispatches a custom event that the React UI listens for and shows a modal.
export function handleApiTimeout(info = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      const event = new CustomEvent('rrservice-timeout', { detail: info })
      window.dispatchEvent(event)
      return
    }
  } catch (e) {
    // fall through to alert fallback below
  }

  // Fallback: show a simple alert if the event-based UI is not available.
  try {
    // eslint-disable-next-line no-alert
    alert('The request timed out. Please check your connection and try again.')
  } catch (e) {
    // no-op in environments where alert is not available
  }
}

export default { handleApiTimeout }
