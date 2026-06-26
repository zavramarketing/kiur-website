import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/tours', label: 'Туры' },
  { to: '/blog', label: 'Блог' },
  { to: '/contacts', label: 'Контакты' },
];

const legalLinks = [
  { to: '/privacy', label: 'Конфиденциальность' },
  { to: '/terms', label: 'Условия участия' },
];

function openCookieSettings() {
  window.dispatchEvent(new Event('open-cookie-settings'));
}

export default function Footer() {
  return (
    <footer className="bg-primary text-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img src="/logo.webp" alt="KIUR" width="120" height="48" className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>

          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-background/70 hover:text-background text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-background/70 hover:text-background text-xs transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={openCookieSettings}
              className="text-background/70 hover:text-background text-xs transition-colors"
            >
              Настройки куки
            </button>
          </div>

          <p className="text-background/70 text-sm">© KIUR 2026</p>
        </div>
      </div>
    </footer>
  );
}
