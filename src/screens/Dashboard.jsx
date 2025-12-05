/*
 * Dashboard.jsx — responsive layout, safe-area header for mobile
 * - Mobile: fixed top header with hamburger in the top-right (no left drawer)
 * - Desktop (>=900px): fixed left sidebar + content area
 */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DashboardIcon,
  ReportsIcon,
  CalendarIcon,
  ContactsIcon,
  HelpIcon,
  FeedbackIcon,
} from '../components/Icons'
import { GetDashboard } from '../utils/api'
import { removeAuthCode } from '../utils/storage';

function getCols(width = 1200) {
  // Mobile phones/tablets (<=900px): single column for better readability
  if (width <= 900) return 1
  // Small tablets / narrow desktops: two columns
  if (width < 1200) return 2
  return 3
}

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon size={16} color='#e84b4b' /> },
  { key: 'tasks', label: 'Tasks', path: '/tasks', icon: <DashboardIcon size={16} /> },
  { key: 'dov', label: 'DOV & Dates', path: '/dov', icon: <CalendarIcon size={16} /> },
  { key: 'partners', label: 'Potential Partners', path: '/contacts', icon: <ContactsIcon size={16} /> },
  { key: 'reports', label: 'Reports', path: '/reports', icon: <ReportsIcon size={16} /> },
  { key: 'help', label: 'Help', path: '/help', icon: <HelpIcon size={16} /> },
  { key: 'feedback', label: 'Feedback', path: '/feedback', icon: <FeedbackIcon size={16} /> },
  { key: 'setup', label: 'Setup CRM Integration', path: '/setup', icon: <HelpIcon size={16} /> },
  { key: 'logout', label: ' ← Logout' },
]

