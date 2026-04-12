'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/i18n'
import { HomeNav } from '@/app/HomeNav'
import SiteFooter from '@/app/SiteFooter'
import { CONTACT_REASONS } from '@/lib/constants'

export default function ContactPage() {
  const { lang } = useLang()
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) {
      setError(lang === 'fr' ? 'Le nom est requis.' : 'Full name is required.')
      return
    }
    if (!form.email.trim() || !validateEmail(form.email)) {
      setError(lang === 'fr' ? 'Veuillez entrer un email valide.' : 'Please enter a valid email address.')
      return
    }
    if (!form.reason) {
      setError(lang === 'fr' ? 'Veuillez sélectionner une raison.' : 'Please select a reason.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError(lang === 'fr' ? 'Erreur lors de l\'envoi. Veuillez réessayer.' : 'Failed to send. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 max-w-md w-full text-center shadow-sm animate-fade-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            {lang === 'fr' ? 'Message envoyé !' : 'Message sent!'}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {lang === 'fr'
              ? 'Merci de nous avoir contactés. Nous vous répondrons sous 24 à 48 heures.'
              : 'Thank you for reaching out. We will get back to you within 24-48 hours.'}
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            {lang === 'fr' ? '← Retour à l\'accueil' : '← Back to home'}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNav />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
              {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
            </h1>
            <p className="text-gray-500 leading-relaxed mb-8">
              {lang === 'fr'
                ? 'Une question, une demande de partenariat ou besoin d\'aide ? Notre équipe est là pour vous.'
                : 'Have a question, partnership enquiry, or need help? Our team is here for you.'}
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{lang === 'fr' ? 'Téléphone' : 'Phone'}</p>
                  <a href="tel:+23058137384" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">+230 5813 7384</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <a href="mailto:contact@thereviewer.mu" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">contact@thereviewer.mu</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{lang === 'fr' ? 'Adresse' : 'Address'}</p>
                  <p className="text-gray-900 font-medium">Terre Rouge, Rodrigues, Mauritius</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {lang === 'fr' ? 'Nom complet' : 'Full name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    placeholder={lang === 'fr' ? 'Votre nom' : 'Your name'}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {lang === 'fr' ? 'Téléphone' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                      placeholder="+230 5XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {lang === 'fr' ? 'Raison' : 'Reason'} <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-white"
                  >
                    <option value="">{lang === 'fr' ? '— Choisir une raison —' : '— Select a reason —'}</option>
                    {CONTACT_REASONS.map(r => (
                      <option key={r.value} value={r.value}>{r.label[lang]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none"
                    placeholder={lang === 'fr' ? 'Décrivez votre demande...' : 'Describe your enquiry...'}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2 border border-red-100">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading
                    ? (lang === 'fr' ? 'Envoi en cours...' : 'Sending...')
                    : (lang === 'fr' ? 'Envoyer le message' : 'Send message')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
