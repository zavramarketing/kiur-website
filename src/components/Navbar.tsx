import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/tours', label: 'Туры' },
  { to: '/blog', label: 'Блог' },
  { to: '/contacts', label: 'Контакты' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="KIUR" className="h-8 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-primary border-b-2 border-primary pb-0.5'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contacts"
              className="bg-primary text-background px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Забронировать
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-primary p-2"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-primary/10 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block text-base font-medium ${
                isActive(link.to) ? 'text-primary font-semibold' : 'text-primary/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contacts"
            onClick={() => setOpen(false)}
            className="block bg-primary text-background text-center px-5 py-2.5 rounded-full text-sm font-medium"
          >
            Забронировать
          </Link>
        </div>
      )}
    </nav>
  );
}
