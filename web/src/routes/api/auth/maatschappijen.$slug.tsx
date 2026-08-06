import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { getCompanyFn } from '@/lib/server/insurance'
import { insuranceTypeSchema } from '@/lib/validators/company.schema'
import { regions } from '@/lib/types/insurance'
import { CompanyHeader, CompanyPremiums } from '@/components/companies/company-premiums'
import { ReviewList } from '@/components/companies/review-list'
import { ReviewForm } from '@/components/companies/review-form'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const searchSchema = z.object({
  tab: z.enum(['premiums', 'reviews']).optional().catch('premiums'),
  type: insuranceTypeSchema.optional(),
})

export const Route = createFileRoute('/api/auth/maatschappijen/$slug')({
  validateSearch: searchSchema,
  loader: async ({ params }) => getCompanyFn({ data: params.slug }),
  component: CompanyDetailPage,
})

function CompanyDetailPage() {
  const { company, premiums, reviews } = Route.useLoaderData()
  const { tab = 'premiums', type } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const router = useRouter()
  const region = regions.find((r) => r.value === company.region)

  const filteredPremiums = type
    ? premiums.filter((p) => p.insuranceType === type)
    : premiums

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : premiums[0]?.rating

  function setTab(nextTab: 'premiums' | 'reviews') {
    void navigate({
      search: (prev) => ({ ...prev, tab: nextTab }),
    })
  }

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <section className="mx-auto max-w-5xl px-8 py-14">
        <Button asChild variant="outline" size="sm" className="mb-8">
          <Link to="/vergelijkingen" search={{ region: company.region }}>
            <ArrowLeft className="h-4 w-4" /> Terug naar vergelijkingen
          </Link>
        </Button>

        <CompanyHeader
          name={company.name}
          logoInitial={company.logoInitial}
          description={company.description}
          website={company.website}
          regionLabel={region?.label ?? company.region}
          regionFlag={region?.flag ?? ''}
          averageRating={avgRating}
        />

        <div className="mt-12">
          <Tabs value={tab} onValueChange={(v) => setTab(v as 'premiums' | 'reviews')}>
            <TabsList>
              <TabsTrigger value="premiums">Premies & opties</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="premiums" className="mt-6">
              <CompanyPremiums premiums={filteredPremiums} highlightType={type} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-8">
              <ReviewForm
                companySlug={company.slug}
                onSubmitted={() => void router.invalidate()}
              />
              <ReviewList reviews={reviews} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
