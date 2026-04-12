'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminShell from '../AdminShell'

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  // Add form state
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', region: '', address: '', description: '', website: '', category: 'hotel'
  })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBusinesses().then(() => setLoaded(true))
  }, [])

  const loadBusinesses = async () => {
    const res = await fetch('/api/admin/businesses')
    const data = await res.json()
    setBusinesses(data.businesses || [])
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleCreate = async () => {
    if (!form.name.trim()) { setFormError('Business name is required.'); return }
    if (!form.slug.trim()) { setFormError('Slug is required.'); return }
    if (/[^a-z0-9-]/.test(form.slug)) { setFormError('Slug must contain only lowercase letters, numbers, and hyphens.'); return }
    if (!form.region.trim()) { setFormError('Region is required.'); return }
    if (!form.category) { setFormError('Category is required.'); return }
    if (form.website && !form.website.startsWith('http')) { setFormError('Website must start with http:// or https://'); return }
    setSaving(true)
    setFormError('')

    const res = await fetch('/api/admin/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', ...form })
    })
    const data = await res.json()

    if (data.error) {
      setFormError(data.error)
      setSaving(false)
      return
    }

    await loadBusinesses()
    setForm({ name: '', slug: '', region: '', address: '', description: '', website: '', category: 'hotel' })
    setShowAdd(false)
    setSaving(false)
  }

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Businesses</h1>
            <p className="text-gray-500 text-sm mt-1">Add and manage all businesses</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
              {businesses.length} total
            </span>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-blue-700"
            >
              + Add business
            </button>
          </div>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="p-6">
              <h2 className="font-bold text-gray-900 mb-4">Add new business</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => {
                      setForm(f => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) }))
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    placeholder="Business name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    placeholder="business-name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Region *</label>
                  <input
                    type="text"
                    value={form.region}
                    onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    placeholder="e.g. Grand Baie, Flic en Flac"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-white"
                  >
                    <option value="hotel">Hotel</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="retail">Retail & Shops</option>
                    <option value="spa">Spa & Wellness</option>
                    <option value="tour">Tours & Activities</option>
                    <option value="car_rental">Car Rental</option>
                    <option value="services">Other Services</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Website</label>
                  <input
                    type="text"
                    value={form.website}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none"
                    placeholder="Brief description"
                  />
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">{formError}</div>
              )}

              <div className="flex gap-3">
                <button onClick={handleCreate} disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Creating...' : 'Create business'}
                </button>
                <button onClick={() => setShowAdd(false)}
                  className="text-gray-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Business list */}
        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading businesses...</div>
        ) : businesses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            No businesses yet — click "Add business" above to get started
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {businesses.map((biz) => {
              const owner = biz.business_owners?.find((o: any) => o.status === 'approved')
              return (
                <div key={biz.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{biz.name}</h3>
                        {biz.category && (
                          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                            {biz.category}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">{biz.region} · {biz.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {biz.is_claimed ? (
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-600">Claimed</span>
                      ) : (
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500">Unclaimed</span>
                      )}
                    </div>
                  </div>

                  {biz.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{biz.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Slug</p>
                      <p className="text-sm font-medium text-gray-900">{biz.slug}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Website</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{biz.website || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Owner</p>
                      <p className="text-sm font-medium text-gray-900">{owner ? owner.full_name : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Owner email</p>
                      <p className="text-sm font-medium text-gray-900">{owner ? owner.email : '—'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/admin/businesses/${biz.id}/edit`}
                      className="bg-blue-50 text-blue-600 border border-blue-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/hotels/${biz.slug}`}
                      className="text-blue-600 text-sm self-center hover:underline ml-auto font-medium"
                    >
                      View public page →
                    </Link>
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
