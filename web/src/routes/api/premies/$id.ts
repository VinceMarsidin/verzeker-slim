import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { verzekeringen } from '#/db/schema'
import { requireAdmin } from '#/lib/require-admin'

interface PremieInput {
  categorie: string
  type: string
  premieBedrag: string
  maatschappijId: number
}

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

        const body = (await request.json()) as PremieInput

        const [updated] = await db
          .update(verzekeringen)
          .set({
            categorie: body.categorie,
            type: body.type,
            premieBedrag: body.premieBedrag,
            maatschappijId: Number(body.maatschappijId),
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
