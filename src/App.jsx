import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Verify from './screens/Verify'
import ForgotPassword from './screens/ForgotPassword'
import Contacts from './screens/Contacts'
import LoadingScreen from './screens/loading' // ✅ corrected path
import Login from './screens/login'
import Dashboard from './screens/Dashboard'
import HelpScreen from './screens/helpscreen'
import Tasks from './screens/Tasks'
import DOV from './screens/DOV'
import Reports from './screens/Reports'
import Feedback from './screens/Feedback'

function App() {
  const [showLoading, setShowLoading] = useState(true)

  return (
    <Router>
      {showLoading ? (
        <LoadingScreen onFinish={() => setShowLoading(false)} />
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/dov" element={<DOV />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/help" element={<HelpScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  )
}

export default App
