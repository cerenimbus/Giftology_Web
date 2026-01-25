
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { GetContactList } from '../utils/api'
import { getAuthCode, getDeviceId } from '../utils/storage'
import CryptoJS from 'crypto-js'
import { XMLParser } from 'fast-xml-parser'
import HamburgerMenu from '../components/HamburgerMenu'
import Sidebar from '../components/Sidebar'
import { getMenuItems } from '../utils/menuConfig.jsx'
import { removeAuthCode } from '../utils/storage'
import { useNavigate } from 'react-router-dom'
import './Contacts.css'

export default function Contacts() {
  const navigate = useNavigate()
  const location = useLocation()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900)
  const [debugInfo, setDebugInfo] = useState(null)

  const textOf = (v) => {
    if (v === undefined || v === null) return ''
    if (typeof v === 'string' || typeof v === 'number') return String(v)
    if (typeof v === 'object') {
      if ('#text' in v) return String(v['#text'])
      for (const k of Object.keys(v)) {
        const val = v[k]
        if (typeof val === 'string' || typeof val === 'number') return String(val)
        if (val && typeof val === 'object' && ('#text' in val)) return String(val['#text'])
      }
    }
    return ''
  }

  const toArray = (maybe) => {
    if (!maybe) return []
    return Array.isArray(maybe) ? maybe : [maybe]
  }

  // Deep recursive search for contact-like objects in any structure
  const findContactLikeObjects = (obj, depth = 0, found = []) => {
    if (!obj || typeof obj !== 'object' || depth > 10) return found
    
    // Check if this object looks like a contact (has Name, Serial, or ContactSerial)
    if (obj.Name || obj.name || obj.Serial || obj.serial || obj.ContactSerial || obj.contactSerial || obj.ID || obj.id) {
      found.push(obj)
    }
    
    // If it's an array, check each item
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        if (item && typeof item === 'object') {
          findContactLikeObjects(item, depth + 1, found)
        }
      })
    } else {
      // Recursively search all properties
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== null && typeof obj[key] === 'object') {
          findContactLikeObjects(obj[key], depth + 1, found)
        }
      }
    }
    
    return found
  }

  // Find all arrays in the response that might contain contacts
  const findAllArrays = (obj, depth = 0, arrays = []) => {
    if (!obj || typeof obj !== 'object' || depth > 10) return arrays
    
    if (Array.isArray(obj) && obj.length > 0) {
      arrays.push(obj)
    }
    
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        if (item && typeof item === 'object') {
          findAllArrays(item, depth + 1, arrays)
        }
      })
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== null && typeof obj[key] === 'object') {
          findAllArrays(obj[key], depth + 1, arrays)
        }
      }
    }
    
    return arrays
  }

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
    const fetchContacts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // First try the standard GetContactList
        const result = await GetContactList({ Language: 'EN' })
        
        // If result.data has contacts, use them
        if (result?.data && Array.isArray(result.data) && result.data.length > 0) {
          console.log('[Contacts] ✅ Found contacts via GetContactList:', result.data.length)
          const mapped = result.data.map((c, idx) => ({
            id: String(c.serial || idx),
            name: c.name || '',
            status: c.status || '',
            phone: c.phone || ''
          }))
          setContacts(mapped)
          setError(null)
          setLoading(false)
          return
        }
        
        // If no contacts in result.data, call API directly to get full response
        // This is needed because api.js looks for Selections.Contact but XML has ResultInfo.Contacts.Contact
        console.log('[Contacts] No contacts in result.data, calling API directly...')
        
        const deviceId = (await getDeviceId()) || ''
        const ac = (await getAuthCode()) || ''
        const d = new Date()
        const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}-${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        const key = CryptoJS.SHA1(deviceId + dateStr + ac).toString(CryptoJS.enc.Hex)
        
        const BASE = import.meta.env.VITE_API_BASE
          ? String(import.meta.env.VITE_API_BASE)
          : (import.meta.env.DEV ? '/RRService' : 'https://radar.Giftologygroup.com/RRService')
        
        const params = new URLSearchParams({
          DeviceID: encodeURIComponent(deviceId),
          Date: dateStr,
          Key: key,
          AC: ac,
          Language: 'EN',
          MobileVersion: '1'
        })
        
        const url = `${BASE}/GetContactList.php?${params.toString()}`
        console.log('[Contacts] Calling API directly:', url.replace(/([&?]AC=)[^&]*/, '$1***'))
        
        const response = await fetch(url)
        const xmlText = await response.text()
        console.log('[Contacts] Raw XML response:', xmlText)
        
        // Parse XML
        const xmlParser = new XMLParser({ 
          ignoreAttributes: false, 
          attributeNamePrefix: '',
          textNodeName: '#text',
          parseTagValue: true,
          parseNodeValue: true,
          trimValues: true
        })
        
        const xmlParsed = xmlParser.parse(xmlText)
        console.log('[Contacts] Parsed XML:', xmlParsed)
        
        // Extract contacts from ResultInfo.Contacts.Contact structure
        // XML structure: <ResultInfo><Contacts><Contact>...</Contact></Contacts></ResultInfo>
        const resultInfo = xmlParsed?.ResultInfo || xmlParsed
        let contacts = resultInfo?.Contacts?.Contact || 
                      resultInfo?.contacts?.contact || 
                      resultInfo?.Contact || 
                      resultInfo?.contact || 
                      []
        
        console.log('[Contacts] resultInfo:', resultInfo)
        console.log('[Contacts] resultInfo.Contacts:', resultInfo?.Contacts)
        console.log('[Contacts] Found contacts:', contacts)
        
        // Handle both array and single contact object
        const contactArray = Array.isArray(contacts) ? contacts : (contacts && typeof contacts === 'object' ? [contacts] : [])
        
        if (contactArray.length > 0) {
          console.log('[Contacts] ✅ Found', contactArray.length, 'contacts in XML!')
          const mapped = contactArray.map((c, idx) => {
            const name = textOf(c?.Name || c?.name || '')
            const serial = Number(textOf(c?.Serial || c?.serial || 0)) || idx
            const status = textOf(c?.Status || c?.status || '')
            const phone = textOf(c?.Phone || c?.phone || '')
            
            return {
              id: String(serial || idx),
              name: name || `Contact ${serial || idx}`,
              status: status || 'N/A',
              phone: phone || ''
            }
          })
          
          setContacts(mapped)
          setError(null)
          setLoading(false)
          return
        }
        
        // If we get here, no contacts were found in direct API call either
        // If we get here, direct API call didn't find contacts
        // Fallback to original GetContactList result
        console.log('[Contacts] No contacts found in direct API call, checking original result...')
        
        // Log the full response for debugging
        console.log('[Contacts] ==========================================')
        console.log('[Contacts] GetContactList FULL RESULT:', JSON.stringify(result, null, 2))
        console.log('[Contacts] result.data:', result?.data)
        console.log('[Contacts] result.success:', result?.success)
        
        // Store debug info for on-screen display
        setDebugInfo({
          success: result?.success,
          errorNumber: result?.errorNumber,
          message: result?.message,
          dataLength: Array.isArray(result?.data) ? result.data.length : 'not array',
          hasParsed: !!result?.parsed,
          hasRaw: !!result?.raw,
          resultKeys: Object.keys(result || {}),
          dataType: typeof result?.data,
          dataSample: Array.isArray(result?.data) ? result.data.slice(0, 2) : result?.data
        })

        // ALWAYS try to parse, regardless of success status - sometimes contacts exist even if API reports error
        
        // 1) Preferred: use api.js mapped list if present
        let listFromData = []
        if (result && result.data) {
          if (Array.isArray(result.data)) {
            listFromData = result.data
            console.log('[Contacts] result.data is an array with', result.data.length, 'items')
          } else if (typeof result.data === 'object') {
            // Maybe data is an object, try to extract array from it
            console.log('[Contacts] result.data is an object, checking for nested arrays...')
            console.log('[Contacts] result.data keys:', Object.keys(result.data))
            
            // Try to find any array property
            for (const key of Object.keys(result.data)) {
              const value = result.data[key]
              if (Array.isArray(value) && value.length > 0) {
                console.log(`[Contacts] ✅ Found array in result.data.${key} with`, value.length, 'items')
                listFromData = value
                break
              }
            }
            
            // Also try common property names
            if (listFromData.length === 0) {
              listFromData = Array.isArray(result.data.list) ? result.data.list : 
                            Array.isArray(result.data.contacts) ? result.data.contacts :
                            Array.isArray(result.data.data) ? result.data.data :
                            Array.isArray(result.data.items) ? result.data.items :
                            Array.isArray(result.data.results) ? result.data.results : []
            }
          }
        }
        
        console.log('[Contacts] listFromData after processing:', listFromData.length, 'contacts')

        // 2) Since GetContactList only returns { success, data }, we need to work with result.data
        // Initialize variables to avoid "not defined" errors
        let contactNodes = []
        let selections = {}
        const parsed = result?.parsed || result?.raw || result?.data || result || {}
        
        // Log what we actually have
        console.log('[Contacts] parsed object:', parsed)
        console.log('[Contacts] parsed keys:', Object.keys(parsed || {}))
        console.log('[Contacts] parsed type:', typeof parsed)
        console.log('[Contacts] Is parsed an array?', Array.isArray(parsed))
        
        // PRIMARY: Check if result.data itself contains contacts (most likely scenario)
        if (result?.data) {
          if (Array.isArray(result.data) && result.data.length > 0) {
            console.log('[Contacts] ✅ result.data is an array with', result.data.length, 'contacts!')
            contactNodes = result.data
          } else if (typeof result.data === 'object' && !Array.isArray(result.data)) {
            // result.data is an object - check if it has contact arrays inside
            console.log('[Contacts] result.data is an object, searching for contacts...')
            const dataKeys = Object.keys(result.data)
            console.log('[Contacts] result.data keys:', dataKeys)
            
            // Check if result.data itself is a contact object
            if (result.data.name || result.data.Name || result.data.serial || result.data.Serial) {
              console.log('[Contacts] ✅ result.data IS a contact object!')
              contactNodes = [result.data]
            } else {
              // Look for arrays or contact objects inside result.data
              for (const key of dataKeys) {
                const value = result.data[key]
                if (Array.isArray(value) && value.length > 0) {
                  // Check if array contains contact-like objects
                  const hasContacts = value.some(item => 
                    item && typeof item === 'object' && 
                    (item.name || item.Name || item.serial || item.Serial)
                  )
                  if (hasContacts) {
                    console.log(`[Contacts] ✅ Found contact array in result.data.${key} with`, value.length, 'items')
                    contactNodes = value
                    break
                  }
                } else if (value && typeof value === 'object' && (value.name || value.Name || value.serial || value.Serial)) {
                  console.log(`[Contacts] ✅ Found contact object in result.data.${key}`)
                  contactNodes = [value]
                  break
                }
              }
            }
          }
        }
        
        // SECONDARY: If no contacts found in result.data, try parsing from parsed/raw (if available)
        if (contactNodes.length === 0) {
          // If parsed itself is an array, use it directly
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('[Contacts] ✅ Parsed IS an array with', parsed.length, 'items!')
            contactNodes = parsed
          } else if (parsed && typeof parsed === 'object') {
            const resultInfo = parsed?.ResultInfo || parsed
            selections = resultInfo?.Selections || parsed?.Selections || parsed?.selections || resultInfo?.selections || {}
            
            console.log('[Contacts] selections:', selections)
            console.log('[Contacts] selections keys:', Object.keys(selections || {}))
          
            // Try multiple possible locations for Contact nodes
            contactNodes =
              selections?.Contact ||
              selections?.contact ||
              selections?.Contacts ||
              selections?.contacts ||
              parsed?.Contact ||
              parsed?.contact ||
              parsed?.Contacts ||
              parsed?.contacts ||
              resultInfo?.Contact ||
              resultInfo?.contact ||
              []
          }
        }

        // If no contacts found in standard locations, do a deep recursive search
        // Also check if contactNodes is a single object (not array)
        if (!contactNodes || 
            (Array.isArray(contactNodes) && contactNodes.length === 0) || 
            (typeof contactNodes === 'object' && !Array.isArray(contactNodes) && Object.keys(contactNodes).length === 0)) {
          
          // Check if contactNodes is a single contact object (not array)
          if (contactNodes && typeof contactNodes === 'object' && !Array.isArray(contactNodes) && 
              (contactNodes.Name || contactNodes.name || contactNodes.Serial || contactNodes.serial)) {
            console.log('[Contacts] ✅ contactNodes is a single contact object, converting to array')
            contactNodes = [contactNodes]
          } else {
          console.log('[Contacts] No contacts in standard locations, doing deep search...')
          const deepFound = findContactLikeObjects(parsed)
          if (deepFound.length > 0) {
            contactNodes = deepFound
            console.log('[Contacts] ✅ Found contacts via deep search:', deepFound.length)
          } else {
            // Try finding all arrays and checking if any contain contacts
            console.log('[Contacts] Deep search found nothing, checking all arrays...')
            const allArrays = findAllArrays(parsed)
            console.log('[Contacts] Found arrays in response:', allArrays.length)
            allArrays.forEach((arr, idx) => {
              console.log(`[Contacts] Array ${idx} (length ${arr.length}):`, arr.slice(0, 3))
              // Check if this array contains contact-like objects
              const arrContacts = arr.filter(item => 
                item && typeof item === 'object' && 
                (item.Name || item.name || item.Serial || item.serial || item.ContactSerial || item.contactSerial)
              )
              if (arrContacts.length > 0) {
                console.log(`[Contacts] ✅ Found ${arrContacts.length} contacts in array ${idx}!`)
                contactNodes = (Array.isArray(contactNodes) && contactNodes.length > 0) ? [...contactNodes, ...arrContacts] : arrContacts
              }
            })
          }
          }
        }
        
        // Final check: if contactNodes is still empty or invalid, try result.data directly one more time
        if ((!contactNodes || (Array.isArray(contactNodes) && contactNodes.length === 0)) && result?.data) {
          console.log('[Contacts] Last resort: checking result.data directly again...')
          if (Array.isArray(result.data) && result.data.length > 0) {
            contactNodes = result.data
            console.log('[Contacts] ✅ Using result.data directly:', result.data.length, 'items')
          } else if (result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
            // Maybe data is an object with contacts inside
            const dataKeys = Object.keys(result.data)
            console.log('[Contacts] result.data keys:', dataKeys)
            for (const key of dataKeys) {
              const value = result.data[key]
              if (Array.isArray(value) && value.length > 0) {
                console.log(`[Contacts] ✅ Found array in result.data.${key}:`, value.length, 'items')
                contactNodes = value
                break
              }
            }
          }
        }

        console.log('[Contacts] Found contactNodes:', contactNodes)
        console.log('[Contacts] contactNodes type:', typeof contactNodes, 'isArray:', Array.isArray(contactNodes))

        const listFromParsed = toArray(contactNodes).map((c, idx) => {
          // Try multiple possible field names and casings - be very flexible
          // Also check for nested objects that might contain the actual data
          const name = textOf(
            c?.Name || c?.name || 
            c?.ContactName || c?.contactName || 
            c?.Contact || c?.contact ||
            c?.FullName || c?.fullName ||
            c?.DisplayName || c?.displayName ||
            (c?.ContactInfo && (c.ContactInfo.Name || c.ContactInfo.name)) ||
            ''
          )
          const serial = Number(textOf(
            c?.Serial || c?.serial || 
            c?.ContactSerial || c?.contactSerial || 
            c?.ID || c?.id || 
            c?.ContactID || c?.contactID ||
            c?.SerialNumber || c?.serialNumber ||
            0
          )) || (idx + 1)
          const status = textOf(
            c?.Status || c?.status || 
            c?.ContactStatus || c?.contactStatus ||
            c?.State || c?.state ||
            ''
          )
          const phone = textOf(
            c?.Phone || c?.phone || 
            c?.ContactPhone || c?.contactPhone || 
            c?.PhoneNumber || c?.phoneNumber || 
            c?.Tel || c?.tel ||
            c?.Telephone || c?.telephone ||
            (c?.ContactInfo && (c.ContactInfo.Phone || c.ContactInfo.phone)) ||
            ''
          )
          
          const contactName = name || `Contact ${serial || idx + 1}`
          console.log(`[Contacts] Parsed contact ${idx}:`, { name: contactName, serial, status, phone, raw: c })
          
          return {
            name: contactName,
            serial,
            status: status || 'N/A',
            phone: phone || ''
          }
        }).filter(c => {
          // Very lenient - keep ANY object that looks remotely like a contact
          const hasName = c.name && c.name !== '' && c.name.trim() !== ''
          const hasSerial = c.serial && c.serial > 0
          const hasAnyData = c.status || c.phone || c.name
          // Keep if it has a name, serial, or any contact-like data
          return hasName || hasSerial || hasAnyData
        })

        console.log('[Contacts] listFromData length:', listFromData.length)
        console.log('[Contacts] listFromParsed length:', listFromParsed.length)

        // Combine both sources, preferring listFromData but including any from parsed
        const allContacts = [...listFromData]
        listFromParsed.forEach(parsedContact => {
          // Avoid duplicates based on serial OR name
          const isDuplicate = allContacts.find(c => 
            (c.serial === parsedContact.serial && parsedContact.serial > 0) ||
            (c.name && parsedContact.name && c.name.toLowerCase() === parsedContact.name.toLowerCase())
          )
          if (!isDuplicate) {
            allContacts.push(parsedContact)
          }
        })
        
        // Also add any contacts from listFromData that might have different structure
        listFromData.forEach(dataContact => {
          const isDuplicate = allContacts.find(c => 
            (c.serial === dataContact.serial && dataContact.serial > 0) ||
            (c.name && dataContact.name && c.name.toLowerCase() === dataContact.name.toLowerCase())
          )
          if (!isDuplicate && dataContact.name) {
            allContacts.push(dataContact)
          }
        })

        console.log('[Contacts] Final combined contacts:', allContacts)

        // FINAL FALLBACK: If still no contacts, try to extract ANY objects that might be contacts
        if (allContacts.length === 0) {
          console.log('[Contacts] Trying final fallback - extracting all objects from response...')
          
          // Get all arrays from the entire response
          const allArrays = findAllArrays(parsed)
          console.log('[Contacts] Found', allArrays.length, 'arrays in response')
          
          // Check each array for objects that might be contacts
          allArrays.forEach((arr, arrIdx) => {
            if (Array.isArray(arr) && arr.length > 0) {
              arr.forEach((item, itemIdx) => {
                if (item && typeof item === 'object' && !Array.isArray(item)) {
                  // Check if this object has ANY properties that suggest it's a contact
                  const keys = Object.keys(item)
                  const hasContactLikeKeys = keys.some(key => 
                    /name|serial|id|contact|phone|status|email/i.test(key)
                  )
                  
                  if (hasContactLikeKeys) {
                    const fallbackContact = {
                      name: textOf(item.Name || item.name || item.ContactName || item.contactName || item.FullName || item.fullName || item.DisplayName || item.displayName || keys.find(k => /name/i.test(k) ? item[k] : null) || ''),
                      serial: Number(textOf(item.Serial || item.serial || item.ID || item.id || item.ContactSerial || item.contactSerial || item.ContactID || item.contactID || keys.find(k => /serial|id/i.test(k) ? item[k] : null) || 0)) || (allContacts.length + 1),
                      status: textOf(item.Status || item.status || item.ContactStatus || item.contactStatus || item.State || item.state || keys.find(k => /status|state/i.test(k) ? item[k] : null) || ''),
                      phone: textOf(item.Phone || item.phone || item.ContactPhone || item.contactPhone || item.PhoneNumber || item.phoneNumber || item.Tel || item.tel || item.Telephone || item.telephone || keys.find(k => /phone|tel/i.test(k) ? item[k] : null) || '')
                    }
                    
                    if (fallbackContact.name || fallbackContact.serial > 0) {
                      console.log(`[Contacts] ✅ Found fallback contact from array ${arrIdx}, item ${itemIdx}:`, fallbackContact)
                      allContacts.push(fallbackContact)
                    }
                  }
                }
              })
            }
          })
        }
        
        // Display contacts if we found any, regardless of API success status
        console.log('[Contacts] Total contacts found:', allContacts.length)
        console.log('[Contacts] All contacts:', allContacts)
        
        if (allContacts.length > 0) {
          const mappedContacts = allContacts.map((contact, index) => {
            // Ensure we always have valid data for display
            const contactName = contact.name || contact.Name || `Contact ${contact.serial || index + 1}`
            const contactStatus = contact.status || contact.Status || 'N/A'
            const contactPhone = contact.phone || contact.Phone || ''
            
            return {
              id: String(contact.serial || contact.id || contact.Serial || `contact-${index}`),
              name: String(contactName).trim() || `Contact ${index + 1}`,
              status: String(contactStatus).trim() || 'N/A',
              phone: String(contactPhone).trim() || ''
            }
          })
          
          // Remove duplicates based on serial or name
          const uniqueContacts = []
          const seen = new Set()
          mappedContacts.forEach(c => {
            const key = `${c.name}-${c.id}`
            if (!seen.has(key)) {
              seen.add(key)
              uniqueContacts.push(c)
            }
          })
          
          console.log('[Contacts] ✅ Successfully mapped contacts:', uniqueContacts.length, 'unique contacts')
          console.log('[Contacts] Mapped contact list:', uniqueContacts)
          
          if (uniqueContacts.length > 0) {
            setContacts(uniqueContacts)
            // Clear any previous errors if we found contacts
            setError(null)
            setLoading(false)
          } else {
            console.warn('[Contacts] ⚠️ Contacts found but filtered out during mapping')
            // Even if filtered, try to show something
            if (allContacts.length > 0) {
              console.log('[Contacts] Showing unfiltered contacts as fallback')
              const unfiltered = allContacts.map((c, idx) => ({
                id: `contact-${idx}`,
                name: c.name || c.Name || `Contact ${idx + 1}`,
                status: c.status || c.Status || 'N/A',
                phone: c.phone || c.Phone || ''
              }))
              setContacts(unfiltered)
              setError(null)
        } else {
          setContacts([])
            }
            setLoading(false)
          }
        } else {
          // No contacts found anywhere - show error only if API failed
          console.warn('[Contacts] ❌ No contacts found in response')
          console.warn('[Contacts] Full parsed object keys:', Object.keys(parsed || {}))
          console.warn('[Contacts] Selections keys:', Object.keys(selections || {}))
          console.warn('[Contacts] listFromData:', listFromData)
          console.warn('[Contacts] contactNodes:', contactNodes)
          
          // Try one more time - check if there's ANY array in the response with objects
          const allArraysFinal = findAllArrays(parsed)
          console.warn('[Contacts] All arrays found:', allArraysFinal.length)
          if (allArraysFinal.length > 0) {
            console.warn('[Contacts] First few items from arrays:', allArraysFinal.map(arr => arr.slice(0, 2)))
          }
          
          // LAST RESORT: Check result.data one more time - handle both array and object cases
          if (result && result.data) {
            if (Array.isArray(result.data)) {
              console.log('[Contacts] result.data is an array with length:', result.data.length)
              if (result.data.length === 0) {
                // API returned empty array - this means no contacts exist for this account
                setError('API returned empty contact list. No contacts available for this account. Please check: 1) Browser Network tab (F12) → GetContactList.php to see actual XML response, 2) Console logs for [callService] messages showing the raw XML.')
              } else {
                // Contacts exist in result.data - display them
                console.log('[Contacts] ✅ Found contacts in result.data array!', result.data)
                const mapped = result.data.map((c, idx) => ({
                  id: String(c.serial || c.id || idx),
                  name: c.name || 'Unknown',
                  status: c.status || 'N/A',
                  phone: c.phone || ''
                }))
                setContacts(mapped)
                setError(null)
                setLoading(false)
                return // Exit early since we found contacts
              }
            } else if (typeof result.data === 'object' && result.data !== null) {
              // result.data is an object - try to extract contacts from it
              console.log('[Contacts] result.data is an object, attempting to extract contacts...')
              const dataObj = result.data
              const objKeys = Object.keys(dataObj)
              console.log('[Contacts] result.data object keys:', objKeys)
              
              // Check if the object itself is a contact
              if (dataObj.name || dataObj.Name || dataObj.serial || dataObj.Serial) {
                console.log('[Contacts] ✅ result.data IS a contact object!')
                setContacts([{
                  id: String(dataObj.serial || dataObj.Serial || dataObj.id || dataObj.ID || '1'),
                  name: dataObj.name || dataObj.Name || 'Unknown',
                  status: dataObj.status || dataObj.Status || 'N/A',
                  phone: dataObj.phone || dataObj.Phone || ''
                }])
                setError(null)
                setLoading(false)
                return
              }
              
              // Look for arrays or nested contact objects
              for (const key of objKeys) {
                const value = dataObj[key]
                if (Array.isArray(value) && value.length > 0) {
                  const hasContacts = value.some(item => item && typeof item === 'object' && (item.name || item.Name || item.serial || item.Serial))
                  if (hasContacts) {
                    console.log(`[Contacts] ✅ Found contact array in result.data.${key}!`, value.length, 'contacts')
                    const mapped = value.map((c, idx) => ({
                      id: String(c.serial || c.Serial || c.id || c.ID || idx),
                      name: c.name || c.Name || 'Unknown',
                      status: c.status || c.Status || 'N/A',
                      phone: c.phone || c.Phone || ''
                    }))
                    setContacts(mapped)
                    setError(null)
                    setLoading(false)
                    return
                  }
                }
              }
              
              setError('result.data is an object but no contacts found inside it. Check browser console for details.')
            }
          } else if (result && !result.success) {
            setError(result.message || 'Failed to load contacts')
          } else {
            setError('No contacts found. The GetContactList API returned an empty list. Check browser Network tab (F12) → GetContactList.php to see the actual XML response from the server.')
          }
          setContacts([])
          setLoading(false)
        }
      } catch (err) {
        console.error('[Contacts] Error fetching contacts:', err)
        setError(err.message || 'An error occurred while loading contacts')
        setContacts([])
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [])

  return (
    <div className="contacts-page">
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

      {/* Left Sidebar */}
      {isDesktop && (
        <Sidebar 
          onItemClick={handleMenuClick}
          currentPath={location.pathname}
        />
      )}

      {/* Main Content */}
      <main className="contacts-content" style={{ paddingTop: !isDesktop ? 'calc(env(safe-area-inset-top, 12px) + 72px)' : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
          <h1 className="contacts-title" style={{ marginBottom: 0 }}>Contacts</h1>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid #e0e0e0',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontSize: 14,
              color: '#555',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            Back
          </button>
        </div>
        
        {loading && (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading contacts...</div>
        )}
        
        {error && contacts.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</div>
            {debugInfo && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'left', maxWidth: '600px', margin: '10px auto' }}>
                <strong>Debug Info:</strong>
                <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#999' }}>
                  Check browser console (F12) for full API response details.
                </div>
              </div>
            )}
          </div>
        )}
        
        {!loading && (
          <div className="contacts-table">
            {/* Table Headers */}
            <div className="table-header">
              <div className="header-cell header-name">Name</div>
              <div className="header-cell header-status">Status</div>
              <div className="header-cell header-phone">Phone</div>
            </div>

            {/* Table Rows */}
            <div className="table-body">
              {contacts.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>No contacts found</div>
              ) : (
                contacts.map((item) => (
                  <div key={item.id} className="table-row">
                    <div className="table-cell cell-name">{item.name || 'N/A'}</div>
                    <div className="table-cell cell-status">{item.status || 'N/A'}</div>
                    <div className="table-cell cell-phone">{item.phone || 'N/A'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

