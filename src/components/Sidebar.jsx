// RHCM: 12/19/2025
import React from 'react'
import { getMenuItems } from '../utils/menuConfig.jsx'

/**
 * Sidebar - A reusable desktop sidebar navigation component
 * @param {Object} props
 * @param {Function} props.onItemClick - Callback function when a menu item is clicked (receives item object)
 * @param {string} props.currentPath - Current path for highlighting active item
 */
export default function Sidebar({ onItemClick, currentPath }) {
  const menuItems = getMenuItems()

  return (
    <aside style={{ width: 280, backgroundColor: '#fff', borderRight: '1px solid #eee', height: '100vh', position: 'fixed' }}>
      <div style={{ padding: 16 }}>
        {/* ROR and Powered by text */}
        <div style={{ marginBottom: 12, textAlign: 'left' }}>
          <div style={{ color: '#333', fontSize: 12, marginBottom: 4 }}>ROR:</div>
          <div style={{ color: '#666', fontSize: 11, marginBottom: 12 }}>Powered by</div>
        </div>

        {/* GIFT·OLOGY Logo */}
        <div style={{ backgroundColor: '#e84b4b', padding: 8, borderRadius: 3, marginBottom: 16 }}>
          <div style={{ border: '1.6px solid #fff', borderRadius: 2, padding: 12, textAlign: 'center', fontWeight: 700, color: '#fff', fontSize: 22 }}>
            GIFT·OLOGY<sub style={{ fontSize: 8, verticalAlign: '0.01em' }}>®</sub>
          </div>
        </div>

        {/* Discover section header */}
        <div style={{ color: '#999', padding: '0 0 8px 0', fontSize: 13 }}>Discover</div>

        {/* Menu Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {menuItems.map(item => {
            if (item.key === 'logout') {
              return (
                <div key={item.key} style={{ marginTop: 20, padding: '0 0', display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={() => onItemClick && onItemClick(item)}
                    style={{
                      width: '100%',
                      backgroundColor: '#e84b4b',
                      color: '#fff',
                      padding: '12px 16px',
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'transform 0.15s ease, background-color 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>←</span>
                    Logout
                  </button>
                </div>
              )
            }

            const isActive = currentPath === item.path
            return (
              <div
                key={item.key}
                onClick={() => onItemClick && onItemClick(item)}
                style={{
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#fdf2f2' : 'transparent',
                  borderLeft: isActive ? '4px solid #e84b4b' : '4px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#e84b4b' : '#333',
                }}
              >
                {item.icon}
                <span style={{ fontSize: 14 }}>{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

