import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthorizeUser } from '../utils/api'
import { getAuthCode, removeAuthCode } from '../utils/storage'
import './Verify.css'

export default function Verify() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async () => {
    if (code.length !== 6) return

    setLoading(true)
    try {
      const deviceCode = await getAuthCode()
      const checkCode = code || deviceCode

      const res = await AuthorizeUser({ code: checkCode })

      if (res?.success) {
        navigate('/main')
      } else {
        alert(res?.message || 'Verification failed')
        await removeAuthCode()
        navigate('/login')
      }
    } catch (e) {
      alert(String(e))
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
  }

  return (
    <div className="verify-page">
      {/* Main Content */}
      <main className="verify-content">
        {/* Relationship Radar Section */}
        <div className="relationship-radar-section">
          <h1 className="relationship-radar-title">Relationship Radar</h1>
          <p className="powered-by">Powered by:</p>
        </div>

        {/* Logo Container */}
        <div className="logo-container">
          <div className="giftology-logo">
            GIFT·OLOGY<sup>®</sup>
          </div>
        </div>

        {/* Verify Card */}
        <div className="verify-card">
          <h2 className="verify-title">Verify</h2>
          <p className="verify-instructions">
            A security code is being texted to your phone. Enter the code below
          </p>
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            className="verify-input"
            placeholder="Enter 6 digit code"
            maxLength="6"
            inputMode="numeric"
          />
          <button
            disabled={code.length !== 6 || loading}
            className={`verify-submit-button ${(code.length !== 6 || loading) ? 'disabled' : ''}`}
            onClick={onSubmit}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </main>

      {/* Background Patterns */}
      <div className="bg-pattern bg-pattern-top-left"></div>
      <div className="bg-pattern bg-pattern-top-right"></div>
      <div className="bg-pattern bg-pattern-bottom-left"></div>
      <div className="bg-pattern bg-pattern-bottom-right"></div>
    </div>
  )
}

