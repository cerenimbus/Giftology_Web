import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GetDOVDateList } from '../utils/api'
import { log } from '../utils/debug'
import HamburgerMenu from '../components/HamburgerMenu'
import { getMenuItems } from '../utils/menuConfig.jsx'
import { removeAuthCode } from '../utils/storage'

export default function DOV() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ harmless: [], greenlight: [], clarity: [] })
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
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const r = await GetDOVDateList()
        if (mounted && r?.success) setData(r.data || {})
      } catch (e) { log('GetDOVDateList', e) }
      finally { if (mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [])

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

      <div style={{ padding: 20, paddingTop: isDesktop ? 20 : 'calc(env(safe-area-inset-top, 12px) + 72px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isDesktop && (
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#333', cursor: 'pointer' }}>← Back</button>
          )}
          <h1 style={{ color: '#e84b4b', margin: 0 }}>DOV & Dates</h1>
          {isDesktop && <div style={{ width: 24 }} />}
        </div>

      {loading ? (
        <div style={{ marginTop: 12 }}>Loading...</div>
      ) : (
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          <section style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
            <h3>Harmless Starters</h3>
            {data.harmless.length === 0 ? <div>No items</div> : data.harmless.map((i, idx) => <div key={idx} style={{ padding: 6, borderBottom: '1px solid #f0f0f0' }}>{i.name} — {i.date}</div>)}
          </section>
          <section style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
            <h3>Greenlight</h3>
            {data.greenlight.length === 0 ? <div>No items</div> : data.greenlight.map((i, idx) => <div key={idx} style={{ padding: 6, borderBottom: '1px solid #f0f0f0' }}>{i.name} — {i.date}</div>)}
          </section>
          <section style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
            <h3>Clarity</h3>
            {data.clarity.length === 0 ? <div>No items</div> : data.clarity.map((i, idx) => <div key={idx} style={{ padding: 6, borderBottom: '1px solid #f0f0f0' }}>{i.name} — {i.date}</div>)}
          </section>
        </div>
      )}
      </div>
    </div>
  )
}
