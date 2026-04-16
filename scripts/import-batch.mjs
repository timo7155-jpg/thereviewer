/**
 * Batch import businesses as DRAFTS (is_published=false)
 * + enrich via Google Places (phone, website, images, place_id)
 * + run AI analysis
 *
 * Usage: node scripts/import-batch.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim()
const SUPABASE_KEY = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()
const GOOGLE_KEY = env.match(/GOOGLE_PLACES_API_KEY=(.+)/)?.[1]?.trim()
const SITE_URL = env.match(/NEXT_PUBLIC_SITE_URL=(.+)/)?.[1]?.trim() || 'https://thereviewer.mu'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ====== BUSINESSES TO IMPORT ======
// All Rodrigues + top Mauritius missing
const BUSINESSES = [
  // RODRIGUES — HOTELS
  { name: 'Cotton Bay Hotel', category: 'hotel', region: 'Rodrigues', address: 'Pointe Coton, Rodrigues' },
  { name: 'Mourouk Ebony Hotel', category: 'hotel', region: 'Rodrigues', address: 'Mourouk, Rodrigues' },
  { name: 'Tekoma Boutik Hotel', category: 'hotel', region: 'Rodrigues', address: 'Anse Ally, Rodrigues' },
  { name: 'Le Récif Hotel', category: 'hotel', region: 'Rodrigues', address: 'Anse aux Anglais, Rodrigues' },
  { name: 'Escale Vacances', category: 'hotel', region: 'Rodrigues', address: 'Port Mathurin, Rodrigues' },
  { name: 'Pointe Venus Hotel & Spa', category: 'hotel', region: 'Rodrigues', address: 'Pointe Venus, Rodrigues' },
  { name: 'Bakwa Lodge', category: 'hotel', region: 'Rodrigues', address: 'Pointe Cotton, Rodrigues' },
  { name: 'Les Cocotiers Hotel Rodrigues', category: 'hotel', region: 'Rodrigues', address: 'Anse aux Anglais, Rodrigues' },
  { name: 'Auberge Lagon Bleu', category: 'hotel', region: 'Rodrigues', address: 'Grand Baie, Rodrigues' },
  // RODRIGUES — RESTAURANTS
  { name: 'Chez Robert et Solange', category: 'restaurant', region: 'Rodrigues', address: 'Saint François, Rodrigues' },
  { name: 'Chef Joey Restaurant', category: 'restaurant', region: 'Rodrigues', address: 'Port Mathurin, Rodrigues' },
  { name: 'Le Capitaine Rodrigues', category: 'restaurant', region: 'Rodrigues', address: 'Port Mathurin, Rodrigues' },
  { name: 'Restaurant L\'Ocean', category: 'restaurant', region: 'Rodrigues', address: 'Anse aux Anglais, Rodrigues' },
  { name: 'Chez Bernard Rodrigues', category: 'restaurant', region: 'Rodrigues', address: 'Mourouk, Rodrigues' },
  { name: 'Ti Paradis Restaurant', category: 'restaurant', region: 'Rodrigues', address: 'Port Mathurin, Rodrigues' },
  // RODRIGUES — TOURS
  { name: 'François Leguat Reserve', category: 'tour', region: 'Rodrigues', address: 'Anse Quitor, Rodrigues' },
  { name: 'Caverne Patate', category: 'tour', region: 'Rodrigues', address: 'La Ferme, Rodrigues' },
  { name: 'Île aux Cocos Excursion', category: 'tour', region: 'Rodrigues', address: 'Port Mathurin, Rodrigues' },
  { name: 'Grande Montagne Nature Reserve', category: 'tour', region: 'Rodrigues', address: 'Grande Montagne, Rodrigues' },
  { name: 'Rodrigues Kitesurfing', category: 'tour', region: 'Rodrigues', address: 'Mourouk, Rodrigues' },
  { name: 'Trou d\'Argent Beach Hike', category: 'tour', region: 'Rodrigues', address: 'Graviers, Rodrigues' },
  { name: 'Jardin des 5 Sens', category: 'tour', region: 'Rodrigues', address: 'Baladirou, Rodrigues' },
  // RODRIGUES — RETAIL & SERVICES
  { name: 'Port Mathurin Saturday Market', category: 'retail', region: 'Rodrigues', address: 'Port Mathurin, Rodrigues' },
  { name: 'Rodrigues Crafts Cooperative', category: 'retail', region: 'Rodrigues', address: 'Port Mathurin, Rodrigues' },
  { name: 'Rodrigues Car Rental', category: 'car_rental', region: 'Rodrigues', address: 'Port Mathurin, Rodrigues' },
  // RODRIGUES — SPA
  { name: 'Cotton Bay Spa', category: 'spa', region: 'Rodrigues', address: 'Pointe Coton, Rodrigues' },

  // TOP MAURITIUS — MISSING HOTELS
  { name: 'Shangri-La Le Touessrok', category: 'hotel', region: 'East', address: 'Trou d\'Eau Douce, Mauritius' },
  { name: 'St. Regis Mauritius Resort', category: 'hotel', region: 'West', address: 'Le Morne, Mauritius' },
  { name: 'The Oberoi Mauritius', category: 'hotel', region: 'North', address: 'Turtle Bay, Mauritius' },
  { name: 'Anantara Iko Mauritius Resort', category: 'hotel', region: 'South-East', address: 'Blue Bay, Mauritius' },
  { name: 'Hilton Mauritius Resort & Spa', category: 'hotel', region: 'West', address: 'Wolmar, Flic en Flac, Mauritius' },
  { name: 'InterContinental Mauritius Resort', category: 'hotel', region: 'North', address: 'Balaclava Fort, Mauritius' },
  { name: 'Sugar Beach Mauritius', category: 'hotel', region: 'West', address: 'Flic en Flac, Mauritius' },
  { name: 'Paradis Beachcomber Golf Resort & Spa', category: 'hotel', region: 'West', address: 'Le Morne, Mauritius' },
  { name: 'LUX Belle Mare', category: 'hotel', region: 'East', address: 'Belle Mare, Mauritius' },
  { name: 'Outrigger Mauritius Beach Resort', category: 'hotel', region: 'South', address: 'Bel Ombre, Mauritius' },

  // TOP MAURITIUS — RESTAURANTS
  { name: 'Le Chamarel Restaurant', category: 'restaurant', region: 'West', address: 'Chamarel, Mauritius' },
  { name: 'Rhumerie de Chamarel', category: 'restaurant', region: 'West', address: 'Chamarel, Mauritius' },
  { name: 'Château de Labourdonnais', category: 'restaurant', region: 'North', address: 'Mapou, Mauritius' },
  { name: 'Le Fangourin', category: 'restaurant', region: 'North', address: 'Pamplemousses, Mauritius' },
  { name: 'Happy Rajah', category: 'restaurant', region: 'North', address: 'Grand Baie, Mauritius' },

  // TOP MAURITIUS — TOURS
  { name: 'Casela Nature Parks', category: 'tour', region: 'West', address: 'Cascavelle, Mauritius' },
  { name: 'Black River Gorges National Park', category: 'tour', region: 'West', address: 'Black River, Mauritius' },
  { name: 'Île aux Cerfs', category: 'tour', region: 'East', address: 'Trou d\'Eau Douce, Mauritius' },
  { name: 'Pamplemousses Botanical Garden', category: 'tour', region: 'North', address: 'Pamplemousses, Mauritius' },
  { name: 'Seven Coloured Earths Chamarel', category: 'tour', region: 'West', address: 'Chamarel, Mauritius' },

  // TOP MAURITIUS — RETAIL
  { name: 'Bagatelle Mall of Mauritius', category: 'retail', region: 'Central', address: 'Moka, Mauritius' },
  { name: 'Caudan Waterfront', category: 'retail', region: 'Central', address: 'Port Louis, Mauritius' },
  { name: 'Central Market Port Louis', category: 'retail', region: 'Central', address: 'Port Louis, Mauritius' },
]

function slugify(name) {
  return name.toLowerCase().replace(/[''`]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function findGooglePlace(name, address) {
  const query = `${name} ${address}`
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,rating,user_ratings_total,formatted_phone_number,website,formatted_address&key=${GOOGLE_KEY}`
    )
    const data = await res.json()
    return data.candidates?.[0] || null
  } catch { return null }
}

async function getPlaceDetails(placeId) {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,international_phone_number,website,photos&key=${GOOGLE_KEY}`
    )
    const data = await res.json()
    return data.result || null
  } catch { return null }
}

function googlePhotoUrl(ref, maxWidth = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${ref}&key=${GOOGLE_KEY}`
}

async function downloadAndUploadPhoto(photoRef, businessId, position) {
  try {
    const url = googlePhotoUrl(photoRef)
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
    return data.success ? '✓ analyzed' : `⚠ ${data.error || 'no data'}`
  } catch (e) {
    return `✗ ${e.message}`
  }
}

// ====== MAIN ======
console.log(`\n🏗️  Importing ${BUSINESSES.length} businesses as DRAFT (is_published=false)\n`)

let imported = 0, skipped = 0, errors = 0

for (const biz of BUSINESSES) {
  const slug = slugify(biz.name)
  process.stdout.write(`  [${imported + skipped + errors + 1}/${BUSINESSES.length}] ${biz.name}...`)

  // Check if already exists
  const { data: existing } = await supabase.from('businesses').select('id').eq('slug', slug).maybeSingle()
  if (existing) {
    console.log(' ⏭ already exists')
    skipped++
    continue
  }

  // Search Google Places
  const place = await findGooglePlace(biz.name, biz.address)
  let phone = null, website = null, placeId = null, description = ''

  if (place) {
    placeId = place.place_id
    phone = place.formatted_phone_number || null
    website = place.website || null
    description = place.formatted_address || biz.address
  }

  // Get more details if we have a place_id
  let photos = []
  if (placeId) {
    const details = await getPlaceDetails(placeId)
    if (details) {
      phone = phone || details.international_phone_number || details.formatted_phone_number || null
      website = website || details.website || null
      photos = (details.photos || []).slice(0, 5) // Max 5 photos
    }
  }

  // Insert business as draft
  const { data: inserted, error } = await supabase.from('businesses').insert({
    name: biz.name,
    slug,
    category: biz.category,
    region: biz.region,
    address: biz.address,
    description: description || biz.address,
    phone,
    website,
    google_place_id: placeId,
    is_claimed: false,
    is_published: false,
  }).select('id').single()

  if (error || !inserted) {
    console.log(` ✗ insert failed: ${error?.message}`)
    errors++
    continue
  }

  const id = inserted.id

  // Upload photos
  let photoCount = 0
  for (let i = 0; i < photos.length; i++) {
    const ref = photos[i].photo_reference
    if (!ref) continue
    const url = await downloadAndUploadPhoto(ref, id, i)
    if (url) {
      await supabase.from('business_images').insert({ business_id: id, url, position: i })
      photoCount++
    }
  }

  // Run AI analysis (calls production endpoint)
  const analysisResult = await runAnalysis(id)

  console.log(` ✓ (${phone || 'no phone'} | ${photoCount} photos | ${analysisResult})`)
  imported++

  // Small delay to avoid rate limits
  await new Promise(r => setTimeout(r, 500))
}

console.log(`\n✅ Done! Imported: ${imported}, Skipped: ${skipped}, Errors: ${errors}`)
console.log('All new businesses are DRAFT (is_published=false). Toggle in admin to publish.')
