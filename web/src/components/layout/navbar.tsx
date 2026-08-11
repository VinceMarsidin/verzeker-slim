import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { NavbarAuth } from '@/components/layout/navbar-auth'

const navLinkClass =
    'relative py-1 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-stamp-dark after:transition-transform after:duration-200 hover:after:scale-x-100'

export function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
                <Link to="/" className="font-slab text-lg font-bold text-ink">
                    Verzeker<span className="text-stamp-dark">Slim</span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm font-medium text-ink md:flex">
                    <Link to="/" className={navLinkClass}>Home</Link>
                    <Link to="/vergelijkingen" className={navLinkClass}>Vergelijkingen</Link>
                    <Link to="/premie-calculator" className={navLinkClass}>Premie berekenen</Link>
                    <Link to="/contact" className={navLinkClass}>Contact</Link>
                </nav>

                {/* Accountacties: op desktop hier, op mobiel verplaatst naar het uitklapmenu */}
                <div className="hidden md:block">
                    <NavbarAuth />
                </div>

                {/* Hamburger-knop, alleen zichtbaar onder md */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="text-ink md:hidden"
                    aria-label={open ? 'Sluit menu' : 'Open menu'}
                    aria-expanded={open}
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Uitklapmenu op mobiel */}
            {open && (
                <div className="border-t border-line bg-paper px-8 py-4 md:hidden">
                    <nav className="flex flex-col gap-4 text-sm font-medium text-ink">
                        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                        <Link to="/vergelijkingen" onClick={() => setOpen(false)}>Vergelijkingen</Link>
                        <Link to="/premie-calculator" onClick={() => setOpen(false)}>Premie berekenen</Link>
                        <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
                    </nav>
                    <div className="mt-4 border-t border-line pt-4">
                        <NavbarAuth />
                    </div>
                </div>
            )}
        </header>
    )
}
