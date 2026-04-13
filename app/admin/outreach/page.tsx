'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

export default function AdminOutreachPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [analyses, setAnalyses] = useState<Record<string, any>>({})
  const [loaded, setLoaded] = useState(false)
  const [sending, setSending] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})
  const [bulkRunning, setBulkRunning] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unclaimed' | 'claimed'>('unclaimed')
  const [customSubject, setCustomSubject] = useState('Helping Mauritius businesses grow through customer insights')

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

    // Load analyses for all businesses
    const analysisMap: Record<string, any> = {}
    for (const id of analyzedData.ids || []) {
      const res = await fetch(`/api/admin/analyze?businessId=${id}`)
      const data = await res.json()
      if (data.analysis) analysisMap[id] = data.analysis
    }
    setAnalyses(analysisMap)
  }

  const sendOne = async (biz: any) => {
    setSending(biz.id)
    setResults(r => ({ ...r, [biz.id]: 'sending...' }))

    const analysis = analyses[biz.id]
    const score = analysis?.overall_score?.toFixed(1) || 'N/A'
    const reviewCount = analysis?.source_review_count?.toLocaleString() || '0'
    const serviceScore = analysis?.service_score?.toFixed(1) || 'N/A'

    // Get owner email from claim if exists
    const ownerEmail = biz.business_owners?.find((o: any) => o.email)?.email

    try {
      const res = await fetch('/api/admin/send-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: biz.name,
          businessSlug: biz.slug,
          businessRegion: biz.region,
          recipientEmail: ownerEmail || null,
          score,
          reviewCount,
          serviceScore,
          subject: customSubject,
        })
      })
      const data = await res.json()
      if (data.success) {
        setResults(r => ({ ...r, [biz.id]: `✓ Sent${data.to ? ` to ${data.to}` : ' (logged)'}` }))
      } else {
        setResults(r => ({ ...r, [biz.id]: `✗ ${data.error || 'Failed'}` }))
      }
    } catch {
      setResults(r => ({ ...r, [biz.id]: '✗ Error' }))
    }
    setSending(null)
  }

  const sendBulk = async () => {
    setBulkRunning(true)
    for (const biz of filtered) {
      if (results[biz.id]?.startsWith('✓')) continue
      await sendOne(biz)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Rate limit
    }
    setBulkRunning(false)
  }

  const filtered = businesses.filter(b => {
    if (filter === 'unclaimed') return !b.is_claimed
    if (filter === 'claimed') return b.is_claimed
    return true
  })

  const sentCount = Object.values(results).filter(r => r.startsWith('✓')).length

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Outreach Emails</h1>
            <p className="text-gray-500 text-sm mt-1">Send personalized outreach to business owners</p>
          </div>
          <div className="flex items-center gap-2">
            {sentCount > 0 && (
              <span className="bg-green-50 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
                {sentCount} sent
              </span>
            )}
          </div>
        </div>

        {/* Subject line */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email subject line</label>
          <input
            type="text"
            value={customSubject}
            onChange={e => setCustomSubject(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
          />
          <p className="text-xs text-gray-400 mt-2">
            The email body is the outreach template from Email Templates. Each email is personalized with the business name, scores, and page link.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800">
          <strong>Note:</strong> Emails are sent to the admin inbox for now (Resend free plan limitation). When you have your own domain email configured, they'll go directly to business owners.
          You can also use this as a log of which businesses you've contacted.
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['unclaimed', 'claimed', 'all'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({
                tab === 'all' ? businesses.length :
                tab === 'unclaimed' ? businesses.filter(b => !b.is_claimed).length :
                businesses.filter(b => b.is_claimed).length
              })
            </button>
          ))}

          <button
            onClick={sendBulk}
            disabled={bulkRunning}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors ml-auto"
          >
            {bulkRunning ? `Sending... (${sentCount})` : `Send to all ${filter} (${filtered.length})`}
          </button>
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading businesses...</div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map(biz => {
              const analysis = analyses[biz.id]
              return (
                <div key={biz.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm truncate">{biz.name}</span>
                      {biz.is_claimed && <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">claimed</span>}
                      {analysis && <span className="text-xs text-blue-600">★ {analysis.overall_score?.toFixed(1)}</span>}
                    </div>
                    <p className="text-xs text-gray-400">{biz.region} · {biz.category}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {results[biz.id] && (
                      <span className={`text-xs font-medium ${
                        results[biz.id].startsWith('✓') ? 'text-green-600' :
                        results[biz.id].startsWith('✗') ? 'text-red-500' : 'text-amber-500'
                      }`}>
                        {results[biz.id]}
                      </span>
                    )}
                    <button
                      onClick={() => sendOne(biz)}
                      disabled={sending === biz.id || bulkRunning}
                      className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      {sending === biz.id ? '...' : 'Send'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
