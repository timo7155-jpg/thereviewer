'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/i18n'
import { PLANS } from '@/lib/constants'

export default function UpgradePage() {
  const router = useRouter()
  const { lang } = useLang()
  const [user, setUser] = useState<any>(null)
  const [owner, setOwner] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [noClaim, setNoClaim] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/dashboard/login'); return }
      setUser(user)

      const { data: ownerData } = await supabase
        .from('business_owners')
        .select('*, businesses(name)')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single()

      if (!ownerData) { setNoClaim(true); setLoading(false); return }
      if (ownerData.plan === 'premium') { router.push('/dashboard'); return }

      setOwner(ownerData)
      setLoading(false)
    }
    init()
  }, [router])

  const handleSubscribe = async () => {
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: owner.full_name || user.email,
          email: user.email,
          phone: owner.phone || '',
          reason: 'premium',
          message: `Premium subscription request for "${owner.businesses?.name}".\n\nOwner: ${owner.full_name}\nEmail: ${user.email}\nPhone: ${owner.phone || 'N/A'}\nBusiness ID: ${owner.business_id}`
        })
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError(lang === 'fr' ? 'Erreur. Veuillez réessayer.' : 'Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</p>
      </div>
    </main>
  )

  if (noClaim) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-10 max-w-md w-full text-center shadow-sm animate-fade-up">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">
          {lang === 'fr' ? 'Réclamez d\'abord votre entreprise' : 'Claim your business first'}
        </h2>
        <p className="text-gray-500 text-sm mb-3 leading-relaxed">
          {lang === 'fr'
            ? 'Pour souscrire au Premium, vous devez d\'abord réclamer votre entreprise et être approuvé par notre équipe.'
            : 'To subscribe to Premium, you need to first claim your business and get approved by our team.'}
        </p>
        <p className="text-gray-400 text-xs mb-6">
          {lang === 'fr'
            ? 'Étape 1 : Réclamer → Étape 2 : Approbation → Étape 3 : Premium'
            : 'Step 1: Claim → Step 2: Approval → Step 3: Premium'}
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/claim" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            {lang === 'fr' ? 'Réclamer mon entreprise' : 'Claim my business'}
          </Link>
          <Link href="/dashboard" className="text-gray-500 text-sm font-medium hover:text-blue-600 transition-colors">
            {lang === 'fr' ? '← Retour au tableau de bord' : '← Back to dashboard'}
          </Link>
        </div>
      </div>
    </main>
  )

  if (submitted) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-10 max-w-md w-full text-center shadow-sm animate-fade-up">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          {lang === 'fr' ? 'Demande envoyée !' : 'Request sent!'}
        </h2>
        <p className="text-gray-600 mb-2 leading-relaxed">
          {lang === 'fr'
            ? 'Notre équipe vous contactera sous 24 heures pour activer votre plan Premium.'
            : 'Our team will contact you within 24 hours to activate your Premium plan.'}
        </p>
        <p className="text-gray-400 text-sm mb-6">
          {lang === 'fr'
            ? 'Nous acceptons le virement bancaire et le paiement par carte.'
            : 'We accept bank transfer and card payments.'}
        </p>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {lang === 'fr' ? '← Retour au tableau de bord' : '← Back to dashboard'}
        </Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></span>
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-blue-600 font-medium">
            {lang === 'fr' ? '← Tableau de bord' : '← Dashboard'}
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {lang === 'fr' ? 'Mise à niveau' : 'Upgrade'}
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-2">
            {lang === 'fr' ? 'Passez au Premium' : 'Upgrade to Premium'}
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            {lang === 'fr'
              ? `Débloquez toutes les fonctionnalités pour ${owner?.businesses?.name}`
              : `Unlock all features for ${owner?.businesses?.name}`}
          </p>
        </div>

        {/* Plan comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Current plan */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">
                {lang === 'fr' ? 'Plan actuel' : 'Current plan'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{PLANS.free.name[lang]}</h3>
            <div className="mb-5">
              <span className="text-3xl font-extrabold text-gray-900">{PLANS.free.price[lang]}</span>
              <span className="text-gray-500 text-sm ml-1">{PLANS.free.period[lang]}</span>
            </div>
            <div className="space-y-2.5">
              {PLANS.free.features[lang].map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-gray-600">{f}</span>
                </div>
              ))}
              {PLANS.free.limitations[lang].map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <span className="text-gray-400 line-through">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium plan */}
          <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 shadow-lg shadow-blue-100 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                {lang === 'fr' ? 'Recommandé' : 'Recommended'}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {lang === 'fr' ? 'Passez à' : 'Upgrade to'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{PLANS.premium.name[lang]}</h3>
            <div className="mb-2">
              <span className="text-base text-gray-400 line-through mr-2">{PLANS.premium.originalPrice[lang]}</span>
              <span className="text-3xl font-extrabold text-gradient">{PLANS.premium.price[lang]}</span>
              <span className="text-gray-500 text-sm ml-1">{PLANS.premium.period[lang]}</span>
            </div>
            <p className="text-xs text-gray-500 mb-1">{PLANS.premium.promoNote[lang]}</p>
            <p className="text-xs font-bold text-red-500 mb-5 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {PLANS.premium.urgency[lang]}
            </p>
            <div className="space-y-2.5">
              {PLANS.premium.features[lang].map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-lg mx-auto">
          <h3 className="font-bold text-gray-900 mb-2">
            {lang === 'fr' ? 'Prêt à passer au Premium ?' : 'Ready to go Premium?'}
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            {lang === 'fr'
              ? 'Cliquez ci-dessous et notre équipe vous contactera pour finaliser votre abonnement.'
              : 'Click below and our team will contact you to finalize your subscription.'}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">{error}</div>
          )}

          <button
            onClick={handleSubscribe}
            disabled={submitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors w-full text-lg"
          >
            {submitting
              ? (lang === 'fr' ? 'Envoi en cours...' : 'Sending...')
              : (lang === 'fr' ? `Souscrire au Premium — ${PLANS.premium.price[lang]}/mois` : `Subscribe to Premium — ${PLANS.premium.price[lang]}/mo`)}
          </button>

          <p className="text-xs text-gray-400 mt-4">
            {lang === 'fr'
              ? 'Paiement par virement bancaire ou carte. Annulation possible à tout moment.'
              : 'Payment by bank transfer or card. Cancel anytime.'}
          </p>
        </div>
      </div>
    </main>
  )
}
