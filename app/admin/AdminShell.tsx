'use client'

import { useEffect, useState, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MiniFooter from '@/app/MiniFooter'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'timo7155@gmail.com'

export default function AdminShell({ children, title, subtitle, backHref, backLabel }: {
  children: ReactNode
  title?: string
  subtitle?: string
  backHref?: string
  backLabel?: string
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<'loading' | 'denied' | 'ok'>('loading')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/admin/login')
        return
      }
      if (user.email !== ADMIN_EMAIL) {
        setStatus('denied')
        return
      }
      setUser(user)
      setStatus('ok')
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (status === 'loading') return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </main>
  )

  if (status === 'denied') return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center animate-fade-up">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <p className="text-red-500 text-lg font-semibold mb-2">Access denied</p>
        <p className="text-gray-500 text-sm mb-4">You do not have admin privileges.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="text-blue-600 text-sm font-medium hover:text-blue-700">Back to home</Link>
          <span className="text-gray-300">|</span>
          <Link href="/dashboard" className="text-blue-600 text-sm font-medium hover:text-blue-700">My dashboard</Link>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold text-white">TheReviewer<span className="text-red-400">.mu</span></span>
            </Link>
            <span className="text-xs font-semibold text-red-400 bg-red-950 px-2 py-0.5 rounded uppercase tracking-wider">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            {backHref && (
              <Link href={backHref} className="text-sm text-gray-400 hover:text-white font-medium">
                {backLabel || '← Back'}
              </Link>
            )}
            <span className="text-gray-700">|</span>
            <span className="text-sm text-gray-400">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {children}

      <MiniFooter />
    </main>
  )
}
