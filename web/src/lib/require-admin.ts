import { auth } from '#/lib/auth'

/**
 * Controleert of het inkomende request van een ingelogde admin komt.
 * Geeft de sessie terug als het goed is, of een Response (401/403) als het
 * request geweigerd moet worden.
 *
 * Gebruik in een API-route:
 *
 *   const guard = await requireAdmin(request)
 *   if (guard instanceof Response) return guard
 *   const { session } = guard
 */
export async function requireAdmin(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    return Response.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const role = (session.user as { role?: string }).role
  if (role !== 'admin') {
    return Response.json(
      { error: 'Geen toegang: adminrechten vereist' },
      { status: 403 },
    )
  }

  return session
}
