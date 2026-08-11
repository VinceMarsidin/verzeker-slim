import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { companies, reviews } from '@/db/schema'
import { auth } from '@/lib/auth'

export const haalMijnReviews = createServerFn({ method: 'GET' }).handler(
    async () => {
        const request = getRequest()
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
            throw new Error('Niet ingelogd.')
        }

        const rows = await db
            .select({
                id: reviews.id,
                rating: reviews.rating,
                title: reviews.title,
                body: reviews.body,
                createdAt: reviews.createdAt,
                companyNaam: companies.name,
                companySlug: companies.slug,
            })
            .from(reviews)
            .innerJoin(companies, eq(reviews.companyId, companies.id))
            .where(eq(reviews.userId, session.user.id))
            .orderBy(desc(reviews.createdAt))

        return rows
    },
)