import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() || ''
  const category = req.nextUrl.searchParams.get('category')?.trim() || ''

  let query = supabaseAdmin
    .from('businesses')
    .select('*')
    .eq('is_published', true)
    .order('name')

  if (q) {
    query = query.or(`name.ilike.%${q}%,region.ilike.%${q}%,description.ilike.%${q}%`)
  }

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data: hotels } = await query

  return NextResponse.json({ hotels: hotels || [] })
}
