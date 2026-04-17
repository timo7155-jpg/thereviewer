'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useLang } from '@/lib/i18n'
import { HomeNav } from '@/app/HomeNav'
import { supabase } from '@/lib/supabase'
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
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const checkOwner = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: owner } = await supabase
        .from('business_owners')
        .select('business_id')
        .eq('user_id', user.id)
        .eq('business_id', hotel.id)
        .eq('status', 'approved')
        .single()
      if (owner) setIsOwner(true)
    }
    checkOwner()
  }, [hotel.id])

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
        {/* Owner banner */}
        {isOwner && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
            <p className="text-sm text-blue-700 font-medium">
              {lang === 'fr' ? 'Ceci est la page publique de votre entreprise' : 'This is your business public page'}
            </p>
            <Link href="/dashboard" className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              {lang === 'fr' ? '← Tableau de bord' : '← Back to dashboard'}
            </Link>
          </div>
        )}

        {/* Back link */}
        {!isOwner && (
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-1 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {t('hotel.backToAll')}
          </Link>
        )}

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
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{hotel.region}</span>
                  {hotel.is_licensed && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1" title={lang === 'fr' ? 'Licence officielle — Commission du Tourisme' : 'Officially licensed — Tourism Commission'}>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      {hotel.license_type ? `${hotel.license_type}` : (lang === 'fr' ? 'Licence' : 'Licensed')}
                    </span>
                  )}
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

                {review.owner_replies?.[0]?.body && (
                  <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                        {lang === 'fr' ? `Réponse de ${hotel.name}` : `Response from ${hotel.name}`}
                      </span>
                      {review.owner_replies[0].created_at && (
                        <span className="text-xs text-blue-500 ml-auto">
                          {new Date(review.owner_replies[0].created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-900 leading-relaxed">{review.owner_replies[0].body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-10 text-center">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {lang === 'fr' ? 'Aucun avis TheReviewer.mu pour le moment' : 'No TheReviewer.mu reviews yet'}
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed mb-3">
              {lang === 'fr'
                ? `Des avis existent peut-être sur d'autres plateformes — nos scores IA ci-dessus, si affichés, proviennent de l'API officielle Google Places.`
                : `Reviews may exist on other platforms — the AI scores above, if shown, are derived from the official Google Places API.`}
            </p>
            <p className="text-sm text-blue-700 font-medium leading-relaxed max-w-md mx-auto">
              {lang === 'fr'
                ? `Vous avez visité ${hotel.name} ? Partagez votre expérience — avis vérifié par email, sans fioritures.`
                : `Visited ${hotel.name}? Share your experience — email-verified, straightforward.`}
            </p>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
