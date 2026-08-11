import { createFileRoute } from '@tanstack/react-router'
import { desc } from 'drizzle-orm'

import { db } from '#/db'
import { contactMessages } from '#/db/schema'
import { requireAdmin } from '#/lib/require-admin'

export const Route = createFileRoute('/api/contact/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request)
        if (guard instanceof Response) return guard

        const data = await db
          .select()
          .from(contactMessages)
          .orderBy(desc(contactMessages.createdAt))

        return Response.json(data)
      },
    },
  },
})