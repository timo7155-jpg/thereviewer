'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

type Business = any

type EmailGroup = {
  email: string
  domain: string
  businesses: Business[]
  isGroup: boolean
}

export default function AdminOutreachPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loaded, setLoaded] = useState(false)
  const [sending, setSending] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string>>({})
  const [bulkRunning, setBulkRunning] = useState(false)
  const [view, setView] = useState<'grouped' | 'all' | 'no-email' | 'results'>('grouped')
  const [customSubject, setCustomSubject] = useState('')
  const [logs, setLogs] = useState<any[]>([])
  const [logsLoaded, setLogsLoaded] = useState(false)
  const [tableExists, setTableExists] = useState(true)

  const loadLogs = async () => {
    const res = await fetch('/api/admin/outreach-logs')
    const data = await res.json()
    setLogs(data.logs || [])
    setTableExists(data.tableExists !== false)
    setLogsLoaded(true)
  }

  useEffect(() => { if (view === 'results') loadLogs() }, [view])

  useEffect(() => {
    loadData().then(() => setLoaded(true))
  }, [])

  const loadData = async () => {
    const res = await fetch('/api/admin/businesses')
    const data = await res.json()
    setBusinesses(data.businesses || [])
  }

  // Group businesses by email domain to avoid duplicate outreach
  const getGroups = (): EmailGroup[] => {
    const withEmail = businesses.filter(b => b.email)
    const domainMap: Record<string, Business[]> = {}

    // Known corporate domains to group
    const corporateDomains = [
      'beachcomber-hotels.com', 'beachcomber.com', 'luxresorts.com', 'constancehotels.com',
      'byascencia.com', 'ascenciamalls.com', 'hotels-attitude.com', 'attitudehotels.com',
      'veranda-resorts.com', 'heritageresorts.mu', 'sunresorts.com', 'marriott.com',
      'shangri-la.com', 'oneandonlyresorts.com', 'fourseasons.com', 'oberoihotels.com',
      'ddl.mu', 'aventuredusucre.com', 'flemingo-mu.com', 'mauritiuscarental.com',
      'lejadis.com', 'lecapitaine.restaurant', 'superu.mu',
    ]

    withEmail.forEach(b => {
      const domain = b.email.split('@')[1]?.toLowerCase() || 'unknown'
      // Group corporate domains together
      const isCorporate = corporateDomains.some(cd => domain.includes(cd) || cd.includes(domain))
      const groupKey = isCorporate ? domain : `${b.id}__${domain}` // unique key for non-corporate

      if (!domainMap[groupKey]) domainMap[groupKey] = []
      domainMap[groupKey].push(b)
    })

    // Also group by exact same email
    const emailExactMap: Record<string, Business[]> = {}
    withEmail.forEach(b => {
      if (!emailExactMap[b.email]) emailExactMap[b.email] = []
      emailExactMap[b.email].push(b)
    })

    // Build final groups - prefer exact email grouping
    const seen = new Set<string>()
    const groups: EmailGroup[] = []

    // First add exact email duplicates as groups
    Object.entries(emailExactMap).forEach(([email, bizList]) => {
      if (bizList.length > 1) {
        bizList.forEach(b => seen.add(b.id))
        groups.push({
          email,
          domain: email.split('@')[1],
          businesses: bizList,
          isGroup: true,
        })
      }
    })

    // Then add remaining as individual entries
    withEmail.forEach(b => {
      if (!seen.has(b.id)) {
        groups.push({
          email: b.email,
          domain: b.email.split('@')[1],
          businesses: [b],
          isGroup: false,
        })
      }
    })

    // Sort: groups first, then alphabetical
    return groups.sort((a, b) => {
      if (a.isGroup && !b.isGroup) return -1
      if (!a.isGroup && b.isGroup) return 1
      return a.businesses[0].name.localeCompare(b.businesses[0].name)
    })
  }

  const sendToGroup = async (group: EmailGroup) => {
    const key = group.email
    setSending(key)
    setResults(r => ({ ...r, [key]: 'sending...' }))

    const biz = group.businesses[0]
    const allNames = group.businesses.map(b => b.name).join(', ')

    try {
      const res = await fetch('/api/admin/send-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: group.isGroup ? allNames : biz.name,
          businessSlug: biz.slug,
          businessId: biz.id,
          businessIds: group.isGroup ? group.businesses.map(b => b.id) : [biz.id],
          businessRegion: biz.region,
          recipientEmail: group.email,
          subject: customSubject || undefined,
        })
      })
      const data = await res.json()
      if (data.success) {
        setResults(r => ({ ...r, [key]: `✓ Sent to ${data.to}` }))
      } else {
        setResults(r => ({ ...r, [key]: `✗ ${data.error || 'Failed'}` }))
      }
    } catch {
      setResults(r => ({ ...r, [key]: '✗ Error' }))
    }
    setSending(null)
  }

  const groups = getGroups()
  const noEmail = businesses.filter(b => !b.email && b.phone)
  const sentCount = Object.values(results).filter(r => r.startsWith('✓')).length
  const withEmailCount = businesses.filter(b => b.email).length

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Outreach</h1>
            <p className="text-gray-500 text-sm mt-1">Send personalized outreach — grouped to avoid duplicates</p>
          </div>
          {sentCount > 0 && (
            <span className="bg-green-50 text-green-600 text-sm font-medium px-3 py-1 rounded-full">
              {sentCount} sent
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-extrabold text-gray-900">{withEmailCount}</div>
            <div className="text-xs text-gray-500">Have email</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-extrabold text-blue-600">{groups.length}</div>
            <div className="text-xs text-gray-500">Unique contacts</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-extrabold text-purple-600">{groups.filter(g => g.isGroup).length}</div>
            <div className="text-xs text-gray-500">Company groups</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl font-extrabold text-amber-600">{noEmail.length}</div>
            <div className="text-xs text-gray-500">Phone only (WhatsApp)</div>
          </div>
        </div>

        {/* Subject */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email subject</label>
          <input
            type="text"
            value={customSubject}
            onChange={e => setCustomSubject(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
          />
        </div>

        {/* View tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setView('grouped')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${view === 'grouped' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            Email contacts ({groups.length})
          </button>
          <button onClick={() => setView('no-email')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${view === 'no-email' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            WhatsApp only ({noEmail.length})
          </button>
          <button onClick={() => setView('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${view === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            All ({businesses.length})
          </button>
          <button onClick={() => setView('results')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${view === 'results' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
            📊 Results
          </button>
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : view === 'grouped' ? (
          /* Email contacts grouped */
          <div className="flex flex-col gap-3">
            {groups.map(group => (
              <div key={group.email} className={`bg-white rounded-2xl border shadow-sm p-5 ${group.isGroup ? 'border-purple-200' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {group.isGroup && (
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                        GROUP — {group.businesses.length} properties
                      </span>
                    )}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {group.businesses.map(b => (
                        <span key={b.id} className="text-sm font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                          {b.name}
                          <span className="text-xs text-gray-400 ml-1">{b.category}</span>
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-blue-600 font-medium">{group.email}</p>
                    <p className="text-xs text-gray-400">{group.businesses[0].region}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {results[group.email] && (
                      <span className={`text-xs font-medium ${results[group.email].startsWith('✓') ? 'text-green-600' : results[group.email].startsWith('✗') ? 'text-red-500' : 'text-amber-500'}`}>
                        {results[group.email]}
                      </span>
                    )}
                    <button
                      onClick={() => sendToGroup(group)}
                      disabled={sending === group.email || bulkRunning}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {sending === group.email ? '...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : view === 'no-email' ? (
          /* WhatsApp only contacts */
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-sm text-amber-800">
              These businesses have phone numbers but no email. Contact them via WhatsApp with your proposal.
            </div>
            <div className="flex flex-col gap-2">
              {noEmail.map(biz => (
                <div key={biz.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{biz.name}</p>
                    <p className="text-xs text-gray-400">{biz.region} · {biz.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 font-medium">{biz.phone}</span>
                    <a
                      href={`https://wa.me/${biz.phone?.replace(/[^0-9+]/g, '').replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : view === 'results' ? (
          /* Outreach results */
          !tableExists ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-bold text-amber-900 mb-2">One-time setup needed</h3>
              <p className="text-sm text-amber-800 mb-3">
                Run this SQL once in the Supabase SQL editor to enable outreach tracking:
              </p>
              <pre className="text-xs bg-white p-3 rounded-lg border border-amber-200 overflow-x-auto">{`CREATE TABLE IF NOT EXISTS outreach_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  business_id uuid REFERENCES businesses(id) ON DELETE SET NULL,
  business_ids text[],
  recipient_email text NOT NULL,
  subject text,
  segment text,
  personalized_intro text,
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  open_count integer DEFAULT 0,
  clicked_at timestamptz,
  click_count integer DEFAULT 0,
  resend_id text,
  error text
);
CREATE INDEX IF NOT EXISTS idx_outreach_logs_token ON outreach_logs(token);
CREATE INDEX IF NOT EXISTS idx_outreach_logs_sent_at ON outreach_logs(sent_at DESC);`}</pre>
              <button onClick={loadLogs} className="mt-3 bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-700">
                I ran it — refresh
              </button>
            </div>
          ) : !logsLoaded ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : (
            <>
              {/* Stats */}
              {(() => {
                const total = logs.length
                const opened = logs.filter(l => l.opened_at).length
                const clicked = logs.filter(l => l.clicked_at).length
                const failed = logs.filter(l => l.error).length
                const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0
                return (
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                      <div className="text-2xl font-extrabold text-gray-900">{total}</div>
                      <div className="text-xs text-gray-500">Total sent</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                      <div className="text-2xl font-extrabold text-blue-600">{opened}</div>
                      <div className="text-xs text-gray-500">Opened ({pct(opened)}%)</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                      <div className="text-2xl font-extrabold text-green-600">{clicked}</div>
                      <div className="text-xs text-gray-500">Clicked ({pct(clicked)}%)</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                      <div className="text-2xl font-extrabold text-red-500">{failed}</div>
                      <div className="text-xs text-gray-500">Failed</div>
                    </div>
                  </div>
                )
              })()}

              {/* Log list */}
              {logs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                  No outreach sent yet. Use the Email contacts tab to send your first campaign.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold">Business</th>
                          <th className="text-left px-4 py-3 font-semibold">Recipient</th>
                          <th className="text-left px-4 py-3 font-semibold">Segment</th>
                          <th className="text-left px-4 py-3 font-semibold">Sent</th>
                          <th className="text-center px-4 py-3 font-semibold">Opened</th>
                          <th className="text-center px-4 py-3 font-semibold">Clicked</th>
                          <th className="text-left px-4 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map(l => (
                          <tr key={l.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900 font-medium">{l.business_name || (l.business_ids?.length > 1 ? `${l.business_ids.length} properties` : '—')}</td>
                            <td className="px-4 py-3 text-gray-600">{l.recipient_email}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                l.segment === 'high' ? 'bg-green-50 text-green-700' :
                                l.segment === 'mid' ? 'bg-amber-50 text-amber-700' :
                                l.segment === 'low' ? 'bg-red-50 text-red-700' :
                                'bg-gray-50 text-gray-500'
                              }`}>
                                {l.segment || '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs">
                              {l.sent_at ? new Date(l.sent_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {l.opened_at ? (
                                <span className="text-blue-600 font-semibold">{l.open_count || 1}×</span>
                              ) : <span className="text-gray-300">—</span>}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {l.clicked_at ? (
                                <span className="text-green-600 font-semibold">{l.click_count || 1}×</span>
                              ) : <span className="text-gray-300">—</span>}
                            </td>
                            <td className="px-4 py-3">
                              {l.error ? (
                                <span className="text-xs text-red-600" title={l.error}>Failed</span>
                              ) : l.clicked_at ? (
                                <span className="text-xs text-green-700 font-semibold">🎯 Clicked</span>
                              ) : l.opened_at ? (
                                <span className="text-xs text-blue-700 font-semibold">👁 Opened</span>
                              ) : (
                                <span className="text-xs text-gray-500">Sent</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <button onClick={loadLogs} className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Refresh
              </button>
            </>
          )
        ) : (
          /* All businesses */
          <div className="flex flex-col gap-2">
            {businesses.map(biz => (
              <div key={biz.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{biz.name}</p>
                  <p className="text-xs text-gray-400">{biz.region} · {biz.category} · {biz.email || 'no email'} · {biz.phone || 'no phone'}</p>
                </div>
                <div className="flex gap-1">
                  {biz.email && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">email</span>}
                  {biz.phone && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">phone</span>}
                  {biz.website && <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">web</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
