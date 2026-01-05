
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GetTaskList, UpdateTask } from '../utils/api'
import { log } from '../utils/debug'
import HamburgerMenu from '../components/HamburgerMenu'
import { getMenuItems } from '../utils/menuConfig.jsx'
import { removeAuthCode } from '../utils/storage'

export default function Tasks() {
  const navigate = useNavigate()
  const location = useLocation()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
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
        const r = await GetTaskList()
        if (mounted && r?.success) setTasks(r.data || [])
      } catch (e) { log('GetTaskList error', e) }
      finally { if (mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [])

  const onToggleDone = async (task) => {
    // Ask for confirmation
    const ok = window.confirm('Are you sure you want to mark this task completed?')
    if (!ok) return
    setUpdating(true)
    try {
      const res = await UpdateTask({ Task: task.serial, Status: 1 })
      if (res?.success) {
        // reload task list
        const r = await GetTaskList()
        if (r?.success) setTasks(r.data || [])
      } else {
        window.alert(res?.message || 'Failed to update task')
      }
    } catch (e) {
      window.alert(String(e))
    } finally { setUpdating(false) }
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

      <div style={{ padding: 20, paddingTop: isDesktop ? 20 : 'calc(env(safe-area-inset-top, 12px) + 72px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {isDesktop && (
            <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#333', cursor: 'pointer' }}>← Back</button>
          )}
          <h1 style={{ color: '#e84b4b', margin: 0 }}>Tasks</h1>
          {isDesktop && <div style={{ width: 24 }} />}
        </div>

      <div style={{ marginTop: 12 }}>
        {loading ? (
          <div>Loading tasks…</div>
        ) : tasks.length === 0 ? (
          <div>No tasks found</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {tasks.map((t) => (
              <div key={String(t.serial)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ color: '#666', fontSize: 13 }}>{t.contact} · {t.date}</div>
                </div>
                <div>
                  <button disabled={updating} onClick={() => onToggleDone(t)} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#e84b4b', color: '#fff', cursor: 'pointer' }}>{updating ? 'Updating...' : 'Mark Done'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
