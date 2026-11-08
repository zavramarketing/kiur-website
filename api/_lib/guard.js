import { clientIp, originAllowed, parseAllowedOrigins } from './leads.js'

/**
 * Checks every browser POST to a function that writes to PocketBase: method,
 * origin, content type, size, rate. Returns null when the request may go on,
 * otherwise { status, body, headers? }.
 */
export function checkPostRequest(req, allow) {
  if (req.method !== 'POST') return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'POST' } }
  if (!originAllowed({ origin: req.headers.origin, host: req.headers.host, allowed: parseAllowedOrigins(process.env.ALLOWED_ORIGINS) })) {
    return { status: 403, body: { error: 'Forbidden' } }
  }
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    return { status: 415, body: { error: 'Unsupported content type' } }
  }
  if (Number(req.headers['content-length'] || 0) > 20_000) return { status: 413, body: { error: 'Payload too large' } }
  if (!allow(clientIp(req.headers))) return { status: 429, body: { error: 'Too many requests' }, headers: { 'Retry-After': '60' } }
  return null
}
