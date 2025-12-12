/*
 * RRService API client (browser-compatible)
 * Implements signed requests and parsing of XML responses for the Giftology
 * RRService PHP endpoints. Designed to be the single file that handles
 * all API calls for the app.
 */
import CryptoJS from 'crypto-js'
import { XMLParser } from 'fast-xml-parser'
import { getAuthCode, getDeviceId } from './storage'
import { log, getDebugFlag, logError } from './debug'
import { handleApiTimeout } from './timeoutHandler'

// Default base URL for the RRService API. Use VITE_API_BASE to override.
// In development we want to hit the Vite proxy to avoid browser CORS errors.
// Behavior:
//  - If VITE_API_BASE is set, use that value (explicit override).
//  - Else if in DEV mode use the local proxy path `/RRService` (no CORS).
//  - Otherwise default to the canonical remote service URL.
const DEFAULT_REMOTE = 'https://radar.Giftologygroup.com/RRService'
const BASE = import.meta.env.VITE_API_BASE
  ? String(import.meta.env.VITE_API_BASE)
  : (import.meta.env.DEV ? '/RRService' : DEFAULT_REMOTE)

// Hardcoded mobile version for all API calls
const MOBILE_VERSION = '1'

// compute SHA1 hex digest
function sha1(str) {
  return CryptoJS.SHA1(str || '').toString(CryptoJS.enc.Hex)
}

// build querystring in the parameter order (per spec)
function mask(s, keep = 4) {
  if (!s) return ''
  if (s.length <= keep + 2) return '***'
  return `${s.slice(0, keep)}...${s.slice(-keep)}`
}

function buildUrl(functionName, params = {}, paramOrder = null) {
  // Use unencoded param concatenation to match the mobile client's behavior.
  const parts = []
  const keys = paramOrder || Object.keys(params || {})

  keys.forEach((k) => {
    const v = params[k]
    if (v !== undefined && v !== null) {
      parts.push(`${k}=${v}`)
    }
  })

  const qs = parts.length ? `?${parts.join('&')}` : ''
  return `${BASE}/${functionName}.php${qs}`
}

// fetch wrapper with timeout
export async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  if (!timeout || timeout <= 0) return fetch(url, options)

  const hasAbort = typeof globalThis.AbortController !== 'undefined'
  let controller
  let timer

  if (hasAbort) {
    controller = new AbortController()
    if (!options.signal) options.signal = controller.signal
    timer = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url, options)
      clearTimeout(timer)
      return res
    } catch (e) {
      clearTimeout(timer)
      throw e
    }
  }

  const fetchPromise = fetch(url, options)
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timeout')), timeout)
  })

  try {
    const res = await Promise.race([fetchPromise, timeoutPromise])
    clearTimeout(timer)
    return res
  } catch (e) {
    clearTimeout(timer)
    throw e
  }
}

