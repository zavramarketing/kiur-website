const PB_URL = process.env.PB_URL || 'http://204.168.190.225/pb'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const response = await fetch(`${PB_URL}/api/collections/leads/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Предложение маршрута',
        email: 'marketing@zavra.eu',
        notes: [
          req.body.destination,
          req.body.source_tour ? `(тур: ${req.body.source_tour})` : null,
        ].filter(Boolean).join(' '),
      }),
    })
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json(data)
    res.status(200).json(data)
  } catch (err) {
    console.error('Suggestions API error:', err)
    res.status(500).json({ error: 'Не удалось отправить предложение' })
  }
}
