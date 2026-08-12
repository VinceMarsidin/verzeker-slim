import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { ComparisonView } from '@/components/vergelijkingen/comparison-view'
import { getCompaniesFn, getQuotesFn } from '@/lib/server/insurance'
import { insuranceTypeSchema, regionSchema } from '@/lib/validators/company.schema'
import type { InsuranceType, Region } from '@/lib/types/insurance'
import { seo, seoLinks } from '@/lib/seo'

const searchSchema = z.object({
  type: insuranceTypeSchema.optional().catch('motor'),
  region: regionSchema.optional().catch('suriname'),
})

// Nette labels voor in de <title>/<meta description>, i.p.v. de rauwe slug.
const typeLabels: Record<InsuranceType, string> = {
  motor: 'motorverzekeringen',
  reis: 'reisverzekeringen',
  woon: 'woonverzekeringen',
  leven: 'levensverzekeringen',
}

export const Route = createFileRoute('/vergelijkingen')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    region: search.region ?? 'suriname',
    type: search.type ?? 'motor',
  }),
  loader: async ({ deps }) => {
    const [quotes, companies] = await Promise.all([
      getQuotesFn({ data: { region: deps.region, type: deps.type } }),
      getCompaniesFn({ data: deps.region }),
    ])
    return { quotes, companies, region: deps.region, type: deps.type }
  },
  // Canonical wijst altijd naar /vergelijkingen zonder query-parameters.
  // Dat voorkomt dat Google elke type/region-combinatie als aparte
  // (bijna-duplicate) pagina indexeert — de title/description passen we
  // wel aan op basis van de query, voor een relevante snippet in resultaten.
  head: ({ match }) => {
    const type = (match.search as { type?: InsuranceType }).type ?? 'motor'
    const label = typeLabels[type] ?? typeLabels.motor
    return {
      meta: seo({
        title: `Vergelijk ${label}`,
        description: `Vergelijk premies en dekking voor ${label} van meerdere verzekeraars naast elkaar. Onafhankelijk, actueel en gratis.`,
        path: '/vergelijkingen',
      }),
      links: seoLinks('/vergelijkingen'),
    }
  },
  component: VergelijkingenPage,
})

function VergelijkingenPage() {
  const { quotes, companies, region, type } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })

  function updateSearch(next: { type?: InsuranceType; region?: Region }) {
    void navigate({
      search: (prev) => ({
        ...prev,
        ...next,
      }),
    })
  }

  return (
    <ComparisonView
      type={type}
      region={region}
      quotes={quotes}
      companies={companies}
      onTypeChange={(nextType) => updateSearch({ type: nextType })}
      onRegionChange={(nextRegion) => updateSearch({ region: nextRegion })}
    />
  )
}