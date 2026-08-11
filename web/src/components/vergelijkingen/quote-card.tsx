import {
  Car,
  Plane,
  Home as HomeIcon,
  ShieldCheck,
  Star,
  BadgeCheck,
  ArrowRight,
  MessageSquare,
  ExternalLink,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle } from '@/components/ui/card'
import { CompanyLogo } from '@/components/companies/company-logo'
import { getCompanyBySlug } from '@/lib/data/companies'
import type { InsuranceType, Quote } from '@/lib/types/insurance'

interface QuoteCardProps {
  quote: Quote
  insuranceType?: InsuranceType
}

export function QuoteCard({ quote, insuranceType }: QuoteCardProps) {
  const company = getCompanyBySlug(quote.companySlug)

  return (
    <Card className="hover-lift rise-in flex flex-col gap-6 border-line bg-paper-raised p-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <CompanyLogo name={quote.insurer} logoInitial={quote.logoInitial} logoUrl={company?.logoUrl} size="lg" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>
              <Link
                to="/maatschappijen/$slug"
                params={{ slug: quote.companySlug }}
                search={{ tab: 'premiums' }}
                className="hover:text-trust transition-colors"
              >
                {quote.insurer}
              </Link>
            </CardTitle>
            {quote.badge && (
              <Badge
                variant={
                  quote.badge === 'beste prijs'
                    ? 'success'
                    : quote.badge === 'beste dekking'
                      ? 'warning'
                      : 'default'
                }
              >
                <BadgeCheck className="h-3 w-3" /> {quote.badge}
              </Badge>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-sm text-ink-soft">
            <Star className="h-3.5 w-3.5 fill-stamp-dark text-stamp-dark" />
            {quote.rating.toFixed(1)}
            <span className="mx-2 text-line">•</span>
            Eigen risico {quote.currency} {quote.deductible}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {quote.coverage.map((c) => (
              <Badge key={c} variant="outline" className="border-line text-ink-soft">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        <div className="text-right">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Premie
          </p>
          <p className="font-mono text-2xl font-bold tabular-nums text-ink">
            {quote.currency} {quote.monthlyPremium}
            <span className="ml-1 text-sm font-medium text-ink-soft">/mnd</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" size="lg">
            <Link
              to="/maatschappijen/$slug"
              params={{ slug: quote.companySlug }}
              search={{ tab: 'reviews' }}
            >
              <MessageSquare className="h-4 w-4" /> Reviews
            </Link>
          </Button>
          <Button asChild size="lg" className="bg-stamp-dark hover:bg-stamp-dark/90">
            <Link
              to="/maatschappijen/$slug"
              params={{ slug: quote.companySlug }}
              search={{ tab: 'premiums', type: insuranceType }}
            >
              Bekijk opties <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {company?.website && (
            <Button asChild variant="outline" size="lg">
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Website
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export const insuranceTypeIcons = {
  motor: Car,
  reis: Plane,
  woon: HomeIcon,
  leven: ShieldCheck,
} as const
