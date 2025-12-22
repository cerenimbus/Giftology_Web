import React, { useState } from 'react'

const hamburgerButton = { padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer' }
const hamburgerLine = { height: 3, width: 22, background: '#333', margin: '3px 0', borderRadius: 2 }
const mobileMenuOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 60 }
const mobileMenuInner = { position: 'absolute', right: 12, top: 56, background: '#fff', minWidth: 220, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', padding: 8, zIndex: 80 }

/**
 * HamburgerMenu - A reusable mobile navigation menu component
 * @param {Object} props
 * @param {Array} props.menuItems - Array of menu items with { key, label, path, icon }
 * @param {Function} props.onItemClick - Callback function when a menu item is clicked (receives item object)
 * @param {boolean} props.isDesktop - Whether the screen is desktop size (menu only shows on mobile)
 * @param {string} props.currentPath - Optional current path for highlighting active item
 */
export default function HamburgerMenu({ menuItems = [], onItemClick, isDesktop = false, currentPath }) {
  const [showMenu, setShowMenu] = useState(false)

  // Don't render on desktop
  if (isDesktop) {
    return null
  }

  const handleItemClick = (item) => {
    setShowMenu(false)
    if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <>
      {/* Hamburger Button */}
      <button 
        aria-label='Open navigation' 
        onClick={() => setShowMenu(s => !s)} 
        style={hamburgerButton}
      >
        <div style={hamburgerLine} />
        <div style={hamburgerLine} />
        <div style={hamburgerLine} />
      </button>

      {/* Mobile Popover Menu */}
      {showMenu && (
        <div style={mobileMenuOverlay} onClick={() => setShowMenu(false)}>
          <div 
            style={mobileMenuInner} 
            onClick={(e) => e.stopPropagation()} 
            role='menu' 
            aria-label='Mobile navigation'
          >
            <div style={{ padding: 10, borderBottom: '1px solid #f0f0f0', marginBottom: 6 }}>
              <div style={{ marginBottom: 8, textAlign: 'left' }}>
                <div style={{ color: '#333', fontSize: 12, marginBottom: 4 }}>ROR:</div>
                <div style={{ color: '#666', fontSize: 11, marginBottom: 8 }}>Powered by</div>
              </div>
              <div style={{ backgroundColor: '#e84b4b', padding: 8, borderRadius: 4, marginBottom: 8 }}>
                <div style={{ border: '1.6px solid #fff', borderRadius: 2, padding: 8, textAlign: 'center', fontWeight: 700, color: '#fff', fontSize: 16 }}>
                  GIFT·OLOGY<sub style={{ fontSize: 8, verticalAlign: '0.01em' }}>®</sub>
                </div>
              </div>
              <div style={{ color: '#999', fontSize: 13 }}>Discover</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {menuItems.map(item => {
                if (item.key === 'logout') {
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleItemClick(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        border: 'none',
                        background: '#e84b4b',
                        color: '#fff',
                        textAlign: 'center',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        marginTop: 8,
                      }}
                      role="menuitem"
                    >
                      <span style={{ fontSize: 16 }}>←</span>
                      <span>Logout</span>
                    </button>
                  )
                }

                return (
                  <button
                    key={item.key}
                    onClick={() => handleItemClick(item)}
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      padding: '8px 10px', 
                      cursor: 'pointer', 
                      border: 'none', 
                      background: currentPath === item.path ? '#fdf2f2' : 'transparent', 
                      textAlign: 'left', 
                      borderRadius: 8,
                      color: currentPath === item.path ? '#e84b4b' : '#333',
                      fontWeight: currentPath === item.path ? 600 : 400
                    }}
                    role="menuitem"
                  >
                    {item.icon}
                    <span style={{ fontSize: 14 }}>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

