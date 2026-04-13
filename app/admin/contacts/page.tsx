'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

export default function AdminContactsPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [fetching, setFetching] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})
  const [bulkRunning, setBulkRunning] = useState(false)
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'no-phone' | 'no-email' | 'complete'>('all')
  const [scrapingEmails, setScrapingEmails] = useState(false)
  const [scrapeResults, setScrapeResults] = useState<Record<string, string>>({})

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
      const res = await fetch('/api/admin/fetch-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      })
      const data = await res.json()
      if (data.success) {
        setResults(r => ({ ...r, [businessId]: `✓ ${data.phone || 'no phone'} | ${data.website ? 'has website' : 'no website'}` }))
        await loadData()
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
      if (biz.phone && biz.website) continue // skip complete
      await fetchOne(biz.id)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    setBulkRunning(false)
  }

  const scrapeOneEmail = async (businessId: string) => {
    setScrapeResults(r => ({ ...r, [businessId]: 'scraping...' }))
    try {
      const res = await fetch('/api/admin/scrape-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      })
      const data = await res.json()
      if (data.success) {
        setScrapeResults(r => ({ ...r, [businessId]: `✓ ${data.email}` }))
        await loadData()
      } else if (data.skipped) {
        setScrapeResults(r => ({ ...r, [businessId]: `— ${data.email}` }))
      } else {
        setScrapeResults(r => ({ ...r, [businessId]: `✗ ${data.message || data.error || 'Not found'}` }))
      }
    } catch {
      setScrapeResults(r => ({ ...r, [businessId]: '✗ Error' }))
    }
  }

  const scrapeAllEmails = async () => {
    setScrapingEmails(true)
    for (const biz of businesses) {
      if (biz.email) continue // skip if already has email
      if (!biz.website) continue // skip if no website
      await scrapeOneEmail(biz.id)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    setScrapingEmails(false)
  }

  const saveEmail = async (businessId: string) => {
    await fetch('/api/admin/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id: businessId, email: emailInput })
    })
    setEditingEmail(null)
    setEmailInput('')
    await loadData()
  }

  const withPhone = businesses.filter(b => b.phone).length
  const withEmail = businesses.filter(b => b.email).length
  const withWebsite = businesses.filter(b => b.website).length

  const filtered = businesses.filter(b => {
    if (filter === 'no-phone') return !b.phone
    if (filter === 'no-email') return !b.email
    if (filter === 'complete') return b.phone && b.email
    return true
  })

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Business Contacts</h1>
            <p className="text-gray-500 text-sm mt-1">Fetch phone numbers from Google, manually add emails</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrapeAllEmails}
              disabled={scrapingEmails || bulkRunning}
              className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {scrapingEmails ? 'Scraping emails...' : 'Scrape emails from websites'}
            </button>
            <button
              onClick={fetchAll}
              disabled={bulkRunning || scrapingEmails}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {bulkRunning ? 'Fetching...' : 'Fetch phones'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-extrabold text-gray-900">{businesses.length}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-extrabold text-green-600">{withPhone}</div>
            <div className="text-xs text-gray-500">Have phone</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-extrabold text-blue-600">{withEmail}</div>
            <div className="text-xs text-gray-500">Have email</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-extrabold text-purple-600">{withWebsite}</div>
            <div className="text-xs text-gray-500">Have website</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'no-phone', 'no-email', 'complete'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'no-phone' ? 'Missing phone' : tab === 'no-email' ? 'Missing email' : 'Complete'}
            </button>
          ))}
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Business</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Website</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(biz => (
                  <tr key={biz.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{biz.name}</p>
                      <p className="text-xs text-gray-400">{biz.region} · {biz.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      {biz.phone ? (
                        <span className="text-gray-700">{biz.phone}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingEmail === biz.id ? (
                        <div className="flex gap-1">
                          <input
                            type="email"
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-40 outline-none"
                            placeholder="email@business.com"
                            autoFocus
                          />
                          <button onClick={() => saveEmail(biz.id)} className="text-blue-600 text-xs font-bold">Save</button>
                          <button onClick={() => setEditingEmail(null)} className="text-gray-400 text-xs">Cancel</button>
                        </div>
                      ) : biz.email ? (
                        <span className="text-gray-700 cursor-pointer hover:text-blue-600" onClick={() => { setEditingEmail(biz.id); setEmailInput(biz.email) }}>
                          {biz.email}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          {scrapeResults[biz.id] && (
                            <span className={`text-xs ${scrapeResults[biz.id].startsWith('✓') ? 'text-green-600' : scrapeResults[biz.id].startsWith('✗') ? 'text-red-400' : 'text-amber-500'}`}>
                              {scrapeResults[biz.id]}
                            </span>
                          )}
                          <button onClick={() => { setEditingEmail(biz.id); setEmailInput('') }} className="text-blue-600 text-xs font-semibold hover:text-blue-700">
                            + Add
                          </button>
                          {biz.website && (
                            <button onClick={() => scrapeOneEmail(biz.id)} className="text-purple-600 text-xs font-semibold hover:text-purple-700">
                              Scrape
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {biz.website ? (
                        <a href={biz.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline truncate block max-w-[150px]">
                          {biz.website.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]}
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {results[biz.id] && (
                        <span className={`text-xs mr-2 ${results[biz.id].startsWith('✓') ? 'text-green-600' : results[biz.id].startsWith('✗') ? 'text-red-500' : 'text-amber-500'}`}>
                          {results[biz.id].startsWith('✓') ? '✓' : results[biz.id].startsWith('✗') ? '✗' : '...'}
                        </span>
                      )}
                      <button
                        onClick={() => fetchOne(biz.id)}
                        disabled={fetching === biz.id || bulkRunning}
                        className="text-xs text-gray-500 hover:text-blue-600 font-medium disabled:opacity-50"
                      >
                        Fetch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
