'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n'

type Business = {
  id: string
  slug: string
  name: string
  address: string
  image_url?: string | null
  analysis_score?: number | null
  is_licensed?: boolean
  license_type?: string | null
}

export default function RodriguesSpotlight({ businesses }: { businesses: Business[] }) {
  const { lang } = useLang()
  if (!businesses || businesses.length === 0) return null

  return (
    <section className="relative bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">🐢</span>
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-widest">
                {lang === 'fr' ? 'Zoom sur' : 'Spotlight on'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              {lang === 'fr' ? 'Découvrir Rodrigues' : 'Discover Rodrigues'}
            </h2>
            <p className="text-emerald-100 text-sm md:text-base mt-1 max-w-xl">
              {lang === 'fr'
                ? 'Le répertoire le plus complet des hébergements licenciés — du resort 5 étoiles à la chambre d\'hôtes familiale.'
                : 'The most complete directory of licensed accommodations — from 5-star resorts to family-run guest houses.'}
            </p>
          </div>
          <Link
            href="/rodrigues"
            className="bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-colors whitespace-nowrap shrink-0 shadow-md"
          >
            {lang === 'fr' ? 'Tout voir →' : 'View all →'}
          </Link>
        </div>

        {/* Horizontal scrolling cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory">
          {businesses.slice(0, 10).map(b => (
            <Link
              key={b.id}
              href={`/hotels/${b.slug}`}
              className="group shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all snap-start"
            >
              <div className="relative h-36 bg-gradient-to-br from-emerald-100 to-teal-200 overflow-hidden">
                {b.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.image_url} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🏝️</div>
                )}
                {b.analysis_score && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[11px] font-bold text-white bg-amber-500/95 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      ★ {b.analysis_score.toFixed(1)}
                    </span>
                  </div>
                )}
                {b.is_licensed && (
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[9px] font-bold text-white bg-emerald-600/95 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      LICENSED
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition-colors">{b.name}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{b.address}</p>
                {b.license_type && (
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1.5">{b.license_type}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-emerald-100 text-xs mt-4 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            {lang === 'fr' ? 'Licence officielle — Commission du Tourisme' : 'Officially licensed — Tourism Commission'}
          </span>
        </p>
      </div>
    </section>
  )
}
