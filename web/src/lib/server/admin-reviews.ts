import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { companies, reviews } from '@/db/schema'
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

export const haalAlleReviews = createServerFn({ method: 'GET' }).handler(
    async () => {
        await vereisAdmin()

        const rows = await db
            .select({
                id: reviews.id,
                companyName: companies.name,
                companySlug: companies.slug,
                userName: reviews.userName,
                rating: reviews.rating,
                title: reviews.title,
                body: reviews.body,
                createdAt: reviews.createdAt,
            })
            .from(reviews)
            .innerJoin(companies, eq(reviews.companyId, companies.id))
            .orderBy(desc(reviews.createdAt))

        return rows
    },
)

export const verwijderReview = createServerFn({ method: 'POST' })
    .validator((id: number) => id)
    .handler(async ({ data: id }) => {
        await vereisAdmin()
        await db.delete(reviews).where(eq(reviews.id, id))
        return { success: true }
    })