// central caller used by exported API functions
// returns { success, errorNumber, message, raw, parsed, requestUrl }
export async function callService(functionName, extraParams = {}, paramOrder = null, options = {}) {
  console.log(`[callService] Starting API call: ${functionName}`)
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
  const deviceId = (await getDeviceId()) || ''
  const ac = (await getAuthCode()) || ''

  console.log(`[callService] DeviceID: ${deviceId ? 'present' : 'missing'}, AC: ${ac ? 'present' : 'missing'}`)
  console.log(`[callService] extraParams:`, extraParams)

  const d = new Date()
  const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}-${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

  // Historically the mobile client used sha1(deviceId + dateStr)
  // Server spec describes including the AC but some endpoints/tests expect the short form.
  // Use Date and Key from extraParams if provided (e.g., for AuthorizeDeviceID), otherwise calculate them
  const finalDate = extraParams.Date || dateStr
  const finalKey = extraParams.Key || sha1(deviceId + finalDate + ac)

  // Build base params - skip AC for AuthorizeDeviceID (not in spec)
  // If encodeDeviceID option is set and DeviceID is not in extraParams, encode it
  let baseDeviceID = deviceId
  if (options.encodeDeviceID && !extraParams.DeviceID) {
    baseDeviceID = encodeURIComponent(deviceId)
  }
  
  const baseParams = { DeviceID: baseDeviceID, Date: finalDate, Key: finalKey }
  if (!options.skipAC && ac) {
    baseParams.AC = ac
  }

  // Start with base params, then merge extraParams (which may override DeviceID, Date, Key, and add UserName, Password, etc.)
  const params = Object.assign(baseParams, extraParams)
  console.log(`[callService] Final params keys:`, Object.keys(params))
  console.log(`[callService] UserName:`, params.UserName ? 'present' : 'missing', params.UserName)
  console.log(`[callService] Password:`, params.Password ? 'present' : 'missing', params.Password ? '***' : '')
  console.log(`[callService] paramOrder:`, paramOrder)
  const url = buildUrl(functionName, params, paramOrder)

  console.log(`[callService] Request URL: ${url.replace(/([&?]AC=)[^&]*/, '$1***')}`)

  try {
    const debugOn = getDebugFlag && getDebugFlag()
    if (debugOn) {
      const masked = Object.assign({}, params)
      if (masked.AC) masked.AC = mask(masked.AC)
      if (masked.Key) masked.Key = mask(masked.Key)
      if (masked.DeviceID) masked.DeviceID = mask(masked.DeviceID)
      log(`[RRService] Request ${functionName} params:`, masked)
      log(`[RRService] Request URL (masked AC):`, url.replace(/([&?]AC=)[^&]*/,'$1***'))
      log(`[RRService] Request URL (full):`, url)
    }

    console.log(`[callService] Fetching from API...`)
    // Fetch with timeout
    const res = await fetchWithTimeout(url, {}, 30000)
    console.log(`[callService] Response status: ${res.status} ${res.statusText}`)
    
    const txt = await res.text()
    console.log(`[callService] Response text length: ${txt.length} characters`)
    console.log(`[callService] Full Response XML:`, txt)

    const obj = parser.parse(txt)
    console.log(`[callService] Parsed XML object:`, obj)
    
    const ri = obj?.ResultInfo || obj
    const err = Number(ri?.ErrorNumber) || 0
    const result = (ri?.Result || '').toLowerCase()
    const message = ri?.Message || ''

    console.log(`[callService] Parsed result:`, {
      success: result === 'success',
      errorNumber: err,
      message: message,
      hasSelections: !!ri?.Selections,
      selectionsType: typeof ri?.Selections,
      selectionsKeys: ri?.Selections ? Object.keys(ri.Selections) : [],
    })

    return { success: result === 'success', errorNumber: err, message, raw: ri, parsed: ri, requestUrl: url }
  } catch (e) {
    console.error(`[callService] ❌ Error calling ${functionName}:`, e)
    const isTimeout = (e && (e.name === 'AbortError' || String(e).toLowerCase().includes('timeout')))
    if (getDebugFlag && getDebugFlag()) logError && logError(`[RRService] Error calling ${functionName}:`, e && e.stack ? e.stack : e)
    if (isTimeout) {
      try { handleApiTimeout() } catch (err) { /* ignore */ }
    }
    return { success: false, errorNumber: isTimeout ? 408 : 100, message: isTimeout ? 'Request timed out' : String(e), requestUrl: url }
  }
}

// API wrappers used by the app
function textOf(v) {
  if (v === undefined || v === null) return ''
  if (typeof v === 'string' || typeof v === 'number') return String(v)
  if (typeof v === 'object') {
    if ('#text' in v) return String(v['#text'])
    // try nested keys
    for (const k of Object.keys(v)) {
      const val = v[k]
      if (typeof val === 'string' || typeof val === 'number') return String(val)
      if (val && typeof val === 'object' && ('#text' in val)) return String(val['#text'])
    }
  }
  return ''
}

export async function AuthorizeUser(payload) {
  // Build params for AuthorizeUser endpoint
  const deviceInfo = await getDeviceInfo()
  const params = {
    DeviceType: payload.DeviceType || deviceInfo.DeviceType,
    DeviceModel: payload.DeviceModel || deviceInfo.DeviceModel,
    DeviceVersion: payload.DeviceVersion || deviceInfo.DeviceVersion,
    UserName: payload.UserName,
    Password: payload.Password,
    Language: payload.Language || 'EN',
    MobileVersion: payload.MobileVersion || payload.GiftologyVersion || '1',
    ...payload,
  }

  const paramOrder = ['DeviceID','DeviceType','DeviceModel','DeviceVersion','Date','Key','UserName','Password','Language','MobileVersion']
  return callService('AuthorizeUser', params, paramOrder)
}

