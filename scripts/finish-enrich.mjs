/**
 * Resume enrichment — only processes businesses still missing photos.
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
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website,photos&key=${GOOGLE_KEY}`
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
    await admin.storage.from('business-images').upload(file, buf, { contentType: 'image/jpeg', upsert: true })
    const { data } = admin.storage.from('business-images').getPublicUrl(file)
    return data?.publicUrl || null
  } catch { return null }
}

// Get all licensed Rodrigues businesses
const { data: all } = await admin
  .from('businesses')
  .select('id, name, google_place_id')
  .eq('region', 'Rodrigues')
  .eq('is_licensed', true)

// Find those without photos
const targets = []
for (const b of all) {
  const { count } = await admin.from('business_images').select('id', { count: 'exact', head: true }).eq('business_id', b.id)
  if ((count || 0) === 0) targets.push(b)
}

console.log(`\n🎯 ${targets.length} businesses still missing photos\n`)

let ok = 0, nogoogle = 0, nophotos = 0

for (let i = 0; i < targets.length; i++) {
  const biz = targets[i]
  process.stdout.write(`[${i+1}/${targets.length}] ${biz.name.slice(0,45).padEnd(45)} `)

  let placeId = biz.google_place_id
  if (!placeId) {
    placeId = await findPlace(biz.name)
    if (placeId) await admin.from('businesses').update({ google_place_id: placeId }).eq('id', biz.id)
  }

  if (!placeId) {
    console.log('— not on Google')
    nogoogle++
    continue
  }

  const details = await getDetails(placeId)
  if (!details?.photos?.length) {
    console.log('— no photos')
    nophotos++
    continue
  }

  if (details.website) await admin.from('businesses').update({ website: details.website }).eq('id', biz.id)

  let up = 0
  for (let j = 0; j < Math.min(3, details.photos.length); j++) {
    const ref = details.photos[j].photo_reference
    if (!ref) continue
    const url = await uploadPhoto(ref, biz.id, j)
    if (url) {
      await admin.from('business_images').insert({ business_id: biz.id, url, position: j })
      up++
    }
  }
  console.log(`✓ ${up} photos`)
  ok++
  await new Promise(r => setTimeout(r, 200))
}

console.log(`\n✅ Added photos to ${ok}. Not on Google: ${nogoogle}, No photos available: ${nophotos}`)
