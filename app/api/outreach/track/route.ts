import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t')
  const type = req.nextUrl.searchParams.get('type') // 'open' | 'click'
  const redirect = req.nextUrl.searchParams.get('r')

  if (token && type === 'open') {
    try {
      // Get current log
      const { data: log } = await supabaseAdmin
        .from('outreach_logs')
        .select('id, opened_at, open_count')
        .eq('token', token)
        .maybeSingle()
      if (log) {
        await supabaseAdmin.from('outreach_logs').update({
          opened_at: log.opened_at || new Date().toISOString(),
          open_count: (log.open_count || 0) + 1,
        }).eq('id', log.id)
      }
    } catch (e) {
      console.error('Track open failed:', e)
    }
    return new NextResponse(PIXEL, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Pragma': 'no-cache',
      },
    })
  }

  if (token && type === 'click') {
    try {
      const { data: log } = await supabaseAdmin
        .from('outreach_logs')
        .select('id, clicked_at, click_count')
        .eq('token', token)
        .maybeSingle()
      if (log) {
        await supabaseAdmin.from('outreach_logs').update({
          clicked_at: log.clicked_at || new Date().toISOString(),
          click_count: (log.click_count || 0) + 1,
        }).eq('id', log.id)
      }
    } catch (e) {
      console.error('Track click failed:', e)
    }
    const target = redirect && /^https?:\/\//.test(redirect) ? redirect : (process.env.NEXT_PUBLIC_SITE_URL || 'https://thereviewer.mu')
    return NextResponse.redirect(target)
  }

  return NextResponse.json({ ok: false })
}
