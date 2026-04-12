import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { businessId, userId, fullName, role, phone, email, notes } = await req.json()

    const { data: hotel } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (!hotel) return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })

    // Check if already pending
    const { data: existing } = await supabaseAdmin
      .from('business_owners')
      .select('id')
      .eq('business_id', businessId)
      .eq('user_id', userId)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'You already have a pending claim for this hotel' }, { status: 400 })
    }

    // Save claim as pending
    await supabaseAdmin
      .from('business_owners')
      .insert({
        business_id: businessId,
        user_id: userId,
        email: email,
        full_name: fullName,
        role: role,
        phone: phone,
        notes: notes,
        plan: 'free',
        status: 'pending'
      })

    // Notify you (admin) by email
    await resend.emails.send({
      from: 'TheReviewer.mu <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'timo7155@gmail.com',
      subject: `New claim request — ${hotel.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New business claim request</h2>
          <table style="width:100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px; color: #666;">Hotel</td><td style="padding: 8px;"><strong>${hotel.name}</strong></td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; color: #666;">Name</td><td style="padding: 8px;">${fullName}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Role</td><td style="padding: 8px;">${role}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; color: #666;">Phone</td><td style="padding: 8px;"><strong>${phone}</strong></td></tr>
            <tr><td style="padding: 8px; color: #666;">Email</td><td style="padding: 8px;">${email}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding: 8px; color: #666;">Notes</td><td style="padding: 8px;">${notes || '—'}</td></tr>
          </table>
          <p style="margin-top: 24px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/claims" 
               style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Review in admin panel
            </a>
          </p>
          <p style="color: #888; font-size: 12px; margin-top: 16px;">
            Call ${phone} to verify this claim before approving.
          </p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}