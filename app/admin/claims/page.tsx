'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadClaims().then(() => setLoaded(true))
  }, [])

  const loadClaims = async () => {
    const res = await fetch('/api/admin/claims')
    const data = await res.json()
    setClaims(data.claims || [])
  }

  const handleDelete = async (claimId: string, businessId: string, businessName: string) => {
    if (!confirm(`Delete this claim for "${businessName || 'Unknown'}"? The business will be unclaimed and available for others to claim.`)) return
    await fetch('/api/admin/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, businessId, action: 'delete' })
    })
    await loadClaims()
  }

  const handlePlanToggle = async (ownerId: string, currentPlan: string) => {
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
    await loadClaims()
  }

  const handleAction = async (claimId: string, businessId: string, action: 'approve' | 'reject') => {
    await fetch('/api/admin/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, businessId, action })
    })
    await loadClaims()
  }

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Claim requests</h1>
            <p className="text-gray-500 text-sm mt-1">Review and approve business ownership claims</p>
          </div>
          <span className="bg-amber-50 text-amber-600 text-sm font-medium px-3 py-1 rounded-full">
            {claims.filter(c => c.status === 'pending').length} pending
          </span>
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            No claim requests yet
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{claim.businesses?.name}</h3>
                    <p className="text-gray-500 text-sm">{claim.businesses?.region} · {claim.businesses?.address}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    claim.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                    claim.status === 'approved' ? 'bg-green-50 text-green-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {claim.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Full name</p>
                    <p className="text-sm font-medium text-gray-900">{claim.full_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Role</p>
                    <p className="text-sm font-medium text-gray-900">{claim.role || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Phone</p>
                    <p className="text-sm font-medium text-blue-600">{claim.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-900">{claim.email || '—'}</p>
                  </div>
                </div>

                {claim.notes && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <p className="text-xs text-gray-400 mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{claim.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span>Submitted: {new Date(claim.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  {claim.status === 'approved' && (
                    <span className={`font-semibold px-2.5 py-1 rounded-full ${
                      claim.plan === 'premium' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {claim.plan === 'premium' ? 'Premium' : 'Free plan'}
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  {claim.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(claim.id, claim.business_id, 'approve')}
                        className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(claim.id, claim.business_id, 'reject')}
                        className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {claim.status === 'approved' && (
                    <button
                      onClick={() => handlePlanToggle(claim.id, claim.plan)}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        claim.plan === 'premium'
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {claim.plan === 'premium' ? 'Downgrade to Free' : 'Upgrade to Premium'}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(claim.id, claim.business_id, claim.businesses?.name)}
                    className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors ml-auto"
                  >
                    Delete
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
