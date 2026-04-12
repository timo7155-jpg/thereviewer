import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = 'timo7155@gmail.com'

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
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2>Your claim has been approved!</h2>
            <p>Hi ${claim?.full_name},</p>
            <p>Your ownership claim for <strong>${claim?.businesses?.name}</strong> has been verified and approved.</p>
            <p>You can now log in to your dashboard to manage your reviews.</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
              Go to my dashboard
            </a>
          </div>
        `
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