export async function AuthorizeDeviceID(payload) {
  // According to spec: DeviceID, UserName, and Password must be URLENCODED
  // Key = SHA-1(DeviceID + Date + AuthorizationCode) - should be provided by caller
  // Date = MM/DD/YYYY-HH:mm - should be provided by caller
  
  // Get DeviceID from payload or fallback to getDeviceId() (will be handled by callService)
  const deviceId = payload.DeviceID || null
  
  const params = {
    UserName: payload.UserName || '', // Don't URL encode - server expects @ symbol unencoded
    Password: payload.Password || '', // Don't URL encode
    Language: payload.Language || 'EN',
    MobileVersion: payload.MobileVersion || payload.GiftologyVersion || '1',
    SecurityCode: payload.SecurityCode, // 6 digit code
  }
  
  // Only include Date and Key if they're actually provided (not undefined/null/empty)
  // Otherwise, callService will calculate them
  if (payload.Date && payload.Date !== 'null' && payload.Date !== 'undefined') {
    params.Date = payload.Date // MM/DD/YYYY-HH:mm supplied by caller
  }
  if (payload.Key && payload.Key !== 'null' && payload.Key !== 'undefined') {
    params.Key = payload.Key   // SHA-1(DeviceID + Date + AuthorizationCode) - supplied by caller
  }
  
  // URL encode DeviceID if provided in payload (per spec requirement)
  if (deviceId) {
    params.DeviceID = encodeURIComponent(deviceId)
  }

  // Matches required API parameter order (based on working example):
  // DeviceID, Date, Key, UserName, Password, Language, MobileVersion, SecurityCode
  const paramOrder = [
    'DeviceID',
    'Date',
    'Key',
    'UserName',
    'Password',
    'Language',
    'MobileVersion',
    'SecurityCode'
  ]

  // For AuthorizeDeviceID, we don't want AC in the URL (not in spec)
  // If DeviceID wasn't provided, callService will add it from getDeviceId() and we'll encode it there
  return callService('AuthorizeDeviceID', params, paramOrder, { skipAC: true, encodeDeviceID: !deviceId })
}

// export async function AuthorizeDeviceID({ SecurityCode }) {
//   return callService('AuthorizeDeviceID', { SecurityCode })
// }

// Helper to parse formatted numbers (removes commas, spaces, currency symbols, etc.)
function parseFormattedNumber(str) {
  if (!str) return 0
  const cleaned = String(str).replace(/[^0-9.-]+/g, '')
  const num = Number(cleaned)
  return isNaN(num) ? 0 : num
}

