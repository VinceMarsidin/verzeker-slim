import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { asc, avg, eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db'
import { companies, premiums, reviews } from '@/db/schema'
import { auth } from '@/lib/auth'
import { premiumAdminSchema } from '@/lib/validators/premium.schema'

async function vereisAdmin() {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
        throw new Error('Niet ingelogd.')
    }
    const role = (session.user as { role?: string }).role
    if (role !== 'admin') {
        throw new Error('Geen toegang: adminrechten vereist.')
    }
    return session
}

export const haalAllePremies = createServerFn({ method: 'GET' }).handler(
    async () => {
        await vereisAdmin()

        const [rows, gemiddeldeRatingsRows] = await Promise.all([
            db
                .select({
                    id: premiums.id,
                    companyId: companies.id,
                    companyName: companies.name,
                    companySlug: companies.slug,
                    region: companies.region,
                    insuranceType: premiums.insuranceType,
                    monthlyPremium: premiums.monthlyPremium,
                    currency: premiums.currency,
                    deductible: premiums.deductible,
                    rating: premiums.rating,
                    coverage: premiums.coverage,
                    badge: premiums.badge,
                })
                .from(premiums)
                .innerJoin(companies, eq(premiums.companyId, companies.id))
                .orderBy(asc(companies.name)),

            db
                .select({ companyId: reviews.companyId, avgRating: avg(reviews.rating) })
                .from(reviews)
                .groupBy(reviews.companyId),
        ])

        const gemiddeldeRatings = new Map(
            gemiddeldeRatingsRows.map((r) => [r.companyId, Number(r.avgRating)]),
        )

        return rows.map((row) => ({
            ...row,
            rating: gemiddeldeRatings.get(row.companyId) ?? row.rating,
            isReviewBased: gemiddeldeRatings.has(row.companyId),
        }))
    },
)

export const maakPremie = createServerFn({ method: 'POST' })
    .validator(premiumAdminSchema)
    .handler(async ({ data }) => {
        await vereisAdmin()

        const [aangemaakt] = await db
            .insert(premiums)
            .values({
                companyId: data.companyId,
                insuranceType: data.insuranceType,
                monthlyPremium: data.monthlyPremium,
                currency: data.currency,
                deductible: data.deductible,
                rating: data.rating,
                coverage: data.coverage,
                badge: data.badge || null,
            })
            .returning()

        return aangemaakt
    })

export const werkPremieBij = createServerFn({ method: 'POST' })
    .validator(premiumAdminSchema.extend({ id: z.number() }))
    .handler(async ({ data }) => {
        await vereisAdmin()

        const { id, ...velden } = data

        const [bijgewerkt] = await db
            .update(premiums)
            .set({
                companyId: velden.companyId,
                insuranceType: velden.insuranceType,
                monthlyPremium: velden.monthlyPremium,
                currency: velden.currency,
                deductible: velden.deductible,
                rating: velden.rating,
                coverage: velden.coverage,
                badge: velden.badge || null,
            })
            .where(eq(premiums.id, id))
            .returning()

        return bijgewerkt
    })

export const verwijderPremie = createServerFn({ method: 'POST' })
    .validator((id: number) => id)
    .handler(async ({ data: id }) => {
        await vereisAdmin()
        await db.delete(premiums).where(eq(premiums.id, id))
        return { success: true }
    })