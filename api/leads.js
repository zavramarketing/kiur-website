import { checkPostRequest } from './_lib/guard.js'
import { createRateLimiter, validateLead } from './_lib/leads.js'
import { pocketbaseWriteConfig } from './_lib/pocketbase.js'

// Where leads are stored (PocketBase). Both settings are required, there is no
// fallback: without them the function answers 503 and sends nothing.
//   PB_URL      https address of PocketBase (no plain http)
//   PB_API_KEY  secret the PocketBase `leads` create rule checks (docs/leads-backend.md)
// Set them in the Vercel project's environment, never in the repository.

const allow = createRateLimiter({ limit: 5, windowMs: 60_000 })

function reply(res, status, body, headers = {}) {
  res.setHeader('Cache-Control', 'no-store')
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
  return res.status(status).json(body)
}

export default async function handler(req, res) {
  const refused = checkPostRequest(req, allow)
  if (refused) return reply(res, refused.status, refused.body, refused.headers)

  const result = validateLead(req.body)
  if (!result.ok) return reply(res, 400, { error: result.error })

  // Bots that fill the hidden field get the same answer as a real sender and
  // nothing is stored, so they learn nothing.
  if (result.spam) return reply(res, 200, { ok: true })

  const pb = pocketbaseWriteConfig()
  if (!pb) {
    console.error('Leads API: PB_URL must be an https address and PB_API_KEY must be set; lead not sent')
    return reply(res, 503, { error: 'Service unavailable' })
  }

  try {
    const response = await fetch(`${pb.url}/api/collections/leads/records`, {
      method: 'POST',
      // PocketBase refuses a create without this key, so posting to it directly
      // cannot bypass the checks above.
      headers: { 'Content-Type': 'application/json', 'X-Leads-Key': pb.key },
      body: JSON.stringify(result.record),
    })
    if (!response.ok) {
      // The backend's answer can contain internal details: log it, do not forward it.
      console.error('Leads API: backend answered', response.status)
      return reply(res, 502, { error: 'Не удалось отправить заявку' })
    }
    return reply(res, 200, { ok: true })
  } catch (err) {
    console.error('Leads API error:', err)
    return reply(res, 500, { error: 'Не удалось отправить заявку' })
  }
}
