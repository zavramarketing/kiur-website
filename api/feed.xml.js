const SITE = 'https://kiurtours.eu'

const posts = [
  {
    slug: 'what-to-pack',
    title: 'Что взять в треккинг: полный чек-лист экипировки для гор',
    date: '2026-05-12',
    excerpt: 'Сборы в первый (или даже в десятый) пеший поход — это всегда вечная дилемма между «вдруг пригодится» и «мне же тащить это на себе». Мы собрали честный, проверенный практикой чек-лист снаряжения.',
    image: '/blog/what-to-pack.jpg',
  },
  {
    slug: 'dolomites-guide',
    title: 'Доломитовые Альпы: полный гайд для первого путешествия',
    date: '2026-04-28',
    excerpt: 'Доломитовые Альпы — это ожившая открытка и одно из самых фотогеничных мест в Европе. Практический гид для первого путешествия: от логистики до лучших маршрутов.',
    image: '/blog/dolomites-guide.jpg',
  },
  {
    slug: 'trekking-for-beginners',
    title: 'Треккинг для начинающих: как пойти в первый поход и получить удовольствие',
    date: '2026-04-15',
    excerpt: 'Треккинг — это не спорт для суперлюдей, а просто ходьба по красивым местам. Рассказываем, как выбрать первый маршрут, что надеть и как подготовиться к первому походу.',
    image: '/blog/trekking-for-beginners.jpg',
  },
  {
    slug: 'norway-fjords',
    title: 'Треккинг в Норвегии: Гайд по фьордам и культовым маршрутам',
    date: '2026-04-02',
    excerpt: 'Норвегия — это место, где природа ошеломляет своим масштабом. Гайд по 4 культовым маршрутам Норвегии: Preikestolen, Kjerag, Trolltunga и Besseggen.',
    image: '/blog/norway-fjords.jpg',
  },
  {
    slug: 'group-vs-solo',
    title: 'Групповой тур или самостоятельный треккинг в Европе: Честный разбор полетов',
    date: '2026-03-18',
    excerpt: 'Честный разбор плюсов и минусов группового тура и самостоятельного треккинга в Альпах, Доломитах и на Корсике. Поможем выбрать формат под ваш опыт и бюджет.',
    image: '/blog/group-vs-solo.jpg',
  },
  {
    slug: 'mountain-food',
    title: 'Что едят в горах: Полный гайд по питанию и воде на треккинге',
    date: '2026-03-05',
    excerpt: 'Питание и гидратация — ключ к успешному треккингу. Разбираем, что и когда есть на маршруте, как пить воду из горных источников и что заказать в горных хижинах Европы.',
    image: '/blog/mountain-food.jpg',
  },
]

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default function handler(req, res) {
  const items = posts
    .map((p) => {
      const pubDate = new Date(p.date).toUTCString()
      return [
        '    <item>',
        `      <title>${escapeXml(p.title)}</title>`,
        `      <link>${SITE}/blog/${p.slug}</link>`,
        `      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>`,
        `      <description>${escapeXml(p.excerpt)}</description>`,
        `      <pubDate>${pubDate}</pubDate>`,
        p.image ? `      <enclosure url="${SITE}${p.image}" type="image/jpeg" length="0" />` : '',
        '    </item>',
      ].filter(Boolean).join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>KIUR — Блог о треккинге</title>`,
    `    <link>${SITE}/blog</link>`,
    `    <description>Советы, гайды и маршруты для пеших путешествий по Европе</description>`,
    `    <language>ru</language>`,
    `    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n')

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).send(xml)
}
