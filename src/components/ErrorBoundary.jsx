// RHCM: 12/19/2025
import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // You can log the error to an external service here
    // console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: '#fff', minHeight: '100vh', boxSizing: 'border-box' }}>
          <h1 style={{ color: '#e84b4b' }}>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{String(this.state.error && this.state.error.stack ? this.state.error.stack : this.state.error)}</pre>
        </div>
      )
    }

    return this.props.children
  }
}
