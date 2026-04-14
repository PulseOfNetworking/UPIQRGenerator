const STORAGE_KEY = 'upi_qr_history'
const MAX_ITEMS = 5

/**
 * Load QR history from localStorage
 * @returns {Array} array of history objects
 */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Save a new QR entry to history (keeps last MAX_ITEMS)
 * @param {Object} entry  { id, type, payload, upiId, name, amount, note, createdAt }
 */
export function saveToHistory(entry) {
  try {
    const history = loadHistory()
    const updated = [entry, ...history.filter(h => h.id !== entry.id)].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return []
  }
}

/**
 * Clear all history
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

/**
 * Generate a simple uid
 */
export function genId() {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Format a timestamp for display
 */
export function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
