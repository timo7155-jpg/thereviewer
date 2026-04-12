'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminShell from '../../../AdminShell'
import ImageUploader from '../../ImageUploader'

export default function EditBusinessPage() {
  const params = useParams()
  const router = useRouter()
  const businessId = params.id as string

  const [loaded, setLoaded] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState(false)
  const [business, setBusiness] = useState<any>(null)
  const [form, setForm] = useState({
    name: '', slug: '', region: '', address: '', description: '', website: '', category: 'hotel'
  })

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/admin/businesses')
      const data = await res.json()
      const biz = (data.businesses || []).find((b: any) => b.id === businessId)

      if (!biz) {
        setNotFound(true)
        setLoaded(true)
        return
      }

      setBusiness(biz)
      setForm({
        name: biz.name || '',
        slug: biz.slug || '',
        region: biz.region || '',
        address: biz.address || '',
        description: biz.description || '',
        website: biz.website || '',
        category: biz.category || 'hotel'
      })
      setLoaded(true)
    }
    load()
  }, [businessId])

  const handleSubmit = async () => {
    if (!form.name.trim()) { setFormError('Business name is required.'); return }
    if (!form.slug.trim()) { setFormError('Slug is required.'); return }
    if (/[^a-z0-9-]/.test(form.slug)) { setFormError('Slug must contain only lowercase letters, numbers, and hyphens.'); return }
    if (!form.region.trim()) { setFormError('Region is required.'); return }
    if (!form.category) { setFormError('Category is required.'); return }
    if (form.website && !form.website.startsWith('http')) { setFormError('Website must start with http:// or https://'); return }
    setSaving(true)
    setFormError('')
    setSaved(false)

    const res = await fetch('/api/admin/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id: businessId, ...form })
    })
    const data = await res.json()

    if (data.error) {
      setFormError(data.error)
      setSaving(false)
      return
    }

    setSaved(true)
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${form.name}" and all its reviews? This cannot be undone.`)) return

    await fetch('/api/admin/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: businessId })
    })
    router.push('/admin/businesses')
  }

  return (
    <AdminShell backHref="/admin/businesses" backLabel="← Back to businesses">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : notFound ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-semibold mb-2">Business not found</p>
            <Link href="/admin/businesses" className="text-blue-600 text-sm font-medium">← Back to businesses</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Edit business</h1>
            <p className="text-gray-500 text-sm mb-8">Update details for {business?.name}</p>

            {/* Edit form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all" placeholder="Business name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Slug *</label>
                    <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all" placeholder="business-name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Region *</label>
                    <input type="text" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all" placeholder="e.g. Grand Baie" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
                    <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all" placeholder="Street address" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                    <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none" placeholder="Brief description" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Category *</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all bg-white">
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
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Website</label>
                    <input type="text" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition-all" placeholder="https://..." />
                  </div>
                </div>

                {formError && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">{formError}</div>
                )}
                {saved && (
                  <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl mb-4 border border-green-100 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Changes saved successfully
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={handleSubmit} disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                  <Link href="/admin/businesses"
                    className="text-gray-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 className="font-bold text-gray-900 mb-1">Photos</h2>
              <p className="text-gray-500 text-xs mb-4">Upload up to 10 images. The first image will be used as the cover photo.</p>
              <ImageUploader businessId={businessId} />
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl border border-red-100 p-6">
              <h2 className="font-bold text-red-600 mb-1">Danger zone</h2>
              <p className="text-gray-500 text-xs mb-4">Permanently delete this business and all its reviews, replies, and images.</p>
              <button onClick={handleDelete}
                className="bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                Delete this business
              </button>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
