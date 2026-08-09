import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { companies, premiums, reviews } from '@/db/schema'
import { companies as seedCompanies, getCompanyBySlug, getCompaniesByRegion } from '@/lib/data/companies'
import { getQuotes, getQuotesForCompany, quoteData } from '@/lib/data/quotes'
import type { InsuranceType, Quote, Region } from '@/lib/types/insurance'
import type { ReviewInput } from '@/lib/validators/review.schema'

export interface StoredReview {
  id: number
  companySlug: string
  companyName?: string
  userId: string
  userName: string
  rating: number
  title: string
  body: string
  createdAt: Date
}

async function useDatabase(): Promise<boolean> {
  return Boolean(process.env.DATABASE_URL)
}

export async function listCompanies(region?: Region) {
  if (!(await useDatabase())) {
    return region ? getCompaniesByRegion(region) : seedCompanies
  }

  const rows = region
    ? await db.select().from(companies).where(eq(companies.region, region))
    : await db.select().from(companies)

  if (rows.length === 0) {
    return region ? getCompaniesByRegion(region) : seedCompanies
  }

  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    logoInitial: row.logoInitial,
    region: row.region,
    website: row.website,
    description: row.description,
  }))
}

export async function getCompany(slug: string) {
  if (!(await useDatabase())) {
    return getCompanyBySlug(slug) ?? null
  }

  const [row] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1)
  if (!row) {
    return getCompanyBySlug(slug) ?? null
  }

  return {
    slug: row.slug,
    name: row.name,
    logoInitial: row.logoInitial,
    region: row.region,
    website: row.website,
    description: row.description,
  }
}

export async function fetchQuotes(region: Region, type: InsuranceType): Promise<Quote[]> {
  if (!(await useDatabase())) {
    return getQuotes(region, type)
  }

  const rows = await db
    .select({
      slug: companies.slug,
      name: companies.name,
      logoInitial: companies.logoInitial,
      monthlyPremium: premiums.monthlyPremium,
      currency: premiums.currency,
      deductible: premiums.deductible,
      rating: premiums.rating,
      coverage: premiums.coverage,
      badge: premiums.badge,
    })
    .from(premiums)
    .innerJoin(companies, eq(premiums.companyId, companies.id))
    .where(and(eq(companies.region, region), eq(premiums.insuranceType, type)))

  if (rows.length === 0) {
    return getQuotes(region, type)
  }

  return rows.map((row) => ({
    companySlug: row.slug,
    insurer: row.name,
    logoInitial: row.logoInitial,
    monthlyPremium: row.monthlyPremium,
    currency: row.currency,
    deductible: row.deductible,
    rating: row.rating,
    coverage: row.coverage,
    badge: row.badge as Quote['badge'] | undefined,
  }))
}

export async function fetchCompanyPremiums(slug: string): Promise<Quote[]> {
  if (!(await useDatabase())) {
    return getQuotesForCompany(slug)
  }

  const [company] = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1)
  if (!company) {
    return getQuotesForCompany(slug)
  }

  const rows = await db
    .select()
    .from(premiums)
    .where(eq(premiums.companyId, company.id))

  if (rows.length === 0) {
    return getQuotesForCompany(slug)
  }

  return rows.map((row) => ({
    companySlug: slug,
    insurer: company.name,
    logoInitial: company.logoInitial,
    monthlyPremium: row.monthlyPremium,
    currency: row.currency,
    deductible: row.deductible,
    rating: row.rating,
    coverage: row.coverage,
    badge: row.badge as Quote['badge'] | undefined,
    insuranceType: row.insuranceType,
  }))
}

export async function listReviews(companySlug: string): Promise<StoredReview[]> {
  if (!(await useDatabase())) {
    return []
  }

  const [company] = await db.select().from(companies).where(eq(companies.slug, companySlug)).limit(1)
  if (!company) return []

  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.companyId, company.id))
    .orderBy(reviews.createdAt)

  return rows.map((row) => ({
    id: row.id,
    companySlug,
    userId: row.userId,
    userName: row.userName,
    rating: row.rating,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt ?? new Date(),
  }))
}

export async function listUserReviews(userId: string): Promise<StoredReview[]> {
  if (!(await useDatabase())) {
    return []
  }

  const rows = await db
    .select({
      id: reviews.id,
      companySlug: companies.slug,
      companyName: companies.name,
      userId: reviews.userId,
      userName: reviews.userName,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .innerJoin(companies, eq(reviews.companyId, companies.id))
    .where(eq(reviews.userId, userId))
    .orderBy(reviews.createdAt)

  return rows.map((row) => ({
    id: row.id,
    companySlug: row.companySlug,
    companyName: row.companyName,
    userId: row.userId,
    userName: row.userName,
    rating: row.rating,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt ?? new Date(),
  }))
}

export async function createReview(
  input: ReviewInput,
  user: { id: string; name: string },
): Promise<{ id: number }> {
  const company = await getCompany(input.companySlug)
  if (!company) {
    throw new Error('Maatschappij niet gevonden')
  }

  if (!(await useDatabase())) {
    throw new Error('Database niet beschikbaar. Start PostgreSQL om reviews op te slaan.')
  }

  let [dbCompany] = await db.select().from(companies).where(eq(companies.slug, input.companySlug)).limit(1)

  if (!dbCompany) {
    ;[dbCompany] = await db
      .insert(companies)
      .values({
        slug: company.slug,
        name: company.name,
        logoInitial: company.logoInitial,
        region: company.region,
        website: company.website,
        description: company.description,
      })
      .returning()
  }

  const [existingReview] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.companyId, dbCompany.id), eq(reviews.userId, user.id)))
    .limit(1)

  if (existingReview) {
    throw new Error('Je hebt al een review geplaatst voor deze maatschappij')
  }

  const [saved] = await db
    .insert(reviews)
    .values({
      companyId: dbCompany.id,
      userId: user.id,
      userName: user.name,
      rating: input.rating,
      title: input.title,
      body: input.body,
    })
    .returning()

  return { id: saved.id }
}

export async function seedDatabase() {
  for (const company of seedCompanies) {
    const [existing] = await db.select().from(companies).where(eq(companies.slug, company.slug)).limit(1)
    if (existing) continue

    const [inserted] = await db
      .insert(companies)
      .values({
        slug: company.slug,
        name: company.name,
        logoInitial: company.logoInitial,
        region: company.region,
        website: company.website,
        description: company.description,
      })
      .returning()

    for (const [region, types] of Object.entries(quoteData)) {
      if (region !== company.region) continue
      for (const [type, quotes] of Object.entries(types)) {
        for (const quote of quotes) {
          if (quote.companySlug !== company.slug) continue
          await db.insert(premiums).values({
            companyId: inserted.id,
            insuranceType: type as InsuranceType,
            monthlyPremium: quote.monthlyPremium,
            currency: quote.currency,
            deductible: quote.deductible,
            rating: quote.rating,
            coverage: quote.coverage,
            badge: quote.badge ?? null,
          })
        }
      }
    }
  }
}
