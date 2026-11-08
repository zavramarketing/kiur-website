// `npm test` — the lead form backend: what is accepted, what is dropped,
// who may post, spam and rate limits, and that the handler never forwards
// the backend's answer. No network: fetch is replaced.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { clientIp, createRateLimiter, originAllowed, parseAllowedOrigins, validateLead } from '../api/_lib/leads.js'

const contact = { name: 'Anna', email: 'anna@example.com', message: 'Hello' }
const booking = { tour: 'dolomites', name: 'Anna', email: 'anna@example.com', phone: '+372 5555', country: 'EE', experience: 'some', fitness: 'good', travel_group: 'friends', notes: '', status: 'new' }

test('contact and booking payloads of the existing forms are accepted', () => {
  assert.deepEqual(validateLead(contact), { ok: true, record: contact, spam: false })
  const r = validateLead(booking)
  assert.equal(r.ok, true)
  assert.equal(r.record.tour, 'dolomites')
  assert.equal(r.record.notes, undefined)
})

test('unknown fields are dropped and the status is always set by the server', () => {
  const r = validateLead({ ...booking, status: 'paid', admin: true, id: 'x', created: 'y' })
  assert.equal(r.ok, true)
  assert.deepEqual(Object.keys(r.record).sort(), ['country', 'email', 'experience', 'fitness', 'name', 'phone', 'status', 'tour', 'travel_group'])
  assert.equal(r.record.status, 'new')
  assert.equal(validateLead({ ...contact, status: 'paid' }).record.status, undefined)
})

test('missing or malformed required fields are rejected', () => {
  for (const [body, error] of [
    [null, 'invalid_body'],
    [[], 'invalid_body'],
    [{ ...contact, name: ' ' }, 'name_required'],
    [{ ...contact, name: 'A' }, 'name_required'],
    [{ ...contact, email: 'nope' }, 'email_invalid'],
    [{ ...contact, email: undefined }, 'email_invalid'],
    [{ name: 'Anna', email: 'a@b.co' }, 'message_required'],
    [{ ...contact, name: 123 }, 'invalid_name'],
    [{ ...contact, message: 'x'.repeat(5001) }, 'too_long_message'],
    [{ ...contact, email: `${'a'.repeat(250)}@b.co` }, 'too_long_email'],
  ]) {
    assert.deepEqual(validateLead(body), { ok: false, error })
  }
})

test('values are trimmed', () => {
  assert.equal(validateLead({ ...contact, name: '  Anna  ' }).record.name, 'Anna')
})

test('the honeypot marks a lead as spam, a blank one does not', () => {
  assert.equal(validateLead({ ...contact, company_website: 'http://spam.example' }).spam, true)
  assert.equal(validateLead({ ...contact, company_website: '' }).spam, false)
  assert.equal(validateLead({ ...contact, company_website: '  ' }).spam, false)
})

test('origin: same host, localhost and listed origins pass; missing or foreign ones do not', () => {
  const allowed = parseAllowedOrigins(undefined)
  assert.deepEqual(allowed, ['https://kiurtours.eu', 'https://www.kiurtours.eu'])
  const ok = (origin, host = 'kiur-site.vercel.app') => originAllowed({ origin, host, allowed })
  assert.equal(ok('https://kiurtours.eu'), true)
  assert.equal(ok('https://www.kiurtours.eu'), true)
  assert.equal(ok('https://kiur-site.vercel.app'), true)
  assert.equal(ok('http://localhost:5173'), true)
  assert.equal(ok(undefined), false)
  assert.equal(ok('https://evil.example'), false)
  assert.equal(ok('null'), false)
  assert.equal(ok('https://kiurtours.eu.evil.example'), false)
})

test('rate limiter: limit per key and window, other keys unaffected', () => {
  let t = 0
  const allow = createRateLimiter({ limit: 3, windowMs: 1000, now: () => t })
  assert.deepEqual([allow('a'), allow('a'), allow('a'), allow('a')], [true, true, true, false])
  assert.equal(allow('b'), true)
  t = 1001
  assert.equal(allow('a'), true)
})

test('client ip comes from the first forwarded address', () => {
  assert.equal(clientIp({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }), '1.2.3.4')
  assert.equal(clientIp({ 'x-real-ip': '9.9.9.9' }), '9.9.9.9')
  assert.equal(clientIp({}), 'unknown')
})

// ------------------------------------------------------------ handler
const { default: handler } = await import('../api/leads.js')

function call({ method = 'POST', headers = {}, body = contact, backend } = {}) {
  const sent = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    sent.push({ url, body: JSON.parse(init.body) })
    return backend ? backend() : new Response(JSON.stringify({ id: 'secret-internal-id' }), { status: 200 })
  }
  const res = { headers: {}, statusCode: 0, payload: undefined }
  res.setHeader = (k, v) => { res.headers[k] = v }
  res.status = (c) => { res.statusCode = c; return res }
  res.json = (p) => { res.payload = p; return res }
  const req = {
    method,
    headers: { origin: 'https://kiurtours.eu', host: 'kiurtours.eu', 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 250)}`, ...headers },
    body,
  }
  return handler(req, res).then(() => { globalThis.fetch = originalFetch; return { res, sent } }, (e) => { globalThis.fetch = originalFetch; throw e })
}

test('handler: a valid lead is stored and only { ok: true } goes back', async () => {
  const { res, sent } = await call()
  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.payload, { ok: true })
  assert.equal(sent.length, 1)
  assert.match(sent[0].url, /\/api\/collections\/leads\/records$/)
  assert.deepEqual(sent[0].body, contact)
  assert.equal(res.headers['Access-Control-Allow-Origin'], undefined)
})

test('handler: wrong method, origin, content type and spam are handled without storing', async () => {
  for (const [opts, status] of [
    [{ method: 'GET' }, 405],
    [{ headers: { origin: 'https://evil.example' } }, 403],
    [{ headers: { origin: undefined } }, 403],
    [{ headers: { 'content-type': 'text/plain' } }, 415],
    [{ headers: { 'content-length': '999999' } }, 413],
    [{ body: { ...contact, email: 'bad' } }, 400],
  ]) {
    const { res, sent } = await call(opts)
    assert.equal(res.statusCode, status)
    assert.equal(sent.length, 0)
  }
  const spam = await call({ body: { ...contact, company_website: 'x' } })
  assert.equal(spam.res.statusCode, 200)
  assert.deepEqual(spam.res.payload, { ok: true })
  assert.equal(spam.sent.length, 0)
})

test('handler: the backend answer and errors are never forwarded to the browser', async () => {
  const failing = await call({ backend: () => new Response(JSON.stringify({ message: 'internal stack trace', data: { email: 'x' } }), { status: 400 }) })
  assert.equal(failing.res.statusCode, 502)
  assert.doesNotMatch(JSON.stringify(failing.res.payload), /stack trace|data/)
})

test('handler: the same address is limited', async () => {
  const headers = { 'x-forwarded-for': '203.0.113.7' }
  const codes = []
  for (let i = 0; i < 7; i++) codes.push((await call({ headers })).res.statusCode)
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429, 429])
})
