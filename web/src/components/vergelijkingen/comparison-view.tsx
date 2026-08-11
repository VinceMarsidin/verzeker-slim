import { useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { ComparisonHero } from '@/components/vergelijkingen/comparison-hero'
import { ComparisonFilters } from '@/components/vergelijkingen/comparison-filters'
import { CompanyDirectory } from '@/components/vergelijkingen/company-directory'
import { QuoteCard } from '@/components/vergelijkingen/quote-card'
import type { Company, InsuranceType, Quote, Region, SortKey } from '@/lib/types/insurance'

interface ComparisonViewProps {
  type: InsuranceType
  region: Region
  quotes: Quote[]
  companies: Company[]
  onTypeChange: (type: InsuranceType) => void
  onRegionChange: (region: Region) => void
}

function sortQuotes(quotes: Quote[], sort: SortKey): Quote[] {
  const list = [...quotes]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.monthlyPremium - b.monthlyPremium)
    case 'price-desc':
      return list.sort((a, b) => b.monthlyPremium - a.monthlyPremium)
    case 'rating-desc':
      return list.sort((a, b) => b.rating - a.rating)
    default:
      return list
  }
}

export function ComparisonView({
  type,
  region,
  quotes: allQuotes,
  companies,
  onTypeChange,
  onRegionChange,
}: ComparisonViewProps) {
  const [sort, setSort] = useState<SortKey>('price-asc')
  const quotes = useMemo(() => sortQuotes(allQuotes, sort), [allQuotes, sort])

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <ComparisonHero type={type} region={region} quotes={quotes} />

      <section className="mx-auto -mt-8 max-w-5xl px-8">
        <ComparisonFilters
          type={type}
          region={region}
          sort={sort}
          onTypeChange={onTypeChange}
          onRegionChange={onRegionChange}
          onSortChange={setSort}
        />
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-8">
        {quotes.length === 0 ? (
          <div className="rounded-[4px] border border-dashed border-line p-16 text-center text-ink-soft">
            Nog geen aanbieders beschikbaar voor deze combinatie. Probeer een
            andere regio of verzekeringssoort.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {quotes.map((q) => (
              <QuoteCard key={`${q.companySlug}-${type}`} quote={q} insuranceType={type} />
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-soft">
          <ArrowUpDown className="h-4 w-4" />
          Prijzen zijn indicatief. Bekijk per maatschappij de premies, opties en reviews.
        </div>
      </section>

      <CompanyDirectory companies={companies} region={region} insuranceType={type} />

      <section className="mx-auto my-24 max-w-5xl px-8">
        <div className="hover-lift flex flex-col items-center gap-10 rounded-[4px] border border-line bg-paper-raised p-10 md:flex-row md:p-14">
          <div className="w-full overflow-hidden rounded-[4px] border border-line md:w-2/5">
            <img
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=900&q=80&auto=format&fit=crop"
              alt="Caribisch eiland"
              className="block h-[280px] w-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-slab text-2xl font-bold text-ink">
              Eén platform, meerdere eilanden.
            </h2>
            <p className="mt-3 text-ink-soft">
              Of je nu in Paramaribo, Willemstad of Port of Spain woont —
              VerzekerSlim brengt de lokale verzekeraars overzichtelijk bij
              elkaar, zodat je nooit te veel betaalt.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
