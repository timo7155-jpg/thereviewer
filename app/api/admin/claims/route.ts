import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { emailTemplate, emailButton } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'timo7155@gmail.com'

export async function GET() {
  const { data: claims } = await supabaseAdmin
    .from('business_owners')
    .select('*, businesses(name, region, address)')
    .order('created_at', { ascending: false })

  return NextResponse.json({ claims: claims || [] })
}

export async function POST(req: NextRequest) {
  try {
    const { claimId, businessId, action } = await req.json()

    if (action === 'approve') {
      // Update claim status
      await supabaseAdmin
        .from('business_owners')
        .update({ status: 'approved' })
        .eq('id', claimId)

      // Mark business as claimed
      await supabaseAdmin
        .from('businesses')
        .update({ is_claimed: true, claimed_at: new Date().toISOString() })
        .eq('id', businessId)

      // Get claim details to notify owner
      const { data: claim } = await supabaseAdmin
        .from('business_owners')
        .select('*, businesses(name)')
        .eq('id', claimId)
        .single()

      // Email the owner
      await resend.emails.send({
        from: 'TheReviewer.mu <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `Your claim for ${claim?.businesses?.name} has been approved!`,
        html: emailTemplate('Your claim has been approved!', `
          <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 12px;">
            Hi <strong>${claim?.full_name}</strong>,
          </p>
          <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 16px;">
            Your ownership claim for <strong>${claim?.businesses?.name}</strong> has been verified and approved. You can now log in to manage your reviews and reputation.
          </p>
          <div style="text-align:center;">
            ${emailButton('Go to my dashboard', `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`)}
          </div>
        `)
      })
    }

    if (action === 'reject') {
      await supabaseAdmin
        .from('business_owners')
        .update({ status: 'rejected' })
        .eq('id', claimId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}