const PB_URL = process.env.PB_URL || 'http://204.168.190.225/pb'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const limit = req.query.limit || 200
    const filter = encodeURIComponent('published=true')
    const url = `${PB_URL}/api/collections/tours/records?filter=${filter}&sort=created&perPage=${limit}`

    const response = await fetch(url)
    if (!response.ok) throw new Error(`PocketBase ${response.status}`)

    const data = await response.json()

    const tours = (data.items || []).map((t) => ({
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
    }))

    res.status(200).json(tours)
  } catch (err) {
    console.error('Tours API error:', err)
    res.status(500).json({ error: 'Не удалось загрузить туры' })
  }
}
