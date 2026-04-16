'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { HomeNav } from './HomeNav'
import SiteFooter from './SiteFooter'

type Business = any
type IslandKey = 'mauritius' | 'rodrigues'

const COPY: Record<IslandKey, {
  hero: { en: string, fr: string }
  tagline: { en: string, fr: string }
  emoji: string
  gradient: string
  accent: string
  facts: Array<{ en: string, fr: string }>
  editorials: Array<{ en: string, fr: string }>
}> = {
  rodrigues: {
    hero: { en: 'Rodrigues', fr: 'Rodrigues' },
    tagline: {
      en: 'Authentic island hospitality — the complete directory of officially licensed accommodations.',
      fr: 'Hospitalité authentique — le répertoire complet des hébergements officiellement licenciés.',
    },
    emoji: '🐢',
    gradient: 'from-emerald-700 via-teal-700 to-cyan-700',
    accent: 'emerald',
    facts: [
      {
        en: 'Covered by the Tourism Commission — 227 licensed accommodations verified and listed.',
        fr: 'Recensée par la Commission du Tourisme — 227 hébergements licenciés vérifiés et listés.',
      },
      {
        en: 'From 5-star resorts (Cotton Bay, Mourouk Ebony) to family-run villas across Anse aux Anglais, Pointe Coton, Mourouk and Graviers.',
        fr: 'Des resorts 5 étoiles (Cotton Bay, Mourouk Ebony) aux villas familiales à Anse aux Anglais, Pointe Coton, Mourouk et Graviers.',
      },
      {
        en: 'The only platform with full Rodrigues coverage — local, bilingual, verified.',
        fr: 'La seule plateforme avec une couverture complète de Rodrigues — locale, bilingue, vérifiée.',
      },
    ],
    editorials: [
      {
        en: 'Rodrigues moves at its own rhythm — 2 hours by plane from Mauritius, but a world apart. Think coral lagoons, hand-woven baskets at the Saturday market, octopus grilled on the beach at Saint François, and guest houses where the owner serves breakfast personally.',
        fr: 'Rodrigues a son propre rythme — 2 heures d\'avion depuis Maurice, mais un monde à part. Des lagons coralliens, des paniers tissés au marché du samedi, du poulpe grillé sur la plage à Saint François, et des chambres d\'hôtes où le propriétaire sert lui-même le petit-déjeuner.',
      },
    ],
  },
  mauritius: {
    hero: { en: 'Mauritius', fr: 'Maurice' },
    tagline: {
      en: 'The complete business directory — verified reviews, AI-powered insights, direct booking.',
      fr: 'Le répertoire complet des entreprises — avis vérifiés, analyses IA, réservation directe.',
    },
    emoji: '🏝️',
    gradient: 'from-blue-700 via-indigo-700 to-purple-700',
    accent: 'blue',
    facts: [
      {
        en: 'Every major beachfront resort analyzed — Four Seasons, Constance, One&Only, LUX, Beachcomber, Shangri-La and more.',
        fr: 'Chaque grand resort analysé — Four Seasons, Constance, One&Only, LUX, Beachcomber, Shangri-La et plus.',
      },
      {
        en: 'From fine dining in Port Louis to kitesurf schools on Le Morne — 200+ businesses, every region.',
        fr: 'De la haute gastronomie à Port Louis aux écoles de kitesurf au Morne — 200+ entreprises, chaque région.',
      },
      {
        en: 'AI analyses 390,000+ public reviews to surface genuine strengths and improvement areas.',
        fr: 'L\'IA analyse plus de 390 000 avis publics pour identifier forces réelles et axes d\'amélioration.',
      },
    ],
    editorials: [
      {
        en: 'Mauritius has five distinct coasts — the busy North around Grand Baie, the wilder East around Belle Mare, the dramatic South at Le Morne, the family-friendly West at Flic en Flac, and the Central highland towns. Every corner has its own character.',
        fr: 'Maurice a cinq côtes distinctes — le Nord animé autour de Grand Baie, l\'Est plus sauvage autour de Belle Mare, le Sud spectaculaire au Morne, l\'Ouest familial à Flic en Flac, et les villes centrales des hauts plateaux. Chaque coin a son propre caractère.',
      },
    ],
  },
}

function getTopRated(businesses: Business[], n: number) {
  return [...businesses]
    .filter(b => b.analysis_score != null)
    .sort((a, b) => (b.analysis_score - a.analysis_score) || (b.analysis_review_count - a.analysis_review_count))
    .slice(0, n)
}

function getCategoryBreakdown(businesses: Business[]) {
  const breakdown: Record<string, number> = {}
  businesses.forEach(b => {
    const key = b.license_type || b.category || 'other'
    breakdown[key] = (breakdown[key] || 0) + 1
  })
  return Object.entries(breakdown).sort((a, b) => b[1] - a[1])
}

