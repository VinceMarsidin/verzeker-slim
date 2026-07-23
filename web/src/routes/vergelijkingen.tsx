import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  Car,
  Plane,
  Home as HomeIcon,
  ShieldCheck,
  Star,
  MapPin,
  ArrowUpDown,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/vergelijkingen')({
  component: VergelijkingenPage,
})

// ---------------------------------------------------------------------------
// MOCK DATA
// Dit is placeholder-data voor de front-end. Vervang dit later door een
// TanStack Query call naar de Hono-backend (bv. useQuery({ queryKey: ['quotes',
// region, type], queryFn: () => api.getQuotes(region, type) })).
// ---------------------------------------------------------------------------

type InsuranceType = 'motor' | 'reis' | 'woon' | 'leven'

const insuranceTypes: { value: InsuranceType; label: string; icon: typeof Car }[] = [
  { value: 'motor', label: 'Motor', icon: Car },
  { value: 'reis', label: 'Reis', icon: Plane },
  { value: 'woon', label: 'Woon', icon: HomeIcon },
  { value: 'leven', label: 'Leven', icon: ShieldCheck },
]

const regions = [
  { value: 'suriname', label: 'Suriname', flag: '🇸🇷' },
  { value: 'aruba', label: 'Aruba', flag: '🇦🇼' },
  { value: 'curacao', label: 'Curaçao', flag: '🇨🇼' },
  { value: 'bonaire', label: 'Bonaire', flag: '🇧🇶' },
  { value: 'trinidad', label: 'Trinidad & Tobago', flag: '🇹🇹' },
  { value: 'jamaica', label: 'Jamaica', flag: '🇯🇲' },
] as const

type Region = (typeof regions)[number]['value']

interface Quote {
  insurer: string
  logoInitial: string
  monthlyPremium: number
  currency: string
  deductible: number
  rating: number
  coverage: string[]
  badge?: 'populair' | 'beste prijs' | 'beste dekking'
}

