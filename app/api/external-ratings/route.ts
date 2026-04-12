import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY
const BOOKING_API_KEY = process.env.BOOKING_API_KEY

// Unified endpoint: fetches ratings from all available platforms
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId')
  if (!businessId) return NextResponse.json({ error: 'Business ID required' }, { status: 400 })

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('name, region, address, google_place_id, tripadvisor_id')
    .eq('id', businessId)
    .single()

  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  // Fetch all cached scores
  const { data: scores } = await supabaseAdmin
    .from('external_scores')
    .select('*')
    .eq('business_id', businessId)

  const cached: Record<string, any> = {}
  scores?.forEach(s => { cached[s.platform] = s })

  const now = Date.now()
  const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
  const results: Record<string, any> = {}

  // --- GOOGLE ---
  if (GOOGLE_API_KEY) {
    const googleCache = cached['google']
    if (googleCache && now - new Date(googleCache.fetched_at).getTime() < CACHE_TTL) {
      results.google = {
        rating: googleCache.rating,
        reviewCount: googleCache.review_count,
        reviews: googleCache.reviews_json || [],
        url: business.google_place_id
          ? `https://www.google.com/maps/place/?q=place_id:${business.google_place_id}`
          : `https://www.google.com/maps/search/${encodeURIComponent(`${business.name} ${business.region} Mauritius`)}`
      }
    } else {
      try {
        const searchQuery = `${business.name} ${business.region} Mauritius`
        const searchRes = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id,rating,user_ratings_total&key=${GOOGLE_API_KEY}`)
        const searchData = await searchRes.json()

        if (searchData.candidates?.[0]) {
          const place = searchData.candidates[0]
          let reviews: any[] = []
          let mapsUrl = ''

          if (place.place_id) {
            const detailsRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=reviews,url&key=${GOOGLE_API_KEY}`)
            const details = await detailsRes.json()
            reviews = (details.result?.reviews || []).map((r: any) => ({
              author: r.author_name, rating: r.rating, text: r.text,
              time: r.relative_time_description, profilePhoto: r.profile_photo_url
            }))
            mapsUrl = details.result?.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
          }

          results.google = {
            rating: place.rating, reviewCount: place.user_ratings_total || 0,
            reviews, url: mapsUrl
          }

          // Upsert cache
          await upsertScore(businessId, 'google', place.rating, place.user_ratings_total || 0, reviews, cached)
        }
      } catch (e) { console.error('Google fetch error:', e) }
    }
  }

  // --- TRIPADVISOR ---
  if (TRIPADVISOR_API_KEY) {
    const taCache = cached['tripadvisor']
    if (taCache && now - new Date(taCache.fetched_at).getTime() < CACHE_TTL) {
      results.tripadvisor = {
        rating: taCache.rating,
        reviewCount: taCache.review_count,
        reviews: taCache.reviews_json || [],
        url: business.tripadvisor_id
          ? `https://www.tripadvisor.com/${business.tripadvisor_id}`
          : null
      }
    } else {
      try {
        const searchQuery = `${business.name} ${business.region}`
        const taRes = await fetch(`https://api.content.tripadvisor.com/api/v1/location/search?searchQuery=${encodeURIComponent(searchQuery)}&language=en&key=${TRIPADVISOR_API_KEY}`)
        const taData = await taRes.json()

        if (taData.data?.[0]) {
          const location = taData.data[0]
          const locationId = location.location_id

          // Fetch details
          const detailRes = await fetch(`https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?language=en&key=${TRIPADVISOR_API_KEY}`)
          const detail = await detailRes.json()

          // Fetch reviews
          const reviewRes = await fetch(`https://api.content.tripadvisor.com/api/v1/location/${locationId}/reviews?language=en&key=${TRIPADVISOR_API_KEY}`)
          const reviewData = await reviewRes.json()

          const reviews = (reviewData.data || []).slice(0, 5).map((r: any) => ({
            author: r.user?.username || 'Anonymous',
            rating: r.rating,
            text: r.text,
            time: r.published_date,
            title: r.title
          }))

          const rating = detail.rating ? parseFloat(detail.rating) : null
          const reviewCount = detail.num_reviews ? parseInt(detail.num_reviews) : 0
          const taUrl = detail.web_url || null

          results.tripadvisor = { rating, reviewCount, reviews, url: taUrl }

          await upsertScore(businessId, 'tripadvisor', rating, reviewCount, reviews, cached)

          // Save tripadvisor_id
          if (locationId) {
            await supabaseAdmin.from('businesses').update({ tripadvisor_id: locationId }).eq('id', businessId)
          }
        }
      } catch (e) { console.error('TripAdvisor fetch error:', e) }
    }
  }

  // --- BOOKING.COM ---
  if (BOOKING_API_KEY) {
    const bookingCache = cached['booking']
    if (bookingCache && now - new Date(bookingCache.fetched_at).getTime() < CACHE_TTL) {
      results.booking = {
        rating: bookingCache.rating,
        reviewCount: bookingCache.review_count,
        url: null
      }
    } else {
      try {
        // Booking.com Demand API search
        const searchRes = await fetch(`https://demandapi.booking.com/3.1/accommodations/search?city=-1354779&rows=5&query=${encodeURIComponent(business.name)}`, {
          headers: { 'Authorization': `Bearer ${BOOKING_API_KEY}` }
        })
        const searchData = await searchRes.json()

        if (searchData.result?.[0]) {
          const hotel = searchData.result[0]
          const rating = hotel.review_score ? hotel.review_score / 2 : null // Booking uses 1-10 scale
          const reviewCount = hotel.review_nr || 0
          const url = hotel.url || null

          results.booking = { rating, reviewCount, url }

          await upsertScore(businessId, 'booking', rating, reviewCount, [], cached)
        }
      } catch (e) { console.error('Booking.com fetch error:', e) }
    }
  }

  return NextResponse.json({ platforms: results })
}

async function upsertScore(businessId: string, platform: string, rating: number | null, reviewCount: number, reviews: any[], cached: Record<string, any>) {
  if (cached[platform]) {
    await supabaseAdmin.from('external_scores').update({
      rating, review_count: reviewCount, reviews_json: reviews, fetched_at: new Date().toISOString()
    }).eq('id', cached[platform].id)
  } else {
    await supabaseAdmin.from('external_scores').insert({
      business_id: businessId, platform, rating, review_count: reviewCount, reviews_json: reviews, fetched_at: new Date().toISOString()
    })
  }
}