const hamburgerButton = { padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer' }
const hamburgerLine = { height: 3, width: 22, background: '#333', margin: '3px 0', borderRadius: 2 }
const sideItem = { padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }
const mobileMenuOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 60 }
const mobileMenuInner = { position: 'absolute', right: 12, top: 56, background: '#fff', minWidth: 220, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', padding: 8, zIndex: 80 }

export default function Dashboard() {
  const navigate = useNavigate()
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900)
  const [cols, setCols] = useState(getCols(window.innerWidth))
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    function onResize() {
      setIsDesktop(window.innerWidth >= 900)
      setCols(getCols(window.innerWidth))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      console.log('[Dashboard] ========================================')
      console.log('[Dashboard] 🚀 Starting Dashboard load...')
      setLoading(true)
      try {
        console.log('[Dashboard] 📞 Calling GetDashboard API...')
        const r = await GetDashboard()
        console.log('[Dashboard] 📥 GetDashboard returned:', {
          success: r?.success,
          hasData: !!r?.data,
          errorNumber: r?.errorNumber,
          message: r?.message,
        })
        
        if (mounted) {
          if (r?.success && r?.data) {
            console.log('[Dashboard] ✅ API Response Success!')
            console.log('[Dashboard] Full Response Data:', r.data)
            console.log('[Dashboard] Dates & DOV:', r.data.datesDov)
            console.log('[Dashboard] Outcomes:', r.data.outcomes)
            console.log('[Dashboard] Referral Revenue:', r.data.referralRevenue)
            console.log('[Dashboard] Best Partners Count:', r.data.bestReferralPartners?.length || 0)
            console.log('[Dashboard] Current Relationships Count:', r.data.currentRunawayRelationships?.length || 0)
            console.log('[Dashboard] Recent Partners Count:', r.data.recentlyIdentifiedPartners?.length || 0)
            console.log('[Dashboard] Tasks Count:', r.data.tasks?.length || 0)
            setData(r.data)
            console.log('[Dashboard] ✅ Data set successfully!')
          } else {
            console.warn('[Dashboard] ❌ GetDashboard failed!')
            console.warn('[Dashboard] Error Details:', {
              message: r?.message || 'Unknown error',
              errorNumber: r?.errorNumber,
              success: r?.success,
              hasData: !!r?.data,
              fullResponse: r,
            })
          }
        } else {
          console.log('[Dashboard] ⚠️ Component unmounted, skipping data update')
        }
      } catch (err) {
        console.error('[Dashboard] ❌ GetDashboard exception!')
        console.error('[Dashboard] Error:', err)
        console.error('[Dashboard] Error stack:', err?.stack)
      } finally {
        if (mounted) {
          setLoading(false)
          console.log('[Dashboard] ✅ Loading complete')
        }
        console.log('[Dashboard] ========================================')
      }
    }
    load()
    return () => { 
      console.log('[Dashboard] 🧹 Cleanup: Component unmounting')
      mounted = false 
    }
  }, [])

  // Use API data if available, otherwise use fallback
  // Match mobile Dashboard structure exactly
  const d = data ? {
    // Web-specific names (for backward compatibility)
    bestReferralPartners: data.bestReferralPartners || [],
    currentRunawayRelationships: data.currentRunawayRelationships || [],
    tasks: data.tasks || [],
    recentlyIdentifiedPartners: data.recentlyIdentifiedPartners || [],
    datesDov: data.datesDov || {
      harmlessStarters: 0,
      greenlightQuestions: 0,
      clarityConvos: 0,
      handwrittenNotes: 0,
      gifting: 0,
      videos: 0,
      other: 0,
      totalDov: 0,
    },
    // Mobile-compatible structure (matching mobile Dashboard)
    dovTotal: data.dovTotal || data.datesDov?.totalDov || 0,
    outcomes: {
      introductions: data.outcomes?.introductions || 0,
      referrals: data.outcomes?.referrals || 0,
      referralPartners: data.outcomes?.referralPartners || data.outcomes?.partners || 0,
      partners: data.outcomes?.partners || data.outcomes?.referralPartners || 0, // Mobile uses 'partners'
    },
    referralRevenue: data.referralRevenue || 0,
  } : {
    bestReferralPartners: [
      { name: 'Jack Miller', amount: '$36,000' },
      { name: 'Jhon de rosa', amount: '$22,425' },
      { name: 'Martin Mayers', amount: '$17,089' },
      { name: 'Kent Mayers', amount: '$11,298' },
    ],
    currentRunawayRelationships: [
      { name: 'Lucas Mendoza', phone: '(225) 555-0118' },
      { name: 'Ava Torres', phone: '(225) 555-0118' },
      { name: 'Ethan Brooks', phone: '(225) 555-0118' },
      { name: 'Sophia Ramirez', phone: '(225) 555-0118' },
    ],
    tasks: [
      { name: 'James', type: 'Introduction', date: 'Sep 9' },
      { name: 'Kharl', type: 'Clarity Conversation', date: 'Sep 14' },
      { name: 'Jimmy', type: 'Gift', date: 'Sep 24' },
      { name: 'Loren', type: 'DOV', date: 'Sep 26' },
    ],
    datesDov: {
      harmlessStarters: 0,
      greenlightQuestions: 0,
      clarityConvos: 0,
      handwrittenNotes: 0,
      gifting: 0,
      videos: 0,
      other: 0,
      totalDov: 0,
    },
    dovTotal: 0, // Mobile-compatible
    recentlyIdentifiedPartners: [
      { name: 'Charly Oman', phone: '(225) 555-0118' },
      { name: 'Jhon de rosa', phone: '(225) 555-0118' },
      { name: 'Martin Mayers', phone: '(225) 555-0118' },
    ],
    outcomes: { introductions: 0, referrals: 0, referralPartners: 0, partners: 0 }, // Mobile uses 'partners'
    referralRevenue: 0,
  }
