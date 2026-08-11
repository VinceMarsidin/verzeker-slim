import { createFileRoute } from '@tanstack/react-router'

import { requireAdminBeforeLoad } from '#/lib/require-admin-route'

export const Route = createFileRoute('/admin/users')({
  beforeLoad: requireAdminBeforeLoad,
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/users"!</div>
}