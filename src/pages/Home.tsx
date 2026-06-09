import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TourCard from '../components/TourCard';

const upcomingTours = [
  {
    slug: 'dolomites-june-2026',
    name: 'Доломитовые Альпы',
    dates: '15–22 июня 2026',
    price: '€1 290',
    difficulty: 'Средняя',
  },
  {
    slug: 'norway-july-2026',
    name: 'Треккинг в Норвегии',
    dates: '5–12 июля 2026',
    price: '€1 490',
    difficulty: 'Высокая',
  },
  {
    slug: 'pyrenees-august-2026',
    name: 'Пиренеи: Франция — Испания',
    dates: '20–28 августа 2026',
    price: '€1 190',
    difficulty: 'Средняя',
  },
];

const steps = [
  {
    icon: '/icons/icon-compass.png',
    title: 'Выбираете маршрут',
    desc: 'Посмотрите наши туры по пейзажным местам Европы и найдите то, что вам ближе всего по настроению и уровню нагрузки.',
  },
  {
    icon: '/icons/icon-calendar.png',
    title: 'Бронируете место',
    desc: 'Оставьте заявку на сайте. Мы свяжемся с вами, ответим на вопросы и поможем оформить бронирование.',
  },
  {
    icon: '/icons/icon-peaks.png',
    title: 'Приезжаете и отдыхаете',
    desc: 'Мы берем на себя проживание, маршруты и сопровождение. Вы просто наслаждаетесь путешествием.',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-background py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6">
              Пешие путешествия по самым красивым местам Европы
            </h1>
            <p className="text-lg md:text-xl text-background/80 mb-10 max-w-xl">
              Собираем русскоязычные группы, берём на себя всю логистику и показываем природу, от которой захватывает дух.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 bg-background text-primary px-7 py-3 rounded-full font-medium hover:bg-white transition-colors"
              >
                Смотреть туры
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contacts"
                className="inline-flex items-center gap-2 border border-background/40 text-background px-7 py-3 rounded-full font-medium hover:bg-background/10 transition-colors"
              >
                О проекте
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-background pt-10 pb-0 md:pt-14 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <div className="pb-12 md:pb-16 self-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-6">
                О KIUR
              </h2>
              <div className="space-y-4 text-primary/80 leading-relaxed">
                <p>
                  Мы создаем трекинг-туры для тех, кто хочет увидеть Европу с нового ракурса. Наши маршруты проходят через самые живописные природные локации: от космических пейзажей Норвегии и Доломитовых Альп до цветущих долин и уютных троп Пиренеев.
                </p>
                <p>
                  Мы полностью берём на себя организацию: подбираем комфортное жилье, находим опытных гидов и продумываем логистику. Вам не нужно беспокоиться о деталях — вы просто идёте, дышите свежим воздухом и наслаждаетесь моментом в хорошей компании.
                </p>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <img
                src="/mascot/kiur-hiking.png"
                alt="KIUR mascot"
                className="w-[520px] max-w-full object-contain mb-[-60px] relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tours */}
      <section className="bg-background pt-24 pb-16 md:pt-28 md:pb-24 border-t border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary">
              Ближайшие туры
            </h2>
            <Link
              to="/tours"
              className="hidden md:inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:underline"
            >
              Все туры
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTours.map((tour) => (
              <TourCard key={tour.slug} {...tour} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/tours"
              className="inline-block text-primary font-medium text-sm hover:underline"
            >
              Все туры →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-primary text-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-14">
            Как всё устроено
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-5 bg-background/10 rounded-full flex items-center justify-center">
                  <img src={step.icon} alt="" className="w-12 h-12 object-contain" />
                </div>
                <div className="text-accent font-heading font-bold text-sm mb-2">
                  Шаг {i + 1}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-background/70 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background pt-8 pb-16 md:pt-10 md:pb-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="relative max-w-[380px] w-full mb-6">
              <img
                src="/mascot/kiur-horizon.png"
                alt="KIUR horizon"
                className="w-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F0E8] to-transparent" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-6">
              Остались вопросы?
            </h2>
            <p className="text-primary/60 mb-8 max-w-md mx-auto">
              Напишите нам в Telegram. Мы на связи, чтобы быстро подсказать детали по снаряжению, сложности или помочь выбрать подходящий тур.
            </p>
            <a
              href="https://t.me/kiur_tours"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-background px-7 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
