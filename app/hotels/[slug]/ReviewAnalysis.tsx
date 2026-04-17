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
      {/* Header with gradient + transparent sourcing */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-6 py-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-white font-bold text-lg">
                  {lang === 'fr' ? 'Synthèse IA des avis Google' : 'AI Summary of Google Reviews'}
                </h3>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">AI</span>
              </div>
              <p className="text-white/80 text-xs mt-0.5">
                {lang === 'fr'
                  ? `Résumé automatique de ${analysis.source_review_count.toLocaleString()} avis publics Google`
                  : `Automated summary of ${analysis.source_review_count.toLocaleString()} public Google reviews`}
              </p>
            </div>
          </div>
          {/* Big score — AI-derived */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3">
            <div className="text-3xl font-extrabold text-white">{analysis.overall_score.toFixed(1)}</div>
            <div className="text-white/70 text-[10px] uppercase tracking-wider mt-0.5">
              {lang === 'fr' ? 'Score IA' : 'AI score'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Transparent disclaimer banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-xs text-blue-900 leading-relaxed">
            {lang === 'fr'
              ? <>Les scores, résumés et thèmes ci-dessous sont générés par intelligence artificielle à partir des <strong>avis publics publiés sur Google Maps</strong> pour cet établissement. Ce ne sont <strong>pas des citations directes</strong>. Pour lire les avis originaux, consultez la fiche Google Maps officielle.</>
              : <>Scores, summary and themes below are <strong>AI-generated</strong> from the business&apos;s <strong>publicly available Google Maps reviews</strong>. They are <strong>not direct quotes</strong>. To read the original reviews, see the official Google Maps listing.</>}
          </p>
        </div>

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

        {/* Themes from public reviews — labeled clearly as AI-synthesized */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.strengths?.length > 0 && (
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {lang === 'fr' ? 'Thèmes positifs récurrents' : 'Recurring positive themes'}
              </h4>
              <p className="text-[10px] text-emerald-700/70 mb-3">
                {lang === 'fr' ? 'Identifiés par IA dans les avis Google' : 'Identified by AI in Google reviews'}
              </p>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-800 flex items-start gap-2">
                    <span className="w-5 h-5 bg-emerald-200 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-emerald-800">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.improvements?.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                {lang === 'fr' ? 'Thèmes critiques récurrents' : 'Recurring critical themes'}
              </h4>
              <p className="text-[10px] text-amber-700/70 mb-3">
                {lang === 'fr' ? 'Identifiés par IA dans les avis Google' : 'Identified by AI in Google reviews'}
              </p>
              <ul className="space-y-2">
                {analysis.improvements.map((s, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-amber-800">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Owner-visible notice */}
        <p className="text-[11px] text-gray-400 mt-5 text-center leading-relaxed">
          {lang === 'fr'
            ? 'Propriétaire de cette fiche ? Revendiquez-la gratuitement pour corriger les informations, ajouter vos propres photos et répondre aux avis.'
            : 'Own this listing? Claim it free to correct information, add your own photos and respond to reviews.'}
        </p>
      </div>
    </div>
  )
}
