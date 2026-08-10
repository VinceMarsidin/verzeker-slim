import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { registerSchema, type RegisterInput } from '@/lib/validators/auth.schema'
import { authClient } from '@/lib/auth-client'
import { LogoAnimated } from '@/components/logo-animated'

export const Route = createFileRoute('/account/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
      name: data.name,
      email: data.email,
      password: data.password,
    })
    if (result.error) {
      setError('root', { message: 'Registratie mislukt, probeer het opnieuw' })
      return
    }
    await navigate({ to: '/dashboard' })
  }

  return (
    <div className="isolate grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-14 text-paper md:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex flex-col items-start">
          <LogoAnimated size={84} />
          <h2 className="mt-8 max-w-sm font-slab text-3xl font-bold leading-tight">
            Word gratis lid en vergelijk zonder gedoe.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] text-paper/70">
            Maak een account aan om vergelijkingen op te slaan en reviews te
            plaatsen over verzekeraars in Suriname.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck className="h-4 w-4 text-stamp" />
              </div>
              <span className="text-sm text-paper/80">37+ verzekeraars objectief vergeleken</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Users className="h-4 w-4 text-stamp" />
              </div>
              <span className="text-sm text-paper/80">100% gratis, geen verborgen kosten</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Sparkles className="h-4 w-4 text-stamp" />
              </div>
              <span className="text-sm text-paper/80">Jouw gegevens blijven van jou</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-paper px-8 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-block font-slab text-xl font-bold text-ink md:hidden">
            Verzeker<span className="text-stamp-dark">Slim</span>
          </Link>

          <h1 className="font-slab text-3xl font-bold text-ink">Account aanmaken</h1>
          <p className="mt-2 text-ink-soft">
            Maak een gratis account aan om reviews te plaatsen.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-ink">
                Naam
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="name"
                  type="text"
                  placeholder="Jouw volledige naam"
                  {...register('name')}
                  className="w-full rounded-[6px] border border-line bg-paper-raised py-2.5 pl-10 pr-3 text-ink outline-none transition-colors focus:border-stamp-dark focus:ring-2 focus:ring-stamp/25"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
                E-mailadres
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="email"
                  type="email"
                  placeholder="naam@voorbeeld.com"
                  {...register('email')}
                  className="w-full rounded-[6px] border border-line bg-paper-raised py-2.5 pl-10 pr-3 text-ink outline-none transition-colors focus:border-stamp-dark focus:ring-2 focus:ring-stamp/25"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
                Wachtwoord
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full rounded-[6px] border border-line bg-paper-raised py-2.5 pl-10 pr-10 text-ink outline-none transition-colors focus:border-stamp-dark focus:ring-2 focus:ring-stamp/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                  aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-ink">
                Bevestig wachtwoord
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className="w-full rounded-[6px] border border-line bg-paper-raised py-2.5 pl-10 pr-10 text-ink outline-none transition-colors focus:border-stamp-dark focus:ring-2 focus:ring-stamp/25"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                  aria-label={showConfirm ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {errors.root && (
              <p className="rounded-[6px] bg-red-50 px-3 py-2 text-sm text-red-600">
                {errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stamp-dark py-2.5 hover:bg-stamp-dark/90"
            >
              {isSubmitting ? 'Bezig...' : 'Account aanmaken'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            Al een account?{' '}
            <Link to="/account/login" className="font-semibold text-stamp-dark hover:underline">
              Inloggen
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
