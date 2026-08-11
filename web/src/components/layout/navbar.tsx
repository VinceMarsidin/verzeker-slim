import { Link } from '@tanstack/react-router'
import { NavbarAuth } from '@/components/layout/navbar-auth'

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
                <Link to="/" className="font-slab text-lg font-bold text-ink">
                    Verzeker<span className="text-stamp-dark">Slim</span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm font-medium text-ink md:flex">
                    <Link
                        to="/"
                        className="relative py-1 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-stamp-dark after:transition-transform after:duration-200 hover:after:scale-x-100"
                    >
                        Home
                    </Link>
                    <Link
                        to="/vergelijkingen"
                        className="relative py-1 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-stamp-dark after:transition-transform after:duration-200 hover:after:scale-x-100"
                    >
                        Vergelijkingen
                    </Link>
                    <Link
                        to="/premie-calculator"
                        className="relative py-1 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-stamp-dark after:transition-transform after:duration-200 hover:after:scale-x-100"
                    >
                        Premie berekenen
                    </Link>
                    <Link
                        to="/contact"
                        className="relative py-1 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-stamp-dark after:transition-transform after:duration-200 hover:after:scale-x-100"
                    >
                        Contact
                    </Link>
                </nav>

                <NavbarAuth />
            </div>
        </header>
    )
}
