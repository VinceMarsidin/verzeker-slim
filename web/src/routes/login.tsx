import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { authClient } from '#/lib/auth-client'
import { getPostLoginPath } from '#/lib/post-login-redirect'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Laden...
      </div>
    )
  }

  // Al ingelogd? Dan hoeft dit scherm niet meer.
  if (session?.user) {
    return <Navigate to="/dashboard" />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'register') {
        const { error: signUpError } = await authClient.signUp.email({
          name,
          email,
          password,
        })
        if (signUpError) {
          setError(signUpError.message ?? 'Registreren mislukt')
          return
        }
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        })
        if (signInError) {
          setError(signInError.message ?? 'Inloggen mislukt')
          return
        }
      }
      navigate({ to: await getPostLoginPath() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9] px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm">
        <h1 className="text-xl font-bold text-[#004080] mb-1">VerzekerSlim</h1>
        <p className="text-sm text-slate-500 mb-6">
          {mode === 'login' ? 'Log in op je account' : 'Maak een nieuw account aan'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Naam
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-[#ff8c00] transition text-sm"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-[#ff8c00] transition text-sm"
            />
          </div>

          <div className="mb-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-[#ff8c00] transition text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#004080] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#0066cc] transition disabled:opacity-50"
          >
            {loading
              ? 'Bezig...'
              : mode === 'login'
                ? 'Inloggen'
                : 'Account aanmaken'}
          </button>
        </form>

        <button
          onClick={() => {
            setError(null)
            setMode(mode === 'login' ? 'register' : 'login')
          }}
          className="w-full mt-4 text-center text-sm text-slate-500 hover:text-[#004080]"
        >
          {mode === 'login'
            ? 'Nog geen account? Registreer hier'
            : 'Al een account? Log hier in'}
        </button>
      </div>
    </div>
  )
}