import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { profileSchema, type ProfileInput } from '@/lib/validators/profile.schema'
import { uploadAvatar } from '@/lib/server/avatar'

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

  return (
    <ProfileForm
      naam={session.user.name}
      email={session.user.email}
      image={session.user.image ?? null}
    />
  )
}

function ProfileForm({
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
        Werk je naam en profielfoto bij zoals die getoond worden bij reviews
        en op de site.
      </p>

      <AvatarUploader naam={naam} initial={initial} initialImage={image} />

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
    e.target.value = '' // zelfde bestand nogmaals kunnen kiezen
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
      setPreview(url)
    } catch {
      setError('Uploaden mislukt. Probeer het opnieuw.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mt-8 flex items-center gap-4">
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
