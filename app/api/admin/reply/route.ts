import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Admin can reply on behalf of any business owner
export async function POST(req: NextRequest) {
  try {
    const { reviewId, body } = await req.json()

    if (!reviewId || !body?.trim()) {
      return NextResponse.json({ error: 'Review ID and reply body required' }, { status: 400 })
    }

    // Get the review to find the business
    const { data: review } = await supabaseAdmin
      .from('reviews')
      .select('business_id')
      .eq('id', reviewId)
      .single()

    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })

    // Find the business owner
    const { data: owner } = await supabaseAdmin
      .from('business_owners')
      .select('id')
      .eq('business_id', review.business_id)
      .eq('status', 'approved')
      .single()

    // Use owner ID if exists, otherwise use a placeholder for admin-posted replies
    const ownerId = owner?.id || null

    // Check if reply already exists
    const { data: existing } = await supabaseAdmin
      .from('owner_replies')
      .select('id')
      .eq('review_id', reviewId)
      .single()

    if (existing) {
      // Update existing reply
      await supabaseAdmin
        .from('owner_replies')
        .update({ body })
        .eq('id', existing.id)
    } else {
      // Insert new reply
      await supabaseAdmin
        .from('owner_replies')
        .insert({ review_id: reviewId, owner_id: ownerId, body })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin reply error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
