import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { reviewSchema, type ReviewInput } from '@/lib/validators/review.schema'
import { authClient } from '@/lib/auth-client'

interface ReviewFormProps {
  companySlug: string
  onSubmitted?: () => void
}

export function ReviewForm({ companySlug, onSubmitted }: ReviewFormProps) {
  const { data: session } = authClient.useSession()
  const [hoverRating, setHoverRating] = useState(0)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      companySlug,
      rating: 0,
      title: '',
      body: '',
    },
  })

  const rating = watch('rating')

  if (!session?.user) {
    return (
      <Card className="border-line bg-paper-raised p-8 text-center">
        <p className="text-ink-soft">
          Log in om een review te plaatsen over deze verzekeraar.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/account/login">Inloggen</Link>
          </Button>
          <Button asChild className="bg-stamp-dark hover:bg-stamp-dark/90">
            <Link to="/account/register">Account aanmaken</Link>
          </Button>
        </div>
      </Card>
    )
  }

  async function onSubmit(data: ReviewInput) {
    setServerError(null)
    try {
      const res = await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Er ging iets mis')
      }
      setSuccess(true)
      reset({ companySlug, rating: 0, title: '', body: '' })
      onSubmitted?.()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Er ging iets mis')
    }
  }

  if (success) {
    return (
      <Card className="border-line bg-paper-raised p-8 text-center">
        <p className="font-semibold text-ink">Bedankt voor je review!</p>
        <p className="mt-2 text-sm text-ink-soft">Je ervaring helpt anderen bij hun keuze.</p>
        <Button className="mt-4" variant="outline" onClick={() => setSuccess(false)}>
          Nog een review schrijven
        </Button>
      </Card>
    )
  }

  return (
    <Card className="border-line bg-paper-raised p-6">
      <h3 className="font-slab text-lg font-bold text-ink">Schrijf een review</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <input type="hidden" {...register('companySlug')} />

        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">Beoordeling</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1
              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} ${value === 1 ? 'ster' : 'sterren'}`}
                  aria-pressed={rating === value}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue('rating', value, { shouldValidate: true })}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= (hoverRating || rating)
                        ? 'fill-stamp-dark text-stamp-dark'
                        : 'text-line'
                    }`}
                  />
                </button>
              )
            })}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-semibold text-ink">
            Titel
          </label>
          <input
            id="title"
            {...register('title')}
            className="w-full rounded-[4px] border border-line bg-paper px-3 py-2 text-ink"
            placeholder="Korte samenvatting van je ervaring"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="body" className="mb-2 block text-sm font-semibold text-ink">
            Je review
          </label>
          <textarea
            id="body"
            {...register('body')}
            rows={4}
            className="w-full rounded-[4px] border border-line bg-paper px-3 py-2 text-ink"
            placeholder="Beschrijf je ervaring met premies, service en schadeafhandeling..."
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="bg-stamp-dark hover:bg-stamp-dark/90">
          {isSubmitting ? 'Versturen...' : 'Review plaatsen'}
        </Button>
      </form>
    </Card>
  )
}
