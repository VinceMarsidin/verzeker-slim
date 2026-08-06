import { ExternalLink, MessageSquare, Shield } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Company, InsuranceType, Region } from '@/lib/types/insurance'
import { regions } from '@/lib/types/insurance'

interface CompanyDirectoryProps {
  companies: Company[]
  region: Region
  insuranceType: InsuranceType
}

export function CompanyDirectory({ companies, region, insuranceType }: CompanyDirectoryProps) {
  const regionInfo = regions.find((r) => r.value === region)
  const gridColumns =
    companies.length === 4
      ? 'sm:grid-cols-2 lg:grid-cols-2'
      : 'sm:grid-cols-2 lg:grid-cols-3'

  if (companies.length === 0) return null

  return (
    <section className="mx-auto mt-16 max-w-5xl px-8">
      <div className="mb-6">
        <h2 className="font-slab text-2xl font-bold text-ink">
          Alle maatschappijen in {regionInfo?.label ?? region}
        </h2>
        <p className="mt-2 text-ink-soft">
          Bekijk per verzekeraar de premies, dekkingen en reviews — of ga direct naar hun
          officiële website.
        </p>
      </div>

      <div className={`grid gap-4 ${gridColumns}`}>
        {companies.map((company) => (
          <Card
            key={company.slug}
            className="flex flex-col border-line bg-paper-raised p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-line bg-paper font-mono text-sm font-bold text-stamp-dark">
                {company.logoInitial}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-ink">{company.name}</h3>
                <Badge variant="outline" className="mt-1 border-line text-xs text-ink-soft">
                  {regionInfo?.flag} {regionInfo?.label}
                </Badge>
              </div>
            </div>

            <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-soft">
              {company.description}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <Button asChild size="sm" className="w-full bg-stamp-dark hover:bg-stamp-dark/90">
                <Link
                  to="/maatschappijen/$slug"
                  params={{ slug: company.slug }}
                  search={{ tab: 'premiums', type: insuranceType }}
                >
                  <Shield className="h-3.5 w-3.5" /> Premies & opties
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link
                    to="/maatschappijen/$slug"
                    params={{ slug: company.slug }}
                    search={{ tab: 'reviews' }}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Reviews
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" /> Website
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
