import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function Navbar() {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/95 px-8 py-4 backdrop-blur-md">
            <Link to="/" className="font-slab text-lg font-bold text-ink">
                Verzeker<span className="text-stamp-dark">Slim</span>
            </Link>
            <nav className="flex items-center gap-8 text-sm font-medium text-ink">
                <Link to="/">Home</Link>
                <Link to="/vergelijkingen">Vergelijkingen</Link>
                <Link to="/premie-calculator">Premie berekenen</Link>
                <Link to="/contact">Contact</Link>
                <Button asChild size="sm" className="bg-stamp-dark hover:bg-stamp-dark/90">
                    <Link to="/vergelijkingen">Vergelijk nu</Link>
                </Button>
            </nav>
        </header>
    )
}