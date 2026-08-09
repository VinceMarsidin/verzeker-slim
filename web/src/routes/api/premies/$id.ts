import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { verzekeringen } from '#/db/schema'
import { requireAdmin } from '#/lib/require-admin'
import { premieInputSchema } from '#/lib/schemas/premie'
import { validateBody } from '#/lib/validate-body'

export const Route = createFileRoute('/api/premies/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const guard = await requireAdmin(request)
        if (guard instanceof Response) return guard

        const [item] = await db
          .select()
          .from(verzekeringen)
          .where(eq(verzekeringen.id, Number(params.id)))

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
          premieInputSchema,
        )
        if (error) return error

        const [updated] = await db
          .update(verzekeringen)
          .set({
            categorie: body.categorie,
            type: body.type,
            premieBedrag: body.premieBedrag,
            maatschappijId: body.maatschappijId,
          })
          .where(eq(verzekeringen.id, Number(params.id)))
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
          .delete(verzekeringen)
          .where(eq(verzekeringen.id, Number(params.id)))

        return new Response(null, { status: 204 })
      },
    },
  },
})
