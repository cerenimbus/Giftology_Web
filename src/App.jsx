import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Verify from './screens/Verify'
import ForgotPassword from './screens/ForgotPassword'
import Contacts from './screens/Contacts'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </Router>
  )
}

export default App
