/**
 * Cleanup bad Google matches for Rodrigues businesses.
 * Reads data/audit-rodrigues-v2.json.
 *
 * Policy:
 *  - WRONG: unlink fully (place_id → null, delete photos, delete analysis)
 *  - SUSPECT: if normalized names are substring of each other → keep (formatting variant)
 *             otherwise → unlink fully
 *  - CORRECT: leave alone
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const admin = createClient(
  env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim(),
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()
)

const audit = JSON.parse(readFileSync('data/audit-rodrigues-v2.json', 'utf8'))

function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`]/g, '')
    .replace(/\b(hotel|hôtel|resort|spa|restaurant|villa|residence|lodge|guest|house|auberge|chambre|gite|boutik|le|la|les|de|du|des|boutique|beach|and|et|&|rodrigues|mauritius|island)\b/gi, ' ')
    .replace(/[^a-z0-9]+/g, '')
    .trim()
}

// Classify each suspect: variant or different?
const toUnlink = [...audit.wrong]
const keepAsVariant = []

for (const s of audit.suspect) {
  const a = normalize(s.name)
  const b = normalize(s.gname)
  const isVariant =
    (a && b && (a === b || a.includes(b) || b.includes(a))) ||
    // Short names with >60% character overlap
    (a.length >= 4 && b.length >= 4 && levenshtein(a, b) <= Math.max(a.length, b.length) * 0.25)

  if (isVariant) keepAsVariant.push(s)
  else toUnlink.push(s)
}

function levenshtein(a, b) {
  const m = a.length, n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    dp[i][j] = Math.min(
      dp[i-1][j] + 1,
      dp[i][j-1] + 1,
      dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)
    )
  }
  return dp[m][n]
}

console.log(`\n🧹 Cleanup plan:`)
console.log(`   Unlink (wrong + unclear suspects): ${toUnlink.length}`)
console.log(`   Keep as formatting variants:       ${keepAsVariant.length}`)
console.log(`   Leave correct matches untouched:   ${audit.correct.length}`)

console.log(`\n📝 Will unlink these:\n`)
toUnlink.forEach(t => console.log(`   ✗ ${t.name.padEnd(40)} → "${t.gname}"`))

console.log(`\n✅ Kept as variants:\n`)
keepAsVariant.forEach(t => console.log(`   ✓ ${t.name.padEnd(40)} ≈ "${t.gname}"`))

// Execute cleanup
const ids = toUnlink.map(t => t.id)
console.log(`\n⏳ Cleaning up ${ids.length} businesses...`)

for (const id of ids) {
  // 1. Delete photos from storage bucket
  const { data: files } = await admin.storage.from('business-images').list(id, { limit: 50 })
  if (files?.length) {
    await admin.storage.from('business-images').remove(files.map(f => `${id}/${f.name}`))
  }
  // 2. Delete photo rows
  await admin.from('business_images').delete().eq('business_id', id)
  // 3. Delete wrong analysis (score, strengths, improvements, etc. from wrong business)
  await admin.from('business_analysis').delete().eq('business_id', id)
  // 4. Unlink place_id + clear website (it was from wrong business too)
  await admin.from('businesses').update({
    google_place_id: null,
    website: null,
  }).eq('id', id)
}

console.log(`\n✅ Unlinked ${ids.length} businesses.`)
console.log(`   They now show with no photo (category placeholder), no rating,`)
console.log(`   but keep their licensed info + owner contact + our factual description.`)
