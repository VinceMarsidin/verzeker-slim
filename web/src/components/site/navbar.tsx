import { Link } from '@tanstack/react-router'

const links = [
  { to: '/', label: 'Home' },
  { to: '/vergelijkingen', label: 'Vergelijkingen' },
  { to: '/contact', label: 'Contact' },
] as const

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-slate-900">
          Verzeker<span className="text-orange-500">Slim</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
              activeProps={{ className: 'text-blue-700 font-semibold' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/vergelijkingen"
          className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Vergelijk nu
        </Link>
      </div>
    </header>
  )
}
