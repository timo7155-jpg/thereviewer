'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

type TrafficData = {
  tableExists: boolean
  totals?: { today: number; week: number; month: number; year: number; all: number }
  uniqueVisitors?: { today: number; week: number; month: number }
  daily?: { date: string; views: number; visitors: number }[]
  topPaths?: { path: string; views: number }[]
  topCountries?: { country: string; views: number }[]
}

export default function AdminTrafficPage() {
  const [data, setData] = useState<TrafficData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/traffic')
    const d = await res.json()
    setData(d)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Traffic Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Site visits — admin pages excluded</p>
          </div>
          <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : !data?.tableExists ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-bold text-amber-900 mb-2">One-time setup needed</h3>
            <p className="text-sm text-amber-800 mb-3">
              Run this SQL once in the Supabase SQL editor to enable traffic tracking:
            </p>
            <pre className="text-xs bg-white p-3 rounded-lg border border-amber-200 overflow-x-auto">{`CREATE TABLE IF NOT EXISTS page_views (
  id bigserial PRIMARY KEY,
  path text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  ip_hash text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
NOTIFY pgrst, 'reload schema';`}</pre>
            <button onClick={load} className="mt-3 bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-700">
              I ran it — refresh
            </button>
          </div>
        ) : (
          <>
            {/* Period stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <StatCard label="Today" value={data.totals?.today || 0} unique={data.uniqueVisitors?.today} color="from-blue-500 to-blue-600" />
              <StatCard label="This week" value={data.totals?.week || 0} unique={data.uniqueVisitors?.week} color="from-indigo-500 to-indigo-600" />
              <StatCard label="This month" value={data.totals?.month || 0} unique={data.uniqueVisitors?.month} color="from-violet-500 to-violet-600" />
              <StatCard label="This year" value={data.totals?.year || 0} color="from-purple-500 to-purple-600" />
              <StatCard label="All time" value={data.totals?.all || 0} color="from-pink-500 to-rose-600" />
            </div>

            {/* Daily chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Last 30 days</h2>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-600" />Page views</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-200" />Unique visitors</span>
                </div>
              </div>
              <DailyChart daily={data.daily || []} />
            </div>

            {/* Top pages + countries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Top pages (30d)</h2>
                {(data.topPaths?.length || 0) === 0 ? (
                  <p className="text-sm text-gray-400">No data yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {data.topPaths!.map((p, i) => {
                      const max = data.topPaths![0].views || 1
                      const pct = (p.views / max) * 100
                      return (
                        <div key={p.path}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="truncate text-gray-700 font-medium" title={p.path}>{p.path}</span>
                            <span className="text-gray-500 font-semibold text-xs ml-2">{p.views}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Top countries (30d)</h2>
                {(data.topCountries?.length || 0) === 0 ? (
                  <p className="text-sm text-gray-400">No country data yet (needs Vercel/Cloudflare geo headers).</p>
                ) : (
                  <div className="space-y-2.5">
                    {data.topCountries!.map(c => {
                      const max = data.topCountries![0].views || 1
                      const pct = (c.views / max) * 100
                      return (
                        <div key={c.country}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-700 font-medium uppercase">{c.country}</span>
                            <span className="text-gray-500 font-semibold text-xs">{c.views}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}

function StatCard({ label, value, unique, color }: { label: string; value: number; unique?: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {unique !== undefined ? `${unique.toLocaleString()} unique visitors` : 'Page views'}
      </p>
    </div>
  )
}

function DailyChart({ daily }: { daily: { date: string; views: number; visitors: number }[] }) {
  const max = Math.max(1, ...daily.map(d => d.views))
  return (
    <div className="flex items-end gap-1 h-44">
      {daily.map(d => {
        const viewsPct = (d.views / max) * 100
        const visitorsPct = (d.visitors / max) * 100
        const isWeekend = [0, 6].includes(new Date(d.date).getDay())
        return (
          <div
            key={d.date}
            className="flex-1 flex flex-col justify-end gap-0.5 relative group"
            title={`${d.date}\n${d.views} views\n${d.visitors} unique`}
          >
            <div
              className={`rounded-t transition-all ${isWeekend ? 'bg-blue-500' : 'bg-blue-600'}`}
              style={{ height: `${viewsPct}%`, minHeight: d.views > 0 ? '2px' : '0' }}
            />
            <div
              className="bg-blue-200 rounded-t absolute inset-x-0 bottom-0 pointer-events-none"
              style={{ height: `${visitorsPct}%`, minHeight: d.visitors > 0 ? '2px' : '0', width: '40%', left: '30%' }}
            />
          </div>
        )
      })}
    </div>
  )
}
