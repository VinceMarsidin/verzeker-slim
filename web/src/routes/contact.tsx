import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { contactSchema, type ContactInput } from '@/lib/validators/contact.schema'
import { verstuurContactBericht } from '@/lib/server/contact'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(values: ContactInput) {
    setServerError(null)
    try {
      await verstuurContactBericht({ data: values })
      setIsSuccess(true)
      reset()
    } catch {
      setServerError('Er ging iets mis bij het versturen. Probeer het later opnieuw.')
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-8 py-16 md:grid-cols-2 md:items-center">
      {/* Left: illustration + info */}
      <div>
        <img
          src="/contact-illustration.svg"
          alt=""
          className="w-full max-w-sm"
        />

        <div className="mb-2 mt-8 font-mono text-xs uppercase tracking-wide text-stamp-dark">
          Contact
        </div>
        <h1 className="font-slab text-3xl font-bold text-ink">Neem contact met ons op</h1>
        <p className="mt-3 max-w-md text-ink-soft">
          Heb je een vraag over een verzekering of over VerzekerSlim? Stuur ons
          een bericht en we reageren zo snel mogelijk.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 text-sm text-ink-soft">
            <Mail className="h-4 w-4 text-stamp-dark" />
            info@verzekerslim.sr
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-soft">
            <MapPin className="h-4 w-4 text-stamp-dark" />
            Paramaribo, Suriname
          </div>
        </div>
      </div>

      {/* Right: form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">
            E-mailadres
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full rounded-[4px] border border-line bg-paper-raised px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bericht" className="mb-2 block text-sm font-semibold text-ink">
            Bericht
          </label>
          <textarea
            id="bericht"
            rows={5}
            {...register('bericht')}
            className="w-full resize-none rounded-[4px] border border-line bg-paper-raised px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
          />
          {errors.bericht && (
            <p className="mt-1 text-xs text-red-600">{errors.bericht.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-stamp-dark hover:bg-stamp-dark/90"
        >
          {isSubmitting ? 'Versturen…' : 'Verstuur bericht'}
        </Button>

        {isSuccess && (
          <p className="text-sm font-medium text-trust">
            Bedankt! Je bericht is verstuurd.
          </p>
        )}
        {serverError && (
          <p className="text-sm font-medium text-red-600">{serverError}</p>
        )}
      </form>
    </div>
  )
}