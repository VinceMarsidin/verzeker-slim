import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'

// 1. Type Definities voor de API datastructuren
interface Maatschappij {
    id: string
    naam: string
}

interface VerzekeringItem {
    id: string
    type: string
    maatschappijId: string
    premie_bedrag: number | string
}

interface PremieResponse {
    premie: number
    uitleg: string
}

const companyUrls: Record<string, string> = {
    assuria: 'https://www.assuria.sr/',
    fatum: 'https://fatum-suriname.com/',
    self: 'https://self-reliance.sr/',
    par: 'https://www.parsasco.com/',
}

// 2. Definieer en valideer de zoekparameters (?type=motor)
interface VergelijkingSearch {
    type?: 'motor' | 'reis' | 'woon' | 'leven'
}

export const Route = createFileRoute('/vergelijkingen')({
    validateSearch: (search: Record<string, unknown>): VergelijkingSearch => {
        return {
            type: (search.type as VergelijkingSearch['type']) || 'motor',
        }
    },
    component: VerzekeringenComponent,
})

function VerzekeringenComponent() {
    // Gebruik de hooks direct vanuit het Route object
    const navigate = Route.useNavigate()
    const { type: actieveCategorie = 'motor' } = Route.useSearch()

    // State voor geselecteerde maatschappij (kolom-highlighting en externe link)
    const [geselecteerdeComp, setGeselecteerdeComp] = useState<string | null>(null)
    const [carValue, setCarValue] = useState<string>('')

    // 3. TanStack Query: Haal actieve maatschappijen op (Tijdcomplexiteit: O(1) na cache)
    const { data: maatschappijen = [], isLoading: loadingM } = useQuery<Maatschappij[]>({
        queryKey: ['maatschappijen'],
        queryFn: async () => {
            const res = await fetch('/api/maatschappijen')
            if (!res.ok) throw new Error('Fout bij ophalen maatschappijen')
            return res.json()
        },
    })

    // 4. TanStack Query: Haal vergelijkingen op op basis van de actieve categorie
    const { data: verzekeringen = [], isLoading: loadingV } = useQuery<VerzekeringItem[]>({
        queryKey: ['vergelijkingen', actieveCategorie],
        queryFn: async () => {
            const res = await fetch(`/api/vergelijking/${actieveCategorie}`)
            if (!res.ok) throw new Error('Fout bij ophalen vergelijkingen')
            return res.json()
        },
    })

    // 5. TanStack Mutation: Afhandelen van de WAM-premie calculator POST-request
    const calcMutation = useMutation<PremieResponse, Error, number>({
        mutationFn: async (dagwaarde) => {
            const res = await fetch('/api/bereken-premie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dagwaarde }),
            })
            if (!res.ok) throw new Error('Fout bij berekenen premie')
            return res.json()
        },
    })

    // Algoritme: Groepeer platte database-rijen naar een tabelvriendelijke matrixstructuur
    const transformeerData = () => {
        const gegroepeerd: Record<string, Record<string, string | number>> = {}

        verzekeringen.forEach((item) => {
            const dekking = item.type || 'Standaard'
            if (!gegroepeerd[dekking]) {
                gegroepeerd[dekking] = { naam: dekking }
                maatschappijen.forEach((m) => {
                    gegroepeerd[dekking][m.id] = '-'
                })
            }
            if (item.maatschappijId) {
                gegroepeerd[dekking][item.maatschappijId] = item.premie_bedrag
            }
        })

        return Object.values(gegroepeerd)
    }

    const tabelRijen = transformeerData()

    const handleCategorieChange = (val: string) => {
        navigate({
            to: '.', // <--- Dit vertelt de router om op de huidige route te blijven
            search: { type: val as VergelijkingSearch['type'] }
        })
        setGeselecteerdeComp(null) // Reset de kolom-highlight bij een nieuwe categorie
    }

    const handleBerekening = (e: React.FormEvent) => {
        e.preventDefault()
        const waarde = parseFloat(carValue)
        if (!isNaN(waarde)) {
            calcMutation.mutate(waarde)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pt-20">
            {/* HERO SECTION */}
            <section className="bg-gradient-to-br from-[#004080] to-[#002b56] text-white text-center py-20 px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    Verzekeringen Vergelijken
                </h1>
                <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                    Selecteer een categorie en vind de beste dekking voor uw situatie in Suriname.
                </p>

                <div className="inline-block relative">
                    <select
                        value={actieveCategorie}
                        onChange={(e) => handleCategorieChange(e.target.value)}
                        className="appearance-none bg-white text-[#004080] font-bold py-4 px-8 pr-12 rounded-full border-3 border-white/20 shadow-xl cursor-pointer transition focus:outline-none text-base"
                    >
                        <option value="motor">🚗 Motorrijtuigverzekering</option>
                        <option value="reis">✈️ Reisverzekering</option>
                        <option value="woon">🏠 Woonverzekering</option>
                        <option value="leven">🛡️ Levensverzekering</option>
                    </select>
                </div>
            </section>

            {/* MAIN CONTAINER */}
            <main className="max-w-7xl mx-auto -mt-24 px-6 pb-16 flex flex-col gap-8">
                {/* FILTERS CARD */}
                <section className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-[#ff8c00]">
                    <h3 className="border-l-4 border-[#ff8c00] pl-4 text-[#004080] font-bold text-sm tracking-wider uppercase mb-6">
                        Filter op Maatschappij
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {maatschappijen.map((m) => {
                            const safeName = m.naam.toLowerCase().replace(/\s+/g, '-')

                            // Mappen van de specifieke huisstijlkleuren uit je oude CSS
                            const colorClasses: Record<string, string> = {
                                assuria: 'bg-[#28a745]',
                                fatum: 'bg-[#ff8c00]',
                                'self-reliance': 'bg-[#ffcc00] !text-[#333]',
                                parsasco: 'bg-[#dc3545]',
                            }

                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setGeselecteerdeComp(safeName)}
                                    className={`px-6 py-3 rounded-xl text-white font-bold transition transform hover:-translate-y-0.5 hover:brightness-110 hover:shadow-md ${colorClasses[safeName] || 'bg-[#004080]'
                                        }`}
                                >
                                    {m.naam}
                                </button>
                            )
                        })}
                    </div>

                    {/* BEZOEK WEBSITE BUTTON */}
                    {geselecteerdeComp && companyUrls[geselecteerdeComp] && (
                        <div className="mt-6">
                            <a
                                href={companyUrls[geselecteerdeComp]}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block py-3 px-6 bg-[#004080] text-white rounded-lg font-semibold transition hover:bg-[#0066cc] hover:scale-[1.02]"
                            >
                                Bezoek website van{' '}
                                <span className="capitalize">{geselecteerdeComp.replace('-', ' ')}</span> →
                            </a>
                        </div>
                    )}
                </section>

                {/* VERGELIJKINGS TABEL CARD */}
                <section className="bg-white p-8 rounded-2xl shadow-md">
                    <h2 className="text-2xl text-[#004080] font-bold mb-6 border-l-4 border-[#ff8c00] pl-4">
                        Vergelijkingsoverzicht
                    </h2>

                    {(loadingM || loadingV) ? (
                        <div className="text-center py-8 text-slate-500 font-medium">Data laden...</div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#004080] text-white text-xs tracking-wider uppercase">
                                        <th className="p-4 font-semibold text-left border border-white/10 sticky left-0 bg-[#004080]">
                                            Dekking
                                        </th>
                                        {maatschappijen.map((m) => {
                                            const safeName = m.naam.toLowerCase().replace(/\s+/g, '-')
                                            const isHighlighted = geselecteerdeComp === safeName
                                            return (
                                                <th
                                                    key={m.id}
                                                    className={`p-4 font-semibold text-center border border-white/10 transition-colors ${isHighlighted ? 'bg-[#ff8c00] text-white' : ''
                                                        }`}
                                                >
                                                    {m.naam}
                                                </th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabelRijen.map((row, idx) => (
                                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="p-4 text-left font-semibold text-[#004080] bg-slate-50/50 sticky left-0 border-r border-slate-100">
                                                {row.naam}
                                            </td>
                                            {maatschappijen.map((m) => {
                                                const safeName = m.naam.toLowerCase().replace(/\s+/g, '-')
                                                const isHighlighted = geselecteerdeComp === safeName
                                                return (
                                                    <td
                                                        key={m.id}
                                                        className={`p-4 text-center text-sm transition-colors ${isHighlighted
                                                            ? 'bg-[#ff8c00]/10 border-x-2 border-[#ff8c00] text-[#004080] font-medium'
                                                            : 'text-slate-600'
                                                            }`}
                                                    >
                                                        {row[m.id]}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* WAM PREMIE CALCULATOR CARD */}
                <section className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-[#ff8c00] max-w-3xl mx-auto w-full">
                    <div className="text-center md:text-left mb-6">
                        <h2 className="text-2xl text-[#004080] font-bold mb-1">
                            <span className="mr-2">💰</span> WAM Premie Indicatie
                        </h2>
                        <p className="text-sm text-slate-500">
                            Bereken direct een schatting van uw jaarpremie op basis van de dagwaarde.
                        </p>
                    </div>

                    <form onSubmit={handleBerekening} className="mt-6 flex flex-col gap-4 items-center">
                        <div className="w-full max-w-md">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Dagwaarde Voertuig (SRD)
                            </label>
                            <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-[#ff8c00] transition">
                                <span className="px-4 py-3 bg-slate-100 text-slate-600 font-bold border-r border-slate-200">
                                    SRD
                                </span>
                                <input
                                    type="number"
                                    value={carValue}
                                    onChange={(e) => setCarValue(e.target.value)}
                                    placeholder="Bijv. 150000"
                                    className="w-full px-4 py-3 text-lg outline-none border-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={calcMutation.isPending}
                            className="w-full max-w-md bg-[#ff8c00] text-white py-4 rounded-xl text-lg font-extrabold tracking-wide transition transform hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#e67e00] disabled:bg-slate-300 disabled:transform-none"
                        >
                            {calcMutation.isPending ? 'Berekenen...' : 'Bereken Nu'}
                        </button>
                    </form>

                    {/* CALCULATOR RESULT */}
                    {calcMutation.isSuccess && (
                        <div className="mt-8 p-5 bg-sky-50 border-l-4 border-[#ff8c00] rounded-xl text-[#002b56]">
                            <p className="text-base font-medium">
                                Indicatie: <strong>SRD {calcMutation.data.premie}</strong> p/j.
                            </p>
                            <small className="text-xs text-slate-500 block mt-1">
                                {calcMutation.data.uitleg}
                            </small>
                        </div>
                    )}
                    {calcMutation.isError && (
                        <div className="mt-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-800 text-sm">
                            Er is een fout opgetreden bij de berekening. Probeer het opnieuw.
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}