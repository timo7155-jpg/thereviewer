'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../AdminShell'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')

  useEffect(() => {
    loadBookings().then(() => setLoaded(true))
  }, [])

  const loadBookings = async () => {
    const res = await fetch('/api/admin/bookings')
    const data = await res.json()
    setBookings(data.bookings || [])
  }

  const handleAction = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status })
    })
    await loadBookings()
  }

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter)

  const typeLabel = (type: string) => {
    if (type === 'hotel') return 'Hotel booking'
    if (type === 'restaurant') return 'Table reservation'
    return 'Appointment'
  }

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Booking Requests</h1>
            <p className="text-gray-500 text-sm mt-1">View and manage all booking requests</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-600 text-sm font-medium px-3 py-1 rounded-full">
              {bookings.filter(b => b.status === 'pending').length} pending
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(tab => (
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
                tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length
              })
            </button>
          ))}
        </div>

        {!loaded ? (
          <div className="text-center py-12 text-gray-400">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            No booking requests found
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.businesses?.name}</h3>
                    <p className="text-gray-500 text-sm">{booking.businesses?.region} · {typeLabel(booking.booking_type)}</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    booking.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                    booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Customer</p>
                    <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900">{booking.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{booking.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Submitted</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(booking.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Booking-specific details */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {booking.check_in && (
                      <div><span className="text-gray-400 text-xs">Check-in:</span> <span className="font-medium">{booking.check_in}</span></div>
                    )}
                    {booking.check_out && (
                      <div><span className="text-gray-400 text-xs">Check-out:</span> <span className="font-medium">{booking.check_out}</span></div>
                    )}
                    {booking.guests && (
                      <div><span className="text-gray-400 text-xs">Guests:</span> <span className="font-medium">{booking.guests}</span></div>
                    )}
                    {booking.booking_date && (
                      <div><span className="text-gray-400 text-xs">Date:</span> <span className="font-medium">{booking.booking_date}</span></div>
                    )}
                    {booking.booking_time && (
                      <div><span className="text-gray-400 text-xs">Time:</span> <span className="font-medium">{booking.booking_time}</span></div>
                    )}
                    {booking.seats && (
                      <div><span className="text-gray-400 text-xs">Seats:</span> <span className="font-medium">{booking.seats}</span></div>
                    )}
                    {booking.service_type && (
                      <div><span className="text-gray-400 text-xs">Service:</span> <span className="font-medium">{booking.service_type}</span></div>
                    )}
                  </div>
                  {booking.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                  )}
                </div>

                {booking.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(booking.id, 'confirmed')}
                      className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleAction(booking.id, 'cancelled')}
                      className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
