'use client'

import Link from 'next/link'
import { useLang, LangToggle } from '@/lib/i18n'

export function HomeNav() {
  const { lang } = useLang()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></span>
        </Link>
        <div className="flex gap-3 items-center text-sm">
          <LangToggle />
          <Link href="/dashboard/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {lang === 'fr' ? 'Connexion' : 'Login'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
