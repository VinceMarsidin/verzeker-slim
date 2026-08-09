import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { maatschappijen, verzekeringen } from '#/db/schema'
import { requireAdmin } from '#/lib/require-admin'
import { premieInputSchema } from '#/lib/schemas/premie'
import { validateBody } from '#/lib/validate-body'

export const Route = createFileRoute('/api/premies/')({
  server: {
    handlers: {
      // Publiek: gebruikt door zowel de vergelijkingspagina als het dashboard.
      // Alleen het aanmaken/wijzigen van premies vereist adminrechten.
      GET: async () => {
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

        const { data: body, error } = await validateBody(
          request,
          premieInputSchema,
        )
        if (error) return error

        const [created] = await db
          .insert(verzekeringen)
          .values({
            categorie: body.categorie,
            type: body.type,
            premieBedrag: body.premieBedrag,
            maatschappijId: body.maatschappijId,
          })
          .returning()

        return Response.json(created, { status: 201 })
      },
    },
  },
})
