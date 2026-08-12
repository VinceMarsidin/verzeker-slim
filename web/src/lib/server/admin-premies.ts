import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { asc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { companies, premiums } from '@/db/schema'
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

        const rows = await db
            .select({
                id: premiums.id,
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
            .orderBy(asc(companies.name))

        return rows
    },
)