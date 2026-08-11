import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { insuranceTypes, type InsuranceType, type Quote } from '@/lib/types/insurance'
import { CompanyLogo } from '@/components/companies/company-logo'

interface CompanyPremiumsProps {
  premiums: Quote[]
  highlightType?: InsuranceType
}

function typeLabel(type?: InsuranceType): string {
  if (!type) return 'Verzekering'
  return insuranceTypes.find((t) => t.value === type)?.label ?? type
}

export function CompanyPremiums({ premiums, highlightType }: CompanyPremiumsProps) {
  if (premiums.length === 0) {
    return (
      <div className="rounded-[4px] border border-dashed border-line p-10 text-center text-ink-soft">
        Geen premie-informatie beschikbaar voor deze maatschappij.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {premiums.map((premium, index) => {
        const isHighlighted = highlightType && premium.insuranceType === highlightType
        return (
          <Card
            key={`${premium.companySlug}-${premium.insuranceType ?? index}`}
            className={`border-line bg-paper-raised p-6 ${isHighlighted ? 'ring-2 ring-stamp-dark/30' : ''}`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink">
                    {typeLabel(premium.insuranceType)}
                  </p>
                  {premium.badge && (
                    <Badge variant="outline" className="border-line text-ink-soft">
                      {premium.badge}
                    </Badge>
                  )}
                  {isHighlighted && (
                    <Badge variant="default">Geselecteerd uit vergelijking</Badge>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-ink-soft">
                  <Star className="h-3.5 w-3.5 fill-stamp-dark text-stamp-dark" />
                  {premium.rating.toFixed(1)}
                  <span className="mx-2 text-line">•</span>
                  Eigen risico {premium.currency} {premium.deductible}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {premium.coverage.map((c) => (
                    <Badge key={c} variant="outline" className="border-line text-ink-soft">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Premie
                </p>
                <p className="font-mono text-2xl font-bold tabular-nums text-ink">
                  {premium.currency} {premium.monthlyPremium}
                  <span className="ml-1 text-sm font-medium text-ink-soft">/mnd</span>
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

interface CompanyHeaderProps {
  name: string
  logoInitial: string
  logoUrl?: string
  description: string
  website: string
  regionLabel: string
  regionFlag: string
  averageRating?: number
}

export function CompanyHeader({
  name,
  logoInitial,
  logoUrl,
  description,
  website,
  regionLabel,
  regionFlag,
  averageRating,
}: CompanyHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <CompanyLogo name={name} logoInitial={logoInitial} logoUrl={logoUrl} size="lg" />
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-slab text-3xl font-bold text-ink">{name}</h1>
          <Badge variant="outline" className="border-line text-ink-soft">
            {regionFlag} {regionLabel}
          </Badge>
        </div>
        {averageRating !== undefined && (
          <div className="mt-2 flex items-center gap-1 text-sm text-ink-soft">
            <Star className="h-4 w-4 fill-stamp-dark text-stamp-dark" />
            {averageRating.toFixed(1)} gemiddelde beoordeling
          </div>
        )}
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{description}</p>
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-trust hover:underline"
        >
          Bezoek officiële website →
        </a>
      </div>
    </div>
  )
}
