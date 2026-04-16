/**
 * Enrich Rodrigues drafts with Google Places photos + place_id.
 * Skips those already enriched. Silent on Google miss — that's expected.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const admin = createClient(
  env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim(),
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()
)
const GOOGLE_KEY = env.match(/GOOGLE_PLACES_API_KEY=(.+)/)?.[1]?.trim()

async function findPlace(name) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(name + ' Rodrigues')}&inputtype=textquery&fields=place_id&key=${GOOGLE_KEY}`
  )
  const d = await res.json()
  return d.candidates?.[0]?.place_id || null
}

async function getDetails(placeId) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,international_phone_number,website,photos,rating,user_ratings_total&key=${GOOGLE_KEY}`
  )
  const d = await res.json()
  return d.status === 'OK' ? d.result : null
}

async function uploadPhoto(ref, businessId, pos) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${ref}&key=${GOOGLE_KEY}`
    const res = await fetch(url, { redirect: 'follow' })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    const file = `${businessId}/${pos}.jpg`
    await admin.storage.from('business-images').upload(file, buf, {
      contentType: 'image/jpeg',
      upsert: true,
    })
    const { data } = admin.storage.from('business-images').getPublicUrl(file)
    return data?.publicUrl || null
  } catch { return null }
}

const { data: targets } = await admin
  .from('businesses')
  .select('id, name, google_place_id')
  .eq('region', 'Rodrigues')
  .eq('is_licensed', true)

console.log(`\n📦 Enriching ${targets?.length || 0} Rodrigues businesses\n`)

let onGoogle = 0, notOnGoogle = 0, photosUploaded = 0

for (let i = 0; i < targets.length; i++) {
  const biz = targets[i]
  process.stdout.write(`[${i+1}/${targets.length}] ${biz.name.slice(0,40).padEnd(40)} `)

  let placeId = biz.google_place_id
  if (!placeId) {
    placeId = await findPlace(biz.name)
  }

  if (!placeId) {
    console.log('— not on Google')
    notOnGoogle++
    continue
  }

  const details = await getDetails(placeId)
  if (!details) {
    console.log('— details failed')
    notOnGoogle++
    continue
  }

  // Check existing photos
  const { count: existing } = await admin.from('business_images').select('id', { count: 'exact', head: true }).eq('business_id', biz.id)

  // Update row with place_id + rating hint + website
  await admin.from('businesses').update({
    google_place_id: placeId,
    website: details.website || null,
  }).eq('id', biz.id)

  // Upload up to 3 photos (keep API costs down)
  let uploaded = 0
  if ((existing || 0) === 0 && details.photos?.length) {
    for (let j = 0; j < Math.min(3, details.photos.length); j++) {
      const ref = details.photos[j].photo_reference
      if (!ref) continue
      const url = await uploadPhoto(ref, biz.id, j)
      if (url) {
        await admin.from('business_images').insert({ business_id: biz.id, url, position: j })
        uploaded++
      }
    }
  }

  onGoogle++
  photosUploaded += uploaded
  console.log(`✓ ${uploaded} photos, ${details.user_ratings_total || 0} reviews`)

  await new Promise(r => setTimeout(r, 300))
}

console.log(`\n✅ Done. On Google: ${onGoogle}, Not on Google: ${notOnGoogle}, Total photos uploaded: ${photosUploaded}`)
