import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/?error=invalid-token', req.url))
  }

  // Find the review with this token
  const { data: review, error } = await supabaseAdmin
    .from('reviews')
    .select('*, businesses(slug)')
    .eq('verification_token', token)
    .single()

  if (error || !review) {
    return NextResponse.redirect(new URL('/?error=invalid-token', req.url))
  }

  if (review.is_verified) {
    return NextResponse.redirect(
      new URL(`/hotels/${review.businesses.slug}?already=verified`, req.url)
    )
  }

  // Mark review as verified
  await supabaseAdmin
    .from('reviews')
    .update({ is_verified: true })
    .eq('id', review.id)

  // Mark reviewer as verified too
  await supabaseAdmin
    .from('reviewers')
    .update({ is_verified: true })
    .eq('id', review.reviewer_id)

  // Redirect to hotel page with success message
  return NextResponse.redirect(
    new URL(`/hotels/${review.businesses.slug}?verified=true`, req.url)
  )
}