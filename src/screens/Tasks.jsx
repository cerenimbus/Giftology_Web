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
    function onResize() { setIsDesktop(window.innerWidth >= 900) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleMenuClick = (item) => {
    if (item.key === 'logout') {
      removeAuthCode().then(() => navigate('/login'))
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
    // Re-added the snackbar/confirmation logic
    const ok = window.confirm('Are you sure you want to mark this task completed?')
    if (!ok) return

    setUpdating(true)
    try {
      const res = await UpdateTask({ Task: task.serial, Status: 1 })
      if (res?.success) {
        const r = await GetTaskList()
        if (r?.success) setTasks(r.data || [])
      } else {
        window.alert(res?.message || 'Failed to update task')
      }
    } catch (e) {
      window.alert(String(e))
    } finally { setUpdating(false) }
  }

  const formatTaskDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff', flexDirection: 'column' }}>
      
      {/* 1. TOP NAVIGATION & CENTERED RED TITLE */}
      <div style={{ padding: '20px 20px 0 20px', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'transparent', border: 'none', fontSize: '16px', color: '#666', cursor: 'pointer', zIndex: 10 }}
          >
            ← Back
          </button>
          
          <div style={{ zIndex: 10 }}>
            <HamburgerMenu 
              menuItems={getMenuItems()} 
              onItemClick={handleMenuClick} 
              isDesktop={isDesktop} 
              currentPath={location.pathname} 
            />
          </div>
        </div>

        {/* Large Centered Red Title from image_833230.png */}
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: '800', 
          color: '#e84b4b', 
          margin: '-35px 0 30px 0', 
          letterSpacing: '-1px'
        }}>
          Tasks
        </h1>
      </div>

      {/* 2. DATA CONTAINER */}
      <div style={{ 
        maxWidth: '900px', 
        width: '95%', 
        margin: '0 auto', 
        padding: '20px', 
        backgroundColor: '#fff', 
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
      }}>
        
        {/* Black Title at Upper Left of Data list */}
        <div style={{ 
          textAlign: 'left', 
          fontWeight: '700', 
          fontSize: '20px', 
          marginBottom: '15px',
          color: '#000'
        }}>
          Task
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No tasks found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tasks.map((t) => (
              <div 
                key={String(t.serial)} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '45px 1fr 1fr 70px', 
                  alignItems: 'center', 
                  padding: '18px 0', 
                  borderTop: '1px solid #f1f1f1',
                  opacity: updating ? 0.6 : 1 // Visual feedback during update
                }}
              >
                {/* Checkbox for Completion */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input 
                    type="checkbox" 
                    disabled={updating}
                    onChange={() => onToggleDone(t)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#e84b4b' }}
                  />
                </div>

                {/* Contact (Centered) */}
                <div style={{ fontWeight: '500', color: '#333', textAlign: 'center' }}>
                  {t.contact}
                </div>

                {/* Task Name (Centered) */}
                <div style={{ color: '#555', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 10px' }}>
                  {t.name}
                </div>

                {/* Date (Right Aligned) */}
                <div style={{ color: '#bbb', textAlign: 'right', fontSize: '14px' }}>
                  {formatTaskDate(t.date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Updating overlay for better UX */}
      {updating && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#333', color: '#fff', padding: '12px 20px', borderRadius: '8px', zIndex: 100, fontSize: '14px' }}>
          Updating task list...
        </div>
      )}
    </div>
  )
}