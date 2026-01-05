
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import HamburgerMenu from '../components/HamburgerMenu'
import { getMenuItems } from '../utils/menuConfig.jsx'
import { removeAuthCode } from '../utils/storage'

export default function Reports() {
  const navigate = useNavigate()
  const location = useLocation()
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa', flexDirection: 'column' }}>
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

      <div style={{ padding: 40, paddingTop: isDesktop ? 40 : 'calc(env(safe-area-inset-top, 12px) + 72px)' }}>
        <h1 style={{ color: '#e84b4b' }}>Reports</h1>
        <p>Placeholder for Reports screen.</p>
        {isDesktop && (
          <button onClick={() => navigate(-1)} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#ef1f16', color: '#fff' }}>Go back</button>
        )}
      </div>
    </div>
  )
}
