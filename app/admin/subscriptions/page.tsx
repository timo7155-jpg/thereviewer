'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

export default function AdminSubscriptionsPage() {
  const [owners, setOwners] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all')

  useEffect(() => {
    loadOwners().then(() => setLoaded(true))
  }, [])

  const loadOwners = async () => {
    const res = await fetch('/api/admin/claims')
    const data = await res.json()
    // Only show approved owners
    setOwners((data.claims || []).filter((c: any) => c.status === 'approved'))
  }

  const handleToggle = async (ownerId: string, currentPlan: string) => {
    const newPlan = currentPlan === 'premium' ? 'free' : 'premium'
    const msg = newPlan === 'premium'
      ? 'Upgrade this owner to Premium?'
      : 'Downgrade this owner to Free plan?'
    if (!confirm(msg)) return

    await fetch('/api/admin/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerId, plan: newPlan })
    })
    await loadOwners()
  }

  const filtered = owners.filter(o => {
    if (filter === 'free') return o.plan !== 'premium'
    if (filter === 'premium') return o.plan === 'premium'
    return true
  })

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Subscriptions</h1>
            <p className="text-gray-500 text-sm mt-1">Manage owner plans — upgrade or downgrade</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-600 text-sm font-medium px-3 py-1 rounded-full">
              {owners.filter(o => o.plan === 'premium').length} premium
            </span>
            <span className="bg-gray-100 text-gray-500 text-sm font-medium px-3 py-1 rounded-full">
              {owners.filter(o => o.plan !== 'premium').length} free
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'free', 'premium'] as const).map(tab => (
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
                tab === 'all' ? owners.length :
                tab === 'premium' ? owners.filter(o => o.plan === 'premium').length :
                owners.filter(o => o.plan !== 'premium').length
              })
            </button>
          ))}
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading subscriptions...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            No approved owners found
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(owner => (
              <div key={owner.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{owner.businesses?.name}</h3>
                    <p className="text-gray-500 text-sm">{owner.businesses?.region}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    owner.plan === 'premium'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {owner.plan === 'premium' ? 'PREMIUM' : 'FREE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Owner</p>
                    <p className="text-sm font-medium text-gray-900">{owner.full_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900">{owner.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{owner.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Claimed since</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(owner.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(owner.id, owner.plan)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    owner.plan === 'premium'
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {owner.plan === 'premium' ? 'Downgrade to Free' : 'Upgrade to Premium'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
