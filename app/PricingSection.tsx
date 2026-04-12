'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n'
import { PLANS } from '@/lib/constants'

export default function PricingSection() {
  const { lang } = useLang()

  return (
    <section id="pricing" className="bg-gradient-to-b from-white to-blue-50/30 py-20 px-6 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {lang === 'fr' ? 'Tarification' : 'Pricing'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 mb-3">
            {lang === 'fr'
              ? 'Plans pour propriétaires d\'entreprise'
              : 'Plans for Business Owners'}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-2">
            {lang === 'fr'
              ? 'Prenez le contrôle de votre réputation en ligne et améliorez votre service client.'
              : 'Take control of your online reputation and improve your customer service.'}
          </p>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            {lang === 'fr'
              ? 'Rechercher des entreprises et lire des avis est toujours gratuit pour tous.'
              : 'Searching businesses and reading reviews is always free for everyone.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 relative">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{PLANS.free.name[lang]}</h3>
            <p className="text-gray-500 text-sm mb-6">{PLANS.free.description[lang]}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-gray-900">{PLANS.free.price[lang]}</span>
              <span className="text-gray-500 text-sm ml-1">{PLANS.free.period[lang]}</span>
            </div>

            <Link
              href="/dashboard/login"
              className="block w-full text-center bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors mb-8"
            >
              {lang === 'fr' ? 'Commencer gratuitement' : 'Get started free'}
            </Link>

            <div className="space-y-3">
              {PLANS.free.features[lang].map((f, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{f}</span>
                </div>
              ))}
              {PLANS.free.limitations[lang].map((f, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-400">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 relative shadow-xl shadow-blue-200/40">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                {lang === 'fr' ? 'Recommandé' : 'Recommended'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">{PLANS.premium.name[lang]}</h3>
            <p className="text-gray-500 text-sm mb-6">{PLANS.premium.description[lang]}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-gradient">{PLANS.premium.price[lang]}</span>
              <span className="text-gray-500 text-sm ml-1">{PLANS.premium.period[lang]}</span>
            </div>

            <Link
              href="/dashboard/upgrade"
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-8"
            >
              {lang === 'fr' ? 'Souscrire au Premium' : 'Subscribe to Premium'}
            </Link>

            <div className="space-y-3">
              {PLANS.premium.features[lang].map((f, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment details shown only on upgrade page, not here */}
      </div>
    </section>
  )
}
