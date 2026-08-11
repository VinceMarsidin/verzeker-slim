import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export function NavbarAuth() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="h-8 w-20 animate-pulse rounded-[4px] bg-line/40" />
  }

  if (session?.user) {
    const initial = session.user.name?.charAt(0).toUpperCase() ?? 'U'
    const role = (session.user as { role?: string }).role

    return (
      <div className="flex items-center gap-4 border-l border-line pl-4">
        {/* Alleen admins zien de Dashboard-link, zelfde stijl als de overige paginalinks */}
        {role === 'admin' && (
          <Link
            to="/dashboard"
            className="relative py-1 text-sm font-medium text-ink after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-stamp-dark after:transition-transform after:duration-200 hover:after:scale-x-100"
          >
            Dashboard
          </Link>
        )}

        {/* Accountinformatie, klikbaar naar het profiel */}
        <Link
          to="/account"
          className="flex items-center gap-2 rounded-[4px] transition-colors hover:bg-paper-raised"
        >
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[4px] border border-line bg-paper-raised text-xs font-semibold text-stamp-dark">
            {session.user.image ? (
              <img src={session.user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </span>
          <span className="hidden text-sm font-medium text-ink sm:inline">
            {session.user.name ?? session.user.email}
          </span>
        </Link>

        {/* Uitloggen als volle knop, zelfde stijl als Registreren */}
        <Button
          type="button"
          size="sm"
          onClick={() => void authClient.signOut()}
          className="bg-stamp-dark hover:bg-stamp-dark/90"
        >
          Uitloggen
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 border-l border-line pl-4">
      <Button asChild variant="outline" size="sm">
        <Link to="/account/login">Inloggen</Link>
      </Button>
      <Button asChild size="sm" className="bg-stamp-dark hover:bg-stamp-dark/90">
        <Link to="/account/register">Registreren</Link>
      </Button>
    </div>
  )
}
