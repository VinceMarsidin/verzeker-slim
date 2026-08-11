import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link, Navigate, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { profileSchema, type ProfileInput } from '@/lib/validators/profile.schema'
import { changePasswordSchema, type ChangePasswordInput } from '@/lib/validators/password.schema'
import { changeEmailSchema, type ChangeEmailInput } from '@/lib/validators/email.schema'
import { uploadAvatar } from '@/lib/server/avatar'
import { haalMijnReviews } from '@/lib/server/mijn-reviews'

export const Route = createFileRoute('/account/')({
  component: ProfilePage,
})

function MijnReviewsSectie() {
  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['mijn-reviews'],
    queryFn: () => haalMijnReviews(),
  })
  const [toonAlles, setToonAlles] = useState(false)

  function formatDatum(datum: string | Date | null) {
    if (!datum) return ''
    return new Date(datum).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const MAX_ZICHTBAAR = 3
  const zichtbareReviews =
    reviews && !toonAlles ? reviews.slice(0, MAX_ZICHTBAAR) : reviews
  const heeftMeer = (reviews?.length ?? 0) > MAX_ZICHTBAAR

  return (
    <section className="mt-4 rounded-[4px] border border-line bg-paper p-5">
      <p className="font-slab text-base font-bold text-ink">Mijn reviews</p>
      <p className="mt-1 text-sm text-ink-soft">
        Overzicht van reviews die je hebt geplaatst bij verzekeraars.
      </p>

      <div className="mt-4 space-y-3">
        {isLoading && <p className="text-sm text-ink-soft">Laden...</p>}
        {isError && (
          <p className="text-sm text-red-600">
            Er ging iets mis bij het ophalen van je reviews.
          </p>
        )}
        {reviews && reviews.length === 0 && (
          <p className="text-sm text-ink-soft">
            Je hebt nog geen reviews geplaatst. Plaats er een bij een
            maatschappij op de vergelijkingspagina.
          </p>
        )}

        {zichtbareReviews?.map((review) => (
          <div
            key={review.id}
            className="rounded-[4px] border border-line bg-paper-raised p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <Link
                to="/maatschappijen/$slug"
                params={{ slug: review.companySlug }}
                className="font-semibold text-ink hover:text-stamp-dark"
              >
                {review.companyNaam}
              </Link>
              <span className="shrink-0 font-mono text-xs text-ink-soft">
                {formatDatum(review.createdAt)}
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < review.rating
                    ? 'fill-stamp-dark text-stamp-dark'
                    : 'text-line'
                    }`}
                />
              ))}
            </div>

            <p className="mt-2 text-sm font-semibold text-ink">{review.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {review.body}
            </p>
          </div>
        ))}

        {heeftMeer && (
          <button
            type="button"
            onClick={() => setToonAlles((v) => !v)}
            className="text-sm font-medium text-stamp-dark hover:underline"
          >
            {toonAlles
              ? 'Toon minder'
              : `Bekijk alle ${reviews?.length} reviews`}
          </button>
        )}
      </div>
    </section>
  )
}

function CollapsibleSection({
  title,
  description,
  children,
  danger = false,
  defaultOpen = false,
}: {
  title: string
  description: string
  children: React.ReactNode
  danger?: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section
      className={`mt-4 overflow-hidden rounded-[4px] border ${danger ? 'border-red-200 bg-red-50/50' : 'border-line bg-paper'
        }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div>
          <p className={`font-slab text-base font-bold ${danger ? 'text-red-700' : 'text-ink'}`}>
            {title}
          </p>
          <p className={`mt-1 text-sm ${danger ? 'text-red-700/70' : 'text-ink-soft'}`}>
            {description}
          </p>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${danger ? 'text-red-500' : 'text-ink-soft'
            }`}
        />
      </button>
      {open && (
        <div className={`border-t p-5 pt-4 ${danger ? 'border-red-200' : 'border-line'}`}>
          {children}
        </div>
      )}
    </section>
  )
}

async function verversSessie() {
  await authClient.getSession({ query: { disableCookieCache: true } })
}

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

  return (
    <div className="bg-paper">
      <div className="relative overflow-hidden bg-paper">
        <img
          src="/backgrounds/gebergte.jpg"
          alt=""
          className="absolute inset-0 h-[640px] w-full object-cover md:h-[720px]"
        />
        <div className="absolute inset-0 h-[640px] bg-ink/75 md:h-[720px]" />

        <div className="relative pt-16 text-center md:pt-20">
          <div className="mx-auto max-w-md px-8">
            <div className="font-mono text-xs uppercase tracking-wide text-stamp">
              Account
            </div>
            <h1 className="mt-2 font-slab text-4xl font-bold text-paper">
              Mijn profiel
            </h1>
            <p className="mt-4 text-paper/80">
              Beheer je naam, profielfoto, wachtwoord en account op één
              plek.
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-lg px-8 pb-20">
          <div className="mt-25 rounded-[4px] border border-line bg-paper-raised p-8 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_24px_48px_-24px_rgba(13,59,102,0.35)] md:mt-35">
            <NaamSectie
              naam={session.user.name}
              email={session.user.email}
              image={session.user.image ?? null}
            />

            <MijnReviewsSectie />

            <div className="mt-8">
              <p className="mb-1 font-mono text-xs uppercase tracking-wide text-ink-soft">
                Meer instellingen
              </p>
              <WachtwoordSectie />
              <EmailSectie huidigEmail={session.user.email} />
              <VerwijderSectie />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



function NaamSectie({
  naam,
  email,
  image,
}: {
  naam: string
  email: string
  image: string | null
}) {
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
      await verversSessie()
      setSucces(true)
    } catch {
      setServerError('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  const initial = naam?.charAt(0).toUpperCase() ?? 'U'

  return (
    <CollapsibleSection
      title="Naam & profielfoto"
      description="Zichtbaar bij reviews en op de site."
      defaultOpen
    >
      <AvatarUploader naam={naam} initial={initial} initialImage={image} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div>
          <label htmlFor="naam" className="mb-2 block text-sm font-semibold text-ink">
            Naam
          </label>
          <input
            id="naam"
            type="text"
            {...register('naam')}
            className="w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
          />
          {errors.naam && (
            <p className="mt-1 text-xs text-red-600">{errors.naam.message}</p>
          )}
        </div>

        <p className="text-sm text-ink-soft">
          E-mailadres: <span className="font-medium text-ink">{email}</span>{' '}
          &middot; wijzigen kan hieronder.
        </p>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-stamp-dark hover:bg-stamp-dark/90"
        >
          {isSubmitting ? 'Opslaan...' : 'Naam opslaan'}
        </Button>

        {succes && <p className="text-sm font-medium text-trust">Profiel bijgewerkt.</p>}
        {serverError && (
          <p className="text-sm font-medium text-red-600">{serverError}</p>
        )}
      </form>
    </CollapsibleSection>
  )
}

function AvatarUploader({
  naam,
  initial,
  initialImage,
}: {
  naam: string
  initial: string
  initialImage: string | null
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(initialImage)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function kiesBestand() {
    fileInputRef.current?.click()
  }

  async function onBestandGekozen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Alleen PNG, JPEG of WebP toegestaan.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Afbeelding is te groot (max 2MB).')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Kon bestand niet lezen'))
        reader.readAsDataURL(file)
      })

      const { url } = await uploadAvatar({ data: { dataUrl } })
      await authClient.updateUser({ image: url })
      await verversSessie()
      setPreview(url)
    } catch {
      setError('Uploaden mislukt. Probeer het opnieuw.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={kiesBestand}
        disabled={isUploading}
        className="group relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-paper-raised text-xl font-semibold text-stamp-dark"
        aria-label="Profielfoto wijzigen"
      >
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
        <span className="absolute inset-0 hidden items-center justify-center bg-ink/50 text-[10px] font-medium text-paper group-hover:flex">
          {isUploading ? '...' : 'Wijzig'}
        </span>
      </button>

      <div>
        <p className="font-semibold text-ink">{naam}</p>
        <button
          type="button"
          onClick={kiesBestand}
          disabled={isUploading}
          className="text-sm text-stamp-dark hover:underline"
        >
          {isUploading ? 'Bezig met uploaden...' : 'Profielfoto wijzigen'}
        </button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onBestandGekozen}
        className="hidden"
      />
    </div>
  )
}


function WachtwoordSectie() {
  const [succes, setSucces] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  })

  async function onSubmit(values: ChangePasswordInput) {
    setSucces(false)
    setServerError(null)
    try {
      const result = await authClient.changePassword({
        currentPassword: values.huidigWachtwoord,
        newPassword: values.nieuwWachtwoord,
        revokeOtherSessions: true,
      })
      if (result.error) {
        setServerError(result.error.message ?? 'Wachtwoord wijzigen mislukt.')
        return
      }
      setSucces(true)
      reset()
    } catch {
      setServerError('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  return (
    <CollapsibleSection
      title="Wachtwoord wijzigen"
      description="Verander het wachtwoord waarmee je inlogt."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">
            Huidig wachtwoord
          </label>
          <input
            type="password"
            {...register('huidigWachtwoord')}
            className="w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
          />
          {errors.huidigWachtwoord && (
            <p className="mt-1 text-xs text-red-600">{errors.huidigWachtwoord.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">
            Nieuw wachtwoord
          </label>
          <input
            type="password"
            {...register('nieuwWachtwoord')}
            className="w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
          />
          {errors.nieuwWachtwoord && (
            <p className="mt-1 text-xs text-red-600">{errors.nieuwWachtwoord.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">
            Bevestig nieuw wachtwoord
          </label>
          <input
            type="password"
            {...register('bevestigWachtwoord')}
            className="w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
          />
          {errors.bevestigWachtwoord && (
            <p className="mt-1 text-xs text-red-600">{errors.bevestigWachtwoord.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-stamp-dark hover:bg-stamp-dark/90"
        >
          {isSubmitting ? 'Bezig...' : 'Wachtwoord wijzigen'}
        </Button>

        {succes && (
          <p className="text-sm font-medium text-trust">
            Wachtwoord gewijzigd. Andere sessies zijn uitgelogd.
          </p>
        )}
        {serverError && (
          <p className="text-sm font-medium text-red-600">{serverError}</p>
        )}
      </form>
    </CollapsibleSection>
  )
}



function EmailSectie({ huidigEmail }: { huidigEmail: string }) {
  const [succes, setSucces] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
  })

  async function onSubmit(values: ChangeEmailInput) {
    setSucces(false)
    setServerError(null)
    try {
      const result = await authClient.changeEmail({
        newEmail: values.nieuwEmail,
        callbackURL: '/account',
      })
      if (result.error) {
        setServerError(result.error.message ?? 'E-mailadres wijzigen mislukt.')
        return
      }
      setSucces(true)
    } catch {
      setServerError('Er ging iets mis. Probeer het later opnieuw.')
    }
  }

  return (
    <CollapsibleSection
      title="E-mailadres wijzigen"
      description={`Huidig: ${huidigEmail}`}
    >
      <p className="mb-4 text-sm text-ink-soft">
        Je ontvangt een verificatiemail op het nieuwe adres voordat de
        wijziging ingaat.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">
            Nieuw e-mailadres
          </label>
          <input
            type="email"
            {...register('nieuwEmail')}
            className="w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
          />
          {errors.nieuwEmail && (
            <p className="mt-1 text-xs text-red-600">{errors.nieuwEmail.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-stamp-dark hover:bg-stamp-dark/90"
        >
          {isSubmitting ? 'Bezig...' : 'Verificatiemail versturen'}
        </Button>

        {succes && (
          <p className="text-sm font-medium text-trust">
            Check je nieuwe inbox om de wijziging te bevestigen.
          </p>
        )}
        {serverError && (
          <p className="text-sm font-medium text-red-600">{serverError}</p>
        )}
      </form>
    </CollapsibleSection>
  )
}


function VerwijderSectie() {
  const navigate = useNavigate()
  const [wachtwoord, setWachtwoord] = useState('')
  const [bevestiging, setBevestiging] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const kanVerwijderen = bevestiging === 'VERWIJDER' && wachtwoord.length > 0

  async function onDelete() {
    if (!kanVerwijderen) return
    setError(null)
    setIsDeleting(true)
    try {
      const result = await authClient.deleteUser({ password: wachtwoord })
      if (result.error) {
        setError(result.error.message ?? 'Verwijderen mislukt. Klopt je wachtwoord?')
        return
      }
      await navigate({ to: '/' })
    } catch {
      setError('Er ging iets mis. Probeer het later opnieuw.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <CollapsibleSection
      title="Account verwijderen"
      description="Dit verwijdert je account permanent."
      danger
    >
      <div className="space-y-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-red-900">
            Wachtwoord
          </label>
          <input
            type="password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            className="w-full rounded-[4px] border border-red-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-red-900">
            Typ <span className="font-mono">VERWIJDER</span> om te bevestigen
          </label>
          <input
            type="text"
            value={bevestiging}
            onChange={(e) => setBevestiging(e.target.value)}
            className="w-full rounded-[4px] border border-red-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-red-500"
          />
        </div>

        <button
          type="button"
          onClick={onDelete}
          disabled={!kanVerwijderen || isDeleting}
          className="rounded-[4px] bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isDeleting ? 'Bezig...' : 'Account permanent verwijderen'}
        </button>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      </div>
    </CollapsibleSection>
  )
}