export async function GetDashboard() {
  const r = await callService('GetDashboard')
  if (!r.success) {
    console.log('[GetDashboard] API call failed:', r)
    return r
  }

  const sel = r.parsed?.Selections || {}

  // Helper to recursively search for DOV fields in nested Task structure
  const findDovFields = (obj, depth = 0) => {
    if (!obj || typeof obj !== 'object' || depth > 10) return null
    
    // Check if this object has the DOV fields we're looking for
    if (obj.HarmlessStarter !== undefined || obj.Greenlight !== undefined || obj.TotalDOV !== undefined) {
      return obj
    }
    
    // Recursively search in nested objects
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'object' && obj[key] !== null) {
        const found = findDovFields(obj[key], depth + 1)
        if (found) return found
      }
    }
    
    return null
  }

  // Find DOV fields in the nested Task structure
  const dovFields = findDovFields(sel?.Task) || {}

  // Parse DOV array to extract additional DOV types (if needed)
  const dovMap = {}
  const dovSources = []
  if (sel?.DOV) dovSources.push(sel.DOV)
  if (dovFields?.DOV) dovSources.push(dovFields.DOV)
  
  dovSources.forEach(dovSource => {
    const dovArray = Array.isArray(dovSource) ? dovSource : [dovSource]
    dovArray.forEach(dov => {
      const name = (textOf(dov?.Name) || '').toLowerCase().trim()
      const count = parseFormattedNumber(textOf(dov?.Count))
      if (name) {
        if (name.includes('handwritten') || name.includes('note')) {
          dovMap.handwrittenNotes = (dovMap.handwrittenNotes || 0) + count
        } else if (name.includes('gift')) {
          dovMap.gifting = (dovMap.gifting || 0) + count
        } else if (name.includes('video')) {
          dovMap.videos = (dovMap.videos || 0) + count
        } else if (name.includes('other')) {
          dovMap.other = (dovMap.other || 0) + count
        }
      }
    })
  })

  // Helper to extract number from XML field (handles both direct numbers and textOf format)
  const getNumber = (field) => {
    if (field === undefined || field === null) return 0
    // If it's already a number, use it directly
    if (typeof field === 'number') return isNaN(field) ? 0 : field
    // If it's a string, parse it
    if (typeof field === 'string') {
      const parsed = parseFormattedNumber(field)
      return isNaN(parsed) ? 0 : parsed
    }
    // Otherwise use textOf to extract text, then parse
    const text = textOf(field)
    const parsed = parseFormattedNumber(text)
    return isNaN(parsed) ? 0 : parsed
  }

  // Extract DOV fields from nested structure (they're inside Task.TaskName.TaskName.Task.TaskName)
  // Try root level first, then nested structure
  const harmLessStarter = getNumber(sel?.HarmlessStarter || dovFields?.HarmlessStarter)
  const greenlight = getNumber(sel?.Greenlight || dovFields?.Greenlight)
  const clarityConvos = getNumber(sel?.ClarityConvos || dovFields?.ClarityConvos)
  const totalDov = getNumber(sel?.TotalDOV || sel?.TotalDov || dovFields?.TotalDOV || dovFields?.TotalDov)
  const introduction = getNumber(sel?.Introduction || dovFields?.Introduction)
  const referral = getNumber(sel?.Referral || dovFields?.Referral)
  const partner = getNumber(sel?.Partner || dovFields?.Partner)
  
  // Map a compact JS object expected by UI (matching mobile structure)
  const data = {
    // Web-specific property names (for backward compatibility)
    bestReferralPartners: Array.isArray(sel?.BestPartner) ? sel.BestPartner.map(b => ({ name: textOf(b?.Name), contactSerial: textOf(b?.ContactSerial), amount: textOf(b?.Amount) })) : (sel?.BestPartner ? [{ name: textOf(sel.BestPartner?.Name), contactSerial: textOf(sel.BestPartner?.ContactSerial), amount: textOf(sel.BestPartner?.Amount) }] : []),
    currentRunawayRelationships: Array.isArray(sel?.Current) ? sel.Current.map(c => ({ name: textOf(c?.Name), contactSerial: textOf(c?.ContactSerial), phone: textOf(c?.Phone) })) : (sel?.Current ? [{ name: textOf(sel.Current?.Name), contactSerial: textOf(sel.Current?.ContactSerial), phone: textOf(sel.Current?.Phone) }] : []),
    recentlyIdentifiedPartners: Array.isArray(sel?.Recent) ? sel.Recent.map(r => ({ name: textOf(r?.Name), contactSerial: textOf(r?.ContactSerial), phone: textOf(r?.Phone) })) : (sel?.Recent ? [{ name: textOf(sel.Recent?.Name), contactSerial: textOf(sel.Recent?.ContactSerial), phone: textOf(sel.Recent?.Phone) }] : []),
    tasks: Array.isArray(sel?.Task) ? sel.Task.map(t => ({ name: textOf(t?.Name) || textOf(t?.TaskName), taskSerial: textOf(t?.TaskSerial), contactSerial: textOf(t?.ContactSerial), taskName: textOf(t?.TaskName), date: textOf(t?.Date) })) : (sel?.Task ? [{ name: textOf(sel.Task?.Name) || textOf(sel.Task?.TaskName), taskSerial: textOf(sel.Task?.TaskSerial), contactSerial: textOf(sel.Task?.ContactSerial), taskName: textOf(sel.Task?.TaskName), date: textOf(sel.Task?.Date) }] : []),
    
    // Mobile-compatible property names
    bestPartner: Array.isArray(sel?.BestPartner) ? sel.BestPartner.map(b => ({ Name: textOf(b?.Name), ContactSerial: textOf(b?.ContactSerial), Amount: textOf(b?.Amount) })) : (sel?.BestPartner ? [{ Name: textOf(sel.BestPartner?.Name), ContactSerial: textOf(sel.BestPartner?.ContactSerial), Amount: textOf(sel.BestPartner?.Amount) }] : []),
    current: Array.isArray(sel?.Current) ? sel.Current.map(c => ({ Name: textOf(c?.Name), ContactSerial: textOf(c?.ContactSerial), Phone: textOf(c?.Phone) })) : (sel?.Current ? [{ Name: textOf(sel.Current?.Name), ContactSerial: textOf(sel.Current?.ContactSerial), Phone: textOf(sel.Current?.Phone) }] : []),
    recent: Array.isArray(sel?.Recent) ? sel.Recent.map(r => ({ Name: textOf(r?.Name), ContactSerial: textOf(r?.ContactSerial), Phone: textOf(r?.Phone) })) : (sel?.Recent ? [{ Name: textOf(sel.Recent?.Name), ContactSerial: textOf(sel.Recent?.ContactSerial), Phone: textOf(sel.Recent?.Phone) }] : []),
    tasksSummary: Array.isArray(sel?.Task) ? sel.Task.map(t => ({ name: textOf(t?.Name) || textOf(t?.TaskName), taskSerial: textOf(t?.TaskSerial), contactSerial: textOf(t?.ContactSerial), taskName: textOf(t?.TaskName), date: textOf(t?.Date) })) : (sel?.Task ? [{ name: textOf(sel.Task?.Name) || textOf(sel.Task?.TaskName), taskSerial: textOf(sel.Task?.TaskSerial), contactSerial: textOf(sel.Task?.ContactSerial), taskName: textOf(sel.Task?.TaskName), date: textOf(sel.Task?.Date) }] : []),
    
    // DOV data - extract from nested structure or root level
    datesDov: {
      harmlessStarters: harmLessStarter,
      greenlightQuestions: greenlight,
      clarityConvos: clarityConvos,
      handwrittenNotes: getNumber(sel?.HandwrittenNotes || dovFields?.HandwrittenNotes) || dovMap.handwrittenNotes || 0,
      gifting: getNumber(sel?.Gifting || dovFields?.Gifting) || dovMap.gifting || 0,
      videos: getNumber(sel?.Videos || dovFields?.Videos) || dovMap.videos || 0,
      other: getNumber(sel?.Other || dovFields?.Other) || dovMap.other || 0,
      totalDov: totalDov,
    },
    // Mobile-compatible top-level dovTotal
    dovTotal: totalDov,
    
    referralRevenue: getNumber(sel?.ReferralRevenue || sel?.ReferralRevenueGenerated || sel?.referralRevenue || dovFields?.ReferralRevenue || 0),
    outcomes: {
      introductions: introduction,
      referrals: referral,
      referralPartners: partner,
      // Mobile-compatible property name
      partners: partner,
    },
  }

  return { success: true, data }
}

