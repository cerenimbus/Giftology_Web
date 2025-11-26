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

function getCols(width = 1200) {
  if (width < 640) return 1
  if (width < 900) return 2
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
]

const hamburgerButton = { padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer' }
const hamburgerLine = { height: 3, width: 22, background: '#333', margin: '3px 0', borderRadius: 2 }
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
      setLoading(true)
      try {
        const r = await GetDashboard()
        if (mounted && r?.success) setData(r.data)
      } catch (err) {
        console.warn('GetDashboard failed', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const d = data || {
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
    recentlyIdentifiedPartners: [
      { name: 'Charly Oman', phone: '(225) 555-0118' },
      { name: 'Jhon de rosa', phone: '(225) 555-0118' },
      { name: 'Martin Mayers', phone: '(225) 555-0118' },
    ],
    outcomes: { introductions: 0, referrals: 0, referralPartners: 0 },
    referralRevenue: 0,
  }

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
                <button key={item.key} onClick={() => { setShowMenu(false); navigate(item.path) }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', cursor: 'pointer', border: 'none', background: 'transparent', textAlign: 'left', borderRadius: 8 }} role='menuitem'>
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

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 24 }}>
            <Card title='Best Referral Partners' isDesktop={isDesktop}>
              {d.bestReferralPartners.slice(0, 4).map((x, i) => <Row key={i} left={x.name} right={x.amount} />)}
            </Card>

            <Card title='Current Runaway Relationships' isDesktop={isDesktop}>
              {d.currentRunawayRelationships.slice(0, 4).map((x, i) => <Row key={i} left={x.name} right={x.phone} rightColor='#999' />)}
            </Card>

            <Card title='Task' onClick={() => navigate('/tasks')} style={{ cursor: 'pointer' }} isDesktop={isDesktop}>
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

            <Card title='Dates & DOV' span={2} isDesktop={isDesktop}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div />
                <select style={{ border: '1px solid #e0e0e0', backgroundColor: '#fff', padding: '8px 32px 8px 12px', borderRadius: 6, cursor: 'pointer', color: '#333', fontSize: 14, fontFamily: 'inherit', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', outline: 'none' }}>
                  <option>Months</option>
                  <option>Weeks</option>
                  <option>Days</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 20, marginTop: 12, flexWrap: 'wrap' }}>
                <Pill label='Harmless Starters' value={formatNumber(d.datesDov.harmlessStarters)} />
                <Pill label='Greenlight Questions' value={formatNumber(d.datesDov.greenlightQuestions)} />
                <Pill label='Clarity Convos' value={formatNumber(d.datesDov.clarityConvos)} />
              </div>

              <Row left='Handwritten Notes' right={formatNumber(d.datesDov.handwrittenNotes)} />
              <Row left='Gifting' right={formatNumber(d.datesDov.gifting)} />
              <Row left='Videos' right={formatNumber(d.datesDov.videos)} />
              <Row left='Other' right={formatNumber(d.datesDov.other)} />

              <div style={{ backgroundColor: '#fafafa', marginTop: 10, padding: 20, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Total DOV Activities</div>
                    <svg width='100%' height='120' viewBox='0 0 400 120' preserveAspectRatio='none' style={{ display: 'block', minHeight: '120px' }}>
                      <path d='M 0 105 C 8 102, 15 98, 22 100 C 29 102, 35 99, 42 101 C 55 105, 68 90, 85 70 C 95 55, 105 45, 115 50 C 125 55, 135 65, 145 70 C 155 75, 165 80, 175 88 C 185 96, 192 105, 200 110 C 208 115, 215 112, 225 105 C 235 98, 242 85, 250 70 C 258 55, 262 45, 265 35 C 268 25, 270 20, 275 25 C 280 30, 285 40, 290 50 C 293 56, 296 60, 298 55 C 300 50, 303 40, 308 30 C 313 23, 318 20, 325 22 C 332 24, 340 25, 350 25 C 360 25, 370 25, 380 25 C 390 25, 400 25, 400 25' fill='none' stroke='#e84b4b' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                  </div>
                  <div style={{ fontSize: 36, color: '#999', fontWeight: 700, whiteSpace: 'nowrap', marginTop: 16 }}>{formatNumber(d.datesDov.totalDov)}</div>
                </div>
              </div>
            </Card>

            <Card title='Recently Identified Potential Partners' isDesktop={isDesktop}>
              {d.recentlyIdentifiedPartners.map((x, i) => <Row key={i} left={x.name} right={x.phone} rightColor='#999' />)}
            </Card>

            <Card title='Outcomes' span={3} isDesktop={isDesktop}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Mini title='Introductions' value={formatNumber(d.outcomes.introductions)} />
                <Mini title='Referrals' value={formatNumber(d.outcomes.referrals)} />
                <Mini title='Referral Partners' value={formatNumber(d.outcomes.referralPartners)} />
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

