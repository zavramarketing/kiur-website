import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

declare const gtag: (command: string, action: string, params?: Record<string, unknown>) => void;

const STORAGE_KEY = 'cookie_consent';

function updateConsent(granted: boolean) {
  const value = granted ? 'granted' : 'denied';
  gtag('consent', 'update', {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'granted') {
      updateConsent(true);
    } else if (!stored) {
      setVisible(true);
    }

    const onOpen = () => setVisible(true);
    window.addEventListener('open-cookie-settings', onOpen);
    return () => window.removeEventListener('open-cookie-settings', onOpen);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'granted');
    updateConsent(true);
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'denied');
    updateConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-primary text-background rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg pointer-events-auto">
        <p className="text-sm text-background/80 flex-1 leading-relaxed">
          Мы используем cookies для аналитики посещаемости сайта.{' '}
          <Link to="/privacy" className="underline underline-offset-2 text-background hover:text-background/70 transition-colors">
            Политика конфиденциальности
          </Link>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="text-sm text-background/60 hover:text-background transition-colors px-3 py-1.5"
          >
            Отклонить
          </button>
          <button
            onClick={accept}
            className="text-sm bg-background text-primary font-medium px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
