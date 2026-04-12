import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabaseAdmin
    .from('business_images')
    .select('business_id')

  const counts: Record<string, number> = {}
  data?.forEach(d => { counts[d.business_id] = (counts[d.business_id] || 0) + 1 })
  return NextResponse.json({ counts })
}
