// PocketBase connection settings, shared by every function in api/.
// There is no default address and no plain http: a function that needs
// PocketBase answers 503 until the Vercel project has the settings.
//   PB_URL      https address of PocketBase
//   PB_API_KEY  secret for writes; PocketBase's create rule on `leads` checks it
//               (docs/leads-backend.md). Set in Vercel, never in the repository.

/** https address for reading public data (tours), or null when not configured. */
export function pocketbaseUrl(env = process.env) {
  const url = String(env.PB_URL || '').trim().replace(/\/+$/, '')
  return url.startsWith('https://') ? url : null
}

/** Address and key for writes (leads), or null when either is missing. */
export function pocketbaseWriteConfig(env = process.env) {
  const url = pocketbaseUrl(env)
  const key = env.PB_API_KEY
  return url && key ? { url, key } : null
}