// export async function GetTaskList() {
//   const r = await callService('GetTaskList')
//   if (!r.success) return r
//   const sel = r.parsed?.Selections || {}
//   const list = Array.isArray(sel?.Task)
//     ? sel.Task.map(t => ({ name: textOf(t?.Name) || textOf(t?.TaskName), serial: Number(textOf(t?.Serial || t?.TaskSerial) || 0), contact: textOf(t?.Contact) || textOf(t?.Name), date: textOf(t?.Date), status: Number(textOf(t?.Status || 0)) }))
//     : (sel?.Task ? [{ name: textOf(sel.Task?.Name) || textOf(sel.Task?.TaskName), serial: Number(textOf(sel.Task?.Serial || sel.Task?.TaskSerial) || 0), contact: textOf(sel.Task?.Contact) || textOf(sel.Task?.Name), date: textOf(sel.Task?.Date), status: Number(textOf(sel.Task?.Status || 0)) }] : [])
//   return { success: true, data: list }
// }
export async function GetTaskList() {
  const r = await callService('GetTaskList', { MobileVersion: MOBILE_VERSION })
  if (!r.success) return r
  console.log('GetTaskList response:', r)
  const sel = r.parsed?.Selections || {}
  const list = Array.isArray(sel?.Task)
    ? sel.Task.map(t => ({ name: textOf(t?.Name) || textOf(t?.TaskName), serial: Number(textOf(t?.Serial || t?.TaskSerial) || 0), contact: textOf(t?.Contact) || textOf(t?.Name), date: textOf(t?.Date), status: Number(textOf(t?.Status || 0)) }))
    : (sel?.Task ? [{ name: textOf(sel.Task?.Name) || textOf(sel.Task?.TaskName), serial: Number(textOf(sel.Task?.Serial || sel.Task?.TaskSerial) || 0), contact: textOf(sel.Task?.Contact) || textOf(sel.Task?.Name), date: textOf(sel.Task?.Date), status: Number(textOf(sel.Task?.Status || 0)) }] : [])
  return { success: true, data: list }
}

