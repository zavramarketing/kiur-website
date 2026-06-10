import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import TourCard from '../components/TourCard';

const months = [
  'Все',
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const allTours = [
  {
    slug: 'dolomites-june-2026',
    name: 'Доломитовые Альпы',
    dates: '15–22 июня 2026',
    price: '€1 290',
    difficulty: 'Средняя',
    image: '/tours/tour-dolomites.png',
  },
  {
    slug: 'norway-july-2026',
    name: 'Треккинг в Норвегии',
    dates: '5–12 июля 2026',
    price: '€1 490',
    difficulty: 'Высокая',
    image: '/tours/tour-norway.png',
  },
  {
    slug: 'pyrenees-august-2026',
    name: 'Пиренеи: Франция — Испания',
    dates: '20–28 августа 2026',
    price: '€1 190',
    difficulty: 'Средняя',
    image: '/tours/tour-pyrenees.png',
  },
  {
    slug: 'alps-september-2026',
    name: 'Швейцарские Альпы',
    dates: '10–17 сентября 2026',
    price: '€1 390',
    difficulty: 'Средняя',
    image: '/tours/tour-alps.png',
  },
  {
    slug: 'corsica-october-2026',
    name: 'Треккинг на Корсике',
    dates: '1–8 октября 2026',
    price: '€1 090',
    difficulty: 'Низкая',
    image: '/tours/tour-corsica.png',
  },
];

export default function Tours() {
  const [activeMonth, setActiveMonth] = useState('Все');

  const filteredTours =
    activeMonth === 'Все'
      ? allTours
      : allTours.filter((t) => t.dates.includes(activeMonth.toLowerCase().slice(0, 3)));

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] py-12 md:py-20">
      <Helmet>
        <title>Все туры — KIUR</title>
        <meta name="description" content="Треккинг-туры по Европе: Доломиты, Норвегия, Пиренеи, Швейцарские Альпы, Корсика. Выберите маршрут и забронируйте место." />
        <meta property="og:title" content="Все туры — KIUR" />
        <meta property="og:description" content="Треккинг-туры по Европе: Доломиты, Норвегия, Пиренеи, Швейцарские Альпы, Корсика." />
        <meta property="og:url" content="https://kiurtours.eu/tours" />
        <link rel="canonical" href="https://kiurtours.eu/tours" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-8">
          Все туры
        </h1>

        {/* Month filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setActiveMonth(month)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeMonth === month
                  ? 'bg-primary text-background'
                  : 'bg-accent/40 text-primary hover:bg-accent/60'
              }`}
            >
              {month}
            </button>
          ))}
        </div>

        {filteredTours.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <TourCard key={tour.slug} {...tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-primary/40 text-lg font-medium">
              Туры скоро появятся
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
