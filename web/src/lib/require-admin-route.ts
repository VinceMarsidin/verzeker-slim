import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'

import { auth } from '#/lib/auth'

// Haalt de sessie server-side op. Wordt gebruikt in beforeLoad, zodat de
// check al vóór het renderen gebeurt (geen "flits" van beschermde inhoud,
// en de route is écht niet bereikbaar zonder geldige sessie/rol).
const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  return auth.api.getSession({ headers: request.headers })
})

/**
 * Gebruik dit als `beforeLoad` op elke route die alleen voor admins is:
 *
 *   export const Route = createFileRoute('/dashboard')({
 *     beforeLoad: requireAdminBeforeLoad,
 *     component: RouteComponent,
 *   })
 *
 * - Niet ingelogd            -> redirect naar /account/login
 * - Ingelogd maar geen admin -> redirect naar / (publieke home)
 * - Wel admin                -> mag door
 *
 * Dit is de ECHTE toegangscontrole — los van of de "Dashboard"-knop
 * wel/niet in de navbar zichtbaar is. Zonder dit kan iedereen de URL
 * gewoon handmatig intypen.
 */
export async function requireAdminBeforeLoad() {
  const session = await getSession()

  if (!session?.user) {
    throw redirect({ to: '/account/login' })
  }

  const role = (session.user as { role?: string }).role
  if (role !== 'admin') {
    throw redirect({ to: '/' })
  }

  return { user: session.user }
}