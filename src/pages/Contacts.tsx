import { useState } from 'react';
import { Send, MessageCircle, Instagram, Mail, Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

declare const gtag: (command: string, action: string, params?: Record<string, unknown>) => void;

const contactBlocks = [
  {
    icon: MessageCircle,
    label: 'Telegram',
    value: '@kiurtour_bot',
    href: 'https://t.me/kiurtour_bot',
    gaEvent: 'telegram_click',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@kiur.trekking',
    href: 'https://instagram.com/kiur.trekking',
    gaEvent: null,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@kiur.travel',
    href: 'mailto:hello@kiur.travel',
    gaEvent: null,
  },
];

export default function Contacts() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      gtag('event', 'generate_lead', { source: 'contact_form' });
      setTimeout(() => setSent(false), 4000);
    } catch {
      setError('Не удалось отправить сообщение. Попробуй ещё раз или напиши нам напрямую.');
    }
  };

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] py-12 md:py-20">
      <Helmet>
        <title>Контакты — KIUR</title>
        <meta name="description" content="Свяжитесь с командой KIUR: Telegram, Instagram, Email. Ответим на вопросы о турах и поможем с бронированием." />
        <meta property="og:title" content="Контакты — KIUR" />
        <meta property="og:url" content="https://kiurtours.eu/contacts" />
        <link rel="canonical" href="https://kiurtours.eu/contacts" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-10">
          Контакты
        </h1>

        {/* Contact blocks */}
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {contactBlocks.map((block) => (
            <a
              key={block.label}
              href={block.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => block.gaEvent && gtag('event', block.gaEvent)}
              className="bg-background border border-primary/10 rounded-card p-6 text-center hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-accent/40 rounded-full flex items-center justify-center">
                <block.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-xs text-primary/50 mb-1">{block.label}</div>
              <div className="font-medium text-primary text-sm">{block.value}</div>
            </a>
          ))}
        </div>

        {/* Contact form */}
        <div className="max-w-xl mx-auto">
          <h2 className="font-heading text-xl font-bold text-primary mb-6 text-center">
            Напиши нам
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary/70 mb-1.5">
                Имя
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-primary/15 rounded-lg text-primary text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors"
                placeholder="Твоё имя"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary/70 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-primary/15 rounded-lg text-primary text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-primary/70 mb-1.5">
                Сообщение
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-primary/15 rounded-lg text-primary text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
                placeholder="Расскажи о своих планах или задай вопрос..."
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={sent}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                sent
                  ? 'bg-accent text-primary'
                  : 'bg-primary text-background hover:bg-primary/90'
              }`}
            >
              {sent ? (
                <>
                  <Check className="w-4 h-4" />
                  Отправлено
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Отправить
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
