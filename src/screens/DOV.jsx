import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GetDOVDateList } from '../utils/api'
import { log } from '../utils/debug'

export default function DOV() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ harmless: [], greenlight: [], clarity: [] })

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
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#333', cursor: 'pointer' }}>← Back</button>
        <h1 style={{ color: '#e84b4b', margin: 0 }}>DOV & Dates</h1>
        <div style={{ width: 24 }} />
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
  )
}
