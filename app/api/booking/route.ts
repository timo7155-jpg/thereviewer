import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = 'timo7155@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      businessId, businessName, bookingType,
      name, email, phone,
      checkIn, checkOut, guests,
      bookingDate, bookingTime, seats,
      serviceType, notes
    } = body

    if (!businessId || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Business ID, name, and email are required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 })
    }

    // Save to DB
    const { error: dbError } = await supabaseAdmin
      .from('booking_requests')
      .insert({
        business_id: businessId,
        name,
        email,
        phone: phone || null,
        booking_type: bookingType,
        check_in: checkIn || null,
        check_out: checkOut || null,
        booking_date: bookingDate || null,
        booking_time: bookingTime || null,
        guests: guests ? parseInt(guests) : null,
        seats: seats ? parseInt(seats) : null,
        service_type: serviceType || null,
        notes: notes || null,
        status: 'pending'
      })

    if (dbError) {
      console.error('Booking DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
    }

    // Build email details based on type
    const typeLabel = bookingType === 'hotel' ? 'Hotel Booking'
      : bookingType === 'restaurant' ? 'Restaurant Reservation'
      : 'Service Appointment'

    let detailsHtml = ''
    if (bookingType === 'hotel') {
      detailsHtml = `
        <tr><td style="padding:8px 0;color:#6b7280">Check-in</td><td style="padding:8px 0;font-weight:600">${checkIn || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Check-out</td><td style="padding:8px 0;font-weight:600">${checkOut || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Guests</td><td style="padding:8px 0">${guests || '—'}</td></tr>
      `
    } else if (bookingType === 'restaurant') {
      detailsHtml = `
        <tr><td style="padding:8px 0;color:#6b7280">Date</td><td style="padding:8px 0;font-weight:600">${bookingDate || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Time</td><td style="padding:8px 0;font-weight:600">${bookingTime || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Seats</td><td style="padding:8px 0">${seats || '—'}</td></tr>
      `
    } else {
      detailsHtml = `
        <tr><td style="padding:8px 0;color:#6b7280">Date</td><td style="padding:8px 0;font-weight:600">${bookingDate || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Time</td><td style="padding:8px 0">${bookingTime || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Service</td><td style="padding:8px 0">${serviceType || '—'}</td></tr>
      `
    }

    // Send email to admin
    await resend.emails.send({
      from: 'TheReviewer.mu <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `[Booking] ${typeLabel} — ${businessName} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#059669;">New ${typeLabel}</h2>
          <p style="color:#6b7280;margin-bottom:16px;">For <strong>${businessName}</strong></p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6b7280;width:100px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Phone</td><td style="padding:8px 0">${phone || '—'}</td></tr>
            ${detailsHtml}
          </table>
          ${notes ? `
            <div style="margin-top:16px;padding:16px;background:#f0fdf4;border-radius:8px;">
              <p style="margin:0;color:#6b7280;font-size:12px;margin-bottom:8px;">Notes</p>
              <p style="margin:0;color:#1e293b;">${notes.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
          <p style="margin-top:24px;padding:12px;background:#f8fafc;border-radius:8px;color:#6b7280;font-size:12px;">
            Please forward this to the business owner or contact them directly.
          </p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Booking error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
