'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/i18n'

type Review = {
  author: string
  rating: number
  text: string
  time: string
  profilePhoto?: string
  title?: string
}

type PlatformData = {
  rating: number | null
  reviewCount: number
  reviews?: Review[]
  url?: string | null
}

const platformConfig: Record<string, { name: string, color: string, icon: string }> = {
  google: { name: 'Google', color: '#4285f4', icon: 'G' },
  tripadvisor: { name: 'TripAdvisor', color: '#00aa6c', icon: 'TA' },
  booking: { name: 'Booking.com', color: '#003580', icon: 'B' },
}

export default function ExternalRatings({ businessId }: { businessId: string }) {
  const { lang } = useLang()
  const [platforms, setPlatforms] = useState<Record<string, PlatformData>>({})
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/external-ratings?businessId=${businessId}`)
      .then(r => r.json())
      .then(d => { setPlatforms(d.platforms || {}); setLoading(false) })
      .catch(() => setLoading(false))
  }, [businessId])

  if (loading) return (
    <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
      <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
      {lang === 'fr' ? 'Chargement des notes externes...' : 'Loading external ratings...'}
    </div>
  )

  const entries = Object.entries(platforms).filter(([, data]) => data.rating)
  if (entries.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {lang === 'fr' ? 'Notes sur d\'autres plateformes' : 'Ratings on other platforms'}
      </h3>

      {entries.map(([platform, data]) => {
        const config = platformConfig[platform]
        if (!config || !data.rating) return null
        const reviews = data.reviews || []
        const isExpanded = expanded === platform

        return (
          <div key={platform} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <a
              href={data.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${!data.url ? 'pointer-events-none' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: config.color }}>
                <span className="text-white font-bold text-xs">{config.icon}</span>
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
                    ({data.reviewCount.toLocaleString()} {lang === 'fr' ? 'avis' : 'reviews'})
                  </span>
                </div>
                {data.url && (
                  <p className="text-xs font-medium mt-0.5" style={{ color: config.color }}>
                    {lang === 'fr' ? `Voir sur ${config.name} →` : `View on ${config.name} →`}
                  </p>
                )}
              </div>
            </a>

            {/* Reviews toggle */}
            {reviews.length > 0 && (
              <>
                <button
                  onClick={() => setExpanded(isExpanded ? null : platform)}
                  className="w-full px-5 py-3 border-t border-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span>{reviews.length} {lang === 'fr' ? `avis ${config.name} récents` : `recent ${config.name} reviews`}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
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
                        {review.title && (
                          <p className="text-sm font-semibold text-gray-800 mb-1">{review.title}</p>
                        )}
                        {review.text && (
                          <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                        )}
                      </div>
                    ))}

                    {data.url && (
                      <a
                        href={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-5 py-3 text-center text-sm font-medium hover:bg-gray-50 transition-colors"
                        style={{ color: config.color }}
                      >
                        {lang === 'fr' ? `Voir tous les avis sur ${config.name} →` : `See all reviews on ${config.name} →`}
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
