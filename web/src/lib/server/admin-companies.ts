import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { asc, count } from 'drizzle-orm'

import { db } from '@/db'
import { companies, premiums, reviews } from '@/db/schema'
import { auth } from '@/lib/auth'

export const haalAlleMaatschappijen = createServerFn({ method: 'GET' }).handler(
    async () => {
        const request = getRequest()
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
            throw new Error('Niet ingelogd.')
        }

        const role = (session.user as { role?: string }).role
        if (role !== 'admin') {
            throw new Error('Geen toegang: adminrechten vereist.')
        }


        const [bedrijven, premieTellingen, reviewTellingen] = await Promise.all([
            db.select().from(companies).orderBy(asc(companies.name)),
            db
                .select({ companyId: premiums.companyId, aantal: count() })
                .from(premiums)
                .groupBy(premiums.companyId),
            db
                .select({ companyId: reviews.companyId, aantal: count() })
                .from(reviews)
                .groupBy(reviews.companyId),
        ])

        const premieMap = new Map(premieTellingen.map((p) => [p.companyId, p.aantal]))
        const reviewMap = new Map(reviewTellingen.map((r) => [r.companyId, r.aantal]))

        return bedrijven.map((bedrijf) => ({
            ...bedrijf,
            aantalPremies: premieMap.get(bedrijf.id) ?? 0,
            aantalReviews: reviewMap.get(bedrijf.id) ?? 0,
        }))
    },
)