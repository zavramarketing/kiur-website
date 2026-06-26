const SITE = 'https://kiurtours.eu'
const KEY = '56843e721d764beabccacee992eb1fc5'
const PB_URL = process.env.PB_URL || 'http://204.168.190.225/pb'

const STATIC_URLS = [
  `${SITE}/`,
  `${SITE}/tours`,
  `${SITE}/blog`,
  `${SITE}/blog/what-to-pack`,
  `${SITE}/blog/dolomites-guide`,
  `${SITE}/blog/trekking-for-beginners`,
  `${SITE}/blog/norway-fjords`,
  `${SITE}/blog/group-vs-solo`,
  `${SITE}/blog/mountain-food`,
  `${SITE}/contacts`,
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    let tourUrls = []
    try {
      const filter = encodeURIComponent('published=true')
      const response = await fetch(
        `${PB_URL}/api/collections/tours/records?filter=${filter}&perPage=200&fields=slug`,
        { signal: controller.signal }
      )
      const data = response.ok ? await response.json() : {}
      tourUrls = (data.items || []).map((t) => `${SITE}/tours/${t.slug}`)
    } catch {
      tourUrls = []
    } finally {
      clearTimeout(timeout)
    }

    const urlList = [...STATIC_URLS, ...tourUrls]

    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'kiurtours.eu',
        key: KEY,
        keyLocation: `${SITE}/${KEY}.txt`,
        urlList,
      }),
    })

    res.status(200).json({ submitted: urlList.length, status: response.status })
  } catch (err) {
    console.error('IndexNow error:', err)
    res.status(500).json({ error: 'Failed to submit URLs' })
  }
}
