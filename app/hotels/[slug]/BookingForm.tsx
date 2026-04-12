'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'

type Props = {
  businessId: string
  businessName: string
  category: string
}

export default function BookingForm({ businessId, businessName, category }: Props) {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const isHotel = category === 'hotel'
  const isRestaurant = category === 'restaurant'
  const isService = !isHotel && !isRestaurant

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    checkIn: '', checkOut: '', guests: '',
    bookingDate: '', bookingTime: '', seats: '',
    serviceType: '', notes: ''
  })

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Common validation
    if (!form.name.trim()) {
      setError(lang === 'fr' ? 'Le nom est requis.' : 'Full name is required.')
      return
    }
    if (!form.email.trim() || !validateEmail(form.email)) {
      setError(lang === 'fr' ? 'Veuillez entrer un email valide.' : 'Please enter a valid email address.')
      return
    }

    // Hotel-specific
    if (isHotel) {
      if (!form.checkIn) {
        setError(lang === 'fr' ? 'La date d\'arrivée est requise.' : 'Check-in date is required.')
        return
      }
      if (!form.checkOut) {
        setError(lang === 'fr' ? 'La date de départ est requise.' : 'Check-out date is required.')
        return
      }
      if (form.checkOut <= form.checkIn) {
        setError(lang === 'fr' ? 'La date de départ doit être après la date d\'arrivée.' : 'Check-out must be after check-in.')
        return
      }
      if (form.guests && (parseInt(form.guests) < 1 || parseInt(form.guests) > 20)) {
        setError(lang === 'fr' ? 'Le nombre de voyageurs doit être entre 1 et 20.' : 'Guests must be between 1 and 20.')
        return
      }
    }

    // Restaurant-specific
    if (isRestaurant) {
      if (!form.bookingDate) {
        setError(lang === 'fr' ? 'La date est requise.' : 'Date is required.')
        return
      }
      if (!form.bookingTime) {
        setError(lang === 'fr' ? 'L\'heure est requise.' : 'Time is required.')
        return
      }
      if (form.seats && (parseInt(form.seats) < 1 || parseInt(form.seats) > 50)) {
        setError(lang === 'fr' ? 'Le nombre de couverts doit être entre 1 et 50.' : 'Seats must be between 1 and 50.')
        return
      }
    }

    // Service-specific
    if (isService) {
      if (!form.bookingDate) {
        setError(lang === 'fr' ? 'La date est requise.' : 'Date is required.')
        return
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId, businessName, category,
          bookingType: isHotel ? 'hotel' : isRestaurant ? 'restaurant' : 'service',
          ...form
        })
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError(lang === 'fr' ? 'Erreur, veuillez réessayer.' : 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const title = lang === 'fr'
    ? (isHotel ? 'Réserver cet hôtel' : isRestaurant ? 'Réserver une table' : 'Prendre rendez-vous')
    : (isHotel ? 'Book this hotel' : isRestaurant ? 'Book a table' : 'Book an appointment')

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 text-center">
        <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        <h3 className="font-bold text-green-800 mb-1">
          {lang === 'fr' ? 'Demande envoyée !' : 'Request sent!'}
        </h3>
        <p className="text-green-700 text-sm">
          {lang === 'fr'
            ? 'Nous transmettrons votre demande à l\'établissement sous 24h.'
            : 'We will forward your request to the business within 24 hours.'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">
              {lang === 'fr' ? 'Envoyez une demande de réservation' : 'Send a booking request'}
            </p>
          </div>
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col gap-4 border-t border-gray-100 pt-4">
          {/* Contact info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {lang === 'fr' ? 'Nom complet' : 'Full name'} *
              </label>
              <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {lang === 'fr' ? 'Téléphone' : 'Phone'}
              </label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" placeholder="+230..." />
            </div>
          </div>

          {/* Hotel-specific fields */}
          {isHotel && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Check-in *</label>
                <input type="date" required min={today} value={form.checkIn} onChange={e => setForm({...form, checkIn: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Check-out *</label>
                <input type="date" required min={form.checkIn || today} value={form.checkOut} onChange={e => setForm({...form, checkOut: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {lang === 'fr' ? 'Voyageurs' : 'Guests'}
                </label>
                <input type="number" min="1" max="20" value={form.guests} onChange={e => setForm({...form, guests: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" placeholder="2" />
              </div>
            </div>
          )}

          {/* Restaurant-specific fields */}
          {isRestaurant && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                <input type="date" required min={today} value={form.bookingDate} onChange={e => setForm({...form, bookingDate: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {lang === 'fr' ? 'Heure' : 'Time'} *
                </label>
                <input type="time" required value={form.bookingTime} onChange={e => setForm({...form, bookingTime: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {lang === 'fr' ? 'Couverts' : 'Seats'}
                </label>
                <input type="number" min="1" max="50" value={form.seats} onChange={e => setForm({...form, seats: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" placeholder="2" />
              </div>
            </div>
          )}

          {/* Service-specific fields */}
          {isService && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                <input type="date" required min={today} value={form.bookingDate} onChange={e => setForm({...form, bookingDate: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {lang === 'fr' ? 'Heure' : 'Time'}
                </label>
                <input type="time" value={form.bookingTime} onChange={e => setForm({...form, bookingTime: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {lang === 'fr' ? 'Type de service' : 'Service type'}
                </label>
                <input type="text" value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
                  placeholder={lang === 'fr' ? 'ex: Coupe, Massage...' : 'e.g. Haircut, Massage...'} />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {lang === 'fr' ? 'Notes (optionnel)' : 'Notes (optional)'}
            </label>
            <textarea rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-all resize-none"
              placeholder={lang === 'fr' ? 'Demandes spéciales...' : 'Special requests...'} />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            {loading
              ? (lang === 'fr' ? 'Envoi...' : 'Sending...')
              : (lang === 'fr' ? 'Envoyer la demande' : 'Send booking request')}
          </button>

          <p className="text-xs text-gray-400 text-center">
            {lang === 'fr'
              ? 'Votre demande sera transmise à l\'établissement. Ce n\'est pas une confirmation automatique.'
              : 'Your request will be forwarded to the business. This is not an automatic confirmation.'}
          </p>
        </form>
      )}
    </div>
  )
}