export default function IslandLanding({
  island,
  businesses,
}: {
  island: IslandKey
  businesses: Business[]
}) {
  const { lang } = useLang()
  const copy = COPY[island]
  const [visibleCount, setVisibleCount] = useState(24)

  const topRated = getTopRated(businesses, 6)
  const licensed = businesses.filter(b => b.is_licensed).length
  const avgScore = (() => {
    const scored = businesses.filter(b => b.analysis_score != null)
    if (!scored.length) return null
    return (scored.reduce((s, b) => s + b.analysis_score, 0) / scored.length).toFixed(1)
  })()
  const totalReviews = businesses.reduce((s, b) => s + (b.analysis_review_count || 0), 0)
  const categoryBreakdown = getCategoryBreakdown(businesses)

  const displayed = businesses.slice(0, visibleCount)

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNav />

      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${copy.gradient} text-white overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="text-6xl md:text-7xl mb-4">{copy.emoji}</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            {copy.hero[lang]}
          </h1>
          <p className="text-lg md:text-xl opacity-95 max-w-2xl mx-auto mb-8 leading-relaxed">
            {copy.tagline[lang]}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3">
              <div className="text-3xl font-bold">{businesses.length}</div>
              <div className="opacity-80">{lang === 'fr' ? 'entreprises' : 'businesses'}</div>
            </div>
            {licensed > 0 && (
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3">
                <div className="text-3xl font-bold">{licensed}</div>
                <div className="opacity-80">{lang === 'fr' ? 'licenciées' : 'licensed'}</div>
              </div>
            )}
            {avgScore && (
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3">
                <div className="text-3xl font-bold">{avgScore}</div>
                <div className="opacity-80">{lang === 'fr' ? 'moyenne' : 'avg rating'}</div>
              </div>
            )}
            {totalReviews > 0 && (
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3">
                <div className="text-3xl font-bold">{totalReviews.toLocaleString()}</div>
                <div className="opacity-80">{lang === 'fr' ? 'avis analysés' : 'reviews analyzed'}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Editorial & facts */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              {lang === 'fr' ? `Découvrir ${copy.hero.fr}` : `About ${copy.hero.en}`}
            </h2>
            <p className="text-gray-700 leading-relaxed text-[15px]">{copy.editorials[0][lang]}</p>
          </div>
          <div className={`rounded-2xl border p-6 ${
            island === 'rodrigues'
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-blue-50 border-blue-100'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              island === 'rodrigues' ? 'text-emerald-900' : 'text-blue-900'
            }`}>
              {lang === 'fr' ? 'À savoir' : 'Did you know'}
            </h3>
            <ul className="space-y-3">
              {copy.facts.map((f, i) => (
                <li key={i} className="text-sm text-gray-700 leading-snug flex gap-2">
                  <span className={`shrink-0 ${
                    island === 'rodrigues' ? 'text-emerald-600' : 'text-blue-600'
                  }`}>▸</span>
                  <span>{f[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top rated */}
        {topRated.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {lang === 'fr' ? 'Les mieux notés' : 'Top rated'}
              </h2>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">★ {lang === 'fr' ? 'Favoris' : 'Editors\' picks'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {topRated.map(b => (
                <BusinessCard key={b.id} b={b} lang={lang} />
              ))}
            </div>
          </>
        )}

        {/* Category breakdown */}
        {categoryBreakdown.length > 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-12">
            <h3 className="font-bold text-gray-900 mb-4">
              {lang === 'fr' ? 'Par type' : 'By type'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {categoryBreakdown.map(([name, count]) => (
                <div key={name} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm">
                  <span className="font-semibold text-gray-900">{count}</span>{' '}
                  <span className="text-gray-600">{name}{count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full listing */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {lang === 'fr' ? 'Toutes les entreprises' : 'All businesses'}
          </h2>
          <span className="text-sm text-gray-500">{businesses.length} {lang === 'fr' ? 'au total' : 'total'}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map(b => (
            <BusinessCard key={b.id} b={b} lang={lang} />
          ))}
        </div>
        {visibleCount < businesses.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount(c => c + 24)}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              {lang === 'fr' ? `Voir plus (${businesses.length - visibleCount} restants)` : `Show more (${businesses.length - visibleCount} left)`}
            </button>
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  )
}

function BusinessCard({ b, lang }: { b: Business, lang: string }) {
  return (
    <Link href={`/hotels/${b.slug}`} className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
      <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {b.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={b.image_url} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
        )}
        {b.analysis_score && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-bold text-white bg-amber-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
              ★ {b.analysis_score.toFixed(1)}
            </span>
          </div>
        )}
        {b.is_licensed && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] font-bold text-white bg-emerald-600/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              {lang === 'fr' ? 'Licence' : 'Licensed'}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{b.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{b.address}</p>
        {b.description && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">{b.description}</p>
        )}
      </div>
    </Link>
  )
}
