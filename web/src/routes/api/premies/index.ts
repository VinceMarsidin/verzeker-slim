import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { maatschappijen, verzekeringen } from '#/db/schema'
import { requireAdmin } from '#/lib/require-admin'

interface PremieInput {
  categorie: string
  type: string
  premieBedrag: string
  maatschappijId: number
}

export const Route = createFileRoute('/api/premies/')({
  server: {
    handlers: {
      // Alleen admins zien het volledige CRUD-overzicht in het dashboard
      GET: async ({ request }) => {
        const guard = await requireAdmin(request)
        if (guard instanceof Response) return guard

        const rows = await db
          .select({
            id: verzekeringen.id,
            categorie: verzekeringen.categorie,
            type: verzekeringen.type,
            premieBedrag: verzekeringen.premieBedrag,
            maatschappijId: verzekeringen.maatschappijId,
            maatschappijNaam: maatschappijen.naam,
          })
          .from(verzekeringen)
          .leftJoin(
            maatschappijen,
            eq(verzekeringen.maatschappijId, maatschappijen.id),
          )

        return Response.json(rows)
      },

      POST: async ({ request }) => {
        const guard = await requireAdmin(request)
        if (guard instanceof Response) return guard

        const body = (await request.json()) as PremieInput
        if (!body.categorie || !body.type || !body.premieBedrag || !body.maatschappijId) {
          return Response.json(
            { error: 'categorie, type, premieBedrag en maatschappijId zijn verplicht' },
            { status: 400 },
          )
        }

        const [created] = await db
          .insert(verzekeringen)
          .values({
            categorie: body.categorie,
            type: body.type,
            premieBedrag: body.premieBedrag,
            maatschappijId: Number(body.maatschappijId),
          })
          .returning()

        return Response.json(created, { status: 201 })
      },
    },
  },
})
