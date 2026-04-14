export function tlv(tag, value) {
  const clean = String(value)
  const len = String([...clean].length).padStart(2, '0')
  return `${tag}${len}${clean}`
}

export function crc16(str) {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= (str.charCodeAt(i) & 0xff) << 8
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

export function buildEMVCoUPI({ upiId, name, amount, city = 'Kolkata' }) {
  const vpa = upiId.trim().toLowerCase()

  const merchantInfo =
    tlv('00', 'A000000677010111') +
    tlv('01', vpa) +
    tlv('02', 'UPI')  

  let payload = ''
  payload += tlv('00', '01')
  payload += tlv('01', '12')
  payload += tlv('26', merchantInfo)
  payload += tlv('52', '0000')
  payload += tlv('53', '356')

  const numAmount = parseFloat(amount)
  if (!isNaN(numAmount) && numAmount > 0) {
    payload += tlv('54', numAmount.toFixed(2))
  }

  payload += tlv('58', 'IN')
  payload += tlv('59', (name || 'NA').trim().slice(0, 25))
  payload += tlv('60', (city || 'Kolkata').trim().slice(0, 15))

  payload += '6304'
  payload += crc16(payload)

  return payload
}

/**
 * Validate UPI ID format (name@handle)
 */
export function isValidUPI(id) {
  return /^[\w.\-]+@[\w]+$/.test((id || '').trim())
}

/**
 * Validate amount — optional field, 0 to 1 crore
 */
export function isValidAmount(amount) {
  if (!amount) return true
  const n = Number(amount)
  return !isNaN(n) && n >= 0 && n < 1_00_00_000
}

/**
 * Build a Simple UPI deep-link string.
 *
 * IMPORTANT: Do NOT use URLSearchParams — it encodes spaces as '+'
 * which breaks PhonePe, GPay, and BHIM. Must use encodeURIComponent()
 * which produces '%20' per the UPI deep-link spec (RFC 3986).
 *
 * Parameter order follows NPCI UPI Linking Specification v1.6:
 *   pa → pn → am → cu → tn
 */
export function buildSimpleUPI({ upiId, name, amount, note }) {
  // pa: VPA — encodeURIComponent safely encodes special chars
  let uri = `upi://pay?pa=${upiId.trim()}`

  // pn: Payee Name — spaces MUST be %20, never +
  if (name && name.trim()) {
    uri += `&pn=${encodeURIComponent(name.trim())}`
  }

  // am: Amount — only include when positive, always 2 decimal places
  const numAmount = parseFloat(amount)
  if (!isNaN(numAmount) && numAmount > 0) {
    uri += `&am=${numAmount.toFixed(2)}`
  }

  // cu: Currency — always INR, no encoding needed
  uri += `&cu=INR`

  // tn: Transaction Note
  if (note && note.trim()) {
    uri += `&tn=${encodeURIComponent(note.trim())}`
  }

  return uri
}