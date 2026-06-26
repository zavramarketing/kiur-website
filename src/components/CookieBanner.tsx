import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

declare const gtag: (command: string, action: string, params?: Record<string, unknown>) => void;

const STORAGE_KEY = 'cookie_consent_v2';

interface ConsentState {
  analytics: boolean;
}

function applyConsent(consent: ConsentState) {
  const value = consent.analytics ? 'granted' : 'denied';
  gtag('consent', 'update', {
    analytics_storage: value,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

function loadStored(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      applyConsent(stored);
    } else {
      setVisible(true);
    }

    const onOpen = () => {
      const current = loadStored();
      setAnalytics(current?.analytics ?? false);
      setVisible(true);
    };
    window.addEventListener('open-cookie-settings', onOpen);
    return () => window.removeEventListener('open-cookie-settings', onOpen);
  }, []);

  function acceptAll() {
    const consent = { analytics: true };
    saveConsent(consent);
    applyConsent(consent);
    setVisible(false);
  }

  function saveSelected() {
    const consent = { analytics };
    saveConsent(consent);
    applyConsent(consent);
    setVisible(false);
  }

  function declineAll() {
    const consent = { analytics: false };
    saveConsent(consent);
    applyConsent(consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40">
      <div className="bg-background w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
          <h2 className="font-heading font-bold text-primary text-base">Настройки cookies</h2>
          <button onClick={declineAll} aria-label="Закрыть" className="text-primary/30 hover:text-primary/60 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-primary/80 leading-relaxed">
            Мы используем cookies для работы сайта и анализа посещаемости. Вы можете выбрать, какие категории разрешить.{' '}
            <Link to="/privacy" onClick={declineAll} className="underline underline-offset-2 text-primary hover:text-primary transition-colors">
              Политика конфиденциальности
            </Link>
          </p>

          {/* Necessary */}
          <div className="flex items-start justify-between gap-4 py-4 border-t border-primary/10">
            <div>
              <div className="text-sm font-medium text-primary">Необходимые</div>
              <div className="text-xs text-primary/50 mt-0.5 leading-relaxed">
                Обеспечивают базовую работу сайта. Не могут быть отключены.
              </div>
            </div>
            <div className="shrink-0 mt-0.5">
              <div className="w-10 h-5 rounded-full bg-primary flex items-center justify-end px-0.5 cursor-not-allowed opacity-60">
                <div className="w-4 h-4 rounded-full bg-background" />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-start justify-between gap-4 py-4 border-t border-primary/10">
            <div>
              <div className="text-sm font-medium text-primary">Аналитика</div>
              <div className="text-xs text-primary/90 mt-0.5 leading-relaxed">
                Google Analytics — помогает нам понять, как вы используете сайт, и улучшать его.
              </div>
            </div>
            <button
              role="switch"
              aria-checked={analytics}
              aria-label="Аналитика"
              onClick={() => setAnalytics(v => !v)}
              className={`shrink-0 mt-0.5 w-10 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${analytics ? 'bg-primary justify-end' : 'bg-primary/20 justify-start'}`}
            >
              <div className="w-4 h-4 rounded-full bg-background shadow-sm" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-2">
          <button
            onClick={declineAll}
            className="flex-1 border border-primary/20 text-primary/80 text-sm py-2.5 rounded-full hover:bg-accent transition-colors"
          >
            Отклонить все
          </button>
          <button
            onClick={saveSelected}
            className="flex-1 border border-primary text-primary text-sm py-2.5 rounded-full hover:bg-accent transition-colors"
          >
            Сохранить выбор
          </button>
          <button
            onClick={acceptAll}
            className="flex-1 bg-primary text-background text-sm py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Принять все
          </button>
        </div>
      </div>
    </div>
  );
}
