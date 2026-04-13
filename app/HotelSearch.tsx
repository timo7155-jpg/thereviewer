'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/i18n'
import { BUSINESS_CATEGORIES } from '@/lib/constants'

type Business = {
  id: string
  name: string
  slug: string
  region: string
  address: string
  description: string
  category: string
  review_count: number
  analysis_score: number | null
  analysis_review_count: number
  image_url: string | null
}

const categoryPlaceholders: Record<string, { bg: string; icon: string; path: string }> = {
  hotel: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    icon: 'text-blue-300',
    path: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  },
  restaurant: {
    bg: 'bg-gradient-to-br from-orange-50 to-red-100',
    icon: 'text-orange-300',
    path: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z'
  },
  retail: {
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-100',
    icon: 'text-emerald-300',
    path: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
  },
  spa: {
    bg: 'bg-gradient-to-br from-purple-50 to-pink-100',
    icon: 'text-purple-300',
    path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  },
  tour: {
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-100',
    icon: 'text-cyan-300',
    path: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  car_rental: {
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
    icon: 'text-amber-300',
    path: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H3m10 0h2m4 0a1 1 0 001-1v-4a1 1 0 00-.293-.707l-2-2A1 1 0 0017 8h-4v8z'
  },
  services: {
    bg: 'bg-gradient-to-br from-gray-50 to-slate-100',
    icon: 'text-gray-300',
    path: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
}

function getCategoryPlaceholder(category: string) {
  return categoryPlaceholders[category] || categoryPlaceholders.hotel
}

const PER_PAGE = 18

export default function HotelSearch({ initialHotels }: { initialHotels: Business[] }) {
  const { lang, t } = useLang()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [businesses, setBusinesses] = useState(initialHotels)
  const [searching, setSearching] = useState(false)
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(businesses.length / PER_PAGE)
  const paginated = businesses.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const doSearch = async (q: string, cat: string) => {
    if (!q.trim() && cat === 'all') {
      setBusinesses(initialHotels)
      setPage(1)
      return
    }
    setSearching(true)
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q)
    if (cat !== 'all') params.set('category', cat)
    const res = await fetch(`/api/search?${params}`)
    const data = await res.json()
    setBusinesses(data.hotels || [])
    setPage(1)
    setSearching(false)
  }

  const handleSearch = () => doSearch(query, category)
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch() }
  const handleCategory = (cat: string) => { setCategory(cat); doSearch(query, cat) }
  const handleClear = () => { setQuery(''); setCategory('all'); setBusinesses(initialHotels); setPage(1) }

  const getCategoryLabel = (value: string) => {
    const cat = BUSINESS_CATEGORIES.find(c => c.value === value)
    return cat ? cat.label[lang] : value
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-800 via-blue-600 to-cyan-600 text-white py-14 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl opacity-15" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400 rounded-full blur-3xl opacity-5" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            {lang === 'fr'
              ? 'La plateforme qui connecte entreprises et clients à Maurice'
              : 'The platform connecting businesses and customers in Mauritius'}
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-4 max-w-2xl mx-auto">
            {lang === 'fr'
              ? 'Avis vérifiés, analyse IA, réservation instantanée — tout en un seul endroit.'
              : 'Verified reviews, AI-powered insights, instant booking — all in one place.'}
          </p>
          <p className="text-blue-200 text-sm mb-10 max-w-xl mx-auto">
            {lang === 'fr'
              ? 'Propriétaire d\'entreprise ? Réclamez votre fiche gratuitement et gérez votre réputation.'
              : 'Business owner? Claim your listing for free and take control of your reputation.'}
          </p>
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={lang === 'fr' ? 'Rechercher par nom, région...' : 'Search by name, region...'}
                className="w-full pl-10 pr-4 py-3.5 rounded-lg text-gray-900 outline-none text-sm"
              />
            </div>
            {(query || category !== 'all') && (
              <button onClick={handleClear} className="text-white/80 hover:text-white px-3 text-sm font-medium">
                {lang === 'fr' ? 'Effacer' : 'Clear'}
              </button>
            )}
            <button
              onClick={handleSearch}
              disabled={searching}
              className="bg-white text-blue-700 font-semibold px-6 py-3.5 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors text-sm"
            >
              {searching ? '...' : lang === 'fr' ? 'Rechercher' : 'Search'}
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{initialHotels.length}</div>
              <div className="text-blue-200">{lang === 'fr' ? 'Entreprises' : 'Businesses'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{initialHotels.reduce((s, h) => s + (h.analysis_review_count || h.review_count), 0).toLocaleString()}</div>
              <div className="text-blue-200">{lang === 'fr' ? 'Avis analysés' : 'Reviews analyzed'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">7</div>
              <div className="text-blue-200">{lang === 'fr' ? 'Catégories' : 'Categories'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-8 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
          {BUSINESS_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                category === cat.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </section>

      {/* Business listings */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {query
                ? `${lang === 'fr' ? 'Résultats pour' : 'Results for'} "${query}"`
                : category !== 'all'
                ? getCategoryLabel(category)
                : lang === 'fr' ? 'Toutes les entreprises' : 'All businesses'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {businesses.length} {lang === 'fr' ? 'résultat(s)' : 'result(s)'}
            </p>
          </div>
        </div>

        {businesses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium text-gray-500">
              {lang === 'fr' ? 'Aucune entreprise trouvée' : 'No businesses found'}
            </p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((biz, i) => (
              <Link
                key={biz.id}
                href={`/hotels/${biz.slug}`}
                className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden card-hover shadow-rich animate-fade-up flex flex-col"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Image */}
                <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                  {biz.image_url ? (
                    <img
                      src={biz.image_url}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${getCategoryPlaceholder(biz.category).bg}`}>
                      <svg className={`w-12 h-12 ${getCategoryPlaceholder(biz.category).icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={getCategoryPlaceholder(biz.category).path} />
                      </svg>
                    </div>
                  )}
                  {/* Tags overlay */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="text-xs font-medium text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {biz.region}
                    </span>
                    {biz.category && biz.category !== 'hotel' && (
                      <span className="text-xs font-medium text-white bg-purple-600/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {getCategoryLabel(biz.category)}
                      </span>
                    )}
                  </div>
                  {(biz.analysis_score || biz.review_count > 0) && (
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold text-white bg-amber-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                        ★ {biz.analysis_score ? biz.analysis_score.toFixed(1) : biz.review_count}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                    {biz.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{biz.address}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">{biz.description}</p>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    {biz.analysis_score ? (
                      <span className="text-xs text-gray-400">
                        {lang === 'fr'
                          ? `${biz.analysis_review_count.toLocaleString()} avis analysés`
                          : `${biz.analysis_review_count.toLocaleString()} reviews analyzed`}
                      </span>
                    ) : biz.review_count === 0 ? (
                      <span className="text-xs text-gray-400">{lang === 'fr' ? 'Pas encore d\'avis' : 'No reviews yet'}</span>
                    ) : null}
                    <span className="text-xs font-medium text-blue-600 group-hover:translate-x-1 transition-transform ml-auto">
                      {lang === 'fr' ? 'Voir les détails →' : 'View details →'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                disabled={page === 1}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                {lang === 'fr' ? '← Précédent' : '← Previous'}
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => { setPage(p); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${
                      p === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                disabled={page === totalPages}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                {lang === 'fr' ? 'Suivant →' : 'Next →'}
              </button>
            </div>
          )}
          </>
        )}
      </section>
    </>
  )
}
