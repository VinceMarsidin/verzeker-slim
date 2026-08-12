import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Star } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { EmptyState } from './empty-state'
import { PageHeader } from './page-header'
import { SearchInput } from './search-input'
import { StatCard } from './stat-card'
import { haalAllePremies } from '@/lib/server/admin-premies'

const categorieOpties = ['motor', 'reis', 'woon', 'leven'] as const

export function PremiesSectie() {
  const [zoekterm, setZoekterm] = useState('')
  const [gekozenCategorie, setGekozenCategorie] = useState('')

  const { data: premies = [], isLoading } = useQuery({
    queryKey: ['admin-premies'],
    queryFn: () => haalAllePremies(),
  })

  const gemiddeldeRating = premies.length
    ? (premies.reduce((som, p) => som + p.rating, 0) / premies.length).toFixed(1)
    : '—'
  const aantalMaatschappijen = new Set(premies.map((p) => p.companySlug)).size

  const gefilterd = premies.filter((p) => {
    if (gekozenCategorie && p.insuranceType !== gekozenCategorie) return false

    const q = zoekterm.trim().toLowerCase()
    if (!q) return true
    return (
      p.companyName.toLowerCase().includes(q) ||
      p.insuranceType.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <PageHeader
        title="Premies"
        description="Alle premies per maatschappij, uit de premiums-tabel."
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Totaal premies" value={premies.length} />
        <StatCard label="Maatschappijen" value={aantalMaatschappijen} />
        <StatCard label="Gemiddelde rating" value={gemiddeldeRating} />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-[#f8fafd] px-4 py-3">
          <SearchInput
            value={zoekterm}
            onChange={setZoekterm}
            placeholder="Zoek op maatschappij of categorie..."
          />
          <div className="flex shrink-0 items-center gap-3">
            <select
              value={gekozenCategorie}
              onChange={(e) => setGekozenCategorie(e.target.value)}
              className="rounded-[6px] border border-line bg-white px-3 py-1.5 text-sm capitalize text-ink outline-none focus:border-stamp-dark"
            >
              <option value="">Alle categorieën</option>
              {categorieOpties.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
            {(zoekterm || gekozenCategorie) && (
              <span className="text-xs text-ink-soft">
                {gefilterd.length} van {premies.length}
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-sm text-ink-soft">Data laden...</p>
        ) : premies.length === 0 ? (
          <EmptyState label="Nog geen premies in de database. Draai tsx scripts/seed-premiums.ts." />
        ) : gefilterd.length === 0 ? (
          <EmptyState label="Geen premies gevonden voor deze zoekopdracht/filter." />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                <th className="p-4 text-left">Maatschappij</th>
                <th className="p-4 text-left">Categorie</th>
                <th className="p-4 text-left">Premie</th>
                <th className="p-4 text-left">Eigen risico</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Dekking</th>
              </tr>
            </thead>
            <tbody>
              {gefilterd.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-line last:border-0 hover:bg-[#f8fafd]"
                >
                  <td className="p-4 font-medium text-ink">{p.companyName}</td>
                  <td className="p-4">
                    <Badge className="capitalize">{p.insuranceType}</Badge>
                    {p.badge && (
                      <span className="ml-1.5 text-xs text-stamp-dark">
                        ({p.badge})
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono font-semibold text-ink">
                    {p.currency} {p.monthlyPremium}
                    <span className="text-xs font-normal text-ink-soft">/mnd</span>
                  </td>
                  <td className="p-4 text-ink-soft">
                    {p.currency} {p.deductible}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-ink-soft">
                      <Star className="h-3.5 w-3.5 fill-stamp-dark text-stamp-dark" />
                      {p.rating.toFixed(1)}
                    </div>
                  </td>
                  <td className="max-w-xs p-4 text-ink-soft">
                    {p.coverage.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
