'use client'

import { useEffect, useState } from 'react'

export default function GoogleRating({ businessId }: { businessId: string }) {
  const [data, setData] = useState<{ rating: number | null, reviewCount: number, found?: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/google-rating?businessId=${businessId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [businessId])

  if (loading) return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
      Loading Google rating...
    </div>
  )

  if (!data || !data.rating || data.found === false) return null

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
      {/* Google icon */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#4285f4' }}>
        <span className="text-white font-bold text-sm">G</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">{data.rating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={`text-sm ${star <= Math.round(data.rating!) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {data.reviewCount.toLocaleString()} Google reviews
        </p>
      </div>
    </div>
  )
}
