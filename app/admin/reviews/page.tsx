'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '../AdminShell'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all')

  useEffect(() => {
    loadReviews().then(() => setLoaded(true))
  }, [])

  const loadReviews = async () => {
    const res = await fetch('/api/admin/reviews')
    const data = await res.json()
    setReviews(data.reviews || [])
  }

  const handleAction = async (reviewId: string, action: 'delete' | 'toggle_verified') => {
    if (action === 'delete' && !confirm('Delete this review permanently?')) return
    await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, action })
    })
    await loadReviews()
  }

  const filtered = reviews.filter(r => {
    if (filter === 'verified') return r.is_verified
    if (filter === 'unverified') return !r.is_verified
    return true
  })

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Reviews</h1>
            <p className="text-gray-500 text-sm mt-1">Moderate and manage all reviews</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-50 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
              {reviews.filter(r => r.is_verified).length} verified
            </span>
            <span className="bg-amber-50 text-amber-600 text-sm font-medium px-3 py-1 rounded-full">
              {reviews.filter(r => !r.is_verified).length} unverified
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'verified', 'unverified'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({
                tab === 'all' ? reviews.length :
                tab === 'verified' ? reviews.filter(r => r.is_verified).length :
                reviews.filter(r => !r.is_verified).length
              })
            </button>
          ))}
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading reviews...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            No reviews found
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{review.businesses?.name}</h3>
                    <p className="text-gray-500 text-sm">{review.businesses?.region}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">
                      ★ {review.overall_rating}
                    </span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      review.is_verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {review.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Reviewer</p>
                    <p className="text-sm font-medium text-gray-900">{review.reviewers?.name || 'Anonymous'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900">{review.reviewers?.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Source</p>
                    <p className="text-sm font-medium text-gray-900">{review.source || 'native'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {review.body && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-gray-700">{review.body}</p>
                  </div>
                )}

                {/* Owner reply section */}
                {review.owner_replies?.length > 0 ? (
                  <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">
                    <p className="text-xs font-bold text-blue-700 mb-1">Owner reply:</p>
                    <p className="text-sm text-blue-800">{review.owner_replies[0].body}</p>
                  </div>
                ) : (
                  <AdminReplyForm reviewId={review.id} onSent={loadReviews} />
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(review.id, 'toggle_verified')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      review.is_verified
                        ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {review.is_verified ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    onClick={() => handleAction(review.id, 'delete')}
                    className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                  <Link
                    href={`/hotels/${review.businesses?.slug}`}
                    className="text-blue-600 text-sm self-center hover:underline ml-auto font-medium"
                  >
                    View page →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}

function AdminReplyForm({ reviewId, onSent }: { reviewId: string, onSent: () => void }) {
  const [reply, setReply] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!reply.trim()) return
    setLoading(true)
    await fetch('/api/admin/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, body: reply })
    })
    setReply('')
    setOpen(false)
    setLoading(false)
    onSent()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-blue-600 font-semibold hover:text-blue-700 mb-4 flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
        Reply on behalf of owner
      </button>
    )
  }

  return (
    <div className="mb-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
      <p className="text-xs font-bold text-blue-700 mb-2">Reply as business owner:</p>
      <textarea
        rows={2}
        value={reply}
        onChange={e => setReply(e.target.value)}
        className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none bg-white"
        placeholder="Write a reply on behalf of the business owner..."
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSubmit}
          disabled={loading || !reply.trim()}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Posting...' : 'Post reply'}
        </button>
        <button
          onClick={() => { setOpen(false); setReply('') }}
          className="text-gray-500 text-xs font-semibold hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
