import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { contactBerichten } from '#/db/schema'
import { requireAdmin } from '#/lib/require-admin'

export const Route = createFileRoute('/api/contact/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const guard = await requireAdmin(request)
        if (guard instanceof Response) return guard

        const [item] = await db
          .select()
          .from(contactBerichten)
          .where(eq(contactBerichten.id, Number(params.id)))

        if (!item) {
          return Response.json({ error: 'Niet gevonden' }, { status: 404 })
        }
        return Response.json(item)
      },

      DELETE: async ({ request, params }) => {
        const guard = await requireAdmin(request)
        if (guard instanceof Response) return guard

        await db
          .delete(contactBerichten)
          .where(eq(contactBerichten.id, Number(params.id)))

        return new Response(null, { status: 204 })
      },
    },
  },
})
