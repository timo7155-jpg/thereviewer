'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/i18n'

export default function ClaimPage() {
  const router = useRouter()
  const { lang } = useLang()
  const [user, setUser] = useState<any>(null)
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    businessId: '',
    fullName: '',
    role: '',
    phone: '',
    email: '',
    notes: '',
  })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/dashboard/login'); return }
      setUser(user)
      setForm(f => ({ ...f, email: user.email || '' }))

      const { data: hotels } = await supabase
        .from('businesses')
        .select('id, name, region, address')
        .eq('is_claimed', false)
        .order('name')

      setHotels(hotels || [])
      setLoading(false)
    }
    init()
  }, [router])

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => /^\+?[\d\s-]{7,}$/.test(phone)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.businessId) { setError('Please select a business.'); return }
    if (!form.fullName.trim()) { setError('Please enter your full name.'); return }
    if (!form.role) { setError('Please select your role.'); return }
    if (!form.phone.trim() || !validatePhone(form.phone)) { setError('Please enter a valid phone number (e.g. +230 5XXX XXXX).'); return }
    if (form.email && !validateEmail(form.email)) { setError('Please enter a valid email address.'); return }

    setSubmitting(true)

    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId: user.id })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </main>
  )

  if (success) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          {lang === 'fr' ? 'Demande soumise !' : 'Request submitted!'}
        </h2>
        <p className="text-gray-600 mb-2">
          {lang === 'fr' ? 'Nous examinerons votre demande et vous contacterons sous 24 à 48 heures.' : 'We will review your claim and contact you within 24-48 hours.'}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          {lang === 'fr' ? 'Nous pourrons vous appeler ou vous envoyer un email pour vérifier votre lien avec l\'entreprise.' : 'We may call or email you to verify your connection to the business.'}
        </p>
        <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 inline-block">
          {lang === 'fr' ? 'Retour au tableau de bord' : 'Back to dashboard'}
        </Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></span>
          </Link>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline mb-6 block">
          ← Back to dashboard
        </Link>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Claim your business</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Fill in your details below. Our team will review your request and 
          contact you within 24-48 hours to verify your ownership.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          
          {/* Hotel selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select your business <span className="text-red-500">*</span>
            </label>
            <select
              value={form.businessId}
              onChange={e => setForm({ ...form, businessId: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-white"
            >
              <option value="">— Choose a business —</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name} — {hotel.region}
                </option>
              ))}
            </select>
          </div>

          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              placeholder="Jean-Pierre Dupont"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your role at the business <span className="text-red-500">*</span>
            </label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-white"
            >
              <option value="">— Select your role —</option>
              <option value="Owner">Owner</option>
              <option value="General Manager">General Manager</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="Director">Director</option>
              <option value="Front Office Manager">Front Office Manager</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              placeholder="+230 5XXX XXXX"
            />
            <p className="text-xs text-gray-400 mt-1">
              We will call this number to verify your claim
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              placeholder="you@gmail.com"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional notes (optional)
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none"
              placeholder="Any additional information to help us verify your claim..."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit claim request'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Our team will review your request within 24-48 hours
          </p>
        </form>
      </div>
    </main>
  )
}