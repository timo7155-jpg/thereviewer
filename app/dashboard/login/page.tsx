'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/i18n'

export default function LoginPage() {
  const router = useRouter()
  const { lang } = useLang()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !validateEmail(form.email)) {
      setError(lang === 'fr' ? 'Veuillez entrer un email valide.' : 'Please enter a valid email address.')
      return
    }
    if (!form.password || form.password.length < 6) {
      setError(lang === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setError(lang === 'fr'
        ? 'Vérifiez votre email pour confirmer votre compte, puis connectez-vous.'
        : 'Check your email to confirm your account, then log in.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
          </Link>
          <h2 className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></h2>
          <p className="text-gray-500 mt-1 text-sm">
            {lang === 'fr' ? 'Portail propriétaire d\'entreprise' : 'Business owner portal'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="p-8">
            <h1 className="text-xl font-extrabold text-gray-900 mb-6">
              {isSignUp
                ? (lang === 'fr' ? 'Créer votre compte' : 'Create your account')
                : (lang === 'fr' ? 'Connectez-vous à votre tableau de bord' : 'Sign in to your dashboard')}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  placeholder="you@business.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {lang === 'fr' ? 'Mot de passe' : 'Password'}
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className={`text-sm px-4 py-3 rounded-xl flex items-center gap-2 ${
                  error.includes('Check your email') || error.includes('Vérifiez')
                    ? 'bg-green-50 text-green-600 border border-green-100'
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {error.includes('Check your email') || error.includes('Vérifiez')
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    }
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
              >
                {loading
                  ? (lang === 'fr' ? 'Veuillez patienter...' : 'Please wait...')
                  : isSignUp
                  ? (lang === 'fr' ? 'Créer le compte' : 'Create account')
                  : (lang === 'fr' ? 'Se connecter' : 'Sign in')}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp
                  ? (lang === 'fr' ? 'Déjà un compte ? Se connecter' : 'Already have an account? Sign in')
                  : (lang === 'fr' ? 'Pas encore de compte ? S\'inscrire' : "Don't have an account? Sign up")}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {lang === 'fr'
            ? 'Ce portail est réservé aux propriétaires d\'entreprise. '
            : 'This portal is for business owners only. '}
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            {lang === 'fr' ? 'Retour aux avis' : 'Back to reviews'}
          </Link>
        </p>
      </div>
    </main>
  )
}