/**
 * Logs out the user by removing the auth code from the cookie and localStorage
 * and then redirects to the login page
 */
  const handleLogout = async () => {
    await removeAuthCode();   // clears cookie + localStorage
    navigate('/login');   // or '/login' depending on your routing
  };

  const toNumber = (v) => {
    if (v === undefined || v === null) return 0
    const n = Number(String(v).replace(/[^0-9.-]+/g, ''))
    return Number.isFinite(n) ? n : 0
  }
  const formatNumber = (v) => toNumber(v).toLocaleString()
  const formatCurrency = (v) => {
    const n = toNumber(v)
    return n === 0 ? '$0' : `$${n.toLocaleString()}`
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>

      {/* Sidebar visible on desktop */}
      {isDesktop && (
        <aside style={{ width: 280, backgroundColor: '#fff', borderRight: '1px solid #eee', height: '100vh', position: 'fixed' }}>
          <div style={{ backgroundColor: '#e84b4b', padding: 8, margin: 16, borderRadius: 3 }}>
            <div style={{ border: '1.6px solid #fff', borderRadius: 2, padding: 12, textAlign: 'center', fontWeight: 700, color: '#fff', fontSize: 22 }}>
              GIFT·OLOGY<sub style={{ fontSize: 8, verticalAlign: '0.01em' }}>®</sub>
            </div>
          </div>

          <div style={{ color: '#999', padding: '0 16px 8px', fontSize: 13 }}>Discover</div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', backgroundColor: '#fdf2f2', borderLeft: '4px solid #e84b4b', fontWeight: 600, color: '#e84b4b', gap: 8 }}>
            <DashboardIcon size={16} color='#e84b4b' />
            <span style={{ fontSize: 14 }}>Dashboard</span>
          </div>

          <div style={sideItem} onClick={() => navigate('/reports')}>
            <ReportsIcon size={16} color='#333' />
            <span style={{ fontSize: 14 }}>Reports</span>
          </div>
          <div style={sideItem} onClick={() => navigate('/dov')}>
            <CalendarIcon size={16} color='#333' />
            <span style={{ fontSize: 14 }}>Dates & DOV</span>
          </div>
          <div style={sideItem} onClick={() => navigate('/contacts')}>
            <ContactsIcon size={16} color='#333' />
            <span style={{ fontSize: 14 }}>Contacts</span>
          </div>
          <div style={sideItem} onClick={() => navigate('/help')}>
            <HelpIcon size={16} color='#333' />
            <span style={{ fontSize: 14 }}>Help</span>
          </div>
          <div style={sideItem} onClick={() => navigate('/feedback')}>
            <FeedbackIcon size={16} color='#333' />
            <span style={{ fontSize: 14 }}>Feedback</span>
          </div>
          <div style={sideItem} onClick={() => navigate('/setup')}>
            <HelpIcon size={16} color='#333' />
            <span style={{ fontSize: 14 }}>Setup CRM Integration</span>
          </div>
          {/* <div style={sideItem} onClick={handleLogout}>
            <span style={{ fontSize: 14 }}>Logout</span>
          </div> */}
          <div 
            style={{
              marginTop: 20,
              padding: '0 16px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button 
              onClick={handleLogout}
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
              
                <>
                  <span style={{ fontSize: 16 }}>←</span>
                  Logout
                </>
              
            </button>
          </div>
        </aside>
      )}

      {/* Mobile/header (fixed) */}
      {!isDesktop && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(env(safe-area-inset-top, 12px) + 10px) 16px 10px', background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'fixed', left: 0, right: 0, top: 0, zIndex: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontWeight: 700, color: '#e84b4b' }}>GIFT·OLOGY</div>
            <div style={{ color: '#999' }}>Relationship Radar</div>
          </div>

          <div>
            <button aria-label='Open navigation' onClick={() => setShowMenu(s => !s)} style={hamburgerButton}>
              <div style={hamburgerLine} />
              <div style={hamburgerLine} />
              <div style={hamburgerLine} />
            </button>
          </div>
        </header>
      )}

      {/* Mobile popover menu under header */}
      {!isDesktop && showMenu && (
        <div style={mobileMenuOverlay} onClick={() => setShowMenu(false)}>
          <div style={mobileMenuInner} onClick={(e) => e.stopPropagation()} role='menu' aria-label='Mobile navigation'>
            <div style={{ padding: 10, borderBottom: '1px solid #f0f0f0', marginBottom: 6 }}>
              <div style={{ backgroundColor: '#e84b4b', padding: 8, borderRadius: 4, marginBottom: 8 }}>
                <div style={{ border: '1.6px solid #fff', borderRadius: 2, padding: 8, textAlign: 'center', fontWeight: 700, color: '#fff', fontSize: 16 }}>GIFT·OLOGY<sub style={{ fontSize: 8, verticalAlign: '0.01em' }}>®</sub></div>
              </div>
              <div style={{ color: '#999', fontSize: 13 }}>Discover</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {menuItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => {
                    setShowMenu(false);

                    if (item.key === 'logout') {
                      handleLogout();       // ← runs your logout logic
                    } else {
                      navigate(item.path);  // ← normal navigation
                    }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', cursor: 'pointer', border: 'none', background: 'transparent', textAlign: 'left', borderRadius: 8
                  }}
                  role="menuitem"
                >
                  {item.icon}
                  <span style={{ fontSize: 14 }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content area (offset for sidebar on desktop, pushed below header on mobile) */}
      <main style={{ flex: 1, paddingTop: isDesktop ? 40 : 'calc(env(safe-area-inset-top, 12px) + 72px)', paddingLeft: isDesktop ? 40 : 16, paddingRight: isDesktop ? 40 : 16, paddingBottom: 40, marginLeft: isDesktop ? 280 : 0, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
          {loading && (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 64, display: 'flex', justifyContent: 'center', zIndex: 40 }}>
              <div style={{ background: '#fff', padding: '6px 12px', borderRadius: 999, boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>Loading dashboard…</div>
            </div>
          )}

          <h1 style={{ fontSize: 36, color: '#e84b4b', fontWeight: 700 }}>Dashboard</h1>

          <div className='dashboard-grid' style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 24 }}>
            <Card title='Best Referral Partners' span={cols === 1 ? 1 : 1} isDesktop={isDesktop}>
              {d.bestReferralPartners.slice(0, 4).map((x, i) => <Row key={i} left={x.name} right={x.amount} />)}
            </Card>

            <Card title='Current Runaway Relationships' span={cols === 1 ? 1 : 1} isDesktop={isDesktop}>
              {d.currentRunawayRelationships.slice(0, 4).map((x, i) => <Row key={i} left={x.name} right={x.phone} rightColor='#999' />)}
            </Card>

            <Card title='Dates & DOV' span={cols === 1 ? 1 : 2} isDesktop={isDesktop}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <Pill label='Total DOV' value={formatNumber(d.dovTotal || d.datesDov?.totalDov || 0)} />
                <Pill label='Introductions' value={formatNumber(d.outcomes.introductions)} />
                <Pill label='Referrals' value={formatNumber(d.outcomes.referrals)} />
              </div>

              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16, color: '#333' }}>Total DOV Activities</div>
              <div style={{ backgroundColor: '#fafafa', padding: 20, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <svg width='100%' height='120' viewBox='0 0 400 120' preserveAspectRatio='none' style={{ display: 'block', minHeight: '120px' }}>
                    <path d='M 0 105 C 8 102, 15 98, 22 100 C 29 102, 35 99, 42 101 C 55 105, 68 90, 85 70 C 95 55, 105 45, 115 50 C 125 55, 135 65, 145 70 C 155 75, 165 80, 175 88 C 185 96, 192 105, 200 110 C 208 115, 215 112, 225 105 C 235 98, 242 85, 250 70 C 258 55, 262 45, 265 35 C 268 25, 270 20, 275 25 C 280 30, 285 40, 290 50 C 293 56, 296 60, 298 55 C 300 50, 303 40, 308 30 C 313 23, 318 20, 325 22 C 332 24, 340 25, 350 25 C 360 25, 370 25, 380 25 C 390 25, 400 25, 400 25' fill='none' stroke='#e84b4b' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </div>
                <div style={{ fontSize: 36, color: '#999', fontWeight: 700, whiteSpace: 'nowrap', marginTop: 16 }}>{formatNumber(d.dovTotal || d.datesDov?.totalDov || 0)}</div>
              </div>
            </Card>

            <Card title='Task' onClick={() => navigate('/tasks')} style={{ cursor: 'pointer' }} span={cols === 1 ? 1 : 1} isDesktop={isDesktop}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {d.tasks.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 6px', borderRadius: 6, backgroundColor: '#fff0f0' }}>
                    <input type='checkbox' style={{ marginRight: 12 }} disabled />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{t.name || t.taskName}</div>
                      <div style={{ color: '#666', fontSize: 13 }}>{t.taskName || t.type || ''} · {t.date}</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 12, textAlign: 'center', color: '#e84b4b', fontWeight: 600 }}>Open Tasks</div>
              </div>
            </Card>

            <Card title='Recently Identified Potential Partners' span={cols === 1 ? 1 : 1} isDesktop={isDesktop}>
              {d.recentlyIdentifiedPartners.map((x, i) => <Row key={i} left={x.name} right={x.phone} rightColor='#999' />)}
            </Card>

            <Card title='Outcomes' span={cols === 1 ? 1 : 3} isDesktop={isDesktop}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Mini title='Introductions' value={formatNumber(d.outcomes.introductions)} />
                <Mini title='Referrals' value={formatNumber(d.outcomes.referrals)} />
                <Mini title='Referral Partners' value={formatNumber(d.outcomes.partners || d.outcomes.referralPartners)} />
              </div>

              <h3 style={{ marginTop: 30, marginBottom: 16 }}>Referral Revenue Generated</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <svg width='100%' height='120' viewBox='0 0 400 120' preserveAspectRatio='none' style={{ display: 'block', minHeight: '120px' }}>
                    <path d='M 0 105 C 8 102, 15 98, 22 100 C 29 102, 35 99, 42 101 C 55 105, 68 90, 85 70 C 95 55, 105 45, 115 50 C 125 55, 135 65, 145 70 C 155 75, 165 80, 175 88 C 185 96, 192 105, 200 110 C 208 115, 215 112, 225 105 C 235 98, 242 85, 250 70 C 258 55, 262 45, 265 35 C 268 25, 270 20, 275 25 C 280 30, 285 40, 290 50 C 293 56, 296 60, 298 55 C 300 50, 303 40, 308 30 C 313 23, 318 20, 325 22 C 332 24, 340 25, 350 25 C 360 25, 370 25, 380 25 C 390 25, 400 25, 400 25' fill='none' stroke='#e84b4b' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </div>
                <div style={{ fontSize: 36, color: '#999', fontWeight: 700, whiteSpace: 'nowrap', marginTop: 16 }}>{formatCurrency(d.referralRevenue)}</div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ---------- Reusable helpers ---------- */
function Card({ title, children, span = 1, style = {}, onClick, isDesktop = true }) {
  const basePadding = isDesktop ? 24 : 12
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: basePadding, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', gridColumn: `span ${span}`, cursor: onClick ? 'pointer' : 'default', ...style }} onClick={onClick}>
      <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>{title}</h3>
      {children}
    </div>
  )
}

function Row({ left, right, rightColor = '#333' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span>{left}</span>
      <span style={{ color: rightColor, fontWeight: 600 }}>{right}</span>
    </div>
  )
}

function Pill({ label, value }) {
  return (
    <div style={{ flex: 1, backgroundColor: '#fdeaea', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
      <span style={{ fontSize: 24, fontWeight: 700, color: '#333' }}>{value.toLocaleString()}</span>
    </div>
  )
}

function Mini({ title, value }) {
  return (
    <div style={{ flex: 1, backgroundColor: '#fafafa', borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column' }}>
      <span>{title}</span>
      <span style={{ fontSize: 24, fontWeight: 700, color: '#333' }}>{value.toLocaleString()}</span>
    </div>
  )
}

