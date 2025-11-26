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
export async function callService(functionName, extraParams = {}, paramOrder = null) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
  const deviceId = (await getDeviceId()) || ''
  const ac = (await getAuthCode()) || ''

  const d = new Date()
  const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}-${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

  // Historically the mobile client used sha1(deviceId + dateStr)
  // Server spec describes including the AC but some endpoints/tests expect the short form.
  const key = sha1(deviceId + dateStr)

  const params = Object.assign({ DeviceID: deviceId, Date: dateStr, Key: key, AC: ac }, extraParams)
  const url = buildUrl(functionName, params, paramOrder)

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

    // Fetch with timeout
    const res = await fetchWithTimeout(url, {}, 30000)
    const txt = await res.text()

    const obj = parser.parse(txt)
    const ri = obj?.ResultInfo || obj
    const err = Number(ri?.ErrorNumber) || 0
    const result = (ri?.Result || '').toLowerCase()
    const message = ri?.Message || ''

    return { success: result === 'success', errorNumber: err, message, raw: ri, parsed: ri, requestUrl: url }
  } catch (e) {
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

export async function AuthorizeDeviceID({ SecurityCode }) {
  return callService('AuthorizeDeviceID', { SecurityCode })
}

export async function GetDashboard() {
  const r = await callService('GetDashboard')
  if (!r.success) return r

  const sel = r.parsed?.Selections || {}

  // Map a compact JS object expected by UI
  const data = {
    bestReferralPartners: Array.isArray(sel?.BestPartner) ? sel.BestPartner.map(b => ({ name: textOf(b?.Name), contactSerial: textOf(b?.ContactSerial), amount: textOf(b?.Amount) })) : (sel?.BestPartner ? [{ name: textOf(sel.BestPartner?.Name), contactSerial: textOf(sel.BestPartner?.ContactSerial), amount: textOf(sel.BestPartner?.Amount) }] : []),
    currentRunawayRelationships: Array.isArray(sel?.Current) ? sel.Current.map(c => ({ name: textOf(c?.Name), contactSerial: textOf(c?.ContactSerial), phone: textOf(c?.Phone) })) : (sel?.Current ? [{ name: textOf(sel.Current?.Name), contactSerial: textOf(sel.Current?.ContactSerial), phone: textOf(sel.Current?.Phone) }] : []),
    recentlyIdentifiedPartners: Array.isArray(sel?.Recent) ? sel.Recent.map(r => ({ name: textOf(r?.Name), contactSerial: textOf(r?.ContactSerial), phone: textOf(r?.Phone) })) : (sel?.Recent ? [{ name: textOf(sel.Recent?.Name), contactSerial: textOf(sel.Recent?.ContactSerial), phone: textOf(sel.Recent?.Phone) }] : []),
    tasks: Array.isArray(sel?.Task) ? sel.Task.map(t => ({ name: textOf(t?.Name) || textOf(t?.TaskName), taskSerial: textOf(t?.TaskSerial), contactSerial: textOf(t?.ContactSerial), taskName: textOf(t?.TaskName), date: textOf(t?.Date) })) : (sel?.Task ? [{ name: textOf(sel.Task?.Name) || textOf(sel.Task?.TaskName), taskSerial: textOf(sel.Task?.TaskSerial), contactSerial: textOf(sel.Task?.ContactSerial), taskName: textOf(sel.Task?.TaskName), date: textOf(sel.Task?.Date) }] : []),
    datesDov: {
      harmlessStarters: Number(textOf(sel?.HarmlessStarter)) || 0,
      greenlightQuestions: Number(textOf(sel?.Greenlight)) || 0,
      clarityConvos: Number(textOf(sel?.ClarityConvos)) || 0,
      handwrittenNotes: Number(textOf(sel?.HandwrittenNotes)) || 0,
      gifting: Number(textOf(sel?.Gifting)) || 0,
      videos: Number(textOf(sel?.Videos)) || 0,
      other: Number(textOf(sel?.Other)) || 0,
      totalDov: Number(textOf(sel?.TotalDOV || sel?.TotalDov)) || 0,
    },
    referralRevenue: Number(sel?.ReferralRevenue || sel?.ReferralRevenueGenerated || sel?.referralRevenue || 0),
    outcomes: {
      introductions: Number(textOf(sel?.Introduction)) || 0,
      referrals: Number(textOf(sel?.Referral)) || 0,
      referralPartners: Number(textOf(sel?.Partner)) || 0,
    },
  }

  return { success: true, data }
}

export async function GetTaskList() {
  const r = await callService('GetTaskList')
  if (!r.success) return r
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
