import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { insuranceTypes, regions, type InsuranceType, type Quote, type Region } from '@/lib/types/insurance'

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

interface ComparisonHeroProps {
  type: InsuranceType
  region: Region
  quotes: Quote[]
}

export function ComparisonHero({ type, region, quotes }: ComparisonHeroProps) {
  const activeRegion = regions.find((item) => item.value === region)
  const cheapest = quotes[0]
  const typeLabel = insuranceTypes.find((item) => item.value === type)?.label

  if (!activeRegion) return null

  return (
    <section className="relative overflow-hidden px-8 pb-20 pt-14">
      <div className="mx-auto max-w-5xl text-center">
        <Badge variant="outline" className="mx-auto mb-5 w-fit border-line text-ink-soft">
          <MapPin className="h-3.5 w-3.5" /> {activeRegion.flag} {activeRegion.label}
        </Badge>
        <h1 className="mx-auto max-w-2xl font-slab text-4xl font-bold leading-[1.15] text-ink md:text-5xl">
          Vergelijk verzekeringen in <span className="text-trust">de Caraïben</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          Kies je land en je type verzekering. Wij zetten de premies van de grootste
          maatschappijen direct naast elkaar — onafhankelijk en gratis.
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
              {typeLabel} in {activeRegion.label}
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
  )
}
