'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'timo7155@gmail.com'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !validateEmail(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Check admin privilege server-side (avoids NEXT_PUBLIC env var build-time mismatch)
    try {
      const verifyRes = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.user?.email || '' })
      })
      const verify = await verifyRes.json()
      if (!verify.isAdmin) {
        await supabase.auth.signOut()
        setError('Access denied. This portal is restricted to administrators only.')
        setLoading(false)
        return
      }
    } catch {
      await supabase.auth.signOut()
      setError('Could not verify admin access. Please try again.')
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-red-700 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-fade-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </Link>
          <h2 className="text-lg font-bold text-white">TheReviewer<span className="text-red-400">.mu</span></h2>
          <p className="text-gray-500 mt-1 text-sm">Administration Portal</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-600 to-red-800" />
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">Restricted Access</span>
            </div>

            <h1 className="text-xl font-extrabold text-white mb-6">Admin Sign In</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500/20 placeholder-gray-600"
                  placeholder="admin@thereviewer.mu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500/20 placeholder-gray-600"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-950 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2 border border-red-900">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign in to Admin'}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-gray-600">
            This portal is restricted to authorized administrators only.
          </p>
          <div className="flex justify-center gap-3 text-xs">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors">Back to site</Link>
            <span className="text-gray-700">|</span>
            <Link href="/dashboard/login" className="text-gray-500 hover:text-white transition-colors">Owner login</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
