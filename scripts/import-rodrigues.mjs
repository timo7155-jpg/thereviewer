/**
 * Import Rodrigues licensed accommodations as drafts with dedup.
 * Does NOT call Google or Anthropic yet — just bulk insert with contact data.
 *
 * Usage: node scripts/import-rodrigues.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const admin = createClient(
  env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim(),
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()
)

const data = JSON.parse(readFileSync('data/rodrigues-licensed.json', 'utf8'))
console.log(`📋 ${data.length} accommodations to import\n`)

function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Get existing Rodrigues businesses to dedup
const { data: existing } = await admin
  .from('businesses')
  .select('id, name, slug')
  .eq('region', 'Rodrigues')

const existingSlugs = new Set(existing?.map(b => b.slug) || [])
const existingNames = new Set(existing?.map(b => b.name.toLowerCase()) || [])

let inserted = 0, updated = 0, skipped = 0

for (const row of data) {
  const slug = slugify(row.name)

  // Check for dup — either exact slug or case-insensitive name
  const existingMatch = existing?.find(b =>
    b.slug === slug || b.name.toLowerCase() === row.name.toLowerCase()
  )

  if (existingMatch) {
    // Update with licensed data (keep existing Google place_id, photos, etc.)
    const { error } = await admin.from('businesses').update({
      license_type: row.license_type,
      owner_name: row.owner_name,
      is_licensed: true,
      phone: row.phone,
      email: row.email,
      address: `${row.area}, Rodrigues`,
    }).eq('id', existingMatch.id)
    if (!error) {
      process.stdout.write('📝')
      updated++
    } else {
      process.stdout.write('✗')
      skipped++
    }
    continue
  }

  // Insert as draft
  const { error } = await admin.from('businesses').insert({
    name: row.name,
    slug,
    category: 'hotel', // broad category
    region: 'Rodrigues',
    address: `${row.area}, Rodrigues`,
    phone: row.phone,
    email: row.email && row.email.includes('@') ? row.email : null,
    license_type: row.license_type,
    owner_name: row.owner_name,
    is_licensed: true,
    is_claimed: false,
    is_published: false,
  })

  if (error) {
    if (error.code === '23505') skipped++ // duplicate slug
    else console.log(`\n✗ ${row.name}: ${error.message}`)
    process.stdout.write('✗')
  } else {
    process.stdout.write('✓')
    inserted++
  }
}

console.log(`\n\n✅ Done. Inserted: ${inserted}, Updated (existing): ${updated}, Skipped: ${skipped}`)
console.log(`   Total Rodrigues now: ${(existing?.length || 0) + inserted}`)
