const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // no 0/O/1/I/L

export function generateSyncCode(length = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
  }
  return code
}

async function parseJson(res, label) {
  try {
    return await res.json()
  } catch {
    throw new Error(`${label} failed (bad response — is the /api/state function running?)`)
  }
}

export async function pullState(code) {
  const res = await fetch(`/api/state?code=${encodeURIComponent(code)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Sync pull failed (${res.status})`)
  return parseJson(res, 'Sync pull')
}

export async function pushState(code, data) {
  const res = await fetch('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, data }),
  })
  if (!res.ok) throw new Error(`Sync push failed (${res.status})`)
  return parseJson(res, 'Sync push')
}
