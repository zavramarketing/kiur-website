import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

declare const gtag: (command: string, action: string, params?: Record<string, unknown>) => void;

interface Review {
  name: string;
  country?: string;
  date?: string;
  rating: number;
  text: string;
}

interface TourData {
  id: string;
  name: string;
  dates: string;
  price: string;
  difficulty: string;
  difficulty_level: number;
  image: string;
  duration: string;
  group_size: string;
  accommodation: string;
  season: string;
  region?: string;
  program: { day: number; title: string; desc: string }[];
  included: string[];
  not_included: string[];
  reviews: Review[];
}

const EXPERIENCE_LABELS: Record<string, string> = {
  never:        'Не ходил(а) в треккинги',
  few_times:    '1–5 походов',
  regularly:    'Регулярно хожу',
  professional: 'Профессиональный уровень',
}
const FITNESS_LABELS: Record<string, string> = {
  low:     'Низкая',
  medium:  'Средняя',
  high:    'Высокая',
  athletic:'Спортивная',
}
const GROUP_LABELS: Record<string, string> = {
  solo:      'Один / одна',
  couple:    'Вдвоём',
  friends:   'С друзьями',
  family:    'С семьёй',
  corporate: 'Корпоратив',
}

function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const scrollTo = useCallback((index: number) => {
    const container = scrollRef.current
    if (!container) return
    const card = container.children[index] as HTMLElement
    if (!card) return
    container.scrollTo({ left: card.offsetLeft - container.offsetLeft, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const onScroll = () => {
      const cardWidth = (container.children[0] as HTMLElement)?.offsetWidth || 1
      setActive(Math.round(container.scrollLeft / (cardWidth + 16)))
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  const label = reviews.length === 1 ? 'отзыв' : reviews.length < 5 ? 'отзыва' : 'отзывов'

  return (
    <div className="mb-10 md:mb-14">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-3">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-primary">Отзывы участников</h2>
          <span className="text-primary/40 text-sm">{reviews.length} {label}</span>
        </div>
        {reviews.length > 1 && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scrollTo(Math.max(0, active - 1))}
              disabled={active === 0}
              aria-label="Предыдущий отзыв"
              className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center text-primary/60 hover:bg-accent disabled:opacity-25 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo(Math.min(reviews.length - 1, active + 1))}
              disabled={active === reviews.length - 1}
              aria-label="Следующий отзыв"
              className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center text-primary/60 hover:bg-accent disabled:opacity-25 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review, i) => {
          const initials = review.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
          return (
            <div
              key={i}
              className="snap-start shrink-0 w-[85vw] sm:w-[360px] bg-background border border-primary/10 rounded-card p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{initials}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary leading-tight">{review.name}</div>
                    {(review.country || review.date) && (
                      <div className="text-xs text-primary/40 mt-0.5">
                        {[review.country, review.date].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-primary' : 'text-primary/15'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-primary/70 leading-relaxed">{review.text}</p>
            </div>
          )
        })}
      </div>

      {reviews.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all ${i === active ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-primary/20'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BookingModal({ tour, onClose }: { tour: TourData; onClose: () => void }) {
  const [step, setStep] = useState<'info' | 'qualify' | 'done'>('info')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')

  const [experience, setExperience] = useState('')
  const [fitness, setFitness] = useState('')
  const [travelGroup, setTravelGroup] = useState('')
  const [notes, setNotes] = useState('')

  const [qualHint, setQualHint] = useState('')
  const [qualLoading, setQualLoading] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (step !== 'qualify' || !experience || !fitness || !travelGroup) return
    setQualLoading(true)
    setQualHint('')
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/qualify-hint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourName: tour.name, difficulty: tour.difficulty_level, experience, fitness, travelGroup }),
        })
        const data = await res.json()
        setQualHint(data.hint || '')
      } catch { /* ignore */ }
      finally { setQualLoading(false) }
    }, 600)
    return () => clearTimeout(t)
  }, [experience, fitness, travelGroup, step])

  function step1(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError('Заполните имя и email'); return }
    setError('')
    setStep('qualify')
  }

  async function step2(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour: tour.id,
          name, email, phone, country,
          experience, fitness, travel_group: travelGroup, notes,
          status: 'new',
        }),
      })
      if (!res.ok) throw new Error('Ошибка сервера')
      setStep('done')
      gtag('event', 'generate_lead', { tour_name: tour.name, source: 'booking_form' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка при отправке')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-primary/10 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-primary/50 uppercase tracking-widest font-medium">Заявка на тур</p>
            <p className="font-heading font-bold text-primary text-sm mt-0.5 line-clamp-1">{tour.name}</p>
          </div>
          <button onClick={onClose} aria-label="Закрыть" className="text-primary/40 hover:text-primary transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'done' ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-primary text-xl mb-2">Заявка принята!</h3>
              <p className="text-primary/60 text-sm">
                Мы напишем вам на <strong>{email}</strong> в течение 24 часов.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-primary text-background px-8 py-2.5 rounded-full text-sm font-medium"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                {['Контакты', 'О себе'].map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      (i === 0 && step === 'info') || (i === 1 && step === 'qualify') ? 'bg-primary text-background'
                      : i === 0 && step === 'qualify' ? 'bg-primary/70 text-background'
                      : 'bg-primary/10 text-primary/40'
                    }`}>
                      {i === 0 && step === 'qualify' ? '✓' : i + 1}
                    </div>
                    <span className={`text-sm ${
                      (i === 0 && step === 'info') || (i === 1 && step === 'qualify') ? 'font-medium text-primary' : 'text-primary/40'
                    }`}>{label}</span>
                    {i < 1 && <div className="w-8 h-px bg-primary/15 mx-1" />}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
              )}

              {step === 'info' && (
                <form onSubmit={step1} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary/70 mb-1.5">Имя и фамилия *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Анна Смирнова"
                      className="w-full border border-primary/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary/70 mb-1.5">Email *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="anna@email.com"
                      className="w-full border border-primary/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary/70 mb-1.5">Телефон / WhatsApp</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+372 5123 4567"
                      className="w-full border border-primary/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary/70 mb-1.5">Страна</label>
                    <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Эстония, Германия..."
                      className="w-full border border-primary/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20" />
                  </div>
                  <button type="submit" className="w-full bg-primary text-background py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
                    Далее →
                  </button>
                </form>
              )}

              {step === 'qualify' && (
                <form onSubmit={step2} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-primary/70 mb-2">Опыт треккинга</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(EXPERIENCE_LABELS).map(([val, label]) => (
                        <label key={val} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                          experience === val ? 'border-primary bg-accent' : 'border-primary/15 bg-white hover:border-primary/30'
                        }`}>
                          <input type="radio" name="exp" value={val} checked={experience === val} onChange={() => setExperience(val)} className="accent-primary" />
                          <span className="text-xs text-primary">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary/70 mb-2">Физическая форма</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(FITNESS_LABELS).map(([val, label]) => (
                        <label key={val} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                          fitness === val ? 'border-primary bg-accent' : 'border-primary/15 bg-white hover:border-primary/30'
                        }`}>
                          <input type="radio" name="fit" value={val} checked={fitness === val} onChange={() => setFitness(val)} className="accent-primary" />
                          <span className="text-xs text-primary">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary/70 mb-2">Едете</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(GROUP_LABELS).map(([val, label]) => (
                        <label key={val} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                          travelGroup === val ? 'border-primary bg-accent' : 'border-primary/15 bg-white hover:border-primary/30'
                        }`}>
                          <input type="radio" name="grp" value={val} checked={travelGroup === val} onChange={() => setTravelGroup(val)} className="accent-primary" />
                          <span className="text-xs text-primary">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {(qualLoading || qualHint) && (
                    <div className={`p-4 rounded-xl text-sm border ${
                      qualLoading ? 'bg-accent border-primary/15 text-primary/50'
                      : qualHint.toLowerCase().includes('отлично') || qualHint.toLowerCase().includes('подходит') ? 'bg-green-50 border-green-200 text-green-800'
                      : qualHint.toLowerCase().includes('уточнить') ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-orange-50 border-orange-200 text-orange-800'
                    }`}>
                      {qualLoading ? 'Оцениваем подходящесть маршрута...' : qualHint}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-primary/70 mb-1.5">Вопросы или пожелания</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                      placeholder="Что важно учесть? Есть ли ограничения по здоровью?"
                      className="w-full border border-primary/20 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none" />
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep('info')}
                      className="flex-1 border border-primary/20 text-primary/60 py-3 rounded-full text-sm font-medium hover:bg-accent transition-colors">
                      ← Назад
                    </button>
                    <button type="submit" disabled={submitting}
                      className="flex-1 bg-primary text-background py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                      {submitting ? 'Отправляем...' : 'Отправить заявку'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [openDays, setOpenDays] = useState<number[]>([]);
  const [tour, setTour] = useState<TourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [suggestionSent, setSuggestionSent] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const submitSuggestion = async () => {
    const text = suggestion.trim();
    if (!text) return;
    setSuggestionLoading(true);
    try {
      await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: text, source_tour: slug }),
      });
      setSuggestionSent(true);
    } finally {
      setSuggestionLoading(false);
    }
  };

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

  const openBooking = () => {
    setShowModal(true);
    gtag('event', 'begin_checkout', { tour_name: tour.name });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.name,
    description: `${tour.name}. ${tour.duration}, группа ${tour.group_size}. Даты: ${tour.dates}. Сложность: ${tour.difficulty}.`,
    touristType: ['Треккинг', 'Пешеходный туризм'],
    ...(tour.image ? { image: tour.image } : {}),
    ...(tour.region ? { itinerary: { '@type': 'ItemList', name: tour.region } } : {}),
    offers: {
      '@type': 'Offer',
      price: tour.price.replace(/[^\d]/g, '') || tour.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://kiurtours.eu/tours/${slug}`,
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'KIUR',
      url: 'https://kiurtours.eu',
    },
  };

  const infoItems = [
    { icon: '/icons/icon-clock.webp', label: 'Длительность', value: tour.duration },
    { icon: '/icons/icon-group.webp', label: 'Группа', value: tour.group_size },
    { icon: '/icons/icon-mountain.webp', label: 'Сложность', value: tour.difficulty },
    { icon: '/icons/icon-bed.webp', label: 'Жильё', value: tour.accommodation },
    { icon: '/icons/icon-calendar.webp', label: 'Сезон', value: tour.season },
  ];

  return (
    <div className="bg-background pb-24 md:pb-0">
      <Helmet>
        <title>{tour.name} — KIUR</title>
        <meta name="description" content={`${tour.name}, ${tour.dates}. ${tour.duration}, группа ${tour.group_size}. Стоимость ${tour.price}. Треккинг-тур с KIUR.`} />
        <meta property="og:title" content={`${tour.name} — KIUR`} />
        <meta property="og:description" content={`${tour.name}, ${tour.dates}. ${tour.duration}. Стоимость ${tour.price}.`} />
        <meta property="og:url" content={`https://kiurtours.eu/tours/${slug}`} />
        {tour.image && <meta property="og:image" content={tour.image} />}
        <link rel="canonical" href={`https://kiurtours.eu/tours/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
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
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-14">
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

        {/* Reviews */}
        {tour.reviews && tour.reviews.length > 0 && (
          <ReviewsCarousel reviews={tour.reviews} />
        )}

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center justify-between bg-primary rounded-2xl px-10 py-8">
          <div>
            <p className="font-heading font-bold text-background text-2xl mb-1">Готовы отправиться в путь?</p>
            <p className="text-background/70 text-sm">{tour.dates} · {tour.duration} · от {tour.price}</p>
          </div>
          <button
            onClick={openBooking}
            className="bg-background text-primary px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Записаться на тур
          </button>
        </div>

        {/* Suggest a destination */}
        <div className="bg-background border border-primary/10 rounded-card p-6 md:p-8 mt-10 md:mt-14">
          <h3 className="font-heading font-bold text-primary text-lg mb-1">Предложите следующий маршрут</h3>
          <p className="text-primary/60 text-sm mb-5">Куда ещё хотели бы пойти? Мы учитываем пожелания при планировании новых туров.</p>
          {suggestionSent ? (
            <p className="text-primary font-medium text-sm">Спасибо! Мы записали ваше пожелание.</p>
          ) : (
            <div className="flex gap-3">
              <input
                type="text"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitSuggestion()}
                placeholder="Например: Черногория, Триглав, Патагония..."
                className="flex-1 border border-primary/20 rounded-full px-4 py-2.5 text-sm text-primary placeholder:text-primary/30 bg-background focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={submitSuggestion}
                disabled={suggestionLoading || !suggestion.trim()}
                className="bg-primary text-background px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 whitespace-nowrap"
              >
                {suggestionLoading ? '...' : 'Предложить'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom bar on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/10 px-4 py-3 flex items-center justify-between md:hidden z-40">
        <div>
          <div className="text-xs text-primary/50">Стоимость</div>
          <div className="font-heading font-bold text-primary text-lg">{tour.price}</div>
        </div>
        <button
          onClick={openBooking}
          className="bg-primary text-background px-6 py-2.5 rounded-full text-sm font-medium"
        >
          Записаться
        </button>
      </div>

      {showModal && <BookingModal tour={tour} onClose={() => setShowModal(false)} />}
    </div>
  );
}
