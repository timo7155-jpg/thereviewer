'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/i18n'

type Analysis = {
  source: string
  source_rating: number
  source_review_count: number
  overall_score: number
  service_score: number
  cleanliness_score: number
  location_score: number
  food_score: number | null
  value_score: number
  summary: string
  strengths: string[]
  improvements: string[]
  analyzed_at: string
}

function ScoreRow({ label, score }: { label: string; score: number | null }) {
  if (!score) return null
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-700 w-8 text-right">{score.toFixed(1)}</span>
    </div>
  )
}

export default function ReviewAnalysis({ businessId }: { businessId: string }) {
  const { lang } = useLang()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/analyze?businessId=${businessId}`)
      .then(r => r.json())
      .then(d => { setAnalysis(d.analysis); setLoading(false) })
      .catch(() => setLoading(false))
  }, [businessId])

  if (loading) return null
  if (!analysis) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-rich overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-bold">
                {lang === 'fr' ? 'Analyse des avis' : 'Review Analysis'}
              </h3>
              <p className="text-blue-200 text-xs">
                {lang === 'fr'
                  ? `Basée sur ${analysis.source_review_count.toLocaleString()} avis publics Google`
                  : `Based on ${analysis.source_review_count.toLocaleString()} public Google reviews`}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-white">{analysis.overall_score.toFixed(1)}</div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className={`text-sm ${s <= Math.round(analysis.overall_score) ? 'text-yellow-300' : 'text-white/30'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <p className="text-sm text-gray-700 leading-relaxed mb-5">{analysis.summary}</p>

        {/* Score bars */}
        <div className="space-y-3 mb-6">
          <ScoreRow label={lang === 'fr' ? 'Service' : 'Service'} score={analysis.service_score} />
          <ScoreRow label={lang === 'fr' ? 'Propreté' : 'Cleanliness'} score={analysis.cleanliness_score} />
          <ScoreRow label={lang === 'fr' ? 'Emplacement' : 'Location'} score={analysis.location_score} />
          <ScoreRow label={lang === 'fr' ? 'Nourriture' : 'Food'} score={analysis.food_score} />
          <ScoreRow label={lang === 'fr' ? 'Rapport Q/P' : 'Value'} score={analysis.value_score} />
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.strengths?.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2">
                {lang === 'fr' ? 'Points forts' : 'Strengths'}
              </h4>
              <ul className="space-y-1.5">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.improvements?.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                {lang === 'fr' ? 'Axes d\'amélioration' : 'Areas to improve'}
              </h4>
              <ul className="space-y-1.5">
                {analysis.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 mt-5 text-center">
          {lang === 'fr'
            ? `Analyse générée le ${new Date(analysis.analyzed_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à partir de données publiques. Aucun avis n'a été copié.`
            : `Analysis generated on ${new Date(analysis.analyzed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} from public data. No reviews were copied.`}
        </p>
      </div>
    </div>
  )
}
