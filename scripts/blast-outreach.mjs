/**
 * Fire N outreach emails to the highest-value unreached contacts.
 * Priority: AI-rated Mauritius > Rodrigues licensed > rest
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const admin = createClient(
  env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim(),
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()
)

const LIMIT = Number(process.argv[2] || 75)
const SITE = 'https://thereviewer.mu'

// Get all businesses with email, not yet contacted
const { data: contacted } = await admin.from('outreach_logs').select('recipient_email')
const contactedEmails = new Set(contacted?.map(r => r.recipient_email.toLowerCase()))

const { data: businesses } = await admin
  .from('businesses')
  .select('id, name, slug, email, region, is_licensed, license_type')
  .eq('is_published', true)
  .not('email', 'is', null)

// Pull analysis scores
const { data: anals } = await admin
  .from('business_analysis')
  .select('business_id, overall_score, source_review_count')

const scoreMap = {}
anals?.forEach(a => { scoreMap[a.business_id] = { score: a.overall_score, reviews: a.source_review_count } })

// Filter to unreached, dedup by email
const unreachedByEmail = {}
for (const b of businesses) {
  if (contactedEmails.has(b.email.toLowerCase())) continue
  if (unreachedByEmail[b.email.toLowerCase()]) continue
  unreachedByEmail[b.email.toLowerCase()] = {
    ...b,
    analysis_score: scoreMap[b.id]?.score,
    analysis_review_count: scoreMap[b.id]?.reviews,
  }
}
const unreached = Object.values(unreachedByEmail)

// Score each contact by value:
//   Mauritius high-rated (4.5+): 100 + score*10  → 145-150
//   Rodrigues licensed with analysis:           90 + score*5
//   Rodrigues licensed no analysis:             70
//   Mauritius mid-rated 3.5-4.4:                60 + score*5
//   Rest:                                       30
function valueScore(b) {
  const isRodrigues = b.region?.toLowerCase() === 'rodrigues'
  if (b.analysis_score != null) {
    if (b.analysis_score >= 4.5 && !isRodrigues) return 100 + b.analysis_score * 10
    if (isRodrigues) return 90 + b.analysis_score * 5
    if (b.analysis_score >= 3.5) return 60 + b.analysis_score * 5
    return 40
  }
  if (isRodrigues && b.is_licensed) return 70
  return 30
}

unreached.sort((a, b) => valueScore(b) - valueScore(a))
const targets = unreached.slice(0, LIMIT)

console.log(`\n📤 Sending to top ${targets.length} of ${unreached.length} unreached contacts\n`)

let sent = 0, failed = 0
for (let i = 0; i < targets.length; i++) {
  const b = targets[i]
  const tier = b.analysis_score != null
    ? (b.region?.toLowerCase() === 'rodrigues' ? 'Rodr★' : `Mtius★${b.analysis_score.toFixed(1)}`)
    : (b.region?.toLowerCase() === 'rodrigues' ? 'Rodr.lic' : 'Mtius')

  process.stdout.write(`[${i+1}/${targets.length}] ${tier.padEnd(10)} ${b.name.slice(0,38).padEnd(38)} `)
  try {
    const res = await fetch(`${SITE}/api/admin/send-outreach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: b.name,
        businessSlug: b.slug,
        businessId: b.id,
        businessIds: [b.id],
        recipientEmail: b.email,
      }),
    })
    const d = await res.json()
    if (d.success) {
      console.log(`✓ ${b.email}`)
      sent++
    } else {
      console.log(`✗ ${d.error || 'fail'}`)
      failed++
    }
  } catch (e) {
    console.log(`✗ ${e.message.slice(0, 30)}`)
    failed++
  }
  // 1.5s between sends = 2.5 min per 100; stays under Resend rate limits
  await new Promise(r => setTimeout(r, 1500))
}

console.log(`\n✅ Done. Sent: ${sent}, Failed: ${failed}`)
