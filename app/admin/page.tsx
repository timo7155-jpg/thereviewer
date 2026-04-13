'use client'

import Link from 'next/link'
import AdminShell from './AdminShell'

const cards = [
  {
    href: '/admin/claims',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    title: 'Claim requests',
    desc: 'Review and approve business ownership claims',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    href: '/admin/reviews',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
    ),
    title: 'Reviews',
    desc: 'Moderate and manage all reviews',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    href: '/admin/businesses',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    ),
    title: 'Businesses',
    desc: 'Add and manage all businesses',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    href: '/admin/subscriptions',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    ),
    title: 'Subscriptions',
    desc: 'Upgrade or downgrade owner plans',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    href: '/admin/bookings',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    ),
    title: 'Bookings',
    desc: 'View and manage booking requests',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    href: '/admin/images',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    ),
    title: 'Auto-fetch Images',
    desc: 'Download Google photos for all businesses',
    color: 'text-pink-600 bg-pink-50',
  },
  {
    href: '/admin/analyze',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    ),
    title: 'Review Analysis',
    desc: 'AI-analyze Google reviews for all businesses',
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    href: '/admin/outreach',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
    title: 'Send Outreach',
    desc: 'Send personalized emails to business owners',
    color: 'text-rose-600 bg-rose-50',
  },
  {
    href: '/admin/email-preview',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
    title: 'Email Templates',
    desc: 'Preview outreach and notification emails',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    href: '/api/admin/backup',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
    ),
    title: 'Download Backup',
    desc: 'Export full database as JSON file',
    color: 'text-gray-600 bg-gray-100',
  },
  {
    href: '/admin/dashboard',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ),
    title: 'Analytics',
    desc: 'Platform stats, graphs, and activity feed',
    color: 'text-purple-600 bg-purple-50',
  },
]

export default function AdminPage() {
  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-500 text-sm mb-8">Manage your platform</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-white rounded-2xl border border-gray-100 p-6 card-hover shadow-sm"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                {card.icon}
              </div>
              <h2 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{card.title}</h2>
              <p className="text-sm text-gray-500">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
