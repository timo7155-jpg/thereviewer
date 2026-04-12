import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabaseAdmin
    .from('business_analysis')
    .select('business_id')

  const ids = (data || []).map(d => d.business_id)
  return NextResponse.json({ ids })
}
