import { useEffect, useState } from 'react'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { profileSchema, type ProfileInput } from '@/lib/validators/profile.schema'

export const Route = createFileRoute('/account/')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink-soft">
        Laden...
      </div>
    )
  }

  if (!session?.user) {
    return <Navigate to="/account/login" />
  }

  return <ProfileForm naam={session.user.name} email={session.user.email} />
}

function ProfileForm({ naam, email }: { naam: string; email: string }) {
  const [succes, setSucces] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { naam },
  })

  // Zorgt dat het formulier meebeweegt als de sessie later pas ingeladen is
  // (bijv. na een refresh) met een andere naam dan de eerste render.
  useEffect(() => {
    reset({ naam })
  }, [naam, reset])

  async function onSubmit(values: ProfileInput) {
    setSucces(false)
    setServerError(null)
    try {
      const result = await authClient.updateUser({ name: values.naam })
      if (result.error) {
        setServerError('Bijwerken mislukt. Probeer het opnieuw.')
        return
      }
      setSucces(true)
    } catch {
      setServerError('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  const initial = naam?.charAt(0).toUpperCase() ?? 'U'

  return (
    <div className="mx-auto max-w-lg px-8 py-16">
      <div className="mb-2 font-mono text-xs uppercase tracking-wide text-stamp-dark">
        Account
      </div>
      <h1 className="font-slab text-3xl font-bold text-ink">Mijn profiel</h1>
      <p className="mt-3 text-ink-soft">
        Werk je naam bij zoals die getoond wordt bij reviews en op de site.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-paper-raised text-xl font-semibold text-stamp-dark">
          {initial}
        </span>
        <div>
          <p className="font-semibold text-ink">{naam}</p>
          <p className="text-sm text-ink-soft">{email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label htmlFor="naam" className="mb-2 block text-sm font-semibold text-ink">
            Naam
          </label>
          <input
            id="naam"
            type="text"
            {...register('naam')}
            className="w-full rounded-[4px] border border-line bg-paper-raised px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
          />
          {errors.naam && (
            <p className="mt-1 text-xs text-red-600">{errors.naam.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">
            E-mailadres
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full cursor-not-allowed rounded-[4px] border border-line bg-line/20 px-4 py-3 text-sm text-ink-soft outline-none"
          />
          <p className="mt-1.5 text-xs text-ink-soft">
            E-mailadres wijzigen is nog niet mogelijk vanuit je profiel.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-stamp-dark hover:bg-stamp-dark/90"
        >
          {isSubmitting ? 'Opslaan...' : 'Wijzigingen opslaan'}
        </Button>

        {succes && (
          <p className="text-sm font-medium text-trust">Profiel bijgewerkt.</p>
        )}
        {serverError && (
          <p className="text-sm font-medium text-red-600">{serverError}</p>
        )}
      </form>
    </div>
  )
}
