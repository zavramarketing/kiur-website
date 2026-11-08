import { clientIp, createRateLimiter, originAllowed, parseAllowedOrigins, validateLead } from './_lib/leads.js'

// Where leads are stored (PocketBase). Set PB_URL in the Vercel project.
// The fallback below is the endpoint this site has always used; it is plain
// http, so personal data crosses the network unencrypted between Vercel and
// PocketBase. Put TLS in front of PocketBase, set PB_URL to the https address
// and set REQUIRE_HTTPS_LEADS_BACKEND=true: the function then refuses to send
// leads over http.
const LEGACY_PB_URL = 'http://204.168.190.225/pb'

const allow = createRateLimiter({ limit: 5, windowMs: 60_000 })

function reply(res, status, body) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(status).json(body)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return reply(res, 405, { error: 'Method not allowed' })
  }

  const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS)
  if (!originAllowed({ origin: req.headers.origin, host: req.headers.host, allowed: allowedOrigins })) {
    return reply(res, 403, { error: 'Forbidden' })
  }
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    return reply(res, 415, { error: 'Unsupported content type' })
  }
  if (Number(req.headers['content-length'] || 0) > 20_000) {
    return reply(res, 413, { error: 'Payload too large' })
  }
  if (!allow(clientIp(req.headers))) {
    res.setHeader('Retry-After', '60')
    return reply(res, 429, { error: 'Too many requests' })
  }

  const result = validateLead(req.body)
  if (!result.ok) return reply(res, 400, { error: result.error })

  // Bots that fill the hidden field get the same answer as a real sender and
  // nothing is stored, so they learn nothing.
  if (result.spam) return reply(res, 200, { ok: true })

  const pbUrl = (process.env.PB_URL || LEGACY_PB_URL).replace(/\/+$/, '')
  if (pbUrl.startsWith('http://')) {
    if (process.env.REQUIRE_HTTPS_LEADS_BACKEND === 'true') {
      console.error('Leads API: PB_URL is not https and REQUIRE_HTTPS_LEADS_BACKEND=true, lead not sent')
      return reply(res, 503, { error: 'Service unavailable' })
    }
    console.warn('Leads API: sending a lead over plain http, put TLS in front of PocketBase')
  }

  try {
    const response = await fetch(`${pbUrl}/api/collections/leads/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
