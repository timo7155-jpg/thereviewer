import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data: reviews } = await supabaseAdmin
    .from('reviews')
    .select('*, reviewers(name, email), businesses(name, slug, region)')
    .order('created_at', { ascending: false })

  return NextResponse.json({ reviews: reviews || [] })
}

export async function POST(req: NextRequest) {
  try {
    const { reviewId, action } = await req.json()

    if (action === 'delete') {
      // Delete associated replies first, then the review
      await supabaseAdmin
        .from('owner_replies')
        .delete()
        .eq('review_id', reviewId)

      await supabaseAdmin
        .from('reviews')
        .delete()
        .eq('id', reviewId)
    }

    if (action === 'toggle_verified') {
      const { data: review } = await supabaseAdmin
        .from('reviews')
        .select('is_verified')
        .eq('id', reviewId)
        .single()

      await supabaseAdmin
        .from('reviews')
        .update({ is_verified: !review?.is_verified })
        .eq('id', reviewId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
