import { createFileRoute } from '@tanstack/react-router'
import honoApp from '@/server/hono/app'

export const Route = createFileRoute('/api/v1/$')({
  server: {
    handlers: {
      GET: ({ request }) => honoApp.fetch(request),
      POST: ({ request }) => honoApp.fetch(request),
      PUT: ({ request }) => honoApp.fetch(request),
      PATCH: ({ request }) => honoApp.fetch(request),
      DELETE: ({ request }) => honoApp.fetch(request),
    },
  },
})
