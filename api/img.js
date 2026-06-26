import sharp from 'sharp'

const ALLOWED_HOST = 'admin.kiurtours.eu'

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).end()

  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return res.status(400).end()
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return res.status(403).end()
  }

  try {
    const upstream = await fetch(url)
    if (!upstream.ok) return res.status(upstream.status).end()

    const buffer = Buffer.from(await upstream.arrayBuffer())

    const webp = await sharp(buffer)
      .resize(900, null, { withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()

    res.setHeader('Content-Type', 'image/webp')
    res.setHeader('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400')
    res.status(200).send(webp)
  } catch (err) {
    console.error('img proxy error:', err)
    // fall back to redirect so the image still loads
    res.setHeader('Location', url)
    res.status(302).end()
  }
}
