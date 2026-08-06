import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { registerSchema, type RegisterInput } from '@/lib/validators/auth.schema'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/account/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    const result = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    })
    if (result.error) {
      setError('root', { message: result.error.message ?? 'Registratie mislukt' })
      return
    }
    await navigate({ to: '/account' })
  }

  return (
    <div className="min-h-screen bg-paper px-8 py-20">
      <div className="mx-auto max-w-md">
        <h1 className="font-slab text-3xl font-bold text-ink">Account aanmaken</h1>
        <p className="mt-2 text-ink-soft">
          Maak een gratis account aan om reviews te plaatsen.
        </p>

        <Card className="mt-8 border-line bg-paper-raised p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-ink">
                Naam
              </label>
              <input
                id="name"
                {...register('name')}
                className="w-full rounded-[4px] border border-line bg-paper px-3 py-2 text-ink"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full rounded-[4px] border border-line bg-paper px-3 py-2 text-ink"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="w-full rounded-[4px] border border-line bg-paper px-3 py-2 text-ink"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-ink">
                Bevestig wachtwoord
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="w-full rounded-[4px] border border-line bg-paper px-3 py-2 text-ink"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {errors.root && (
              <p className="text-sm text-red-600">{errors.root.message}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stamp-dark hover:bg-stamp-dark/90"
            >
              {isSubmitting ? 'Bezig...' : 'Account aanmaken'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Al een account?{' '}
            <Link to="/account/login" className="font-medium text-trust hover:underline">
              Inloggen
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
