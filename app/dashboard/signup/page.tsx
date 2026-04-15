'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang, LangToggle } from '@/lib/i18n'
import { BUSINESS_CATEGORIES } from '@/lib/constants'

export default function SignupPage() {
  const { lang } = useLang()
  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    phone: '',
    businessName: '',
    category: '',
    region: '',
    website: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.ownerName.trim() || !form.email.trim() || !form.businessName.trim()) {
      setError(lang === 'fr' ? 'Nom, email et nom de l\'entreprise sont requis.' : 'Your name, email and business name are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/business-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setSuccess(true)
    } catch {
      setError(lang === 'fr' ? 'Erreur serveur' : 'Server error')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/dashboard/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium">
              {lang === 'fr' ? 'Se connecter' : 'Login'}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-14">
        {success ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-rich p-10 text-center animate-fade-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
              {lang === 'fr' ? 'Demande reçue !' : 'Request received!'}
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md mx-auto">
              {lang === 'fr'
                ? 'Merci. Nous vous contacterons dans les 24 heures pour confirmer les détails et vérifier votre propriété.'
                : 'Thank you. We\'ll contact you within 24 hours to confirm details and verify your ownership.'}
            </p>
            <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              {lang === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                {lang === 'fr' ? 'Ajouter une entreprise' : 'Add your business'}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                {lang === 'fr' ? 'Listez votre entreprise — gratuit' : 'List your business — free'}
              </h1>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                {lang === 'fr'
                  ? 'Remplissez ce formulaire et je vous contacterai personnellement dans les 24 heures pour vérifier et ajouter votre entreprise.'
                  : 'Fill this form and I\'ll personally contact you within 24 hours to verify and add your business.'}
              </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-3 gap-3 mb-8 text-center text-xs">
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-1.5 font-bold">1</div>
                <p className="text-gray-700 font-semibold">{lang === 'fr' ? 'Vous soumettez' : 'You submit'}</p>
                <p className="text-gray-500 mt-0.5">{lang === 'fr' ? 'Quelques détails' : 'A few details'}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-1.5 font-bold">2</div>
                <p className="text-gray-700 font-semibold">{lang === 'fr' ? 'Je vous contacte' : 'I contact you'}</p>
                <p className="text-gray-500 mt-0.5">{lang === 'fr' ? 'Sous 24 h' : 'Within 24 h'}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-1.5 font-bold">3</div>
                <p className="text-gray-700 font-semibold">{lang === 'fr' ? 'Fiche active' : 'Listing goes live'}</p>
                <p className="text-gray-500 mt-0.5">{lang === 'fr' ? 'Gratuitement' : 'For free'}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-rich p-6 md:p-8 space-y-5">
              {/* Your info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm">{lang === 'fr' ? 'Vos coordonnées' : 'Your details'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{lang === 'fr' ? 'Votre nom *' : 'Your name *'}</label>
                    <input
                      type="text" value={form.ownerName} onChange={e => set('ownerName', e.target.value)} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{lang === 'fr' ? 'Email *' : 'Email *'}</label>
                    <input
                      type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="you@yourbusiness.mu"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{lang === 'fr' ? 'Téléphone (WhatsApp préféré)' : 'Phone (WhatsApp preferred)'}</label>
                  <input
                    type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="+230 5xxx xxxx"
                  />
                </div>
              </div>

              {/* Business info */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">{lang === 'fr' ? 'Votre entreprise' : 'Your business'}</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{lang === 'fr' ? 'Nom de l\'entreprise *' : 'Business name *'}</label>
                  <input
                    type="text" value={form.businessName} onChange={e => set('businessName', e.target.value)} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder={lang === 'fr' ? 'Ex: Le Coin Gourmand' : 'e.g. Le Coin Gourmand'}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{lang === 'fr' ? 'Catégorie' : 'Category'}</label>
                    <select
                      value={form.category} onChange={e => set('category', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                    >
                      <option value="">{lang === 'fr' ? '— Sélectionner —' : '— Select —'}</option>
                      {BUSINESS_CATEGORIES.filter(c => c.value !== 'all').map(c => (
                        <option key={c.value} value={c.value}>{lang === 'fr' ? c.label.fr : c.label.en}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{lang === 'fr' ? 'Région' : 'Region'}</label>
                    <input
                      type="text" value={form.region} onChange={e => set('region', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder={lang === 'fr' ? 'Ex: Grand Baie' : 'e.g. Grand Baie'}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{lang === 'fr' ? 'Site web (optionnel)' : 'Website (optional)'}</label>
                  <input
                    type="url" value={form.website} onChange={e => set('website', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="https://yourbusiness.mu"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{lang === 'fr' ? 'Informations complémentaires (optionnel)' : 'Additional info (optional)'}</label>
                  <textarea
                    value={form.message} onChange={e => set('message', e.target.value)} rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    placeholder={lang === 'fr' ? 'Adresse, heures d\'ouverture, ou toute info utile...' : 'Address, opening hours, or any helpful info...'}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                  {lang === 'fr' ? '← Annuler' : '← Cancel'}
                </Link>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {loading ? (lang === 'fr' ? 'Envoi...' : 'Submitting...') : (lang === 'fr' ? 'Soumettre ma demande' : 'Submit my request')}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center pt-2">
                {lang === 'fr'
                  ? 'En soumettant, vous acceptez d\'être contacté pour vérifier votre propriété.'
                  : 'By submitting, you agree to be contacted to verify your ownership.'}
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
