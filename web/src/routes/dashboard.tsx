import { createFileRoute, Navigate } from '@tanstack/react-router'

import { authClient } from '#/lib/auth-client'
import { DashboardShell } from '../components/dashboard/dashboard-shell'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

// ---------------------------------------------------------------------------
// Root component: auth-guard, daarna het echte dashboard
// ---------------------------------------------------------------------------

// TODO: zet terug op false voordat dit naar productie gaat.
// Schakelt de auth-guard uit zodat je zonder inloggen aan het
// dashboard-design kunt werken.
const DISABLE_AUTH_GUARD_FOR_DESIGN = false

function DashboardPage() {
  const { data: session, isPending } = authClient.useSession()

  if (DISABLE_AUTH_GUARD_FOR_DESIGN) {
    return <DashboardShell adminName="Test Admin" />
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Laden...
      </div>
    )
  }

  if (!session?.user) {
    return <Navigate to="/" />
  }

  const role = (session.user as { role?: string }).role
  if (role !== 'admin') {
    return <Navigate to="/" />
  }

  return <DashboardShell adminName={session.user.name} />
}
