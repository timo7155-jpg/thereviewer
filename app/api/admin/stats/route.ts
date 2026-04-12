import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  // Total businesses
  const { count: totalBusinesses } = await supabaseAdmin
    .from('businesses')
    .select('*', { count: 'exact', head: true })

  // Claimed businesses
  const { count: claimedBusinesses } = await supabaseAdmin
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('is_claimed', true)

  // Total reviews
  const { count: totalReviews } = await supabaseAdmin
    .from('reviews')
    .select('*', { count: 'exact', head: true })

  // Verified reviews
  const { count: verifiedReviews } = await supabaseAdmin
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', true)

  // Pending claims
  const { count: pendingClaims } = await supabaseAdmin
    .from('business_owners')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Total bookings
  const { count: totalBookings } = await supabaseAdmin
    .from('booking_requests')
    .select('*', { count: 'exact', head: true })

  // Pending bookings
  const { count: pendingBookings } = await supabaseAdmin
    .from('booking_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Total reviewers
  const { count: totalReviewers } = await supabaseAdmin
    .from('reviewers')
    .select('*', { count: 'exact', head: true })

  // Recent reviews (last 10)
  const { data: recentReviews } = await supabaseAdmin
    .from('reviews')
    .select('id, overall_rating, created_at, is_verified, businesses(name), reviewers(name)')
    .order('created_at', { ascending: false })
    .limit(10)

  // Recent bookings (last 10)
  const { data: recentBookings } = await supabaseAdmin
    .from('booking_requests')
    .select('id, name, email, booking_type, status, created_at, businesses(name)')
    .order('created_at', { ascending: false })
    .limit(10)

  // Reviews per month (last 6 months)
  const { data: allReviews } = await supabaseAdmin
    .from('reviews')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())

  const monthlyReviews: Record<string, number> = {}
  allReviews?.forEach(r => {
    const month = new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    monthlyReviews[month] = (monthlyReviews[month] || 0) + 1
  })

  // Rating distribution
  const { data: ratingData } = await supabaseAdmin
    .from('reviews')
    .select('overall_rating')
    .eq('is_verified', true)

  const ratingDist = [0, 0, 0, 0, 0]
  ratingData?.forEach(r => {
    if (r.overall_rating >= 1 && r.overall_rating <= 5) {
      ratingDist[r.overall_rating - 1]++
    }
  })

  // Category distribution
  const { data: catData } = await supabaseAdmin
    .from('businesses')
    .select('category')

  const categoryDist: Record<string, number> = {}
  catData?.forEach(b => {
    const cat = b.category || 'hotel'
    categoryDist[cat] = (categoryDist[cat] || 0) + 1
  })

  return NextResponse.json({
    stats: {
      totalBusinesses: totalBusinesses || 0,
      claimedBusinesses: claimedBusinesses || 0,
      totalReviews: totalReviews || 0,
      verifiedReviews: verifiedReviews || 0,
      pendingClaims: pendingClaims || 0,
      totalBookings: totalBookings || 0,
      pendingBookings: pendingBookings || 0,
      totalReviewers: totalReviewers || 0,
    },
    recentReviews: recentReviews || [],
    recentBookings: recentBookings || [],
    monthlyReviews,
    ratingDist,
    categoryDist,
  })
}
