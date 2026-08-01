import { Link } from '@tanstack/react-router'

const categorieen = [
    { naam: 'Motor', slug: 'motor' },
    { naam: 'Reis', slug: 'reis' },
    { naam: 'Woon', slug: 'woon' },
    { naam: 'Leven', slug: 'leven' },
]

export function Footer() {
    return (
        <footer className="border-t border-line bg-ink px-8 py-14 text-paper/70">
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
                <span className="font-slab text-lg font-bold text-paper">VerzekerSlim</span>
                <div>
                    <p className="text-sm font-semibold text-paper">Producten</p>
                    <ul className="mt-3 space-y-2 text-sm">
                        {categorieen.map((c) => (
                            <li key={c.naam}>
                                <Link to="/vergelijkingen/$type" params={{ type: c.slug }} className="hover:text-paper">
                                    {c.naam}verzekering
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-sm font-semibold text-paper">Bedrijf</p>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li><Link to="/contact" className="hover:text-paper">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="text-sm font-semibold text-paper">Contact</p>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li>info@verzekerslim.sr</li>
                    </ul>
                </div>
            </div>
            <p className="mx-auto mt-12 max-w-5xl text-xs text-paper/50">
                &copy; 2026 VerzekerSlim. Alle rechten voorbehouden.
            </p>
        </footer>
    )
}
