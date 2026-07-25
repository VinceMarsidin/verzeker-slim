import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_public/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage(null)

    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      subject: String(form.get('subject') || ''),
      message: String(form.get('message') || ''),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setErrorMessage(data?.error ?? 'Er ging iets mis. Probeer het opnieuw.')
        setStatus('error')
        return
      }

      setStatus('success')
      e.currentTarget.reset()
    } catch {
      setErrorMessage('Kan geen verbinding maken met de server.')
      setStatus('error')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
      <p className="mt-2 text-slate-600">
        Heb je een vraag? Vul het formulier in en we nemen zo snel mogelijk
        contact met je op.
      </p>

      {status === 'success' ? (
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
          Bedankt! Je bericht is verstuurd — we nemen snel contact met je op.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Naam
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="phone" className="text-sm font-medium text-slate-700">
              Telefoonnummer <span className="text-slate-400">(optioneel)</span>
            </label>
            <input
              id="phone"
              name="phone"
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="subject" className="text-sm font-medium text-slate-700">
              Onderwerp
            </label>
            <input
              id="subject"
              name="subject"
              required
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-medium text-slate-700">
              Bericht
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="mt-1 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-colors text-sm resize-none"
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {status === 'loading' ? 'Versturen...' : 'Verstuur bericht'}
          </button>
        </form>
      )}
    </div>
  )
}
