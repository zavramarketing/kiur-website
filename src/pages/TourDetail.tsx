import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronDown,
  Check,
  X,
} from 'lucide-react';

const tourData: Record<
  string,
  {
    name: string;
    dates: string;
    price: string;
    difficulty: string;
    image?: string;
    duration: string;
    groupSize: string;
    accommodation: string;
    season: string;
    program: { day: number; title: string; desc: string }[];
    included: string[];
    notIncluded: string[];
  }
> = {
  'dolomites-june-2026': {
    name: 'Доломитовые Альпы',
    dates: '15–22 июня 2026',
    price: '€1 290',
    difficulty: 'Средняя',
    image: '/tours/tour-dolomites.png',
    duration: '8 дней / 7 ночей',
    groupSize: '8–14 человек',
    accommodation: 'Горные хижины',
    season: 'июнь — сентябрь',
    program: [
      { day: 1, title: 'Прибытие в Кортину-д’Ампеццо', desc: 'Трансфер из аэропорта, размещение, знакомство с группой и гидом. Ужин в традиционном альпийском ресторане.' },
      { day: 2, title: 'Трек к озеру Брайес', desc: 'Переход через лесные тропы к знаменитому озеру Брайес с его бирюзовой водой. Пикник на берегу, возвращение в хижину.' },
      { day: 3, title: 'Восхождение на Тре-Чиме-ди-Л', desc: 'Классический маршрут вокруг трёх вершин. Панорамные виды, исторические укрепления Первой мировой войны.' },
      { day: 4, title: 'Долина Фанес', desc: 'Переход через плато Фанес — одно из красивейших мест Доломитов. Высокогорные луга, известняковые стены.' },
      { day: 5, title: 'Перевал Селла', desc: 'Маршрут через перевал Селла с видами на четыре долины. Спуск в деревню Валь-Гардена.' },
      { day: 6, title: 'Сасс-Пордой', desc: 'Подъём на плато Сасс-Пордой фуникулёром, кольцевая прогулка по «лунному» ландшафту.' },
      { day: 7, title: 'Последний день в горах', desc: 'Лёгкий трек к водопаду, обед в приюте, прощальный ужин с группой.' },
      { day: 8, title: 'Отъезд', desc: 'Трансфер в аэропорт, прощание. Возвращение домой с воспоминаниями на всю жизнь.' },
    ],
    included: [
      'Проживание в горных хижинах',
      'Полный пансион (завтрак, обед, ужин)',
      'Трансферы из/в аэропорт',
      'Услуги профессионального гида',
      'Групповое страхование',
      'Карты маршрутов и GPS-треки',
    ],
    notIncluded: [
      'Авиабилеты до Италии',
      'Личные напитки',
      'Личное страхование',
      'Чаевые гиду (по желанию)',
    ],
  },
  'norway-july-2026': {
    name: 'Треккинг в Норвегии',
    dates: '5–12 июля 2026',
    price: '€1 490',
    difficulty: 'Высокая',
    image: '/tours/tour-norway.png',
    duration: '8 дней / 7 ночей',
    groupSize: '6–10 человек',
    accommodation: 'Палатки и хижины',
    season: 'июнь — август',
    program: [
      { day: 1, title: 'Прилёт в Ставангер', desc: 'Встреча в аэропорту, трансфер в базовый лагерь, инструктаж.' },
      { day: 2, title: 'Восхождение на Кьераг', desc: 'Тяжёлый подъём к знаменитому камню Кьерагболтен. Виды на Люсе-фьорд.' },
      { day: 3, title: 'Трек к Прекестулен', desc: 'Переход к скале Прекестулен — «Кафедра проповедника». Фото на краю утёса.' },
      { day: 4, title: 'Долина Люсеботн', desc: 'Спуск в долину, купание в ледниковом озере, ночёвка в палатках.' },
      { day: 5, title: 'Трек через хребет', desc: 'Переход через горный хребет с видами на фьорды. Дикая природа, олени.' },
      { day: 6, title: 'Водопады и мосты', desc: 'Посещение водопадов, переход по подвесным мостам.' },
      { day: 7, title: 'Возвращение к цивилизации', desc: 'Последний трек, трансфер в город, ужин в ресторане.' },
      { day: 8, title: 'Отъезд', desc: 'Трансфер в аэропорт, прощание.' },
    ],
    included: [
      'Проживание (палатки + хижины)',
      'Все приёмы пищи на маршруте',
      'Трансферы',
      'Гид и техподдержка',
      'Аренда палаток',
      'Групповое страхование',
    ],
    notIncluded: [
      'Авиабилеты',
      'Личные напитки',
      'Личное страхование',
      'Чаевые',
    ],
  },
  'pyrenees-august-2026': {
    name: 'Пиренеи: Франция — Испания',
    dates: '20–28 августа 2026',
    price: '€1 190',
    difficulty: 'Средняя',
    image: '/tours/tour-pyrenees.png',
    duration: '9 дней / 8 ночей',
    groupSize: '8–12 человек',
    accommodation: 'Горные приюты',
    season: 'июнь — сентябрь',
    program: [
      { day: 1, title: 'Прибытие в Тулузу', desc: 'Встреча, трансфер в Пиренеи, размещение в приюте.' },
      { day: 2, title: 'Долина Ордеса', desc: 'Трек через национальный парк Ордеса. Водопады, известняковые стены.' },
      { day: 3, title: 'Перевал Портийе', desc: 'Переход через перевал с видами на обе стороны Пиренеев.' },
      { day: 4, title: 'Озеро Гаубе', desc: 'Восхождение к озеру Гаубе — одному из красивейших в Пиренеях.' },
      { day: 5, title: 'Горный хребет', desc: 'Кольцевой маршрут по хребту с панорамными видами.' },
      { day: 6, title: 'Лесные деревни', desc: 'Спуск в традиционные баскские деревни, знакомство с культурой.' },
      { day: 7, title: 'Последний трек', desc: 'Финальный маршрут, фотосессия, праздничный ужин.' },
      { day: 8, title: 'Отдых и отъезд', desc: 'Свободное утро, трансфер в аэропорт.' },
    ],
    included: [
      'Проживание в приютах',
      'Полный пансион',
      'Трансферы',
      'Гид',
      'Групповое страхование',
    ],
    notIncluded: [
      'Авиабилеты',
      'Личные напитки',
      'Личное страхование',
      'Чаевые',
    ],
  },
  'alps-september-2026': {
    name: 'Швейцарские Альпы',
    dates: '10–17 сентября 2026',
    price: '€1 390',
    difficulty: 'Средняя',
    image: '/tours/tour-alps.png',
    duration: '8 дней / 7 ночей',
    groupSize: '8–14 человек',
    accommodation: 'Горные хижины',
    season: 'июнь — октябрь',
    program: [
      { day: 1, title: 'Прибытие в Цюрих', desc: 'Встреча, трансфер в Интерлакен, размещение.' },
      { day: 2, title: 'Озёра Бриенц и Тун', desc: 'Трек вдоль озёр с видами на Юнгфрау.' },
      { day: 3, title: 'Долина Лаутербруннен', desc: 'Переход через долину с 72 водопадами.' },
      { day: 4, title: 'Восхождение на Шильтхорн', desc: 'Подъём на вершину, панорамные виды.' },
      { day: 5, title: 'Ледник Алеч', desc: 'Посещение ледника Алеч — крупнейшего в Альпах.' },
      { day: 6, title: 'Деревня Гриндельвальд', desc: 'Трек к деревне с видами на Северную стену Айгера.' },
      { day: 7, title: 'Последний день', desc: 'Финальная прогулка, ужин.' },
      { day: 8, title: 'Отъезд', desc: 'Трансфер в аэропорт.' },
    ],
    included: [
      'Проживание',
      'Полный пансион',
      'Трансферы',
      'Гид',
      'Групповое страхование',
    ],
    notIncluded: [
      'Авиабилеты',
      'Личные напитки',
      'Личное страхование',
    ],
  },
  'corsica-october-2026': {
    name: 'Треккинг на Корсике',
    dates: '1–8 октября 2026',
    price: '€1 090',
    difficulty: 'Низкая',
    image: '/tours/tour-corsica.png',
    duration: '8 дней / 7 ночей',
    groupSize: '8–12 человек',
    accommodation: 'Гостевые дома',
    season: 'апрель — октябрь',
    program: [
      { day: 1, title: 'Прибытие в Аяччо', desc: 'Встреча, трансфер в гостевой дом.' },
      { day: 2, title: 'Побережье Каланк', desc: 'Трек вдоль скалистого побережья.' },
      { day: 3, title: 'Долина Рестоника', desc: 'Переход через долину с кристально чистыми реками.' },
      { day: 4, title: 'Горные деревни', desc: 'Посещение старинных корсиканских деревень.' },
      { day: 5, title: 'Водопады и леса', desc: 'Трек через каштановые леса к водопадам.' },
      { day: 6, title: 'Пляжный день', desc: 'Отдых на диком пляже, купание.' },
      { day: 7, title: 'Последний трек', desc: 'Финальная прогулка, ужин.' },
      { day: 8, title: 'Отъезд', desc: 'Трансфер в аэропорт.' },
    ],
    included: [
      'Проживание',
      'Завтраки',
      'Трансферы',
      'Гид',
      'Групповое страхование',
    ],
    notIncluded: [
      'Авиабилеты',
      'Обеды и ужины',
      'Личное страхование',
    ],
  },
};

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [openDays, setOpenDays] = useState<number[]>([]);

  const tour = slug ? tourData[slug] : null;

  if (!tour) {
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
    { icon: '/icons/icon-group.png', label: 'Группа', value: tour.groupSize },
    { icon: '/icons/icon-mountain.png', label: 'Сложность', value: tour.difficulty },
    { icon: '/icons/icon-bed.png', label: 'Жильё', value: tour.accommodation },
    { icon: '/icons/icon-calendar.png', label: 'Сезон', value: tour.season },
  ];

  return (
    <div className="bg-background pb-24 md:pb-0">
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
              {tour.notIncluded.map((item) => (
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
