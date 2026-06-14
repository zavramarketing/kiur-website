const PB_URL = process.env.PB_URL || 'http://204.168.190.225/pb'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { slug } = req.query

  if (!slug) {
    return res.status(400).json({ error: 'slug required' })
  }

  try {
    const filter = encodeURIComponent(`published=true&&slug="${slug}"`)
    const url = `${PB_URL}/api/collections/tours/records?filter=${filter}&perPage=1`

    const response = await fetch(url)
    if (!response.ok) throw new Error(`PocketBase ${response.status}`)

    const data = await response.json()
    const t = (data.items || [])[0]

    if (!t) {
      return res.status(404).json({ error: 'Тур не найден' })
    }

    res.status(200).json({
      id: t.id,
      slug: t.slug,
      name: t.name,
      dates: t.dates,
      price: t.price,
      difficulty: t.difficulty,
      difficulty_level: t.difficulty_level,
      image: t.image_url || '',
      duration: t.duration,
      group_size: t.group_size,
      accommodation: t.accommodation,
      season: t.season,
      region: t.region,
      program: t.program || [],
      included: t.included || [],
      not_included: t.not_included || [],
    })
  } catch (err) {
    console.error('Tour detail API error:', err)
    res.status(500).json({ error: 'Не удалось загрузить тур' })
  }
}
