import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Reports() {
  const navigate = useNavigate()
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: '#e84b4b' }}>Reports</h1>
      <p>Placeholder for Reports screen.</p>
      <button onClick={() => navigate(-1)} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#ef1f16', color: '#fff' }}>Go back</button>
    </div>
  )
}