export async function GetTask({ Task }) {
  const r = await callService('GetTask', { Task })
  if (!r.success) return r
  const t = r.parsed?.Task || r.parsed
  return { success: true, data: { name: t?.Name, serial: Number(t?.Serial), contact: t?.Contact, date: t?.Date, status: Number(t?.Status || 0) } }
}

export async function UpdateTask({ Task, Status }) {
  // Status 1 for done, 0 for not done
  return callService('UpdateTask', { Task, Status })
}

export async function GetDOVDateList() {
  const r = await callService('GetDOVDateList')
  if (!r.success) return r
  const sel = r.parsed?.Selections || {}
  const mapArr = (name) => (Array.isArray(sel?.[name]) ? sel[name].map(x => ({ name: x?.Name, contactSerial: x?.ContactSerial, date: x?.Date })) : (sel?.[name] ? [{ name: sel[name].Name, contactSerial: sel[name].ContactSerial, date: sel[name].Date }] : []))
  return { success: true, data: { harmless: mapArr('Harmless'), greenlight: mapArr('Greenlight'), clarity: mapArr('Clarity') } }
}

export async function GetContactList() {
  const r = await callService('GetContactList')
  if (!r.success) return r
  const sel = r.parsed?.Selections || {}
  const list = Array.isArray(sel?.Contact)
    ? sel.Contact.map(c => ({ name: textOf(c?.Name), serial: Number(textOf(c?.Serial) || 0), status: textOf(c?.Status) }))
    : (sel?.Contact ? [{ name: textOf(sel.Contact?.Name), serial: Number(textOf(sel.Contact?.Serial) || 0), status: textOf(sel.Contact?.Status) }] : [])
  return { success: true, data: list }
}

export async function GetContact({ Serial }) {
  const r = await callService('GetContact', { Serial })
  if (!r.success) return r
  const c = r.parsed?.Contact || r.parsed
  return { success: true, data: { name: c?.Name, serial: Number(c?.Serial), status: c?.Status } }
}

export async function ResetPassword({ Email }) {
  return callService('ResetPassword', { Email })
}

export async function GetHelp({ HelpID }) {
  const r = await callService('GetHelp', { HelpID })
  if (!r.success) return r
  return { success: true, data: r.parsed?.Help || r.parsed }
}

export async function UpdateFeedback({ Name, Email, Phone, Response, Update, Comment }) {
  // Response and Update expected as 1 or 0
  return callService('UpdateFeedback', { Name, Email, Phone, Response, Update, Comment })
}

export async function GetUserInfo() {
  const r = await callService('GetUserInfo')
  if (!r.success) return r
  
  // Handle both correct spelling "Contact" and typo "Conctact"
  const contact = r.parsed?.Contact || r.parsed?.Conctact || {}
  
  return {
    success: true,
    data: {
      name: textOf(contact?.Name),
      email: textOf(contact?.Email),
      company: textOf(contact?.Company),
      serial: Number(textOf(contact?.Serial) || 0),
      subscriber: Number(textOf(contact?.Subscriber) || 0)
    }
  }
}

// Helper function to get device information in web
async function getDeviceInfo() {
  try {
    const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : ''
    return {
      DeviceType: 'Web',
      DeviceModel: (typeof navigator !== 'undefined' ? (navigator.platform || '').slice(0, 20) : 'Browser') || 'Browser',
      DeviceVersion: (typeof navigator !== 'undefined' ? (navigator.appVersion || '') : '').slice(0, 20) || '1.0',
    }
  } catch (e) {
    return { DeviceType: 'Web', DeviceModel: 'Browser', DeviceVersion: '1.0' }
  }
}
