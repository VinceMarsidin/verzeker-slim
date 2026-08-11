import { Link } from '@tanstack/react-router'
import { NavbarAuth } from '@/components/layout/navbar-auth'

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-paper/95 px-8 py-4 backdrop-blur-md">
            <Link to="/" className="font-slab text-lg font-bold text-ink">
                Verzeker<span className="text-stamp-dark">Slim</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-ink md:gap-8">
                <Link to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>Home</Link>
                <Link to="/vergelijkingen" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>Vergelijkingen</Link>
                <Link to="/premie-calculator" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>Premie berekenen</Link>
                <Link to="/contact" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>Contact</Link>
                <NavbarAuth />
            </nav>
        </header>
    )
}