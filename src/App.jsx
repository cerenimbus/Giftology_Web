import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Verify from './screens/Verify'
import ForgotPassword from './screens/ForgotPassword'
import Contacts from './screens/Contacts'
import LoadingScreen from './screens/loading' 
import HelpScreen from './screens/helpscreen'
import Login from './screens/login'
import Feedback from './screens/Feedback'

function App() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Router basename="/dev">
      {showLoading ? (
        <LoadingScreen />
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/help" element={<HelpScreen />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      )}
    </Router>
  )
}

export default App