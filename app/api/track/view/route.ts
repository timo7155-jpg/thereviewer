import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json()
    if (!path || typeof path !== 'string') return NextResponse.json({ ok: false })

    // Skip admin paths so analytics aren't self-polluted
    if (path.startsWith('/admin') || path.startsWith('/api/')) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    // Hash the IP for privacy (not stored raw)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || ''
    const ipHash = ip ? createHash('sha256').update(ip + 'thereviewer').digest('hex').slice(0, 16) : null
    const userAgent = req.headers.get('user-agent')?.slice(0, 300) || null
    const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || null

    await supabaseAdmin.from('page_views').insert({
      path: path.slice(0, 500),
      referrer: referrer?.slice(0, 500) || null,
      user_agent: userAgent,
      country,
      ip_hash: ipHash,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Never fail the page because analytics failed
    return NextResponse.json({ ok: false })
  }
}
