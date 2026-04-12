'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

export default function AdminImagesPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [fetching, setFetching] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})
  const [bulkRunning, setBulkRunning] = useState(false)

  useEffect(() => {
    loadData().then(() => setLoaded(true))
  }, [])

  const loadData = async () => {
    const res = await fetch('/api/admin/businesses')
    const data = await res.json()
    setBusinesses(data.businesses || [])
  }

  const fetchOne = async (businessId: string) => {
    setFetching(businessId)
    setResults(r => ({ ...r, [businessId]: 'fetching...' }))
    try {
      const res = await fetch('/api/admin/fetch-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, maxPhotos: 5 })
      })
      const data = await res.json()
      if (data.success) {
        setResults(r => ({ ...r, [businessId]: `✓ ${data.uploaded} photos uploaded` }))
      } else if (data.skipped) {
        setResults(r => ({ ...r, [businessId]: `— Already has images (${data.count})` }))
      } else {
        setResults(r => ({ ...r, [businessId]: `✗ ${data.error || 'Failed'}` }))
      }
    } catch {
      setResults(r => ({ ...r, [businessId]: '✗ Error' }))
    }
    setFetching(null)
  }

  const fetchAll = async () => {
    setBulkRunning(true)
    for (const biz of businesses) {
      if (results[biz.id]?.startsWith('✓') || results[biz.id]?.startsWith('—')) continue
      await fetchOne(biz.id)
      // Delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    setBulkRunning(false)
  }

  const doneCount = Object.values(results).filter(r => r.startsWith('✓') || r.startsWith('—')).length
  const uploadedCount = Object.values(results).filter(r => r.startsWith('✓')).length

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Auto-fetch Images</h1>
            <p className="text-gray-500 text-sm mt-1">
              Automatically download Google photos for all businesses
            </p>
          </div>
          <div className="flex items-center gap-3">
            {doneCount > 0 && (
              <span className="bg-green-50 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
                {uploadedCount} with photos
              </span>
            )}
            <button
              onClick={fetchAll}
              disabled={bulkRunning}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {bulkRunning ? `Fetching... (${doneCount}/${businesses.length})` : 'Fetch all images'}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-800">
          <strong>How it works:</strong> For each business, we search Google Places, download up to 5 photos,
          and upload them to your Supabase Storage. Businesses that already have 3+ images are skipped.
          This uses your Google Places API credits (~$7 per 1,000 photos).
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading businesses...</div>
        ) : (
          <div className="flex flex-col gap-2">
            {businesses.map(biz => (
              <div key={biz.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm truncate">{biz.name}</span>
                    <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded shrink-0">{biz.category}</span>
                  </div>
                  <p className="text-xs text-gray-400">{biz.region}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {results[biz.id] && (
                    <span className={`text-xs font-medium ${
                      results[biz.id].startsWith('✓') ? 'text-green-600' :
                      results[biz.id].startsWith('—') ? 'text-gray-500' :
                      results[biz.id].startsWith('✗') ? 'text-red-500' : 'text-amber-500'
                    }`}>
                      {results[biz.id]}
                    </span>
                  )}
                  <button
                    onClick={() => fetchOne(biz.id)}
                    disabled={fetching === biz.id || bulkRunning}
                    className="bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {fetching === biz.id ? '...' : 'Fetch'}
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
