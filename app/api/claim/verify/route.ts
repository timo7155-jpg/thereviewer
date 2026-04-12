import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId')
  const userId = req.nextUrl.searchParams.get('userId')

  if (!businessId || !userId) {
    return NextResponse.redirect(new URL('/dashboard?error=invalid', req.url))
  }

  // Mark business as claimed
  await supabaseAdmin
    .from('businesses')
    .update({ is_claimed: true, claimed_at: new Date().toISOString() })
    .eq('id', businessId)

  // Mark owner as verified
  await supabaseAdmin
    .from('business_owners')
    .update({ plan: 'free' })
    .eq('business_id', businessId)
    .eq('user_id', userId)

  return NextResponse.redirect(
    new URL('/dashboard?claimed=true', req.url)
  )
}