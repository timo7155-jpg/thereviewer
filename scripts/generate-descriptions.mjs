/**
 * Generate short factual AI descriptions for licensed Rodrigues businesses
 * that don't have a meaningful description yet.
 * No fake reviews — just factual intro from what we know.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'

const env = readFileSync('.env.local', 'utf8')
const admin = createClient(
  env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim(),
  env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim()
)
const anthropic = new Anthropic({ apiKey: env.match(/ANTHROPIC_API_KEY=(.+)/)?.[1]?.trim() })

// Get all licensed Rodrigues without a meaningful description
const { data: targets } = await admin
  .from('businesses')
  .select('id, name, address, license_type, owner_name, description')
  .eq('region', 'Rodrigues')
  .eq('is_licensed', true)

// Filter out those with an existing non-trivial description (not just "X, Rodrigues")
const needsDescription = targets.filter(b => !b.description || b.description.length < 50 || b.description.trim() === b.address.trim())
console.log(`\n✍️  ${needsDescription.length} businesses need descriptions\n`)

let done = 0, fail = 0

for (let i = 0; i < needsDescription.length; i++) {
  const biz = needsDescription[i]
  process.stdout.write(`[${i+1}/${needsDescription.length}] ${biz.name.slice(0,45).padEnd(45)} `)

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Write a SHORT 2-sentence factual description (60-90 words max) for this officially licensed Rodrigues accommodation:

Name: ${biz.name}
Type: ${biz.license_type}
Area: ${biz.address}
Owner: ${biz.owner_name || 'Not disclosed'}

Tone: neutral, informative, welcoming. DO NOT invent reviews, ratings, or features you don't know (pool, wifi, size). Focus on what we can honestly say: it's a licensed ${biz.license_type.toLowerCase()} in [area], Rodrigues, ideal for travelers seeking [authentic Rodriguan hospitality / a quiet escape / personalized service / a family-run experience — pick what fits]. Mention Rodrigues's character (traditional island, untouched beaches, creole culture) if it helps.

Return ONLY the 2 sentences, no preamble. In English.`
      }]
    })
    const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
    if (text.length > 20) {
      await admin.from('businesses').update({ description: text }).eq('id', biz.id)
      console.log(`✓`)
      done++
    } else {
      console.log(`⚠ empty response`)
      fail++
    }
  } catch (e) {
    console.log(`✗ ${e.message.slice(0, 40)}`)
    fail++
  }
  await new Promise(r => setTimeout(r, 200))
}

console.log(`\n✅ Generated ${done} descriptions. Failed: ${fail}`)