// Voorbeeld-tarieven per regio en verzekeringstype. Bedragen en aanbieders
// zijn indicatief/placeholder totdat de backend gekoppeld is.
const quoteData: Record<Region, Record<InsuranceType, Quote[]>> = {
  suriname: {
    motor: [
      { insurer: 'Assuria', logoInitial: 'A', monthlyPremium: 145, currency: 'SRD', deductible: 500, rating: 4.7, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { insurer: 'Self Reliance', logoInitial: 'S', monthlyPremium: 132, currency: 'SRD', deductible: 450, rating: 4.5, coverage: ['WA', 'Diefstal'], badge: 'beste prijs' },
      { insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 158, currency: 'SRD', deductible: 400, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
      { insurer: 'Parsasco', logoInitial: 'P', monthlyPremium: 149, currency: 'SRD', deductible: 500, rating: 4.3, coverage: ['WA', 'Brand'] },
    ],
    reis: [
      { insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 38, currency: 'SRD', deductible: 50, rating: 4.6, coverage: ['Medische kosten', 'Bagage'], badge: 'populair' },
      { insurer: 'Assuria', logoInitial: 'A', monthlyPremium: 34, currency: 'SRD', deductible: 50, rating: 4.5, coverage: ['Medische kosten'], badge: 'beste prijs' },
      { insurer: 'Self Reliance', logoInitial: 'S', monthlyPremium: 42, currency: 'SRD', deductible: 40, rating: 4.4, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
    ],
    woon: [
      { insurer: 'Assuria', logoInitial: 'A', monthlyPremium: 65, currency: 'SRD', deductible: 250, rating: 4.6, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
      { insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 72, currency: 'SRD', deductible: 200, rating: 4.7, coverage: ['Brand', 'Storm', 'Inbraak', 'Waterschade'], badge: 'beste dekking' },
      { insurer: 'Parsasco', logoInitial: 'P', monthlyPremium: 58, currency: 'SRD', deductible: 300, rating: 4.2, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
    ],
    leven: [
      { insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 95, currency: 'SRD', deductible: 0, rating: 4.8, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { insurer: 'Assuria', logoInitial: 'A', monthlyPremium: 88, currency: 'SRD', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
      { insurer: 'Self Reliance', logoInitial: 'S', monthlyPremium: 99, currency: 'SRD', deductible: 0, rating: 4.4, coverage: ['Overlijdensrisico', 'Arbeidsongeschiktheid'], badge: 'populair' },
    ],
  },
  aruba: {
    motor: [
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 62, currency: 'AWG', deductible: 250, rating: 4.5, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { insurer: 'Nagico', logoInitial: 'N', monthlyPremium: 58, currency: 'AWG', deductible: 200, rating: 4.3, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 68, currency: 'AWG', deductible: 150, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
    ],
    reis: [
      { insurer: 'Nagico', logoInitial: 'N', monthlyPremium: 18, currency: 'AWG', deductible: 25, rating: 4.4, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 21, currency: 'AWG', deductible: 20, rating: 4.6, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
    ],
    woon: [
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 34, currency: 'AWG', deductible: 100, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 31, currency: 'AWG', deductible: 120, rating: 4.4, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
    ],
    leven: [
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 48, currency: 'AWG', deductible: 0, rating: 4.7, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 44, currency: 'AWG', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
    ],
  },
  curacao: {
    motor: [
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 60, currency: 'ANG', deductible: 250, rating: 4.5, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 65, currency: 'ANG', deductible: 200, rating: 4.6, coverage: ['WA', 'Diefstal', 'Cascoschade'], badge: 'beste dekking' },
      { insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 57, currency: 'ANG', deductible: 300, rating: 4.3, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
    ],
    reis: [
      { insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 17, currency: 'ANG', deductible: 25, rating: 4.5, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 20, currency: 'ANG', deductible: 20, rating: 4.6, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
    ],
    woon: [
      { insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 33, currency: 'ANG', deductible: 150, rating: 4.6, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'beste dekking' },
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 29, currency: 'ANG', deductible: 180, rating: 4.3, coverage: ['Brand', 'Storm'], badge: 'beste prijs' },
    ],
    leven: [
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 46, currency: 'ANG', deductible: 0, rating: 4.6, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
      { insurer: 'Fatum', logoInitial: 'F', monthlyPremium: 42, currency: 'ANG', deductible: 0, rating: 4.4, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
    ],
  },
  bonaire: {
    motor: [
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 55, currency: 'USD', deductible: 200, rating: 4.4, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 59, currency: 'USD', deductible: 150, rating: 4.5, coverage: ['WA', 'Diefstal', 'Cascoschade'], badge: 'beste dekking' },
    ],
    reis: [
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 19, currency: 'USD', deductible: 25, rating: 4.5, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
    ],
    woon: [
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 27, currency: 'USD', deductible: 150, rating: 4.4, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
    ],
    leven: [
      { insurer: 'Ennia', logoInitial: 'E', monthlyPremium: 40, currency: 'USD', deductible: 0, rating: 4.5, coverage: ['Overlijdensrisico'], badge: 'beste prijs' },
    ],
  },
  trinidad: {
    motor: [
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 410, currency: 'TTD', deductible: 1500, rating: 4.5, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 385, currency: 'TTD', deductible: 1200, rating: 4.4, coverage: ['WA', 'Brand'], badge: 'beste prijs' },
      { insurer: 'Nagico', logoInitial: 'N', monthlyPremium: 430, currency: 'TTD', deductible: 1000, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
    ],
    reis: [
      { insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 120, currency: 'TTD', deductible: 150, rating: 4.4, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 135, currency: 'TTD', deductible: 100, rating: 4.6, coverage: ['Medische kosten', 'Bagage', 'Annulering'], badge: 'beste dekking' },
    ],
    woon: [
      { insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 210, currency: 'TTD', deductible: 800, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
    ],
    leven: [
      { insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 260, currency: 'TTD', deductible: 0, rating: 4.7, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
    ],
  },
  jamaica: {
    motor: [
      { insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 9500, currency: 'JMD', deductible: 25000, rating: 4.4, coverage: ['WA', 'Diefstal', 'Brand'], badge: 'populair' },
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 10200, currency: 'JMD', deductible: 20000, rating: 4.6, coverage: ['WA', 'Diefstal', 'Brand', 'Cascoschade'], badge: 'beste dekking' },
    ],
    reis: [
      { insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 2800, currency: 'JMD', deductible: 3000, rating: 4.3, coverage: ['Medische kosten', 'Bagage'], badge: 'beste prijs' },
    ],
    woon: [
      { insurer: 'Guardian Group', logoInitial: 'G', monthlyPremium: 4900, currency: 'JMD', deductible: 15000, rating: 4.5, coverage: ['Brand', 'Storm', 'Inbraak'], badge: 'populair' },
    ],
    leven: [
      { insurer: 'Sagicor', logoInitial: 'S', monthlyPremium: 6200, currency: 'JMD', deductible: 0, rating: 4.6, coverage: ['Overlijdensrisico', 'Uitkering nabestaanden'], badge: 'beste dekking' },
    ],
  },
}

const heroImages: Record<InsuranceType, string> = {
  motor:
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80&auto=format&fit=crop',
  reis:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80&auto=format&fit=crop',
  woon:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80&auto=format&fit=crop',
  leven:
    'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1400&q=80&auto=format&fit=crop',
}

type SortKey = 'price-asc' | 'price-desc' | 'rating-desc'

function VergelijkingenPage() {
  const [type, setType] = useState<InsuranceType>('motor')
  const [region, setRegion] = useState<Region>('suriname')
  const [sort, setSort] = useState<SortKey>('price-asc')

  const quotes = useMemo(() => {
    const list = [...(quoteData[region]?.[type] ?? [])]
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
  }, [region, type, sort])

  const activeRegion = regions.find((r) => r.value === region)!
  const cheapest = quotes[0]

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      {/* Hero */}
      <section className="relative overflow-hidden px-8 pb-20 pt-14">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mx-auto mb-5 w-fit border-line text-ink-soft">
            <MapPin className="h-3.5 w-3.5" /> {activeRegion.flag} {activeRegion.label}
          </Badge>
          <h1 className="mx-auto max-w-2xl font-slab text-4xl font-bold leading-[1.15] text-ink md:text-5xl">
            Vergelijk verzekeringen in <span className="text-trust">de Caraïben</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Kies je land en je type verzekering. Wij zetten de premies van de
            grootste maatschappijen direct naast elkaar — onafhankelijk en
            gratis.
          </p>
        </div>

        <div className="relative mx-auto mt-10 w-full max-w-5xl overflow-hidden rounded-[4px] border border-line">
          <img
            src={heroImages[type]}
            alt="VerzekerSlim vergelijking"
            className="block h-[320px] w-full object-cover md:h-[420px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-paper">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-paper/80">
                {insuranceTypes.find((t) => t.value === type)?.label} in{' '}
                {activeRegion.label}
              </p>
              <p className="mt-1 font-slab text-2xl font-bold">
                {quotes.length} aanbieders vergeleken
              </p>
            </div>
            {cheapest && (
              <div className="rounded-[4px] bg-paper-raised/95 px-5 py-3 text-ink shadow-lg">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Vanaf
                </p>
                <p className="font-mono text-xl font-bold">
                  {cheapest.currency} {cheapest.monthlyPremium}
                  <span className="text-sm font-medium text-ink-soft"> /mnd</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto -mt-8 max-w-5xl px-8">
        <Card className="border-line bg-paper-raised p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-3 text-sm font-semibold text-ink">
                Type verzekering
              </p>
              <Tabs value={type} onValueChange={(v) => setType(v as InsuranceType)}>
                <TabsList className="flex-wrap">
                  {insuranceTypes.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger key={value} value={value}>
                      <Icon className="h-4 w-4" />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 gap-4 md:w-[420px]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink">
                  Regio
                </label>
                <Select
                  value={region}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setRegion(e.target.value as Region)
                  }
                >
                  {regions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.flag} {r.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-ink">
                  Sorteer op
                </label>
                <Select
                  value={sort}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setSort(e.target.value as SortKey)
                  }
                >
                  <option value="price-asc">Laagste premie</option>
                  <option value="price-desc">Hoogste premie</option>
                  <option value="rating-desc">Beste beoordeling</option>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Results */}
      <section className="mx-auto mt-12 max-w-5xl px-8">
        {quotes.length === 0 ? (
          <div className="rounded-[4px] border border-dashed border-line p-16 text-center text-ink-soft">
            Nog geen aanbieders beschikbaar voor deze combinatie. Probeer een
            andere regio of verzekeringssoort.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {quotes.map((q) => (
              <Card
                key={q.insurer}
                className="flex flex-col gap-6 border-line bg-paper-raised p-6 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border border-line bg-paper font-mono text-lg font-bold text-stamp-dark">
                    {q.logoInitial}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle>{q.insurer}</CardTitle>
                      {q.badge && (
                        <Badge
                          variant={
                            q.badge === 'beste prijs'
                              ? 'success'
                              : q.badge === 'beste dekking'
                                ? 'warning'
                                : 'default'
                          }
                        >
                          <BadgeCheck className="h-3 w-3" /> {q.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-sm text-ink-soft">
                      <Star className="h-3.5 w-3.5 fill-stamp-dark text-stamp-dark" />
                      {q.rating.toFixed(1)}
                      <span className="mx-2 text-line">•</span>
                      Eigen risico {q.currency} {q.deductible}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {q.coverage.map((c) => (
                        <Badge key={c} variant="outline" className="border-line text-ink-soft">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 md:justify-end">
                  <div className="text-right">
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                      Premie
                    </p>
                    <p className="font-mono text-2xl font-bold text-ink">
                      {q.currency} {q.monthlyPremium}
                      <span className="text-sm font-medium text-ink-soft">/mnd</span>
                    </p>
                  </div>
                  <Button size="lg" className="bg-stamp-dark hover:bg-stamp-dark/90">
                    Kies deze <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-soft">
          <ArrowUpDown className="h-4 w-4" />
          Prijzen zijn indicatief en worden na jouw gegevens definitief
          bevestigd door de verzekeraar.
        </div>
      </section>

      {/* Trust strip with stock photo */}
      <section className="mx-auto my-24 max-w-5xl px-8">
        <div className="flex flex-col items-center gap-10 rounded-[4px] border border-line bg-paper-raised p-10 md:flex-row md:p-14">
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
