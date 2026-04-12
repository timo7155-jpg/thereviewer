import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

// POST: Fetch Google photos for a single business and upload to Supabase Storage
export async function POST(req: NextRequest) {
  try {
    const { businessId, maxPhotos = 5 } = await req.json()
    if (!businessId) return NextResponse.json({ error: 'Business ID required' }, { status: 400 })
    if (!GOOGLE_API_KEY) return NextResponse.json({ error: 'Google API key not configured' }, { status: 500 })

    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('name, region, google_place_id')
      .eq('id', businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    // Check if business already has images
    const { count: existingCount } = await supabaseAdmin
      .from('business_images')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)

    if ((existingCount || 0) >= 3) {
      return NextResponse.json({ skipped: true, message: 'Already has images', count: existingCount })
    }

    // Step 1: Find place on Google (or use cached place_id)
    let placeId = business.google_place_id
    if (!placeId) {
      const searchQuery = `${business.name} ${business.region} Mauritius`
      const searchRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`
      )
      const searchData = await searchRes.json()
      placeId = searchData.candidates?.[0]?.place_id
      if (!placeId) return NextResponse.json({ error: 'Not found on Google', found: false })

      // Cache the place_id
      await supabaseAdmin.from('businesses').update({ google_place_id: placeId }).eq('id', businessId)
    }

    // Step 2: Get photo references
    const detailsRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`
    )
    const detailsData = await detailsRes.json()
    const photos = detailsData.result?.photos || []

    if (photos.length === 0) {
      return NextResponse.json({ error: 'No photos available', found: true, photoCount: 0 })
    }

    // Step 3: Download and upload each photo
    const photosToFetch = photos.slice(0, maxPhotos)
    let uploaded = 0

    for (let i = 0; i < photosToFetch.length; i++) {
      const photoRef = photosToFetch[i].photo_reference
      if (!photoRef) continue

      try {
        // Download from Google Places Photo API
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`
        const photoRes = await fetch(photoUrl)

        if (!photoRes.ok) continue

        const imageBuffer = Buffer.from(await photoRes.arrayBuffer())
        const contentType = photoRes.headers.get('content-type') || 'image/jpeg'
        const ext = contentType.includes('png') ? 'png' : 'jpg'
        const fileName = `${businessId}/google-${Date.now()}-${i}.${ext}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
          .from('business-images')
          .upload(fileName, imageBuffer, {
            contentType,
            upsert: false
          })

        if (uploadError) {
          console.error(`Upload error for ${business.name} photo ${i}:`, uploadError.message)
          continue
        }

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from('business-images')
          .getPublicUrl(fileName)

        // Save to DB
        await supabaseAdmin.from('business_images').insert({
          business_id: businessId,
          url: urlData.publicUrl,
          position: (existingCount || 0) + i
        })

        uploaded++
      } catch (e) {
        console.error(`Error fetching photo ${i} for ${business.name}:`, e)
      }
    }

    return NextResponse.json({
      success: true,
      uploaded,
      available: photos.length,
      businessName: business.name
    })
  } catch (err) {
    console.error('Fetch images error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
