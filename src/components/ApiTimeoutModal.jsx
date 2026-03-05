import React, { useEffect, useState } from 'react'

/**
 * Global modal that appears when an API request times out.
 * Listens for the custom `rrservice-timeout` event dispatched by `handleApiTimeout`.
 */
export default function ApiTimeoutModal() {
  const [visible, setVisible] = useState(false)
  const [info, setInfo] = useState({})

  useEffect(() => {
    const handler = (event) => {
      const detail = event?.detail || {}
      setInfo(detail)
      setVisible(true)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('rrservice-timeout', handler)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('rrservice-timeout', handler)
      }
    }
  }, [])

  if (!visible) return null

  const message =
    info.message ||
    'The request timed out. Please check your connection and try again.'

  const functionName = info.functionName || ''

  const handleRetry = () => {
    // Simplest and most reliable way to retry all in-flight API calls
    // is to reload the page; individual screens will re-request data.
    window.location.reload()
  }

  const handleDismiss = () => {
    setVisible(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '90%',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
          padding: 24,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif',
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 12,
            fontSize: 20,
            fontWeight: 700,
            color: '#e84b4b',
          }}
        >
          Request Timed Out
        </h2>

        {functionName && (
          <div
            style={{
              marginBottom: 8,
              fontSize: 13,
              color: '#666',
            }}
          >
            API: <strong>{functionName}</strong>
          </div>
        )}

        <div
          style={{
            fontSize: 14,
            color: '#333',
            marginBottom: 12,
            whiteSpace: 'pre-wrap',
          }}
        >
          {message}
        </div>

        <div
          style={{
            fontSize: 13,
            color: '#555',
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          If retry does not work please email{' '}
          <a href="mailto:support@giftologygroup.com">
            support@giftologygroup.com
          </a>{' '}
          and include a screenshot of this message if possible. Error # 100
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <button
            onClick={handleDismiss}
            style={{
              flex: 1,
              backgroundColor: '#e84b4b',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 14px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Dismiss
          </button>

          <button
            onClick={handleRetry}
            style={{
              flex: 1,
              backgroundColor: '#1a9c4b',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 14px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}

