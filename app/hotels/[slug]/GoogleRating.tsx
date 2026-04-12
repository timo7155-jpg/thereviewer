'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/i18n'

type GoogleReview = {
  author: string
  rating: number
  text: string
  time: string
  profilePhoto?: string
}

type GoogleData = {
  rating: number | null
  reviewCount: number
  reviews: GoogleReview[]
  googleMapsUrl: string
  found?: boolean
}

export default function GoogleRating({ businessId }: { businessId: string }) {
  const { lang } = useLang()
  const [data, setData] = useState<GoogleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch(`/api/google-rating?businessId=${businessId}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [businessId])

  if (loading) return (
    <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
      <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
      {lang === 'fr' ? 'Chargement de la note Google...' : 'Loading Google rating...'}
    </div>
  )

  if (!data || !data.rating || data.found === false) return null

  const reviews = data.reviews || []

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header — clickable to Google Maps */}
      <a
        href={data.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#4285f4' }}>
          <span className="text-white font-bold text-sm">G</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-lg">{data.rating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`text-sm ${star <= Math.round(data.rating!) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({data.reviewCount.toLocaleString()} {lang === 'fr' ? 'avis Google' : 'Google reviews'})
            </span>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-0.5">
            {lang === 'fr' ? 'Voir sur Google Maps →' : 'View on Google Maps →'}
          </p>
        </div>
      </a>

      {/* Reviews toggle */}
      {reviews.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-5 py-3 border-t border-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span>{lang === 'fr' ? `${reviews.length} avis Google récents` : `${reviews.length} recent Google reviews`}</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expanded && (
            <div className="border-t border-gray-100 divide-y divide-gray-50">
              {reviews.map((review, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-center gap-3 mb-2">
                    {review.profilePhoto ? (
                      <img src={review.profilePhoto} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-bold">{review.author.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{review.author}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={`text-xs ${star <= review.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{review.time}</span>
                      </div>
                    </div>
                  </div>
                  {review.text && (
                    <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                  )}
                </div>
              ))}

              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-5 py-3 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {lang === 'fr' ? 'Voir tous les avis sur Google →' : 'See all reviews on Google →'}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
