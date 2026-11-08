// Pure helpers for api/leads.js: input whitelist and validation, origin
// check, spam checks, rate limit. No network, no framework: node:test
// imports this file directly (tests/leads.test.mjs).

// Only these fields reach the leads collection; anything else the browser
// sends is dropped. `status` is never taken from the client.
const FIELDS = {
  name: 120,
  email: 254,
  message: 5000,
  tour: 100,
  phone: 40,
  country: 100,
  experience: 200,
  fitness: 200,
  travel_group: 200,
  notes: 5000,
}

// Hidden field in both forms. People never fill it, simple bots do.
export const HONEYPOT_FIELD = 'company_website'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * @returns {{ ok: true, record: Record<string, string>, spam: boolean } | { ok: false, error: string }}
 */
export function validateLead(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, error: 'invalid_body' }

  const record = {}
  for (const [key, max] of Object.entries(FIELDS)) {
    const value = body[key]
    if (value === undefined || value === null || value === '') continue
    if (typeof value !== 'string') return { ok: false, error: `invalid_${key}` }
    const trimmed = value.trim()
    if (trimmed.length > max) return { ok: false, error: `too_long_${key}` }
    if (trimmed) record[key] = trimmed
  }

  if (!record.name || record.name.length < 2) return { ok: false, error: 'name_required' }
  if (!record.email || !EMAIL.test(record.email)) return { ok: false, error: 'email_invalid' }
  if (record.message === undefined && record.tour === undefined) return { ok: false, error: 'message_required' }

  // A booking request carries a tour; the status is always set here.
  if (record.tour !== undefined) record.status = 'new'

  const honeypot = body[HONEYPOT_FIELD]
  return { ok: true, record, spam: typeof honeypot === 'string' && honeypot.trim() !== '' }
}

/** Same-origin or an explicitly allowed origin. Browsers always send Origin on POST. */
export function originAllowed({ origin, host, allowed }) {
  if (!origin) return false
  let parsed
  try {
    parsed = new URL(origin)
  } catch {
    return false
  }
  if (host && parsed.host === host) return true
  if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return true
  return allowed.includes(parsed.origin)
}

export function parseAllowedOrigins(value) {
  return String(value || 'https://kiurtours.eu,https://www.kiurtours.eu')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

/** Best-effort per-instance limiter (serverless instances do not share memory). */
export function createRateLimiter({ limit = 5, windowMs = 60_000, now = () => Date.now() } = {}) {
  const hits = new Map()
  return function allow(key) {
    const t = now()
    const recent = (hits.get(key) || []).filter((ts) => t - ts < windowMs)
    if (recent.length >= limit) {
      hits.set(key, recent)
      return false
    }
    recent.push(t)
    hits.set(key, recent)
    if (hits.size > 5000) for (const [k, v] of hits) if (v.every((ts) => t - ts >= windowMs)) hits.delete(k)
    return true
  }
}

export function clientIp(headers) {
  const forwarded = String(headers['x-forwarded-for'] || '').split(',')[0].trim()
  return forwarded || String(headers['x-real-ip'] || 'unknown')
}

/** Route suggestion: a destination text and, optionally, the slug of the tour it was made on. */
export function validateSuggestion(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, error: 'invalid_body' }
  const destination = typeof body.destination === 'string' ? body.destination.trim() : ''
  if (destination.length < 2) return { ok: false, error: 'destination_required' }
  if (destination.length > 300) return { ok: false, error: 'too_long_destination' }
  let sourceTour
  if (body.source_tour !== undefined && body.source_tour !== null && body.source_tour !== '') {
    if (typeof body.source_tour !== 'string' || !/^[a-z0-9][a-z0-9-]{0,99}$/i.test(body.source_tour)) return { ok: false, error: 'invalid_source_tour' }
    sourceTour = body.source_tour
  }
  return { ok: true, destination, sourceTour }
}
