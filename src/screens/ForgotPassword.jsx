import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ForgotPassword.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      // TODO: Implement password reset API call
      // const res = await ResetPassword({ email })
      // if (res?.success) {
      //   navigate('/verify')
      // }
      
      // For now, navigate to verify screen
      setTimeout(() => {
        setLoading(false)
        navigate('/verify')
      }, 1000)
    } catch (e) {
      alert(String(e))
      setLoading(false)
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  return (
    <div className="forgot-password-page">
      {/* Background Patterns */}
      <div className="bg-pattern bg-pattern-top-left"></div>
      <div className="bg-pattern bg-pattern-top-right"></div>
      
      {/* Main Content */}
      <main className="forgot-password-content">
        {/* Relationship Radar Section */}
        <div className="relationship-radar-section">
          <h1 className="relationship-radar-title">ROR</h1>
          <p className="powered-by">Powered by:</p>
        </div>

        {/* Logo Container */}
        <div className="logo-container">
          <div className="giftology-logo">
            GIFT·OLOGY<sup>®</sup>
          </div>
        </div>

        {/* Reset Password Card */}
        <div className="reset-password-card">
          <h2 className="reset-password-title">Reset Password</h2>
          <form onSubmit={onSubmit}>
            <label className="email-label">Enter Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="email-input"
              placeholder="enter_email@email.com"
              required
            />
            <button
              type="submit"
              disabled={!email || loading}
              className={`submit-button ${(!email || loading) ? 'disabled' : ''}`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </main>

      {/* Background Patterns */}
      <div className="bg-pattern bg-pattern-bottom-left"></div>
      <div className="bg-pattern bg-pattern-bottom-right"></div>
    </div>
  )
}

