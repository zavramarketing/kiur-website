import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const articles = [
  {
    slug: 'what-to-pack',
    title: 'Что взять в треккинг: полный чек-лист экипировки для гор',
    date: '12 мая 2026',
    image: '/blog/what-to-pack.jpg',
    excerpt:
      'Чем легче рюкзак, тем больше удовольствия от видов. Проверенный сотнями километров пути чек-лист: от треккинговых ботинок до аптечки.',
  },
  {
    slug: 'dolomites-guide',
    title: 'Доломитовые Альпы: полный гайд для первого путешествия',
    date: '28 апреля 2026',
    image: '/blog/dolomites-guide.jpg',
    excerpt:
      'Всё, что нужно знать о Доломитовых Альпах: лучшие маршруты, сезоны, где жить и что есть.',
  },
  {
    slug: 'trekking-for-beginners',
    title: 'Треккинг для начинающих: как пойти в первый поход и получить удовольствие',
    date: '15 апреля 2026',
    image: undefined,
    excerpt:
      'Никогда не ходил в походы? Рассказываем, как подготовиться к первому треккингу, что купить и как тренироваться.',
  },
  {
    slug: 'norway-fjords',
    title: 'Норвежские фьорды: маршруты и советы',
    date: '2 апреля 2026',
    image: undefined,
    excerpt:
      'Как организовать треккинг в Норвегии самостоятельно и с гидом. Лучшие точки для фото и отдыха.',
  },
  {
    slug: 'group-vs-solo',
    title: 'Групповой тур или самостоятельно?',
    date: '18 марта 2026',
    image: undefined,
    excerpt:
      'Разбираем плюсы и минусы групповых треккинг-туров и самостоятельных походов. Что выбрать именно тебе.',
  },
  {
    slug: 'mountain-food',
    title: 'Что едят в горах: питание на треккинге',
    date: '5 марта 2026',
    image: undefined,
    excerpt:
      'Как питаться правильно в походе: калории, гидратация, простые рецепты для горных хижин.',
  },
];

export default function Blog() {
  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] py-12 md:py-20">
      <Helmet>
        <title>Блог о треккинге — KIUR</title>
        <meta name="description" content="Статьи о треккинге в Европе: советы по снаряжению, гиды по маршрутам, питание в горах и многое другое." />
        <meta property="og:title" content="Блог о треккинге — KIUR" />
        <meta property="og:description" content="Статьи о треккинге в Европе: советы по снаряжению, гиды по маршрутам, питание в горах." />
        <meta property="og:url" content="https://kiurtours.eu/blog" />
        <link rel="canonical" href="https://kiurtours.eu/blog" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-10">
          Блог
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="bg-background border border-primary/10 rounded-card overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="h-48 bg-accent/30 overflow-hidden">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-primary/30 text-sm font-medium">Изображение статьи</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-primary/40 text-xs mb-2">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{article.date}</span>
                </div>
                <h3 className="font-heading font-semibold text-primary text-base mb-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-primary/60 text-sm leading-relaxed flex-1">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
