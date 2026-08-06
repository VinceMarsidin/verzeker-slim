import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { quotesQuerySchema, companySlugSchema } from '@/lib/validators/company.schema'
import { reviewSchema } from '@/lib/validators/review.schema'
import { contactSchema } from '@/lib/validators/contact.schema'
import {
  listCompanies,
  getCompany,
  fetchQuotes,
  fetchCompanyPremiums,
  listReviews,
  listUserReviews,
  createReview,
} from '@/lib/services/insurance'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { contactMessages } from '@/db/schema'

const app = new Hono().basePath('/api/v1')

app.onError((err, c) => {
  const message = err instanceof Error ? err.message : 'Er ging iets mis'
  const status = message.includes('ingelogd') || message.includes('review geplaatst') ? 400 : 500
  return c.json({ error: message }, status)
})

app.get('/companies', async (c) => {
  const region = c.req.query('region')
  const data = await listCompanies(region as Parameters<typeof listCompanies>[0])
  return c.json({ data })
})

app.get('/companies/:slug', zValidator('param', companySlugSchema), async (c) => {
  const { slug } = c.req.valid('param')
  const company = await getCompany(slug)
  if (!company) return c.json({ error: 'Niet gevonden' }, 404)
  const premiums = await fetchCompanyPremiums(slug)
  const companyReviews = await listReviews(slug)
  return c.json({ data: { company, premiums, reviews: companyReviews } })
})

app.get('/quotes', zValidator('query', quotesQuerySchema), async (c) => {
  const { region, type } = c.req.valid('query')
  const data = await fetchQuotes(region, type)
  return c.json({ data })
})

app.get('/reviews/me', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session?.user) {
    return c.json({ error: 'Je moet ingelogd zijn' }, 401)
  }
  const data = await listUserReviews(session.user.id)
  return c.json({
    data: data.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    })),
  })
})

app.get('/reviews/:slug', zValidator('param', companySlugSchema), async (c) => {
  const { slug } = c.req.valid('param')
  const data = await listReviews(slug)
  return c.json({ data })
})

app.post('/reviews', zValidator('json', reviewSchema), async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session?.user) {
    return c.json({ error: 'Je moet ingelogd zijn om een review te plaatsen' }, 401)
  }

  const input = c.req.valid('json')
  const result = await createReview(input, {
    id: session.user.id,
    name: session.user.name ?? session.user.email,
  })
  return c.json({ data: result }, 201)
})

app.post('/contact', zValidator('json', contactSchema), async (c) => {
  if (!process.env.DATABASE_URL) {
    return c.json({ error: 'Contactformulier is tijdelijk niet beschikbaar' }, 503)
  }

  const input = c.req.valid('json')
  const [saved] = await db
    .insert(contactMessages)
    .values({
      naam: input.naam,
      email: input.email,
      bericht: input.bericht,
    })
    .returning()

  return c.json({ data: { success: true, id: saved.id } }, 201)
})

export default app
