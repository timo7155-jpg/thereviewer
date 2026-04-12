'use client'

import Link from 'next/link'

export default function MiniFooter() {
  return (
    <footer className="border-t border-gray-100 mt-12 py-6 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <p>&copy; 2025 TheReviewer.mu</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
