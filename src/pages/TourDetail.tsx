import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, Check, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface TourData {
  name: string;
  dates: string;
  price: string;
  difficulty: string;
  image: string;
  duration: string;
  group_size: string;
  accommodation: string;
  season: string;
  program: { day: number; title: string; desc: string }[];
  included: string[];
  not_included: string[];
}

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [openDays, setOpenDays] = useState<number[]>([]);
  const [tour, setTour] = useState<TourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/tours/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data && !data.error) setTour(data);
        else if (data?.error) setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-primary/40 text-lg font-medium">Загружаем тур...</p>
      </div>
    );
  }

  if (notFound || !tour) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-primary/40 text-lg font-medium">Тур не найден</p>
      </div>
    );
  }

  const toggleDay = (day: number) => {
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const infoItems = [
    { icon: '/icons/icon-clock.png', label: 'Длительность', value: tour.duration },
    { icon: '/icons/icon-group.png', label: 'Группа', value: tour.group_size },
    { icon: '/icons/icon-mountain.png', label: 'Сложность', value: tour.difficulty },
    { icon: '/icons/icon-bed.png', label: 'Жильё', value: tour.accommodation },
    { icon: '/icons/icon-calendar.png', label: 'Сезон', value: tour.season },
  ];

  return (
    <div className="bg-background pb-24 md:pb-0">
      <Helmet>
        <title>{tour.name} — KIUR</title>
        <meta name="description" content={`${tour.name}, ${tour.dates}. ${tour.duration}, группа ${tour.group_size}. Стоимость ${tour.price}. Треккинг-тур с KIUR.`} />
        <meta property="og:title" content={`${tour.name} — KIUR`} />
        <meta property="og:description" content={`${tour.name}, ${tour.dates}. ${tour.duration}. Стоимость ${tour.price}.`} />
        <meta property="og:url" content={`https://kiurtours.eu/tours/${slug}`} />
        <link rel="canonical" href={`https://kiurtours.eu/tours/${slug}`} />
      </Helmet>
      {/* Hero */}
      <div className="relative h-72 md:h-[28rem] bg-accent/30 flex items-end">
        {tour.image ? (
          <img src={tour.image} alt={tour.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <span className="text-primary/30 text-sm font-medium">Изображение тура</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 md:pb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-primary text-background text-xs font-medium px-3 py-1 rounded-full">
              {tour.dates}
            </span>
            <span className="bg-accent text-primary text-xs font-medium px-3 py-1 rounded-full">
              {tour.price}
            </span>
          </div>
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-background">
            {tour.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Info row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-10 md:mb-14">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="bg-background border border-primary/10 rounded-card p-4 text-center"
            >
              <img src={item.icon} alt={item.label} className="w-12 h-12 object-contain mx-auto mb-2" />
              <div className="text-xs text-primary/50 mb-0.5">{item.label}</div>
              <div className="text-sm font-medium text-primary">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Program accordion */}
        <div className="mb-10 md:mb-14">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-primary mb-6">
            Программа тура
          </h2>
          <div className="space-y-3">
            {tour.program.map((day) => {
              const isOpen = openDays.includes(day.day);
              return (
                <div
                  key={day.day}
                  className="border border-primary/10 rounded-card overflow-hidden bg-background"
                >
                  <button
                    onClick={() => toggleDay(day.day)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-primary text-background text-xs font-bold px-2.5 py-1 rounded-full">
                        День {day.day}
                      </span>
                      <span className="font-medium text-primary text-sm md:text-base">
                        {day.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-primary/50 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-primary/70 text-sm leading-relaxed">
                      {day.desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Included / Not included */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="bg-background border border-primary/10 rounded-card p-6">
            <h3 className="font-heading font-bold text-primary mb-4">Включено в стоимость</h3>
            <ul className="space-y-3">
              {tour.included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-primary/80">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background border border-primary/10 rounded-card p-6">
            <h3 className="font-heading font-bold text-primary mb-4">Не включено</h3>
            <ul className="space-y-3">
              {tour.not_included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-primary/80">
                  <X className="w-4 h-4 text-primary/40 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/10 px-4 py-3 flex items-center justify-between md:hidden z-40">
        <div>
          <div className="text-xs text-primary/50">Стоимость</div>
          <div className="font-heading font-bold text-primary text-lg">{tour.price}</div>
        </div>
        <a
          href="https://t.me/kiur_tours"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-background px-6 py-2.5 rounded-full text-sm font-medium"
        >
          Забронировать
        </a>
      </div>
    </div>
  );
}
