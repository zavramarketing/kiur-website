import { checkPostRequest } from './_lib/guard.js'
import { createRateLimiter, validateSuggestion } from './_lib/leads.js'
import { pocketbaseWriteConfig } from './_lib/pocketbase.js'

const allow = createRateLimiter({ limit: 5, windowMs: 60_000 })

function reply(res, status, body, headers = {}) {
  res.setHeader('Cache-Control', 'no-store')
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
  return res.status(status).json(body)
}

// A route suggestion from the tour page is stored as a lead with a fixed name
// and address (the team's own), so nothing here comes from the visitor except
// the destination text and the tour it was made on.
export default async function handler(req, res) {
  const refused = checkPostRequest(req, allow)
  if (refused) return reply(res, refused.status, refused.body, refused.headers)

  const result = validateSuggestion(req.body)
  if (!result.ok) return reply(res, 400, { error: result.error })

  const pb = pocketbaseWriteConfig()
  if (!pb) {
    console.error('Suggestions API: PB_URL must be an https address and PB_API_KEY must be set; suggestion not sent')
    return reply(res, 503, { error: 'Service unavailable' })
  }

  try {
    const response = await fetch(`${pb.url}/api/collections/leads/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Leads-Key': pb.key },
      body: JSON.stringify({
        name: 'Предложение маршрута',
        email: 'marketing@zavra.eu',
        notes: [result.destination, result.sourceTour ? `(тур: ${result.sourceTour})` : null].filter(Boolean).join(' '),
      }),
    })
    if (!response.ok) {
      console.error('Suggestions API: backend answered', response.status)
      return reply(res, 502, { error: 'Не удалось отправить предложение' })
    }
    return reply(res, 200, { ok: true })
  } catch (err) {
    console.error('Suggestions API error:', err)
    return reply(res, 500, { error: 'Не удалось отправить предложение' })
  }
}
