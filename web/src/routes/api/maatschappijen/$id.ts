import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { maatschappijen } from '#/db/schema'
import { requireAdmin } from '#/lib/require-admin'
import { maatschappijInputSchema } from '#/lib/schemas/maatschappij'
import { validateBody } from '#/lib/validate-body'

export const Route = createFileRoute('/api/maatschappijen/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [item] = await db
          .select()
          .from(maatschappijen)
          .where(eq(maatschappijen.id, Number(params.id)))

        if (!item) {
          return Response.json({ error: 'Niet gevonden' }, { status: 404 })
        }
        return Response.json(item)
      },

      PUT: async ({ request, params }) => {
        const guard = await requireAdmin(request)
        if (guard instanceof Response) return guard

        const { data: body, error } = await validateBody(
          request,
          maatschappijInputSchema,
        )
        if (error) return error

        const [updated] = await db
          .update(maatschappijen)
          .set({
            naam: body.naam,
            logoUrl: body.logoUrl ?? null,
            contactEmail: body.contactEmail ?? null,
          })
          .where(eq(maatschappijen.id, Number(params.id)))
          .returning()

        if (!updated) {
          return Response.json({ error: 'Niet gevonden' }, { status: 404 })
        }
        return Response.json(updated)
      },

      DELETE: async ({ request, params }) => {
        const guard = await requireAdmin(request)
        if (guard instanceof Response) return guard

        await db
          .delete(maatschappijen)
          .where(eq(maatschappijen.id, Number(params.id)))

        return new Response(null, { status: 204 })
      },
    },
  },
})
