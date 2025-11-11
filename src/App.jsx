import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Verify from './screens/Verify'
import ForgotPassword from './screens/ForgotPassword'
import Contacts from './screens/Contacts'
import LoadingScreen from './screens/loading' // ✅ corrected path

function App() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Router>
      {showLoading ? (
        <LoadingScreen />
      ) : (
        <Routes>
          <Route path="/" element={<ForgotPassword />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/help" element={<HelpScreen />} />
        </Routes>
      )}
    </Router>
  )
}

export default App
