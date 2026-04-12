'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang, LangToggle } from '@/lib/i18n'

export function HomeNav() {
  const { lang } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-3 items-center text-sm">
          <LangToggle />
          <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Contact
          </Link>
          <Link href="/dashboard/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {lang === 'fr' ? 'Connexion' : 'Login'}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 -mr-2">
          {menuOpen ? (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-2 border-t border-gray-100 pt-4 flex flex-col gap-3">
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-2">
            Contact
          </Link>
          <Link href="/dashboard/login" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-2">
            {lang === 'fr' ? 'Connexion' : 'Login'}
          </Link>
          <Link href="/#pricing" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium py-2">
            {lang === 'fr' ? 'Tarifs' : 'Pricing'}
          </Link>
          <div className="pt-2">
            <LangToggle />
          </div>
        </div>
      )}
    </nav>
  )
}
