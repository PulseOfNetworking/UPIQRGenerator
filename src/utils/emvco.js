/**
 * EMVCo QR Code Payload Builder for UPI
 * Implements TLV encoding + CRC16-CCITT checksum
 */

/**
 * TLV encoder — Tag Length Value
 * @param {string} tag  2-char tag id
 * @param {string} value  string value
 * @returns {string} encoded TLV segment
 */
export function tlv(tag, value) {
  const len = String(value.length).padStart(2, '0')
  return `${tag}${len}${value}`
}

/**
 * CRC16-CCITT (XModem variant, poly 0x1021, init 0xFFFF)
 * Used by EMVCo QR spec for Tag 63
 * @param {string} str  payload string up to and including "6304"
 * @returns {string}  4-char uppercase hex checksum
 */
export function crc16(str) {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/**
 * Build a Simple UPI deep-link string
 */
export function buildSimpleUPI({ upiId, name, amount, note }) {
  const params = new URLSearchParams()
  params.set('pa', upiId)
  if (name) params.set('pn', name)
  if (amount) params.set('am', amount)
  params.set('cu', 'INR')
  if (note) params.set('tn', note)
  return `upi://pay?${params.toString()}`
}

/**
 * Build an EMVCo-compliant UPI QR payload
 * Spec: NPCI UPI Linking Specs v1.6 / EMVCo QR v1.1
 */
export function buildEMVCoUPI({ upiId, name, amount, city = 'Kolkata' }) {
  // Tag 26 — Merchant Account Info (UPI)
  const merchantInfo =
    tlv('00', 'A000000677010111') + // GUID for UPI
    tlv('01', upiId)               // UPI VPA

  let payload = ''
  payload += tlv('00', '01')           // Payload Format Indicator
  payload += tlv('01', '12')           // Point of Initiation: 11=static, 12=dynamic
  payload += tlv('26', merchantInfo)   // Merchant Account Info — UPI
  payload += tlv('52', '0000')         // Merchant Category Code
  payload += tlv('53', '356')          // Transaction Currency (INR = 356)
  if (amount && Number(amount) > 0) {
    payload += tlv('54', String(Number(amount).toFixed(2)))
  }
  payload += tlv('58', 'IN')           // Country Code
  payload += tlv('59', (name || 'NA').slice(0, 25)) // Merchant Name (max 25)
  payload += tlv('60', (city || 'Kolkata').slice(0, 15)) // Merchant City (max 15)
  payload += '6304'                    // CRC tag + 2-byte length, value appended after

  const checksum = crc16(payload)
  payload += checksum

  return payload
}

/**
 * Validate UPI ID format
 */
export function isValidUPI(id) {
  return /^[\w.\-]+@[\w]+$/.test(id.trim())
}

/**
 * Validate amount
 */
export function isValidAmount(amount) {
  if (!amount) return true // optional
  const n = Number(amount)
  return !isNaN(n) && n >= 0 && n < 1_00_00_000 // ≤ 1 crore
}
