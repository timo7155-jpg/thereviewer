import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

// Search for a business on Google Places and return its rating
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId')
  if (!businessId) return NextResponse.json({ error: 'Business ID required' }, { status: 400 })

  // Check if we already have a recent score (cached within 24h)
  const { data: existing } = await supabaseAdmin
    .from('external_scores')
    .select('*')
    .eq('business_id', businessId)
    .eq('platform', 'google')
    .single()

  if (existing) {
    const fetchedAt = new Date(existing.fetched_at).getTime()
    const now = Date.now()
    // Return cached if less than 24 hours old
    if (now - fetchedAt < 24 * 60 * 60 * 1000) {
      // Get business google_place_id for the maps link
      const { data: biz } = await supabaseAdmin
        .from('businesses')
        .select('google_place_id, name, region')
        .eq('id', businessId)
        .single()

      const googleMapsUrl = biz?.google_place_id
        ? `https://www.google.com/maps/place/?q=place_id:${biz.google_place_id}`
        : `https://www.google.com/maps/search/${encodeURIComponent(`${biz?.name} ${biz?.region} Mauritius`)}`

      return NextResponse.json({
        rating: existing.rating,
        reviewCount: existing.review_count,
        reviews: existing.reviews_json || [],
        googleMapsUrl,
        cached: true
      })
    }
  }

  // Get business details
  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('name, region, address')
    .eq('id', businessId)
    .single()

  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  try {
    // Search Google Places for this business
    const searchQuery = `${business.name} ${business.region} Mauritius`
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id,name,rating,user_ratings_total&key=${GOOGLE_API_KEY}`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()

    if (!searchData.candidates || searchData.candidates.length === 0) {
      return NextResponse.json({ rating: null, reviewCount: 0, found: false })
    }

    const place = searchData.candidates[0]
    const rating = place.rating || null
    const reviewCount = place.user_ratings_total || 0
    const placeId = place.place_id

    // Fetch detailed place info including reviews
    let reviews: any[] = []
    if (placeId) {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,url&key=${GOOGLE_API_KEY}`
      const detailsRes = await fetch(detailsUrl)
      const detailsData = await detailsRes.json()

      if (detailsData.result?.reviews) {
        reviews = detailsData.result.reviews.map((r: any) => ({
          author: r.author_name,
          rating: r.rating,
          text: r.text,
          time: r.relative_time_description,
          profilePhoto: r.profile_photo_url
        }))
      }

      // Save google maps URL
      if (detailsData.result?.url) {
        await supabaseAdmin
          .from('businesses')
          .update({ google_place_id: placeId })
          .eq('id', businessId)
      }
    }

    const googleMapsUrl = placeId
      ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
      : `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`

    // Save/update in external_scores
    if (existing) {
      await supabaseAdmin
        .from('external_scores')
        .update({
          rating,
          review_count: reviewCount,
          reviews_json: reviews,
          fetched_at: new Date().toISOString()
        })
        .eq('id', existing.id)
    } else {
      await supabaseAdmin
        .from('external_scores')
        .insert({
          business_id: businessId,
          platform: 'google',
          rating,
          review_count: reviewCount,
          reviews_json: reviews,
          fetched_at: new Date().toISOString()
        })
    }

    return NextResponse.json({ rating, reviewCount, reviews, googleMapsUrl, found: true })
  } catch (err) {
    console.error('Google Places error:', err)
    return NextResponse.json({ error: 'Failed to fetch Google rating' }, { status: 500 })
  }
}
