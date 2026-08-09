import { createServerFn } from '@tanstack/react-start'
import { quotesQuerySchema } from '@/lib/validators/company.schema'
import {
  fetchQuotes,
  getCompany,
  fetchCompanyPremiums,
  listReviews,
  listCompanies,
} from '@/lib/services/insurance'

export const getQuotesFn = createServerFn({ method: 'GET' })
  .validator(quotesQuerySchema)
  .handler(async ({ data }) => {
    return fetchQuotes(data.region, data.type)
  })

export const getCompanyFn = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const company = await getCompany(slug)
    if (!company) throw new Error('Maatschappij niet gevonden')

    const [premiums, companyReviews] = await Promise.all([
      fetchCompanyPremiums(slug),
      listReviews(slug),
    ])

    return { company, premiums, reviews: companyReviews }
  })

export const getCompaniesFn = createServerFn({ method: 'GET' })
  .validator((region?: string) => region)
  .handler(async ({ data: region }) => {
    return listCompanies(region as Parameters<typeof listCompanies>[0])
  })