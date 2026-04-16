/**
 * Enrich already-imported draft businesses:
 * - Fetch phone, website, place_id, rating via Google Places
 * - Download photos
 * - Run AI analysis
 *
 * Safe to re-run; only updates missing fields.
 * Usage: node scripts/enrich-drafts.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim()
const SUPABASE_KEY = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()
const GOOGLE_KEY = env.match(/GOOGLE_PLACES_API_KEY=(.+)/)?.[1]?.trim()
const SITE_URL = 'https://thereviewer.mu' // always production
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Fields supported by findplacefromtext (NOT formatted_phone_number or website)
const FIND_FIELDS = 'place_id,name,rating,user_ratings_total,formatted_address'
// Fields supported by place/details (most fields allowed here)
const DETAIL_FIELDS = 'formatted_phone_number,international_phone_number,website,photos,rating,user_ratings_total,formatted_address'

async function findGooglePlace(name, region) {
  const query = `${name} ${region} Mauritius`
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=${FIND_FIELDS}&key=${GOOGLE_KEY}`
    )
    const data = await res.json()
    if (data.status !== 'OK') return null
    return data.candidates?.[0] || null
  } catch { return null }
}

async function getPlaceDetails(placeId) {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${DETAIL_FIELDS}&key=${GOOGLE_KEY}`
    )
    const data = await res.json()
    if (data.status !== 'OK') return null
    return data.result || null
  } catch { return null }
}

async function downloadAndUploadPhoto(photoRef, businessId, position) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${photoRef}&key=${GOOGLE_KEY}`
    const res = await fetch(url, { redirect: 'follow' })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    const fileName = `${businessId}/${position}.jpg`
    await supabase.storage.from('business-images').upload(fileName, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })
    const { data } = supabase.storage.from('business-images').getPublicUrl(fileName)
    return data?.publicUrl || null
  } catch { return null }
}

async function runAnalysis(businessId) {
  try {
    const res = await fetch(`${SITE_URL}/api/admin/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId }),
    })
    const data = await res.json()
    return data.success ? '✓' : `⚠ ${data.error || 'no data'}`
  } catch (e) {
    return `✗ ${e.message.slice(0, 30)}`
  }
}

// ===== MAIN =====
// Grab all draft businesses missing phone or analysis
const { data: drafts } = await supabase
  .from('businesses')
  .select('id, name, region, category, phone, website, google_place_id')
  .eq('is_published', false)
  .order('created_at', { ascending: false })

console.log(`\n📦 Enriching ${drafts?.length || 0} draft businesses\n`)

let ok = 0, partial = 0, failed = 0

for (let i = 0; i < (drafts || []).length; i++) {
  const biz = drafts[i]
  process.stdout.write(`  [${i + 1}/${drafts.length}] ${biz.name}...`)

  let placeId = biz.google_place_id
  let phone = biz.phone
  let website = biz.website
  let photos = []

  // 1. Find place_id if missing
  if (!placeId) {
    const candidate = await findGooglePlace(biz.name, biz.region)
    if (candidate) placeId = candidate.place_id
  }

  // 2. Get full details
  if (placeId) {
    const details = await getPlaceDetails(placeId)
    if (details) {
      phone = phone || details.international_phone_number || details.formatted_phone_number || null
      website = website || details.website || null
      photos = (details.photos || []).slice(0, 5)
    }
  }

  // 3. Update business row with enriched data
  if (placeId || phone || website) {
    await supabase.from('businesses').update({
      google_place_id: placeId,
      phone,
      website,
    }).eq('id', biz.id)
  }

  // 4. Check existing photos
  const { count: existingPhotos } = await supabase
    .from('business_images')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', biz.id)

  // 5. Upload photos (only if none exist yet)
  let photoCount = existingPhotos || 0
  if (photoCount === 0) {
    for (let j = 0; j < photos.length; j++) {
      const ref = photos[j].photo_reference
      if (!ref) continue
      const url = await downloadAndUploadPhoto(ref, biz.id, j)
      if (url) {
        await supabase.from('business_images').insert({ business_id: biz.id, url, position: j })
        photoCount++
      }
    }
  }

  // 6. Run AI analysis (skip if already analyzed)
  const { data: existingAnalysis } = await supabase
    .from('business_analysis')
    .select('id')
    .eq('business_id', biz.id)
    .maybeSingle()

  let analysisResult = '→ cached'
  if (!existingAnalysis) {
    analysisResult = await runAnalysis(biz.id)
  }

  const gotSomething = (phone || website || photoCount > 0)
  console.log(` ${gotSomething ? '✓' : '⚠'} (${phone ? '📞' : '—'} ${website ? '🌐' : '—'} ${photoCount} 📷 ${analysisResult})`)

  if (phone && photoCount > 0) ok++
  else if (gotSomething) partial++
  else failed++

  // Rate limit friendliness
  await new Promise(r => setTimeout(r, 600))
}

console.log(`\n✅ Done. Full: ${ok}, Partial: ${partial}, No data: ${failed}`)
