
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

  const textOf = (v) => {
    if (v === undefined || v === null) return ''
    if (typeof v === 'string' || typeof v === 'number') return String(v)
    if (typeof v === 'object') {
      if ('#text' in v) return String(v['#text'])
      for (const k of Object.keys(v)) {
        const val = v[k]
        if (typeof val === 'string' || typeof val === 'number') return String(val)
        if (val && typeof val === 'object' && ('#text' in val)) return String(val['#text'])
      }
    }
    return ''
  }

  const toArray = (maybe) => {
    if (!maybe) return []
    return Array.isArray(maybe) ? maybe : [maybe]
  }

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

        // 1) Preferred: use api.js mapped list if present
        const listFromData = (result?.success && Array.isArray(result.data)) ? result.data : []

        // 2) Fallback: parse directly from raw/parsed response (still only GetContactList)
        // Some responses may nest contacts under different keys/casing.
        const parsed = result?.parsed || result?.raw || {}
        const selections = parsed?.Selections || parsed?.selections || parsed?.ResultInfo?.Selections || {}
        const contactNodes =
          selections?.Contact ||
          selections?.contact ||
          parsed?.Contact ||
          parsed?.contact ||
          []

        const listFromParsed = toArray(contactNodes).map((c) => ({
          name: textOf(c?.Name || c?.name),
          serial: Number(textOf(c?.Serial || c?.serial)) || 0,
          status: textOf(c?.Status || c?.status),
        }))

        const bestList = (listFromData.length > 0) ? listFromData : listFromParsed

        // Always try to display any contacts we can parse, even if API reports an error.
        if (bestList.length > 0) {
          const mappedContacts = bestList.map((contact, index) => ({
            id: String(contact.serial || index),
            name: contact.name || '',
            status: contact.status || '',
            phone: '' // Phone not provided by GetContactList
          }))
          setContacts(mappedContacts)

          // If API reported an error, still surface the message but keep showing data.
          if (result && !result.success) {
            setError(result.message || 'There was an issue loading contacts, showing latest available list.')
          }
        } else {
          // No contacts found anywhere
          if (result && !result.success) {
            setError(result.message || 'Failed to load contacts')
          }
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
          <h1 className="contacts-title" style={{ marginBottom: 0 }}>Contacts</h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid #e0e0e0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontSize: 14,
              color: '#555',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            Back
          </button>
        </div>
        
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

