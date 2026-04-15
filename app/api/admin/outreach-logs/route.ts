import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('outreach_logs')
      .select('id, recipient_email, subject, segment, personalized_intro, sent_at, opened_at, open_count, clicked_at, click_count, error, business_id, business_ids')
      .order('sent_at', { ascending: false })
      .limit(500)

    if (error) {
      // Table might not exist yet
      return NextResponse.json({ logs: [], tableExists: false, error: error.message })
    }

    // Fetch business names for logs with business_id
    const ids = (data || []).map(l => l.business_id).filter(Boolean) as string[]
    let bizMap: Record<string, string> = {}
    if (ids.length > 0) {
      const { data: bizs } = await supabaseAdmin
        .from('businesses')
        .select('id, name')
        .in('id', ids)
      bizs?.forEach(b => { bizMap[b.id] = b.name })
    }

    const logs = (data || []).map(l => ({
      ...l,
      business_name: l.business_id ? bizMap[l.business_id] || null : null,
    }))

    return NextResponse.json({ logs, tableExists: true })
  } catch (err: any) {
    return NextResponse.json({ logs: [], tableExists: false, error: err?.message })
  }
}
