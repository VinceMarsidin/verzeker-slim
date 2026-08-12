import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { asc, avg, eq } from 'drizzle-orm'

import { db } from '@/db'
import { companies, premiums, reviews } from '@/db/schema'
import { auth } from '@/lib/auth'

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

            // Los opgehaald, net als bij de maatschappijen-tellingen eerder —
            // gemiddelde review-rating per maatschappij.
            db
                .select({ companyId: reviews.companyId, avgRating: avg(reviews.rating) })
                .from(reviews)
                .groupBy(reviews.companyId),
        ])

        const gemiddeldeRatings = new Map(
            gemiddeldeRatingsRows.map((r) => [r.companyId, Number(r.avgRating)]),
        )

        // Terugval op de statische premiums.rating zolang een maatschappij nog
        // geen reviews heeft — zelfde regel als op de maatschappij-detailpagina.
        return rows.map((row) => ({
            ...row,
            rating: gemiddeldeRatings.get(row.companyId) ?? row.rating,
            isReviewBased: gemiddeldeRatings.has(row.companyId),
        }))
    },
)