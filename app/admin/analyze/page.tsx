'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

export default function AdminAnalyzePage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})
  const [bulkRunning, setBulkRunning] = useState(false)
  const [analyzed, setAnalyzed] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadData().then(() => setLoaded(true))
  }, [])

  const loadData = async () => {
    const [bizRes, analyzedRes] = await Promise.all([
      fetch('/api/admin/businesses'),
      fetch('/api/admin/analyzed-ids')
    ])
    const bizData = await bizRes.json()
    const analyzedData = await analyzedRes.json()
    setBusinesses(bizData.businesses || [])
    setAnalyzed(new Set(analyzedData.ids || []))
  }

  const analyzeOne = async (businessId: string, name: string) => {
    setAnalyzing(businessId)
    setResults(r => ({ ...r, [businessId]: 'analyzing...' }))
    try {
      const res = await fetch('/api/admin/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      })
      const data = await res.json()
      if (data.success) {
        setResults(r => ({ ...r, [businessId]: `✓ Done — ${data.analysis.overall_score}/5` }))
      } else {
        setResults(r => ({ ...r, [businessId]: `✗ ${data.error || 'Failed'}` }))
      }
    } catch {
      setResults(r => ({ ...r, [businessId]: '✗ Error' }))
    }
    setAnalyzing(null)
  }

  const analyzeAll = async (newOnly: boolean) => {
    setBulkRunning(true)
    for (const biz of businesses) {
      if (results[biz.id]?.startsWith('✓')) continue
      if (newOnly && analyzed.has(biz.id)) continue
      await analyzeOne(biz.id, biz.name)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    setBulkRunning(false)
  }

  const doneCount = Object.values(results).filter(r => r.startsWith('✓')).length
  const newCount = businesses.filter(b => !analyzed.has(b.id)).length

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Review Analysis</h1>
            <p className="text-gray-500 text-sm mt-1">
              Analyze public Google reviews with AI to generate scores and summaries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-50 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
              {analyzed.size} analyzed
            </span>
            {newCount > 0 && (
              <span className="bg-amber-50 text-amber-600 text-sm font-medium px-3 py-1 rounded-full">
                {newCount} new
              </span>
            )}
            <div className="flex gap-2">
              {newCount > 0 && (
                <button
                  onClick={() => analyzeAll(true)}
                  disabled={bulkRunning}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {bulkRunning ? `Analyzing... (${doneCount})` : `Analyze new only (${newCount})`}
                </button>
              )}
              <button
                onClick={() => analyzeAll(false)}
                disabled={bulkRunning}
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {bulkRunning ? '...' : 'Re-analyze all'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800">
          <strong>How it works:</strong> For each business, we search Google Places, fetch their rating and reviews,
          then use AI to generate original sub-scores (Service, Cleanliness, Location, Food, Value), a summary,
          strengths, and areas to improve. No review text is copied. This uses your Google API + Anthropic API credits.
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading businesses...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {businesses.map(biz => (
              <div key={biz.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{biz.name}</h3>
                    {biz.category && (
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{biz.category}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs">
                    {biz.region}
                    {analyzed.has(biz.id) && !results[biz.id] && (
                      <span className="ml-2 text-green-500">● analyzed</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {results[biz.id] && (
                    <span className={`text-xs font-medium ${results[biz.id].startsWith('✓') ? 'text-green-600' : results[biz.id].startsWith('✗') ? 'text-red-500' : 'text-amber-500'}`}>
                      {results[biz.id]}
                    </span>
                  )}
                  <button
                    onClick={() => analyzeOne(biz.id, biz.name)}
                    disabled={analyzing === biz.id || bulkRunning}
                    className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    {analyzing === biz.id ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
