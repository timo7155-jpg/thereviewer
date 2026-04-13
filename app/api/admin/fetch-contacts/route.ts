import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json()
    if (!businessId) return NextResponse.json({ error: 'Business ID required' }, { status: 400 })

    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('name, region, google_place_id')
      .eq('id', businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    // Find place if no cached ID
    let placeId = business.google_place_id
    if (!placeId) {
      const searchQuery = `${business.name} ${business.region} Mauritius`
      const searchRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`
      )
      const searchData = await searchRes.json()
      placeId = searchData.candidates?.[0]?.place_id
      if (!placeId) return NextResponse.json({ error: 'Not found on Google', found: false })

      await supabaseAdmin.from('businesses').update({ google_place_id: placeId }).eq('id', businessId)
    }

    // Fetch contact details
    const detailsRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,international_phone_number,website,url&key=${GOOGLE_API_KEY}`
    )
    const detailsData = await detailsRes.json()
    const result = detailsData.result || {}

    const phone = result.international_phone_number || result.formatted_phone_number || null
    const website = result.website || null

    // Update business record
    const updates: any = {}
    if (phone) updates.phone = phone
    if (website) updates.website = website

    if (Object.keys(updates).length > 0) {
      await supabaseAdmin.from('businesses').update(updates).eq('id', businessId)
    }

    return NextResponse.json({
      success: true,
      phone,
      website,
      googleMapsUrl: result.url || null
    })
  } catch (err) {
    console.error('Fetch contacts error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
