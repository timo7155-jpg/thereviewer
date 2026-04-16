import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  // Supabase's default .select() caps at 1000 rows — paginate to get every row
  const counts: Record<string, number> = {}
  let from = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('business_images')
      .select('business_id')
      .range(from, from + pageSize - 1)

    if (error || !data?.length) break
    data.forEach(d => { counts[d.business_id] = (counts[d.business_id] || 0) + 1 })
    if (data.length < pageSize) break
    from += pageSize
  }

  return NextResponse.json({ counts })
}
