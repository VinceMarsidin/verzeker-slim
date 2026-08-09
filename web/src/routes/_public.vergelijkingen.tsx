import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Car, Home, Plane, ShieldCheck } from 'lucide-react'

import { SearchInput } from '#/components/ui/search-input'
import { avatarKleur } from '#/lib/avatar-color'
import type { Premie } from '#/lib/types'

export const Route = createFileRoute('/_public/vergelijkingen')({
  component: VergelijkingenPage,
})

type CategorieFilter = 'alle' | 'motor' | 'reis' | 'woon' | 'leven'

const categorieen: { id: CategorieFilter; label: string; icon?: typeof Car }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'motor', label: 'Motor', icon: Car },
  { id: 'reis', label: 'Reis', icon: Plane },
  { id: 'woon', label: 'Woon', icon: Home },
  { id: 'leven', label: 'Leven', icon: ShieldCheck },
]

function VergelijkingenPage() {
  const [categorie, setCategorie] = useState<CategorieFilter>('alle')
  const [zoekterm, setZoekterm] = useState('')

  const { data: premies = [], isLoading, error } = useQuery<Premie[]>({
    queryKey: ['public', 'premies'],
    queryFn: async () => {
      const res = await fetch('/api/premies')
      if (!res.ok) throw new Error('Fout bij ophalen premies')
      return res.json()
    },
  })

  const gefilterd = premies.filter((p) => {
    if (categorie !== 'alle' && p.categorie !== categorie) return false

    const q = zoekterm.trim().toLowerCase()
    if (!q) return true
    return (
      (p.maatschappijNaam ?? '').toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">
          Vergelijk verzekeringen
        </h1>
        <p className="mt-2 text-slate-600">
          Bekijk en vergelijk premies van verschillende maatschappijen in
          Suriname, op één plek.
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
          {categorieen.map((c) => {
            const Icon = c.icon
            const isActief = categorie === c.id
            return (
              <button
                key={c.id}
                onClick={() => setCategorie(c.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActief
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-blue-700'
                }`}
              >
                {Icon && <Icon size={14} strokeWidth={2.25} />}
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <SearchInput
          value={zoekterm}
          onChange={setZoekterm}
          placeholder="Zoek op maatschappij of type dekking..."
        />
      </div>

      <div className="mt-10">
        {isLoading ? (
          <p className="text-center text-slate-400 text-sm">Premies laden...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-sm">
            Kon premies niet laden. Probeer het later opnieuw.
          </p>
        ) : gefilterd.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">
            Geen premies gevonden{zoekterm && ` voor "${zoekterm}"`}.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gefilterd.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${avatarKleur(p.maatschappijNaam ?? '?')}`}
                  >
                    {(p.maatschappijNaam ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">
                      {p.maatschappijNaam ?? 'Onbekend'}
                    </div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium capitalize">
                      {p.categorie}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">{p.type}</p>
                  <p className="mt-1 text-xl font-semibold text-blue-700 tabular-nums">
                    {p.premieBedrag}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}