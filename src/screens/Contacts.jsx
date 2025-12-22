import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GetContactList } from '../utils/api'
import './Contacts.css'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await GetContactList({ Language: 'EN' })
        
        if (result.success && result.data) {
          // Map API response to component format
          // API returns: name, serial, status
          // Component expects: id, name, status, phone
          const mappedContacts = result.data.map((contact, index) => ({
            id: String(contact.serial || index),
            name: contact.name || '',
            status: contact.status || '',
            phone: '' // Phone not available in API response
          }))
          setContacts(mappedContacts)
        } else {
          setError(result.message || 'Failed to load contacts')
          setContacts([])
        }
      } catch (err) {
        console.error('Error fetching contacts:', err)
        setError(err.message || 'An error occurred while loading contacts')
        setContacts([])
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  return (
    <div className="contacts-page">
      {/* Left Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          GIFT·OLOGY<sup>®</sup>
        </div>

        {/* Navigation Header */}
        <div className="nav-header">Discover</div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <Link to="/dashboard" className="nav-item">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7L12 4L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11L12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Dashboard</span>
          </Link>
          <Link to="/reports" className="nav-item">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="6" r="2" fill="currentColor"/>
              <line x1="10" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Reports</span>
          </Link>
          <Link to="/dates" className="nav-item">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Dates & DOV</span>
          </Link>
          <Link to="/contacts" className="nav-item active">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 18C7 15.7909 9.23858 14 12 14C14.7614 14 17 15.7909 17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Contacts</span>
          </Link>
          <Link to="/help" className="nav-item">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Help</span>
          </Link>
          <Link to="/feedback" className="nav-item">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L22 6L14 14L10 14L10 10L18 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 20L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Feedback</span>
          </Link>
          <Link to="/setup" className="nav-item">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Setup CRM Integration</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="contacts-content">
        <h1 className="contacts-title">Contacts</h1>
        
        {loading && (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading contacts...</div>
        )}
        
        {error && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
            Error: {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="contacts-table">
            {/* Table Headers */}
            <div className="table-header">
              <div className="header-cell header-name">Name</div>
              <div className="header-cell header-status">Status</div>
              <div className="header-cell header-phone">Phone</div>
            </div>

            {/* Table Rows */}
            <div className="table-body">
              {contacts.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>No contacts found</div>
              ) : (
                contacts.map((item) => (
                  <div key={item.id} className="table-row">
                    <div className="table-cell cell-name">{item.name}</div>
                    <div className="table-cell cell-status">{item.status}</div>
                    <div className="table-cell cell-phone">{item.phone || 'N/A'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

