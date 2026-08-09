import { createFileRoute } from '@tanstack/react-router'

import { db } from '#/db'
import { maatschappijen } from '#/db/schema'
import { requireAdmin } from '#/lib/require-admin'
import { maatschappijInputSchema } from '#/lib/schemas/maatschappij'
import { validateBody } from '#/lib/validate-body'

export const Route = createFileRoute('/api/maatschappijen/')({
  server: {
    handlers: {
      // Publiek: gebruikt door de vergelijkingspagina en het dashboard
      GET: async () => {
        const data = await db.select().from(maatschappijen)
        return Response.json(data)
      },

      // Alleen admins mogen nieuwe maatschappijen toevoegen
      POST: async ({ request }) => {
        const guard = await requireAdmin(request)
        if (guard instanceof Response) return guard

        const { data: body, error } = await validateBody(
          request,
          maatschappijInputSchema,
        )
        if (error) return error

        const [created] = await db
          .insert(maatschappijen)
          .values({
            naam: body.naam,
            logoUrl: body.logoUrl ?? null,
            contactEmail: body.contactEmail ?? null,
          })
          .returning()

        return Response.json(created, { status: 201 })
      },
    },
  },
})
