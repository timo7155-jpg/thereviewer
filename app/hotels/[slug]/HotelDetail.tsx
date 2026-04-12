'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n'
import { HomeNav } from '@/app/HomeNav'
import ImageCarousel from './ImageCarousel'
import BookingForm from './BookingForm'
import ExternalRatings from './ExternalRatings'
import ReviewAnalysis from './ReviewAnalysis'
import SiteFooter from '@/app/SiteFooter'

type Props = {
  hotel: any
  reviews: any[]
  avgRating: string | null
  reviewCountDisplay: number
  slug: string
  images: { id: string; url: string; position: number }[]
}

function ScoreBar({ label, score }: { label: string, score: number | null }) {
  if (!score) return null
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24">{label}</span>
      <div className="flex-1 score-bar">
        <div className="score-bar-fill" style={{ width: `${(score / 5) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{score}</span>
    </div>
  )
}

export default function HotelDetail({ hotel, reviews, avgRating, reviewCountDisplay, slug, images }: Props) {
  const { lang, t } = useLang()

  // Compute average sub-scores
  const avgScores = reviews.length > 0 ? {
    service: +(reviews.reduce((s, r) => s + (r.service_score || 0), 0) / reviews.filter(r => r.service_score).length).toFixed(1) || 0,
    cleanliness: +(reviews.reduce((s, r) => s + (r.cleanliness_score || 0), 0) / reviews.filter(r => r.cleanliness_score).length).toFixed(1) || 0,
    location: +(reviews.reduce((s, r) => s + (r.location_score || 0), 0) / reviews.filter(r => r.location_score).length).toFixed(1) || 0,
    food: +(reviews.reduce((s, r) => s + (r.food_score || 0), 0) / reviews.filter(r => r.food_score).length).toFixed(1) || 0,
    value: +(reviews.reduce((s, r) => s + (r.value_score || 0), 0) / reviews.filter(r => r.value_score).length).toFixed(1) || 0,
  } : null

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNav />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-1 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {t('hotel.backToAll')}
        </Link>

        {/* Image carousel */}
        <div className="mt-4">
          <ImageCarousel images={images} businessName={hotel.name} />
        </div>

        {/* Hotel header card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Gradient header strip */}
          <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{hotel.region}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{hotel.name}</h1>
                <p className="text-gray-500 mb-3">{hotel.address}</p>
                <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
                {hotel.website && (
                  <a href={hotel.website} target="_blank" className="inline-flex items-center gap-1 text-blue-600 text-sm mt-3 font-medium hover:text-blue-700 transition-colors">
                    {t('hotel.visitWebsite')}
                  </a>
                )}
              </div>

              {/* Rating card */}
              {avgRating ? (
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white rounded-2xl p-6 text-center min-w-[160px] flex flex-col justify-center shadow-xl shadow-indigo-200/50">
                  <div className="text-4xl font-extrabold mb-1">{avgRating}</div>
                  <div className="text-yellow-300 text-lg mb-1">{'★'.repeat(Math.round(Number(avgRating)))}</div>
                  <div className="text-blue-200 text-sm">{reviewCountDisplay.toLocaleString()} {t('home.reviews')}</div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 text-center min-w-[160px] flex flex-col justify-center border border-gray-100">
                  <div className="text-gray-400 text-sm">{t('hotel.noReviewsYet')}</div>
                </div>
              )}
            </div>

            {/* Average scores */}
            {avgScores && (
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <ScoreBar label={t('review.service')} score={avgScores.service} />
                <ScoreBar label={t('review.cleanliness')} score={avgScores.cleanliness} />
                <ScoreBar label={t('review.location')} score={avgScores.location} />
                <ScoreBar label={t('review.food')} score={avgScores.food} />
                <ScoreBar label={t('review.value')} score={avgScores.value} />
              </div>
            )}
          </div>
        </div>

        {/* AI Review Analysis */}
        <ReviewAnalysis businessId={hotel.id} />

        {/* External ratings */}
        <div className="mb-6">
          <ExternalRatings businessId={hotel.id} />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href={`/hotels/${slug}/review`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            {t('hotel.writeReview')}
          </Link>
        </div>

        {/* Booking form */}
        <BookingForm businessId={hotel.id} businessName={hotel.name} category={hotel.category || 'hotel'} />

        {/* Reviews list */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            {reviews.length > 0 ? `${reviews.length} ${t('hotel.reviews')}` : t('hotel.noReviewsYet')}
          </h2>
        </div>

        {reviews.length > 0 ? (
          <div className="flex flex-col gap-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {(review.reviewers?.name || 'A').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 block">
                        {review.reviewers?.name || t('common.anonymous')}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                    <span className="text-amber-400 text-sm">★</span>
                    <span className="text-amber-700 font-bold text-sm">{review.overall_rating}</span>
                  </div>
                </div>

                {/* Sub-scores */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {review.service_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.service')}: {review.service_score}</span>}
                  {review.cleanliness_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.cleanliness')}: {review.cleanliness_score}</span>}
                  {review.location_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.location')}: {review.location_score}</span>}
                  {review.food_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.food')}: {review.food_score}</span>}
                  {review.value_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.value')}: {review.value_score}</span>}
                </div>

                {review.body && <p className="text-gray-700 text-sm leading-relaxed">{review.body}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <p className="text-gray-500 font-medium">{t('hotel.beFirst')} {hotel.name}</p>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
