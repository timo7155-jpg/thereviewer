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
  best_review: string | null
  worst_review: string | null
  analyzed_at: string
}

function ScoreRow({ label, score, color }: { label: string; score: number | null; color: string }) {
  if (!score) return null
  const pct = (score / 5) * 100
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-700 w-8 text-right">{score.toFixed(1)}</span>
    </div>
  )
}

function RadialScore({ score, label, size = 80 }: { score: number; label: string; size?: number }) {
  const pct = (score / 5) * 100
  const circumference = 2 * Math.PI * 34
  const offset = circumference - (pct / 100) * circumference
  const color = score >= 4.5 ? '#10b981' : score >= 3.5 ? '#3b82f6' : score >= 2.5 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r="34" fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle
            cx={size/2} cy={size/2} r="34" fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-extrabold text-gray-900">{score.toFixed(1)}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-1.5 text-center">{label}</span>
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

  const scores = [
    { label: lang === 'fr' ? 'Service' : 'Service', score: analysis.service_score, color: 'bg-blue-500' },
    { label: lang === 'fr' ? 'Propreté' : 'Cleanliness', score: analysis.cleanliness_score, color: 'bg-emerald-500' },
    { label: lang === 'fr' ? 'Emplacement' : 'Location', score: analysis.location_score, color: 'bg-violet-500' },
    { label: lang === 'fr' ? 'Nourriture' : 'Food', score: analysis.food_score, color: 'bg-amber-500' },
    { label: lang === 'fr' ? 'Rapport Q/P' : 'Value', score: analysis.value_score, color: 'bg-cyan-500' },
  ].filter(s => s.score)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-rich overflow-hidden mb-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {lang === 'fr' ? 'Analyse des avis' : 'Review Analysis'}
              </h3>
              <p className="text-white/60 text-xs">
                {lang === 'fr'
                  ? `Basée sur ${analysis.source_review_count.toLocaleString()} avis publics`
                  : `Based on ${analysis.source_review_count.toLocaleString()} public reviews`}
              </p>
            </div>
          </div>
          {/* Big score */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3">
            <div className="text-3xl font-extrabold text-white">{analysis.overall_score.toFixed(1)}</div>
            <div className="flex justify-center mt-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className={`text-sm ${s <= Math.round(analysis.overall_score) ? 'text-yellow-300' : 'text-white/20'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <p className="text-sm text-gray-700 leading-relaxed mb-6">{analysis.summary}</p>

        {/* Radial score widgets */}
        <div className="flex justify-center gap-4 md:gap-6 mb-8 flex-wrap">
          {scores.map((s, i) => (
            <RadialScore key={i} score={s.score!} label={s.label} />
          ))}
        </div>

        {/* Bar chart scores */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            {lang === 'fr' ? 'Détail des scores' : 'Score Breakdown'}
          </h4>
          <div className="space-y-3">
            {scores.map((s, i) => (
              <ScoreRow key={i} label={s.label} score={s.score} color={s.color} />
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.strengths?.length > 0 && (
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {lang === 'fr' ? 'Points forts' : 'Strengths'}
              </h4>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                    <span className="w-5 h-5 bg-emerald-200 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-emerald-700">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.improvements?.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                {lang === 'fr' ? 'Axes d\'amélioration' : 'Areas to improve'}
              </h4>
              <ul className="space-y-2">
                {analysis.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-amber-700">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Best & Worst review summaries */}
        {(analysis.best_review || analysis.worst_review) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {analysis.best_review && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {lang === 'fr' ? 'Ce que les clients adorent' : 'What customers love'}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{analysis.best_review}"</p>
              </div>
            )}
            {analysis.worst_review && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {lang === 'fr' ? 'Ce qui pourrait être amélioré' : 'What could be better'}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{analysis.worst_review}"</p>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 mt-6 text-center leading-relaxed">
          {lang === 'fr'
            ? `Analyse générée le ${new Date(analysis.analyzed_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à partir de ${analysis.source_review_count.toLocaleString()} avis publics. Contenu original — aucun avis copié.`
            : `Analysis generated on ${new Date(analysis.analyzed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} from ${analysis.source_review_count.toLocaleString()} public reviews. Original content — no reviews were copied.`}
        </p>
      </div>
    </div>
  )
}
