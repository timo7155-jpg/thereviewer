import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { ownerId, plan } = await req.json()

    if (!ownerId || !['free', 'premium'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid owner ID or plan' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('business_owners')
      .update({ plan })
      .eq('id', ownerId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
