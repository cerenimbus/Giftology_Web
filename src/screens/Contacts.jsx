import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { GetContactList } from '../utils/api'
import HamburgerMenu from '../components/HamburgerMenu'
import Sidebar from '../components/Sidebar'
import { getMenuItems } from '../utils/menuConfig.jsx'
import { removeAuthCode } from '../utils/storage'
import { useNavigate } from 'react-router-dom'
import './Contacts.css'

export default function Contacts() {
  const navigate = useNavigate()
  const location = useLocation()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900)

  useEffect(() => {
    function onResize() {
      setIsDesktop(window.innerWidth >= 900)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = async () => {
    await removeAuthCode()
    navigate('/login')
  }

  const handleMenuClick = (item) => {
    if (item.key === 'logout') {
      handleLogout()
    } else {
      navigate(item.path)
    }
  }

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
      {/* Mobile/header (fixed) */}
      {!isDesktop && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(env(safe-area-inset-top, 12px) + 10px) 16px 10px', background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'fixed', left: 0, right: 0, top: 0, zIndex: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontWeight: 700, color: '#e84b4b' }}>GIFT·OLOGY</div>
            <div style={{ color: '#999' }}>ROR</div>
          </div>
          <div>
            <HamburgerMenu 
              menuItems={getMenuItems()}
              onItemClick={handleMenuClick}
              isDesktop={isDesktop}
              currentPath={location.pathname}
            />
          </div>
        </header>
      )}

      {/* Left Sidebar */}
      {isDesktop && (
        <Sidebar 
          onItemClick={handleMenuClick}
          currentPath={location.pathname}
        />
      )}

      {/* Main Content */}
      <main className="contacts-content" style={{ paddingTop: !isDesktop ? 'calc(env(safe-area-inset-top, 12px) + 72px)' : undefined }}>
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

