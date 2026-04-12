import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { reviewId, userId, body } = await req.json()

    const { data: owner } = await supabaseAdmin
      .from('business_owners')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!owner) return NextResponse.json({ error: 'Not authorized' }, { status: 401 })

    await supabaseAdmin
      .from('owner_replies')
      .insert({ review_id: reviewId, owner_id: owner.id, body })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}