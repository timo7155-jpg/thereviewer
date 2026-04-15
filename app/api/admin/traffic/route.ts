import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function todayStart(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export async function GET() {
  try {
    // Get totals via head counts (efficient)
    const [today, week, month, year, total] = await Promise.all([
      supabaseAdmin.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', todayStart()),
      supabaseAdmin.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', daysAgo(7)),
      supabaseAdmin.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', daysAgo(30)),
      supabaseAdmin.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', daysAgo(365)),
      supabaseAdmin.from('page_views').select('id', { count: 'exact', head: true }),
    ])

    // Last 30 days daily breakdown for the sparkline/chart
    const { data: recentRows } = await supabaseAdmin
      .from('page_views')
      .select('created_at, path, ip_hash, country')
      .gte('created_at', daysAgo(30))
      .limit(50000)

    const dailyMap: Record<string, number> = {}
    const pathMap: Record<string, number> = {}
    const countryMap: Record<string, number> = {}
    const uniqueIpsByDay: Record<string, Set<string>> = {}

    ;(recentRows || []).forEach(r => {
      const day = (r.created_at as string).slice(0, 10)
      dailyMap[day] = (dailyMap[day] || 0) + 1
      if (r.path) pathMap[r.path] = (pathMap[r.path] || 0) + 1
      if (r.country) countryMap[r.country] = (countryMap[r.country] || 0) + 1
      if (r.ip_hash) {
        if (!uniqueIpsByDay[day]) uniqueIpsByDay[day] = new Set()
        uniqueIpsByDay[day].add(r.ip_hash)
      }
    })

    // Build 30-day array (with zero-fill)
    const daily: { date: string; views: number; visitors: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      daily.push({
        date: key,
        views: dailyMap[key] || 0,
        visitors: uniqueIpsByDay[key]?.size || 0,
      })
    }

    // Unique visitors in windows
    const today0 = todayStart()
    const week0 = daysAgo(7)
    const month0 = daysAgo(30)
    const uniqToday = new Set<string>()
    const uniqWeek = new Set<string>()
    const uniqMonth = new Set<string>()
    ;(recentRows || []).forEach(r => {
      if (!r.ip_hash) return
      if (r.created_at >= today0) uniqToday.add(r.ip_hash)
      if (r.created_at >= week0) uniqWeek.add(r.ip_hash)
      if (r.created_at >= month0) uniqMonth.add(r.ip_hash)
    })

    const topPaths = Object.entries(pathMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    const topCountries = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, views]) => ({ country, views }))

    return NextResponse.json({
      tableExists: true,
      totals: {
        today: today.count || 0,
        week: week.count || 0,
        month: month.count || 0,
        year: year.count || 0,
        all: total.count || 0,
      },
      uniqueVisitors: {
        today: uniqToday.size,
        week: uniqWeek.size,
        month: uniqMonth.size,
      },
      daily,
      topPaths,
      topCountries,
    })
  } catch (err: any) {
    return NextResponse.json({ tableExists: false, error: err?.message })
  }
}
