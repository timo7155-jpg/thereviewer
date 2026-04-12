'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLang, LangToggle } from '@/lib/i18n'

export default function DashboardPage() {
  const router = useRouter()
  const { lang, t } = useLang()
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<string>('free')
  const [claimStatus, setClaimStatus] = useState<any>(null)
  const [teaserInsight, setTeaserInsight] = useState<string | null>(null)
  const isPremium = plan === 'premium'

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/dashboard/login'); return }
      setUser(user)

      const { data: owner } = await supabase
        .from('business_owners')
        .select('*, businesses(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (owner) {
        if (owner.status === 'approved' && owner.businesses) {
          setBusiness(owner.businesses)
          setPlan(owner.plan || 'free')

          const { data: reviews } = await supabase
            .from('reviews')
            .select('*, reviewers(name), owner_replies(*)')
            .eq('business_id', owner.businesses.id)
            .eq('is_verified', true)
            .order('created_at', { ascending: false })

          setReviews(reviews || [])

          // Fetch teaser insight for free users
          if (owner.plan !== 'premium') {
            fetch(`/api/admin/analyze?businessId=${owner.businesses.id}`)
              .then(r => r.json())
              .then(d => { if (d.analysis?.teaser_insight) setTeaserInsight(d.analysis.teaser_insight) })
              .catch(() => {})
          }
        } else {
          // Pending or rejected claim
          setClaimStatus({
            status: owner.status,
            businessName: owner.businesses?.name || 'Unknown',
            created_at: owner.created_at
          })
        }
      }

      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/dashboard/login')
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length).toFixed(1)
    : null

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <LangToggle />
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">{(user?.email || 'U').charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-sm text-gray-500 hidden md:block">{user?.email}</span>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 font-medium ml-1">
              {t('dash.signOut')}
            </button>
          </div>
        </div>
      </nav>

      {/* Welcome banner */}
      <div className={`text-white px-6 py-10 ${
        isPremium
          ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600'
          : 'bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600'
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold">
              {lang === 'fr' ? 'Bienvenue dans votre espace propriétaire' : 'Welcome to your Owner Dashboard'}
            </h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              isPremium
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/10 text-white/70 border border-white/20'
            }`}>
              {isPremium ? 'Premium' : 'Free'}
            </span>
          </div>
          <p className={isPremium ? 'text-purple-200' : 'text-blue-100'}>
            {isPremium
              ? (lang === 'fr'
                ? 'Accès complet — gérez vos avis, répondez aux clients et exploitez l\'analyse IA.'
                : 'Full access — manage reviews, reply to customers, and leverage AI insights.')
              : (lang === 'fr'
                ? 'Gérez votre entreprise, suivez vos avis et améliorez votre réputation.'
                : 'Manage your business, track your reviews, and grow your reputation.')}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {!business ? (
          <div className="animate-fade-up">
            {/* Show claim status if exists */}
            {claimStatus ? (
              <div className="max-w-lg mx-auto">
                <div className={`rounded-2xl border p-8 shadow-sm text-center ${
                  claimStatus.status === 'pending'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    claimStatus.status === 'pending' ? 'bg-amber-100' : 'bg-red-100'
                  }`}>
                    {claimStatus.status === 'pending' ? (
                      <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {claimStatus.status === 'pending'
                      ? (lang === 'fr' ? 'Demande en attente' : 'Claim request pending')
                      : (lang === 'fr' ? 'Demande refusée' : 'Claim request rejected')}
                  </h2>

                  <p className="text-gray-600 text-sm mb-2">
                    {lang === 'fr' ? 'Entreprise :' : 'Business:'} <span className="font-semibold">{claimStatus.businessName}</span>
                  </p>

                  <p className="text-gray-500 text-xs mb-4">
                    {lang === 'fr' ? 'Soumis le' : 'Submitted on'}{' '}
                    {new Date(claimStatus.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>

                  {claimStatus.status === 'pending' ? (
                    <p className="text-amber-700 text-sm">
                      {lang === 'fr'
                        ? 'Notre équipe examine votre demande. Vous serez notifié sous 24 à 48 heures.'
                        : 'Our team is reviewing your request. You will be notified within 24-48 hours.'}
                    </p>
                  ) : (
                    <div>
                      <p className="text-red-700 text-sm mb-4">
                        {lang === 'fr'
                          ? 'Votre demande a été refusée. Veuillez nous contacter pour plus d\'informations.'
                          : 'Your request was not approved. Please contact us for more information.'}
                      </p>
                      <Link href="/dashboard/upgrade" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors inline-block">
                        {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* No claim submitted yet */
              <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{t('dash.claimHotel')}</h2>
                <p className="text-gray-500 text-sm mb-5">{t('dash.claimDesc')}</p>
                <Link href="/dashboard/claim" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors inline-block">
                  {t('dash.claimBtn')}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-up">
            {/* Hotel header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-gray-900">{business.name}</h1>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">{lang === 'fr' ? 'Vérifié' : 'Verified'}</span>
                </div>
                <p className="text-gray-500">{business.region} · {business.address}</p>
                {business.claimed_at && (
                  <p className="text-xs text-gray-400 mt-1">
                    {lang === 'fr' ? 'Approuvé le' : 'Approved on'}{' '}
                    {new Date(business.claimed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
              <Link href={`/hotels/${business.slug}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
                {t('dash.viewPublic')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <div className="text-3xl font-extrabold text-gradient mb-1">{avgRating || '—'}</div>
                <div className="text-sm text-gray-500">{t('dash.overallRating')}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <div className="text-3xl font-extrabold text-gradient mb-1">{reviews.length}</div>
                <div className="text-sm text-gray-500">{t('dash.totalReviews')}</div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <div className="text-3xl font-extrabold text-gradient mb-1">
                  {reviews.filter(r => r.owner_replies?.length > 0).length}
                </div>
                <div className="text-sm text-gray-500">{t('dash.repliesSent')}</div>
              </div>
            </div>

            {/* Teaser insight for free users */}
            {!isPremium && teaserInsight && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">
                      {lang === 'fr' ? 'Conseil gratuit de notre analyse IA' : 'Free tip from our AI analysis'}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{teaserInsight}</p>
                    <p className="text-xs text-blue-600 font-semibold mt-2">
                      <Link href="/dashboard/upgrade">
                        {lang === 'fr' ? 'Passez au Premium pour l\'analyse complète →' : 'Upgrade to Premium for the full analysis →'}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Plan banner for free users */}
            {!isPremium && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 mb-8 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">{lang === 'fr' ? 'Passez au Premium' : 'Upgrade to Premium'}</h3>
                  <p className="text-blue-100 text-sm mb-1">{lang === 'fr' ? 'Débloquez les réponses aux avis, l\'analyse IA et plus encore.' : 'Unlock review replies, AI insights, analytics and more.'}</p>
                  <p className="text-blue-200 text-xs flex items-center gap-1">
                    <span className="line-through">{lang === 'fr' ? '3 000 MUR' : 'MUR 3,000'}</span>
                    <span className="font-bold text-white">{lang === 'fr' ? '2 490 MUR/mois' : 'MUR 2,490/mo'}</span>
                    <span className="text-yellow-300 font-bold ml-1">— {lang === 'fr' ? 'Presque complet !' : 'Almost fully booked!'}</span>
                  </p>
                </div>
                <Link href="/dashboard/upgrade" className="bg-white text-blue-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shrink-0 ml-4">
                  {lang === 'fr' ? 'Souscrire' : 'Subscribe'}
                </Link>
              </div>
            )}

            {/* Photo management */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{lang === 'fr' ? 'Photos de votre entreprise' : 'Business Photos'}</h3>
                    <p className="text-xs text-gray-500">{lang === 'fr' ? 'Ajoutez ou gérez les photos de votre fiche' : 'Add or manage photos on your listing'}</p>
                  </div>
                </div>
                {isPremium ? (
                  <Link href={`/admin/businesses/${business.id}/edit`} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                    {lang === 'fr' ? 'Gérer les photos' : 'Manage photos'}
                  </Link>
                ) : (
                  <button
                    onClick={() => alert(lang === 'fr' ? 'Passez au Premium pour gérer vos photos.' : 'Upgrade to Premium to manage your photos.')}
                    className="bg-gray-100 text-gray-400 px-4 py-2 rounded-xl text-sm font-semibold cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {lang === 'fr' ? 'Premium requis' : 'Premium required'}
                  </button>
                )}
              </div>
            </div>

            {/* Business Analysis from public reviews */}
            <OwnerAnalysis businessId={business.id} isPremium={isPremium} lang={lang} />

            {/* AI Insights */}
            <div className={!isPremium ? 'relative' : ''}>
              {!isPremium && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <p className="text-gray-500 font-semibold text-sm">Premium</p>
                  </div>
                </div>
              )}
              <InsightsPanel businessId={business.id} reviewCount={reviews.length} />
            </div>

            {/* Reviews */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                {reviews.length > 0 ? `${reviews.length} ${t('hotel.reviews')}` : t('hotel.noReviewsYet')}
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p className="font-medium">{t('dash.noReviews')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
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

                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.service_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.service')}: {review.service_score}</span>}
                      {review.cleanliness_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.cleanliness')}: {review.cleanliness_score}</span>}
                      {review.location_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.location')}: {review.location_score}</span>}
                      {review.food_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.food')}: {review.food_score}</span>}
                      {review.value_score && <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full">{t('review.value')}: {review.value_score}</span>}
                    </div>

                    {review.body && <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.body}</p>}

                    {/* Reply section */}
                    {review.owner_replies?.length > 0 ? (
                      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mt-2 border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                          <span className="font-semibold text-blue-700">{t('dash.yourReply')}</span>
                        </div>
                        {review.owner_replies[0].body}
                      </div>
                    ) : isPremium ? (
                      <ReplyForm reviewId={review.id} userId={user.id} onSent={(body) => {
                        setReviews(prev => prev.map(r =>
                          r.id === review.id
                            ? { ...r, owner_replies: [{ body }] }
                            : r
                        ))
                      }} />
                    ) : (
                      <div className="mt-3 bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                        <svg className="w-5 h-5 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <p className="text-xs text-gray-500">
                          <Link href="/dashboard/upgrade" className="text-blue-600 font-semibold hover:text-blue-700">{lang === 'fr' ? 'Passez au Premium' : 'Upgrade to Premium'}</Link>
                          {lang === 'fr' ? ' pour répondre aux avis' : ' to reply to reviews'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-12 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>&copy; 2026 TheReviewer.mu</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">{lang === 'fr' ? 'Accueil' : 'Home'}</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            <Link href="/#pricing" className="hover:text-blue-600 transition-colors">{lang === 'fr' ? 'Tarifs' : 'Pricing'}</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

function OwnerAnalysis({ businessId, isPremium, lang }: { businessId: string, isPremium: boolean, lang: string }) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/analyze?businessId=${businessId}`)
      .then(r => r.json())
      .then(d => { setAnalysis(d.analysis); setLoading(false) })
      .catch(() => setLoading(false))
  }, [businessId])

  if (loading || !analysis) return null

  const scores = [
    { label: lang === 'fr' ? 'Service' : 'Service', score: analysis.service_score, color: 'from-blue-500 to-blue-600' },
    { label: lang === 'fr' ? 'Propreté' : 'Cleanliness', score: analysis.cleanliness_score, color: 'from-emerald-500 to-emerald-600' },
    { label: lang === 'fr' ? 'Emplacement' : 'Location', score: analysis.location_score, color: 'from-violet-500 to-violet-600' },
    { label: lang === 'fr' ? 'Nourriture' : 'Food', score: analysis.food_score, color: 'from-amber-500 to-amber-600' },
    { label: lang === 'fr' ? 'Rapport Q/P' : 'Value', score: analysis.value_score, color: 'from-cyan-500 to-cyan-600' },
  ].filter(s => s.score)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-rich overflow-hidden mb-6">
      <div className={`px-6 py-5 ${isPremium ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {lang === 'fr' ? 'Analyse de votre réputation' : 'Your Reputation Analysis'}
              </h3>
              <p className="text-white/60 text-xs">
                {lang === 'fr'
                  ? `Basée sur ${analysis.source_review_count?.toLocaleString() || 0} avis publics`
                  : `Based on ${analysis.source_review_count?.toLocaleString() || 0} public reviews`}
              </p>
            </div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3">
            <div className="text-3xl font-extrabold text-white">{analysis.overall_score?.toFixed(1)}</div>
            <div className="flex justify-center mt-0.5">
              {[1, 2, 3, 4, 5].map((s: number) => (
                <span key={s} className={`text-sm ${s <= Math.round(analysis.overall_score) ? 'text-yellow-300' : 'text-white/20'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-700 leading-relaxed mb-5">{analysis.summary}</p>

        {/* Score breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {scores.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-extrabold text-gray-900">{s.score?.toFixed(1)}</div>
              <div className={`h-1.5 rounded-full bg-gradient-to-r ${s.color} mt-1 mb-1`} style={{ width: `${(s.score / 5) * 100}%`, margin: '4px auto' }} />
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Strengths & Improvements — visible to all */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {analysis.strengths?.length > 0 && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Points forts' : 'Strengths'}</h4>
              <ul className="space-y-1.5">
                {analysis.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-emerald-700">{s}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.improvements?.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Axes d\'amélioration' : 'Areas to improve'}</h4>
              <ul className="space-y-1.5">
                {analysis.improvements.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-amber-700">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Best/Worst — premium only */}
        {isPremium && (analysis.best_review || analysis.worst_review) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {analysis.best_review && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                  </div>
                  <span className="text-xs font-bold text-gray-700">{lang === 'fr' ? 'Ce que vos clients adorent' : 'What your customers love'}</span>
                </div>
                <p className="text-sm text-gray-600 italic">"{analysis.best_review}"</p>
              </div>
            )}
            {analysis.worst_review && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                  </div>
                  <span className="text-xs font-bold text-gray-700">{lang === 'fr' ? 'Ce qui pourrait être amélioré' : 'What could be better'}</span>
                </div>
                <p className="text-sm text-gray-600 italic">"{analysis.worst_review}"</p>
              </div>
            )}
          </div>
        )}

        {!isPremium && (
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">
              {lang === 'fr' ? 'Passez au Premium pour voir ce que vos clients adorent et ce qu\'ils veulent améliorer.' : 'Upgrade to Premium to see what your customers love and what they want improved.'}
            </p>
            <Link href="/dashboard/upgrade" className="text-blue-600 text-xs font-semibold hover:text-blue-700">
              {lang === 'fr' ? 'Débloquer l\'analyse complète →' : 'Unlock full analysis →'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function InsightsPanel({ businessId, reviewCount }: { businessId: string, reviewCount: number }) {
  const { t } = useLang()
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadInsights = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setInsights(data.insights)
    } catch {
      setError('Failed to load insights')
    }
    setLoading(false)
  }

  const sentimentConfig = {
    positive: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
    negative: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
    mixed: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    neutral: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' },
  }
  const sc = sentimentConfig[(insights?.sentiment as keyof typeof sentimentConfig) || 'neutral']

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('insights.title')}</h2>
              <p className="text-gray-500 text-xs">{t('insights.desc')}</p>
            </div>
          </div>
          <button
            onClick={loadInsights}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Analyzing...' : insights ? t('insights.refresh') : t('insights.generate')}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-3 py-10 justify-center text-gray-400">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">{t('insights.analyzing')} {reviewCount} {t('insights.reviewsWord')}</span>
          </div>
        )}

        {insights && !loading && (
          <div className="space-y-5">
            <div className={`flex items-start gap-3 p-4 rounded-xl ${sc.bg} border ${sc.border}`}>
              <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white ${sc.text} capitalize`}>
                {insights.sentiment}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{insights.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <h3 className="font-bold text-green-800 text-sm mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t('insights.strengths')}
                </h3>
                <ul className="space-y-2">
                  {insights.strengths?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-green-700">{s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <h3 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                  {t('insights.improvements')}
                </h3>
                <ul className="space-y-2">
                  {insights.improvements?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-amber-700">{s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  {t('insights.actions')}
                </h3>
                <ul className="space-y-2">
                  {insights.actionItems?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-blue-700">{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ReplyForm({ reviewId, userId, onSent }: { reviewId: string, userId: string, onSent: (body: string) => void }) {
  const { t } = useLang()
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReply = async () => {
    if (!reply.trim()) return
    setLoading(true)
    await fetch('/api/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, userId, body: reply })
    })
    onSent(reply)
    setLoading(false)
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <textarea
        rows={2}
        value={reply}
        onChange={e => setReply(e.target.value)}
        placeholder={t('dash.replyPlaceholder')}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none"
      />
      <button
        onClick={handleReply}
        disabled={loading}
        className="self-start bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? t('dash.posting') : t('dash.postReply')}
      </button>
    </div>
  )
}
