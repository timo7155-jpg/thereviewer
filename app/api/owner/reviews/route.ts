import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    const businessId = req.nextUrl.searchParams.get('businessId')
    if (!userId || !businessId) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    // Verify the user owns this business (approved status)
    const { data: owner } = await supabaseAdmin
      .from('business_owners')
      .select('id')
      .eq('user_id', userId)
      .eq('business_id', businessId)
      .eq('status', 'approved')
      .maybeSingle()

    if (!owner) {
      return NextResponse.json({ error: 'Not authorized for this business' }, { status: 403 })
    }

    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('*, reviewers(name), owner_replies(*)')
      .eq('business_id', businessId)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    return NextResponse.json({ reviews: reviews || [] })
  } catch (err) {
    console.error('Owner reviews error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
