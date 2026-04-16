/**
 * Stricter audit: checks both (a) in Rodrigues and (b) name similarity.
 * A match is WRONG if:
 *  - Location is outside Rodrigues, OR
 *  - Google name differs significantly from stored name (<40% word overlap),
 *    especially when review count is suspicious for a small licensed venue
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const admin = createClient(
  env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim(),
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()
)
const GOOGLE_KEY = env.match(/GOOGLE_PLACES_API_KEY=(.+)/)?.[1]?.trim()

function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`]/g, '')
    .replace(/\b(hotel|hôtel|resort|spa|restaurant|villa|residence|lodge|guest|house|auberge|chambre|gite|boutik|le|la|les|de|du|des|boutique|beach|and|et|&|rodrigues|mauritius)\b/gi, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function wordSet(s) {
  return new Set(normalize(s).split(' ').filter(w => w.length >= 3))
}

function similarity(a, b) {
  const sa = wordSet(a)
  const sb = wordSet(b)
  if (sa.size === 0 && sb.size === 0) return 1
  if (sa.size === 0 || sb.size === 0) return 0
  const intersect = [...sa].filter(w => sb.has(w)).length
  return intersect / Math.max(sa.size, sb.size)
}

const { data: all } = await admin
  .from('businesses')
  .select('id, name, google_place_id, is_licensed, license_type')
  .eq('region', 'Rodrigues')
  .not('google_place_id', 'is', null)

console.log(`\n🔎 Strict audit of ${all.length} Rodrigues businesses\n`)

const correct = []
const wrong = []
const suspect = []

for (let i = 0; i < all.length; i++) {
  const biz = all[i]
  process.stdout.write(`[${i+1}/${all.length}] ${biz.name.slice(0,40).padEnd(40)} `)

  try {
    const r = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${biz.google_place_id}&fields=name,formatted_address,rating,user_ratings_total,geometry&key=${GOOGLE_KEY}`
    )
    const d = await r.json()
    if (d.status !== 'OK') { console.log(`⚠ ${d.status}`); continue }

    const gname = d.result?.name || ''
    const addr = d.result?.formatted_address || ''
    const lat = d.result?.geometry?.location?.lat
    const lng = d.result?.geometry?.location?.lng
    const reviews = d.result?.user_ratings_total || 0

    const inRodriguesBox = lat != null && lat >= -19.9 && lat <= -19.55 && lng != null && lng >= 63.30 && lng <= 63.55
    const sim = similarity(biz.name, gname)
    const suspiciousReviewCount = !biz.is_licensed
      ? false
      : (biz.license_type === 'Tourist Residence' || biz.license_type === 'Chambre d\'Hotes' || biz.license_type === 'Gite') && reviews > 300

    let status, reason
    if (!inRodriguesBox) {
      status = 'WRONG'; reason = `not in Rodrigues (${addr})`
    } else if (sim < 0.2 && suspiciousReviewCount) {
      status = 'WRONG'; reason = `name mismatch + ${reviews} reviews suspicious`
    } else if (sim < 0.2) {
      status = 'SUSPECT'; reason = `name differs: "${gname}" (${(sim*100).toFixed(0)}% match)`
    } else if (sim < 0.4 && suspiciousReviewCount) {
      status = 'SUSPECT'; reason = `partial match + ${reviews} reviews`
    } else {
      status = 'OK'
    }

    const row = { id: biz.id, name: biz.name, gname, addr, reviews, sim: (sim*100).toFixed(0)+'%', license_type: biz.license_type, reason, place_id: biz.google_place_id }

    if (status === 'WRONG') { console.log(`✗ WRONG — ${reason}`); wrong.push(row) }
    else if (status === 'SUSPECT') { console.log(`⚠ SUSPECT — ${reason}`); suspect.push(row) }
    else { console.log(`✓ OK (${(sim*100).toFixed(0)}% match, ${reviews} reviews)`); correct.push(row) }
  } catch (e) {
    console.log(`✗ ${e.message.slice(0, 30)}`)
  }
  await new Promise(r => setTimeout(r, 120))
}

console.log(`\n📊 STRICT AUDIT RESULTS:`)
console.log(`   ✓ Correct:   ${correct.length}`)
console.log(`   ⚠ Suspect:   ${suspect.length}`)
console.log(`   ✗ Wrong:     ${wrong.length}`)

writeFileSync('data/audit-rodrigues-v2.json', JSON.stringify({ correct, suspect, wrong }, null, 2))

console.log(`\n✗ CONFIRMED WRONG (${wrong.length}):`)
wrong.forEach(w => console.log(`   ${w.name} → "${w.gname}" (${w.reason})`))

console.log(`\n⚠ SUSPECT (${suspect.length}) — needs human review:`)
suspect.slice(0, 30).forEach(w => console.log(`   ${w.name} → "${w.gname}" (${w.sim} match, ${w.reviews} reviews)`))
if (suspect.length > 30) console.log(`   ... ${suspect.length - 30} more in data/audit-rodrigues-v2.json`)
