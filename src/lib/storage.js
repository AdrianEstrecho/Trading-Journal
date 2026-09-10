const STORAGE_KEY = 'trading-journal:v1'
const SYNC_CODE_KEY = 'trading-journal:sync-code'

export function getSyncCode() {
  try {
    return window.localStorage.getItem(SYNC_CODE_KEY)
  } catch {
    return null
  }
}

export function setSyncCode(code) {
  try {
    if (code) window.localStorage.setItem(SYNC_CODE_KEY, code)
    else window.localStorage.removeItem(SYNC_CODE_KEY)
  } catch {
    // Storage full or unavailable — sync code just won't persist across reloads.
  }
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable — fail silently, in-memory state still works.
  }
}
