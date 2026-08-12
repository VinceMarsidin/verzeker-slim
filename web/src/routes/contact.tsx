import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { contactSchema, type ContactInput } from '@/lib/validators/contact.schema'
import { verstuurContactBericht } from '@/lib/server/contact'
import { seo, seoLinks } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: seo({
      title: 'Contact',
      description:
        'Vragen over verzekeringen of premies? Neem contact op met VerzekerSlim via e-mail, WhatsApp of social media.',
      path: '/contact',
    }),
    links: seoLinks('/contact'),
  }),
  component: ContactPage,
})


const socialLinks = [
  { label: 'Facebook', icon: '/icons/facebook.svg', url: 'https://facebook.com/verzekerslim' },
  { label: 'Instagram', icon: '/icons/instagram.svg', url: 'https://instagram.com/verzekerslim' },
  { label: 'X', icon: '/icons/x.svg', url: 'https://x.com/verzekerslim' },
  { label: 'WhatsApp', icon: '/icons/whatsapp.svg', url: 'https://wa.me/597XXXXXXX' },
  { label: 'LinkedIn', icon: '/icons/linkedin.svg', url: 'https://linkedin.com/company/verzekerslim' },
  { label: 'YouTube', icon: '/icons/youtube.svg', url: 'https://youtube.com/@verzekerslim' },
]

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
    <div className="bg-paper">
      <section className="relative h-[420px] overflow-hidden md:h-[460px]">
        <img
          src="/paramaribo.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/75" />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-5xl px-8">
            <div className="max-w-md">
              <div className="font-mono text-xs uppercase tracking-wide text-stamp">
                Contact
              </div>
              <h1 className="mt-2 font-slab text-4xl font-bold text-paper">
                Neem contact met ons op
              </h1>
              <p className="mt-4 text-paper/80">
                Heb je een vraag over een verzekering of over VerzekerSlim? Stuur
                ons een bericht en we reageren zo snel mogelijk.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm text-paper/90">
                  <Mail className="h-4 w-4 text-stamp" />
                  info@verzekerslim.sr
                </div>
                <div className="flex items-center gap-3 text-sm text-paper/90">
                  <MapPin className="h-4 w-4 text-stamp" />
                  Paramaribo, Suriname
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                {socialLinks.map(({ label, icon, url }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`VerzekerSlim op ${label}`}
                    className="opacity-90 transition-opacity hover:opacity-100"
                  >
                    <img src={icon} alt="" className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-8 pb-20 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <img
            src="/icons/contact-illustration.svg"
            alt=""
            className="w-56 md:w-64"
          />
          <p className="mt-6 text-sm leading-relaxed text-ink-soft md:pb-2">
            Of je nu een auto, een reis, je huis of je toekomst wilt verzekeren
            — wij zorgen dat je de juiste keuze maakt, zonder gedoe en zonder
            verborgen kosten.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="-mt-24 w-full space-y-5 rounded-[4px] border border-line bg-paper-raised p-8 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_24px_48px_-24px_rgba(13,59,102,0.35)] md:-mt-32 md:w-[420px] md:shrink-0 md:p-10"
        >
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

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
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
              className="w-full resize-none rounded-[4px] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-stamp-dark"
            />
            {errors.bericht && (
              <p className="mt-1 text-xs text-red-600">{errors.bericht.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stamp-dark hover:bg-stamp-dark/90"
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
    </div>
  )
}