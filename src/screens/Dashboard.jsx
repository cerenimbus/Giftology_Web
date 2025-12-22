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
            console.log('[Dashboard] DOV Graph Data Points:', r.data.dovGraph?.length || 0, r.data.dovGraph)
            console.log('[Dashboard] Revenue Graph Data Points:', r.data.revenueGraph?.length || 0, r.data.revenueGraph)
            console.log('[Dashboard] DOV List:', r.data.dovList?.length || 0, r.data.dovList)
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
    // Graph data
    dovGraph: data.dovGraph || [],
    revenueGraph: data.revenueGraph || [],
    dovList: data.dovList || [],
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
    // Graph data (empty fallback)
    dovGraph: [],
    revenueGraph: [],
    dovList: [],
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
            <div style={{ color: '#999' }}>ROR</div>
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

            <Card title='Current Run away Relationships' span={cols === 1 ? 1 : 1} isDesktop={isDesktop}>
              {d.currentRunawayRelationships.slice(0, 4).map((x, i) => <Row key={i} left={x.name} right={x.phone} rightColor='#999' />)}
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

            <Card title='Dates & DOV' span={cols === 1 ? 1 : 2} isDesktop={isDesktop}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1 }}>
                  <Pill label='Harmless Starters' value={formatNumber(d.datesDov?.harmlessStarters || 0)} />
                  <Pill label='Greenlight Questions' value={formatNumber(d.datesDov?.greenlightQuestions || 0)} />
                  <Pill label='Clarity Convos' value={formatNumber(d.datesDov?.clarityConvos || 0)} />
                </div>
                <div style={{ marginLeft: 16 }}>
                  <select 
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                      fontSize: 14,
                      color: '#333',
                      cursor: 'pointer',
                      minWidth: 120
                    }}
                    defaultValue="all"
                  >
                    <option value="all">Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
              </div>

              {/* DOV Activities List */}
              {(d.dovList && d.dovList.length > 0) || d.datesDov?.handwrittenNotes || d.datesDov?.gifting || d.datesDov?.videos || d.datesDov?.other ? (
                <div style={{ marginBottom: 20 }}>
                  {d.dovList && d.dovList.length > 0 ? (
                    d.dovList.map((dov, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <span style={{ fontSize: 14 }}>{dov.name}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{formatNumber(dov.count)}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      {d.datesDov?.handwrittenNotes > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                          <span style={{ fontSize: 14 }}>Handwritten Notes</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{formatNumber(d.datesDov.handwrittenNotes)}</span>
                        </div>
                      )}
                      {d.datesDov?.gifting > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                          <span style={{ fontSize: 14 }}>Gifting</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{formatNumber(d.datesDov.gifting)}</span>
                        </div>
                      )}
                      {d.datesDov?.videos > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                          <span style={{ fontSize: 14 }}>Videos</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{formatNumber(d.datesDov.videos)}</span>
                        </div>
                      )}
                      {d.datesDov?.other > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                          <span style={{ fontSize: 14 }}>Other</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{formatNumber(d.datesDov.other)}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : null}

              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 16, color: '#333' }}>Total DOV Activities</div>
              <div style={{ backgroundColor: '#fafafa', padding: 20, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1, minWidth: 0, maxWidth: '100%' }}>
                  <LineChart dataPoints={d.dovGraph || []} height={120} color='#e84b4b' />
                  {/* Display graph values below */}
                  {d.dovGraph && d.dovGraph.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
                      {d.dovGraph.map((dp, i) => (
                        <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: 60 }}>
                          <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{dp.label || ''}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{formatNumber(dp.value || 0)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 36, color: '#999', fontWeight: 700, whiteSpace: 'nowrap', marginTop: 16 }}>{formatNumber(d.dovTotal || d.datesDov?.totalDov || 0)}</div>
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
              <div style={{ backgroundColor: '#fafafa', padding: 20, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1, minWidth: 0, maxWidth: '100%' }}>
                  <LineChart dataPoints={d.revenueGraph || []} height={120} color='#e84b4b' />
                  {/* Display graph values below */}
                  {d.revenueGraph && d.revenueGraph.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
                      {d.revenueGraph.map((dp, i) => (
                        <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: 60 }}>
                          <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{dp.label || ''}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{formatCurrency(dp.value || 0)}</div>
                        </div>
                      ))}
                    </div>
                  )}
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
function LineChart({ dataPoints = [], height = 120, color = '#e84b4b', strokeWidth = 2.5 }) {
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  if (!dataPoints || dataPoints.length === 0) {
    // Return empty chart if no data
    return (
      <svg width='100%' height={height} viewBox={`0 0 400 ${height}`} preserveAspectRatio='none' style={{ display: 'block', minHeight: `${height}px` }}>
        <line x1='0' y1={height - 10} x2='400' y2={height - 10} stroke='#e0e0e0' strokeWidth='1' />
      </svg>
    )
  }

  const values = dataPoints.map(dp => Number(dp.value) || 0)
  const maxValue = Math.max(...values, 1) // Avoid division by zero
  // Use actual minimum from data, not 0, to show better variation
  const minValue = Math.min(...values)
  // Add a small buffer (5% of range) to make variations more visible
  const buffer = (maxValue - minValue) * 0.05 || 1
  const adjustedMin = Math.max(0, minValue - buffer)
  const adjustedMax = maxValue + buffer
  const valueRange = adjustedMax - adjustedMin || 1

  const width = 400
  const padding = 20
  const verticalPadding = 10 // Add extra padding top/bottom to make variations more visible
  const chartHeight = height - padding * 2 - verticalPadding * 2
  const chartWidth = width - padding * 2

  // Generate path for the line and points with labels
  const points = dataPoints.map((dp, i) => {
    const normalizedIndex = dataPoints.length === 1 ? 0 : i / (dataPoints.length - 1)
    const x = padding + normalizedIndex * chartWidth
    const normalizedValue = (Number(dp.value) || 0) - adjustedMin
    // Add vertical padding so line doesn't touch edges, making variations more visible
    const y = padding + verticalPadding + chartHeight - (normalizedValue / valueRange) * chartHeight
    return { x, y, label: dp.label || '', value: dp.value || 0, index: i }
  })

  // Build path string
  let pathString = ''
  if (points.length === 1) {
    // Single point - draw a horizontal line
    pathString = `M ${padding} ${points[0].y} L ${width - padding} ${points[0].y}`
  } else if (points.length > 1) {
    pathString = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      // Use smooth curves between points
      const cp1x = prev.x + (curr.x - prev.x) / 3
      const cp1y = prev.y
      const cp2x = curr.x - (curr.x - prev.x) / 3
      const cp2y = curr.y
      pathString += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
    }
  }

  const handleMouseMove = (e) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const svgWidth = rect.width
    const svgHeight = rect.height
    const mouseX = ((e.clientX - rect.left) / svgWidth) * width
    const mouseY = ((e.clientY - rect.top) / svgHeight) * height
    
    // Find the closest point to the mouse
    let closestPoint = null
    let minDistance = Infinity
    
    points.forEach(point => {
      const distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2))
      if (distance < minDistance && distance < 40) { // 40px threshold in viewBox coordinates
        minDistance = distance
        closestPoint = point
      }
    })
    
    if (closestPoint) {
      setHoveredPoint(closestPoint)
      // Position tooltip at the point location (in percentage of container)
      setTooltipPosition({ 
        x: (closestPoint.x / width) * 100, 
        y: (closestPoint.y / height) * 100 
      })
    } else {
      setHoveredPoint(null)
    }
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg 
        width='100%' 
        height={height} 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio='none' 
        style={{ display: 'block', minHeight: `${height}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <path
          d={pathString}
          fill='none'
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        {/* Small dots at each data point */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={1.8}
            fill='#000'
            style={{ pointerEvents: 'none' }}
          />
        ))}
      </svg>
      {/* Tooltip */}
      {hoveredPoint && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltipPosition.x}%`,
            top: `${tooltipPosition.y}%`,
            transform: 'translate(-50%, -120%)',
            backgroundColor: '#333',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: 6,
            fontSize: 12,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ fontWeight: 600 }}>{hoveredPoint.label}</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>Value: {hoveredPoint.value.toLocaleString()}</div>
        </div>
      )}
    </div>
  )
}

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

