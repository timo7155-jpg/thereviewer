import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { emailTemplate, emailNote } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thereviewer.mu'

export async function POST(req: NextRequest) {
  try {
    const { reviewId, userId, body } = await req.json()

    // Verify the user is an approved owner of the business this review belongs to
    const { data: review } = await supabaseAdmin
      .from('reviews')
      .select('id, business_id, reviewer_id, body, overall_rating')
      .eq('id', reviewId)
      .single()

    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })

    const { data: owner } = await supabaseAdmin
      .from('business_owners')
      .select('id, business_id')
      .eq('user_id', userId)
      .eq('business_id', review.business_id)
      .eq('status', 'approved')
      .maybeSingle()

    if (!owner) return NextResponse.json({ error: 'Not authorized' }, { status: 401 })

    await supabaseAdmin
      .from('owner_replies')
      .insert({ review_id: reviewId, owner_id: owner.id, body })

    // Invalidate the public hotel page so the reply appears immediately
    try {
      const { data: biz } = await supabaseAdmin
        .from('businesses')
        .select('slug')
        .eq('id', review.business_id)
        .single()
      if (biz?.slug) revalidatePath(`/hotels/${biz.slug}`)
    } catch {}

    // Notify the reviewer by email (best-effort, don't fail the request)
    try {
      const { data: reviewer } = await supabaseAdmin
        .from('reviewers')
        .select('name, email')
        .eq('id', review.reviewer_id)
        .single()

      const { data: business } = await supabaseAdmin
        .from('businesses')
        .select('name, slug')
        .eq('id', review.business_id)
        .single()

      // Skip internal/test addresses
      const skip = reviewer?.email?.endsWith('@test.thereviewer.mu')

      if (reviewer?.email && business && !skip) {
        const firstName = (reviewer.name || '').split(' ')[0] || 'there'
        const reviewUrl = `${SITE_URL}/hotels/${business.slug}#review-${reviewId}`

        await resend.emails.send({
          from: 'TheReviewer.mu <contact@thereviewer.mu>',
          to: reviewer.email,
          subject: `${business.name} replied to your review`,
          html: emailTemplate(`${business.name} replied to your review`, `
            <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px;">
              Hi ${firstName.replace(/[<>]/g, '')},
            </p>
            <p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 16px;">
              Good news — <strong>${business.name}</strong> has responded to the review you left on TheReviewer.mu.
            </p>

            <div style="background:#f9fafb;border-left:4px solid #d1d5db;border-radius:8px;padding:14px 18px;margin:16px 0;">
              <p style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;margin:0 0 6px;">Your review (${review.overall_rating}/5)</p>
              <p style="font-size:14px;color:#4b5563;line-height:1.6;margin:0;font-style:italic;">${(review.body || '').replace(/[<>]/g, '').slice(0, 300)}${(review.body?.length || 0) > 300 ? '…' : ''}</p>
            </div>

            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;margin:16px 0;">
              <p style="font-size:12px;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;margin:0 0 6px;">Response from ${business.name}</p>
              <p style="font-size:14px;color:#1e3a8a;line-height:1.6;margin:0;">${body.replace(/[<>]/g, '').replace(/\n/g, '<br>')}</p>
            </div>

            <div style="text-align:center;margin:24px 0 8px;">
              <a href="${reviewUrl}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;">View on TheReviewer.mu</a>
            </div>

            ${emailNote('Thank you for helping other customers in Mauritius make informed choices. Your voice matters.')}
          `)
        })
      }
    } catch (e) {
      console.error('Reply notification email failed:', e)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
