// Minimal timeout handler for web — called when API requests time out.
export function handleApiTimeout() {
  try {
    // In the mobile app this might show a modal; on web we can show an alert and
    // optionally reload or navigate to login. Keep it conservative here.
    // You can replace this with a nicer UX as needed.
    // eslint-disable-next-line no-alert
    alert('The request timed out. Please check your connection and try again.')
  } catch (e) {
    // no-op in environments where alert is not available
  }
}

export default { handleApiTimeout }
