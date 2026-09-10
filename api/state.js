import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

const MAX_PAYLOAD_BYTES = 4_000_000

let schemaReady = null
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS journal_state (
        sync_code text PRIMARY KEY,
        data jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `
  }
  return schemaReady
}

function isValidCode(code) {
  return typeof code === 'string' && /^[A-Za-z0-9-]{4,64}$/.test(code)
}

export default async function handler(req, res) {
  await ensureSchema()

  if (req.method === 'GET') {
    const { code } = req.query
    if (!isValidCode(code)) return res.status(400).json({ error: 'invalid_code' })

    const rows = await sql`SELECT data, updated_at FROM journal_state WHERE sync_code = ${code}`
    if (rows.length === 0) return res.status(404).json({ error: 'not_found' })
    return res.status(200).json({ data: rows[0].data, updatedAt: rows[0].updated_at })
  }

  if (req.method === 'PUT') {
    const { code, data } = req.body ?? {}
    if (!isValidCode(code)) return res.status(400).json({ error: 'invalid_code' })
    if (typeof data !== 'object' || data === null) return res.status(400).json({ error: 'invalid_data' })

    const serialized = JSON.stringify(data)
    if (serialized.length > MAX_PAYLOAD_BYTES) return res.status(413).json({ error: 'payload_too_large' })

    const rows = await sql`
      INSERT INTO journal_state (sync_code, data, updated_at)
      VALUES (${code}, ${serialized}::jsonb, now())
      ON CONFLICT (sync_code) DO UPDATE SET data = ${serialized}::jsonb, updated_at = now()
      RETURNING updated_at
    `
    return res.status(200).json({ updatedAt: rows[0].updated_at })
  }

  res.setHeader('Allow', 'GET, PUT')
  return res.status(405).json({ error: 'method_not_allowed' })
}
