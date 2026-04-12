'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n'

export default function SiteFooter() {
  const { lang } = useLang()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Us */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold text-white">TheReviewer<span className="text-blue-400">.mu</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {lang === 'fr'
                ? 'TheReviewer.mu est la plateforme de confiance pour les avis d\'entreprises à Maurice. Notre équipe possède une expertise approfondie en gestion de la relation client, analyse financière, développement digital et stratégie commerciale. Nous aidons les entreprises à comprendre leurs clients et à améliorer leur réputation.'
                : 'TheReviewer.mu is the trusted platform for business reviews in Mauritius. Our team brings deep expertise in customer relationship management, financial analysis, digital development, and business strategy. We help businesses understand their customers and elevate their reputation.'}
            </p>
            <p className="text-xs text-gray-500">
              {lang === 'fr'
                ? 'Basé à Terre Rouge, Rodrigues, Maurice'
                : 'Based in Terre Rouge, Rodrigues, Mauritius'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">
              {lang === 'fr' ? 'Liens rapides' : 'Quick links'}
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                {lang === 'fr' ? 'Accueil' : 'Home'}
              </Link>
              <Link href="/#pricing" className="text-gray-400 hover:text-white transition-colors">
                {lang === 'fr' ? 'Tarifs' : 'Pricing'}
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Link>
              <Link href="/dashboard/login" className="text-gray-400 hover:text-white transition-colors">
                {lang === 'fr' ? 'Portail propriétaire' : 'Owner portal'}
              </Link>
              <Link href="/dashboard/claim" className="text-gray-400 hover:text-white transition-colors">
                {lang === 'fr' ? 'Réclamer votre entreprise' : 'Claim your business'}
              </Link>
              <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                {lang === 'fr' ? 'Administration' : 'Admin portal'}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">
              {lang === 'fr' ? 'Contact' : 'Contact'}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+23058137384" className="text-gray-400 hover:text-white transition-colors">+230 5813 7384</a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@thereviewer.mu" className="text-gray-400 hover:text-white transition-colors">contact@thereviewer.mu</a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">Terre Rouge, Rodrigues, Mauritius</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-block mt-5 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
            >
              {lang === 'fr' ? 'Nous contacter' : 'Get in touch'}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; 2025 TheReviewer.mu — {lang === 'fr' ? 'Tous droits réservés' : 'All rights reserved'}</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">{lang === 'fr' ? 'Conditions' : 'Terms'}</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">{lang === 'fr' ? 'Confidentialité' : 'Privacy'}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
