import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GetTaskList, UpdateTask } from '../utils/api'
import { log } from '../utils/debug'
import HamburgerMenu from '../components/HamburgerMenu'
import { getMenuItems } from '../utils/menuConfig.jsx'
import { removeAuthCode } from '../utils/storage'

/**
 * INTERNAL COMPONENT: TaskCard
 * Uses the field names defined in the API documentation: Name, Contact, Date, Serial.
 */
function TaskCard({ tasks = [], onTaskToggle, isDesktop }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: isDesktop ? 24 : 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map((t, i) => (
          <div key={t.Serial || i} style={{ display: 'flex', alignItems: 'center', padding: '10px 6px', borderBottom: i < tasks.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
            <input 
              type='checkbox' 
              style={{ marginRight: 12, cursor: 'pointer' }} 
              checked={t.Status === "1"} 
              onChange={() => onTaskToggle(t)}
            />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{t.Name}</div>
                <div style={{ color: '#666', fontSize: 13 }}>{t.Contact}</div>
              </div>
              <div style={{ color: '#666', fontSize: 13 }}>{t.Date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Tasks() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900)

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 900)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const r = await GetTaskList()
        if (mounted && r?.success) {
          // Path from API Doc: Selections -> Task
          const selections = r.parsed?.Selections || r.parsed?.selections;
          const taskData = selections?.Task || selections?.task || [];
          setApiData(Array.isArray(taskData) ? taskData : [taskData])
        }
      } catch (e) { 
        log('GetTaskList error', e) 
      } finally { 
        if (mounted) setLoading(false) 
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const onToggleDone = async (task) => {
    if (String(task.Serial).startsWith('f')) return; // Ignore fallback data
    if (!window.confirm('Mark this task completed?')) return;
    
    setUpdating(true)
    try {
      const res = await UpdateTask({ Task: task.Serial, Status: 1 })
      if (res?.success) {
        const r = await GetTaskList()
        const selections = r.parsed?.Selections || r.parsed?.selections;
        setApiData(Array.isArray(selections?.Task) ? selections.Task : [selections?.Task].filter(Boolean))
      }
    } catch (e) {
      window.alert(String(e))
    } finally { setUpdating(false) }
  }

  const tasks = (apiData && apiData.length > 0) ? apiData : [
    { Name: 'James Task', Contact: 'James', Date: 'Sep 9', Serial: 'f1', Status: "0" },
    { Name: 'Kharl Task', Contact: 'Kharl', Date: 'Sep 14', Serial: 'f2', Status: "0" }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa', flexDirection: 'column' }}>
      {!isDesktop && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(env(safe-area-inset-top, 12px) + 10px) 16px 10px', background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'fixed', left: 0, right: 0, top: 0, zIndex: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontWeight: 700, color: '#e84b4b' }}>GIFT·OLOGY</div>
            <div style={{ color: '#999' }}>ROR</div>
          </div>
          <HamburgerMenu 
            menuItems={getMenuItems()}
            onItemClick={(item) => item.key === 'logout' ? removeAuthCode().then(() => navigate('/login')) : navigate(item.path)}
            isDesktop={isDesktop}
            currentPath={location.pathname}
          />
        </header>
      )}

      <div style={{ padding: 20, paddingTop: isDesktop ? 20 : 'calc(env(safe-area-inset-top, 12px) + 72px)' }}>
        {/* Header Container with Back Button and Centered Title */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, minHeight: 40 }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ position: 'absolute', left: 0, background: 'transparent', border: 'none', color: '#333', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center' }}
          >
            ← Back
          </button>
          
          <h1 style={{ color: '#e84b4b', margin: 0, fontSize: 24, textAlign: 'center' }}>Tasks</h1>
        </div>

        <div style={{ marginTop: 12 }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#999' }}>Loading tasks…</div>
          ) : (
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <TaskCard 
                tasks={tasks}
                onTaskToggle={onToggleDone}
                isDesktop={isDesktop}
              />
              {updating && (
                <div style={{ marginTop: 10, textAlign: 'center', color: '#e84b4b', fontSize: 13 }}>
                  Updating...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}