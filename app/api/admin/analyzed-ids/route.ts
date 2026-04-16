import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const ids: string[] = []
  let from = 0
  const pageSize = 1000
  while (true) {
    const { data, error } = await supabaseAdmin
      .from('business_analysis')
      .select('business_id')
      .range(from, from + pageSize - 1)
    if (error || !data?.length) break
    data.forEach(d => ids.push(d.business_id))
    if (data.length < pageSize) break
    from += pageSize
  }
  return NextResponse.json({ ids })
}
