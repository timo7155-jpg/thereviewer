/**
 * Audit every Rodrigues business with a google_place_id.
 * Verify the Google address actually mentions Rodrigues.
 * Flag mismatches so we can clean them up.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const admin = createClient(
  env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim(),
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()
)
const GOOGLE_KEY = env.match(/GOOGLE_PLACES_API_KEY=(.+)/)?.[1]?.trim()

const { data: all } = await admin
  .from('businesses')
  .select('id, name, google_place_id, is_licensed')
  .eq('region', 'Rodrigues')
  .not('google_place_id', 'is', null)

console.log(`\n🔎 Auditing ${all.length} Rodrigues businesses with Google place_id\n`)

const correct = []
const wrong = []
const failed = []

for (let i = 0; i < all.length; i++) {
  const biz = all[i]
  process.stdout.write(`[${i+1}/${all.length}] ${biz.name.slice(0,40).padEnd(40)} `)

  try {
    const r = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${biz.google_place_id}&fields=name,formatted_address,rating,user_ratings_total,geometry&key=${GOOGLE_KEY}`
    )
    const d = await r.json()
    if (d.status !== 'OK') {
      console.log(`⚠ Google ${d.status}`)
      failed.push({ ...biz, status: d.status })
      continue
    }

    const addr = (d.result?.formatted_address || '').toLowerCase()
    const gname = d.result?.name || ''
    const lat = d.result?.geometry?.location?.lat
    const lng = d.result?.geometry?.location?.lng
    const reviews = d.result?.user_ratings_total || 0
    const rating = d.result?.rating

    // Rodrigues bounding box: roughly lat -19.85 to -19.60, lng 63.30 to 63.55
    const inRodriguesBox = lat != null && lat >= -19.9 && lat <= -19.55 && lng != null && lng >= 63.30 && lng <= 63.55
    const addrMentionsRodrigues = addr.includes('rodrigues') || addr.includes('port mathurin')

    const isCorrect = inRodriguesBox || addrMentionsRodrigues

    if (isCorrect) {
      console.log(`✓ OK (${reviews} reviews)`)
      correct.push({ ...biz, gname, addr, reviews, rating })
    } else {
      console.log(`✗ WRONG: ${gname} @ ${d.result?.formatted_address?.slice(0, 50)}`)
      wrong.push({
        id: biz.id,
        name: biz.name,
        gname,
        addr: d.result?.formatted_address,
        reviews,
        rating,
        place_id: biz.google_place_id,
        inRodriguesBox,
        addrMentionsRodrigues,
      })
    }
  } catch (e) {
    console.log(`✗ ${e.message.slice(0, 30)}`)
    failed.push({ ...biz, err: e.message })
  }
  await new Promise(r => setTimeout(r, 150))
}

console.log(`\n📊 RESULTS:`)
console.log(`   ✓ Correct matches:     ${correct.length}`)
console.log(`   ✗ Wrong matches:       ${wrong.length}`)
console.log(`   ⚠ Google API failures: ${failed.length}`)

writeFileSync('data/audit-rodrigues-matches.json', JSON.stringify({ correct, wrong, failed }, null, 2))

if (wrong.length > 0) {
  console.log(`\n✗ WRONG MATCHES (first 20):`)
  wrong.slice(0, 20).forEach(w => {
    console.log(`\n  ${w.name}`)
    console.log(`    → linked to: "${w.gname}"`)
    console.log(`    at: ${w.addr}`)
    console.log(`    ${w.reviews} reviews, rating ${w.rating || 'n/a'}`)
  })
  if (wrong.length > 20) console.log(`\n   ... and ${wrong.length - 20} more.`)
  console.log(`\n💾 Full list written to data/audit-rodrigues-matches.json`)
}
