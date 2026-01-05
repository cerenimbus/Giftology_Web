// RHCM: 12/19/2025
// Very small debug helpers used across the app.
export function log(...args) {
  try { console.log('[debug]', ...args) } catch(e){}
}

export function logError(...args) {
  try { console.error('[debug]', ...args) } catch(e){}
}

export function getDebugFlag() {
  try { const v = localStorage.getItem('DEBUG_FLAG'); return v === 'true' } catch(e){ return false }
}

export default { log, logError, getDebugFlag }
