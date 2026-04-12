'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '../AdminShell'

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setData(d); setLoaded(true) })
  }, [])

  const s = data?.stats || {}

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Platform Overview</h1>
        <p className="text-gray-500 text-sm mb-8">Real-time metrics across TheReviewer.mu</p>

        {!loaded ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading analytics...
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Businesses" value={s.totalBusinesses} sub={`${s.claimedBusinesses} claimed`} color="blue" />
              <StatCard label="Reviews" value={s.totalReviews} sub={`${s.verifiedReviews} verified`} color="green" />
              <StatCard label="Bookings" value={s.totalBookings} sub={`${s.pendingBookings} pending`} color="purple" />
              <StatCard label="Reviewers" value={s.totalReviewers} sub="registered" color="amber" />
            </div>

            {/* Alert cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {s.pendingClaims > 0 && (
                <Link href="/admin/claims" className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-amber-800">{s.pendingClaims} pending claim{s.pendingClaims > 1 ? 's' : ''}</p>
                    <p className="text-amber-600 text-sm">Review and approve ownership requests</p>
                  </div>
                </Link>
              )}
              {s.totalReviews - s.verifiedReviews > 0 && (
                <Link href="/admin/reviews" className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-blue-800">{s.totalReviews - s.verifiedReviews} unverified review{s.totalReviews - s.verifiedReviews > 1 ? 's' : ''}</p>
                    <p className="text-blue-600 text-sm">Reviews awaiting verification</p>
                  </div>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Rating distribution */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = data.ratingDist[star - 1]
                    const total = data.ratingDist.reduce((a: number, b: number) => a + b, 0)
                    const pct = total > 0 ? (count / total) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 w-12">{star} ★</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Category breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Businesses by Category</h3>
                <div className="space-y-3">
                  {Object.entries(data.categoryDist as Record<string, number>)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, count]) => {
                      const total = s.totalBusinesses || 1
                      const pct = (count / total) * 100
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600 w-28 capitalize">{cat.replace('_', ' ')}</span>
                          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* Monthly reviews */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Reviews (Last 6 Months)</h3>
                {Object.keys(data.monthlyReviews).length === 0 ? (
                  <p className="text-gray-400 text-sm py-8 text-center">No review data yet</p>
                ) : (
                  <div className="flex items-end gap-2 h-40">
                    {Object.entries(data.monthlyReviews as Record<string, number>).map(([month, count]) => {
                      const max = Math.max(...Object.values(data.monthlyReviews as Record<string, number>), 1)
                      const height = (count / max) * 100
                      return (
                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-xs font-semibold text-gray-700">{count}</span>
                          <div className="w-full bg-blue-100 rounded-t-lg relative" style={{ height: `${Math.max(height, 8)}%` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" />
                          </div>
                          <span className="text-xs text-gray-500">{month}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Recent bookings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
                {data.recentBookings.length === 0 ? (
                  <p className="text-gray-400 text-sm py-8 text-center">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.recentBookings.slice(0, 5).map((b: any) => (
                      <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{b.name}</p>
                          <p className="text-xs text-gray-500">{b.businesses?.name} · {b.booking_type}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          b.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          b.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent reviews table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Recent Reviews</h3>
              {data.recentReviews.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">No reviews yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-xs font-medium text-gray-400 uppercase">Business</th>
                        <th className="text-left py-2 text-xs font-medium text-gray-400 uppercase">Reviewer</th>
                        <th className="text-center py-2 text-xs font-medium text-gray-400 uppercase">Rating</th>
                        <th className="text-center py-2 text-xs font-medium text-gray-400 uppercase">Status</th>
                        <th className="text-right py-2 text-xs font-medium text-gray-400 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentReviews.map((r: any) => (
                        <tr key={r.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 font-medium text-gray-900">{r.businesses?.name}</td>
                          <td className="py-3 text-gray-600">{r.reviewers?.name || 'Anonymous'}</td>
                          <td className="py-3 text-center">
                            <span className="text-amber-600 font-bold">★ {r.overall_rating}</span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              r.is_verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {r.is_verified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="py-3 text-right text-gray-500">
                            {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}

function StatCard({ label, value, sub, color }: { label: string, value: number, sub: string, color: string }) {
  const colors: Record<string, string> = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    amber: 'from-amber-500 to-amber-600',
  }

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 text-white shadow-sm`}>
      <p className="text-white/70 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-white/60 text-xs mt-1">{sub}</p>
    </div>
  )
}
