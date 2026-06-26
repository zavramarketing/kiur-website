const PB_URL = process.env.PB_URL || 'http://204.168.190.225/pb'

const SITE = 'https://kiurtours.eu'

const STATIC_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/tours', priority: '0.9', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.7', changefreq: 'weekly' },
  { loc: '/blog/what-to-pack', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/dolomites-guide', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/trekking-for-beginners', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/norway-fjords', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/group-vs-solo', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/mountain-food', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contacts', priority: '0.6', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
]

export default async function handler(req, res) {
  try {
    const filter = encodeURIComponent('published=true')
    const url = `${PB_URL}/api/collections/tours/records?filter=${filter}&perPage=200&fields=slug,updated`

    const response = await fetch(url)
    const data = response.ok ? await response.json() : { items: [] }
    const tours = data.items || []

    const staticUrls = STATIC_PAGES.map(
      ({ loc, priority, changefreq }) =>
        `  <url>\n    <loc>${SITE}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    ).join('\n')

    const tourUrls = tours
      .map((t) => {
        const lastmod = t.updated ? t.updated.split(' ')[0] : ''
        return (
          `  <url>\n    <loc>${SITE}/tours/${t.slug}</loc>` +
          (lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '') +
          `\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
        )
      })
      .join('\n')

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      staticUrls,
      tourUrls,
      '</urlset>',
    ].join('\n')

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).send(xml)
  } catch (err) {
    console.error('Sitemap error:', err)
    res.status(500).send('<?xml version="1.0"?><error/>')
  }
}
