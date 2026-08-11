import { createFileRoute } from '@tanstack/react-router'

import { requireAdminBeforeLoad } from '#/lib/require-admin-route'
import { DashboardShell } from '../components/dashboard/dashboard-shell'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireAdminBeforeLoad,
  component: DashboardPage,
})

function DashboardPage() {
  return <DashboardShell />
}