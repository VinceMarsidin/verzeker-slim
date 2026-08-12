import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Card } from '@/components/ui/card'

import { EmptyState } from './empty-state'
import { PageHeader } from './page-header'
import { SearchInput } from './search-input'
import { StatCard } from './stat-card'
import { haalAlleMaatschappijen } from '@/lib/server/admin-companies'

export function MaatschappijenSectie() {
  const [zoekterm, setZoekterm] = useState('')

  const { data: maatschappijen = [], isLoading } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: () => haalAlleMaatschappijen(),
  })

  const gefilterd = maatschappijen.filter((m) => {
    const q = zoekterm.trim().toLowerCase()
    if (!q) return true
    return (
      m.name.toLowerCase().includes(q) ||
      m.region.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <PageHeader
        title="Maatschappijen"
        description="Alle verzekeringsmaatschappijen in het systeem (uit de companies-tabel)."
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Totaal maatschappijen" value={maatschappijen.length} />
        <StatCard
          label="Totaal premies"
          value={maatschappijen.reduce((som, m) => som + m.aantalPremies, 0)}
        />
        <StatCard
          label="Totaal reviews"
          value={maatschappijen.reduce((som, m) => som + m.aantalReviews, 0)}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-[#f8fafd] px-4 py-3">
          <SearchInput
            value={zoekterm}
            onChange={setZoekterm}
            placeholder="Zoek op naam of regio..."
          />
          {zoekterm && (
            <span className="shrink-0 text-xs text-ink-soft">
              {gefilterd.length} van {maatschappijen.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-sm text-ink-soft">Data laden...</p>
        ) : maatschappijen.length === 0 ? (
          <EmptyState label="Nog geen maatschappijen in de database. Draai tsx scripts/seed-companies.ts." />
        ) : gefilterd.length === 0 ? (
          <EmptyState label={`Geen resultaten voor "${zoekterm}".`} />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                <th className="p-4 text-left">Maatschappij</th>
                <th className="p-4 text-left">Homepage</th>
                <th className="p-4 text-left">Beschrijving</th>
                <th className="p-4 text-left">Website</th>
                <th className="p-4 text-right">Premies</th>
                <th className="p-4 text-right">Reviews</th>
              </tr>
            </thead>
            <tbody>
              {gefilterd.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-line last:border-0 hover:bg-[#f8fafd]"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {m.logoUrl ? (
                        <img
                          src={m.logoUrl}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-[4px] border border-line bg-white object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-line/40 text-sm font-semibold text-ink">
                          {m.logoInitial}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-ink">{m.name}</div>
                        <div className="text-xs capitalize text-ink-soft">{m.region}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {m.homepageImage ? (
                      <img
                        src={m.homepageImage}
                        alt=""
                        className="h-9 w-14 rounded-[4px] border border-line object-cover"
                      />
                    ) : (
                      <span className="text-xs text-ink-soft">—</span>
                    )}
                  </td>
                  <td className="max-w-xs p-4 text-ink-soft">
                    <span className="line-clamp-2" title={m.description}>
                      {m.description}
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={m.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stamp-dark hover:underline"
                    >
                      {m.website.replace(/^https?:\/\//, '')}
                    </a>
                  </td>
                  <td className="p-4 text-right text-ink-soft">{m.aantalPremies}</td>
                  <td className="p-4 text-right text-ink-soft">{m.aantalReviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
