import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { asc, count, eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db'
import { companies, premiums, reviews } from '@/db/schema'
import { auth } from '@/lib/auth'
import { companyAdminSchema } from '@/lib/validators/company.schema'

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

export const haalAlleMaatschappijen = createServerFn({ method: 'GET' }).handler(
    async () => {
        await vereisAdmin()


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

export const maakMaatschappij = createServerFn({ method: 'POST' })
    .validator(companyAdminSchema)
    .handler(async ({ data }) => {
        await vereisAdmin()

        const [bestaand] = await db
            .select({ id: companies.id })
            .from(companies)
            .where(eq(companies.slug, data.slug))
            .limit(1)

        if (bestaand) {
            throw new Error('Er bestaat al een maatschappij met deze slug.')
        }

        const [aangemaakt] = await db
            .insert(companies)
            .values({
                slug: data.slug,
                name: data.name,
                logoInitial: data.logoInitial,
                logoUrl: data.logoUrl || null,
                homepageImage: data.homepageImage || null,
                region: data.region,
                website: data.website,
                description: data.description,
            })
            .returning()

        return aangemaakt
    })

export const werkMaatschappijBij = createServerFn({ method: 'POST' })
    .validator(companyAdminSchema.extend({ id: z.number() }))
    .handler(async ({ data }) => {
        await vereisAdmin()

        const { id, ...velden } = data

        const [bestaand] = await db
            .select({ id: companies.id })
            .from(companies)
            .where(eq(companies.slug, velden.slug))
            .limit(1)

        if (bestaand && bestaand.id !== id) {
            throw new Error('Er bestaat al een andere maatschappij met deze slug.')
        }

        const [bijgewerkt] = await db
            .update(companies)
            .set({
                slug: velden.slug,
                name: velden.name,
                logoInitial: velden.logoInitial,
                logoUrl: velden.logoUrl || null,
                homepageImage: velden.homepageImage || null,
                region: velden.region,
                website: velden.website,
                description: velden.description,
            })
            .where(eq(companies.id, id))
            .returning()

        return bijgewerkt
    })

export const verwijderMaatschappij = createServerFn({ method: 'POST' })
    .validator((id: number) => id)
    .handler(async ({ data: id }) => {
        await vereisAdmin()
        await db.delete(companies).where(eq(companies.id, id))
        return { success: true }
    })