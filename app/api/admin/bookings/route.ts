import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data: bookings } = await supabaseAdmin
    .from('booking_requests')
    .select('*, businesses(name, region)')
    .order('created_at', { ascending: false })

  return NextResponse.json({ bookings: bookings || [] })
}

export async function POST(req: NextRequest) {
  try {
    const { bookingId, status } = await req.json()

    if (!bookingId || !['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid booking ID or status' }, { status: 400 })
    }

    await supabaseAdmin
      .from('booking_requests')
      .update({ status })
      .eq('id', bookingId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
