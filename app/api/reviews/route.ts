import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { emailTemplate, emailButton, emailNote } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      slug, name, email,
      overall_rating, service_score, cleanliness_score,
      location_score, food_score, value_score, review_body
    } = body

    // Find the hotel
    const { data: hotel, error: hotelError } = await supabaseAdmin
      .from('businesses')
      .select('id, name')
      .eq('slug', slug)
      .single()

    if (hotelError || !hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    // Find or create reviewer
    let reviewer
    const { data: existingReviewer } = await supabaseAdmin
      .from('reviewers')
      .select('*')
      .eq('email', email)
      .single()

    if (existingReviewer) {
      reviewer = existingReviewer
    } else {
      const { data: newReviewer, error: reviewerError } = await supabaseAdmin
        .from('reviewers')
        .insert({ name, email, is_verified: false })
        .select()
        .single()

      if (reviewerError) {
        return NextResponse.json({ error: 'Could not create reviewer' }, { status: 500 })
      }
      reviewer = newReviewer
    }

    // Generate verification token
    const token = crypto.randomUUID()

    // Save review (unverified)
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .insert({
        business_id: hotel.id,
        reviewer_id: reviewer.id,
        source: 'native',
        overall_rating,
        service_score,
        cleanliness_score,
        location_score,
        food_score,
        value_score,
        body: review_body,
        is_verified: false,
        verification_token: token,
        language: 'en'
      })
      .select()
      .single()

    if (reviewError) {
      return NextResponse.json({ error: 'Could not save review' }, { status: 500 })
    }

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify?token=${token}`

    await resend.emails.send({
      from: 'TheReviewer.mu <onboarding@resend.dev>',
      to: 'timo7155@gmail.com',
      subject: `Please confirm your review of ${hotel.name}`,
      html: emailTemplate('Thank you for your review!', `
        <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 12px;">
          Hi <strong>${name}</strong>, you reviewed <strong>${hotel.name}</strong> and gave it <strong>${overall_rating}/5 stars</strong>.
        </p>
        <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 16px;">
          Please click the button below to confirm and publish your review:
        </p>
        <div style="text-align:center;">
          ${emailButton('Confirm my review', verifyUrl)}
        </div>
        ${emailNote('If you did not submit this review, you can safely ignore this email.')}
      `)
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}