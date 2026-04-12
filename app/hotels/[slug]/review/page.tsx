'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLang } from '@/lib/i18n'
import { HomeNav } from '@/app/HomeNav'
import MiniFooter from '@/app/MiniFooter'

function StarRating({ label, value, onChange }: {
  label: string
  value: number
  onChange: (val: number) => void
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700 text-sm font-medium w-32">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`text-2xl transition-all duration-150 ${
              star <= (hover || value) ? 'text-amber-400 scale-110' : 'text-gray-200 hover:text-amber-200'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const params = useParams()
  const { lang, t } = useLang()
  const slug = params.slug as string

  const [form, setForm] = useState({
    name: '',
    email: '',
    overall_rating: 0,
    service_score: 0,
    cleanliness_score: 0,
    location_score: 0,
    food_score: 0,
    value_score: 0,
    body: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError(lang === 'fr' ? 'Le nom est requis.' : 'Your name is required.')
      return
    }
    if (!form.email.trim() || !validateEmail(form.email)) {
      setError(lang === 'fr' ? 'Veuillez entrer un email valide.' : 'Please enter a valid email address.')
      return
    }
    if (form.overall_rating === 0) {
      setError(lang === 'fr' ? 'Veuillez sélectionner une note globale.' : 'Please select an overall rating.')
      return
    }
    if (!form.body.trim() || form.body.trim().length < 10) {
      setError(lang === 'fr' ? 'Votre avis doit contenir au moins 10 caractères.' : 'Your review must be at least 10 characters long.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug, review_body: form.body }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 max-w-md w-full text-center shadow-sm animate-fade-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('review.success').split('!')[0]}!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t('review.success')}
          </p>
          <Link href={`/hotels/${slug}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {lang === 'fr' ? '← Retour' : '← Back'}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNav />

      <div className="max-w-xl mx-auto px-6 py-8">
        <Link href={`/hotels/${slug}`} className="text-sm text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-1 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to hotel
        </Link>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1 mt-4">{t('review.title')}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {lang === 'fr' ? 'Partagez votre expérience et aidez les autres clients' : 'Share your experience and help other customers'}
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

          <div className="p-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('review.name')}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('review.email')}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ratings</label>
              <div className="border border-gray-100 rounded-xl px-5 divide-y divide-gray-50 bg-gray-50/50">
                <StarRating label={t('review.overall') + ' *'} value={form.overall_rating} onChange={v => setForm({ ...form, overall_rating: v })} />
                <StarRating label={t('review.service')} value={form.service_score} onChange={v => setForm({ ...form, service_score: v })} />
                <StarRating label={t('review.cleanliness')} value={form.cleanliness_score} onChange={v => setForm({ ...form, cleanliness_score: v })} />
                <StarRating label={t('review.location')} value={form.location_score} onChange={v => setForm({ ...form, location_score: v })} />
                <StarRating label={t('review.food')} value={form.food_score} onChange={v => setForm({ ...form, food_score: v })} />
                <StarRating label={t('review.value')} value={form.value_score} onChange={v => setForm({ ...form, value_score: v })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('review.body')}</label>
              <textarea
                rows={5}
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none"
                placeholder="Share your experience at this hotel..."
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? t('review.submitting') : t('review.submit')}
            </button>
          </div>
        </form>
      </div>

      <MiniFooter />
    </main>
  )
}
