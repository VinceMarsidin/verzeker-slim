import { authClient } from '#/lib/auth-client'

/** Na succesvolle login: admins naar dashboard, overige gebruikers naar home. */
export async function getPostLoginPath(): Promise<'/dashboard' | '/'> {
  const { data } = await authClient.getSession()
  const role = (data?.user as { role?: string } | undefined)?.role
  return role === 'admin' ? '/dashboard' : '/'
}
