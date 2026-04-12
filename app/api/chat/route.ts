import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

    // Fetch all businesses with analysis scores for context
    const { data: businesses } = await supabaseAdmin
      .from('businesses')
      .select('id, name, slug, region, category, description')
      .order('name')

    const { data: analyses } = await supabaseAdmin
      .from('business_analysis')
      .select('business_id, overall_score, source_review_count')

    const scoreMap: Record<string, { score: number, count: number }> = {}
    analyses?.forEach(a => { scoreMap[a.business_id] = { score: a.overall_score, count: a.source_review_count } })

    // Build a compact business list for the AI
    const bizList = (businesses || []).map(b => {
      const s = scoreMap[b.id as string]
      return `${b.name} | ${b.category} | ${b.region} | ${s ? s.score + '/5 (' + s.count + ' reviews)' : 'no rating'} | /hotels/${b.slug}`
    }).join('\n')

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: message
      }],
      system: `You are a friendly discovery assistant for TheReviewer.mu, a business review platform in Mauritius. Help visitors find the right business.

RULES:
- Keep answers SHORT (2-4 sentences max)
- Recommend 1-3 businesses maximum per response
- For each recommendation, include the link as: [Business Name](/hotels/slug)
- If the user asks something unrelated to Mauritius businesses, politely redirect
- You can answer in French if the user writes in French
- Never invent businesses — only recommend from the list below
- If nothing matches, say so honestly and suggest they browse by category

AVAILABLE BUSINESSES:
${bizList}`
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ reply: text })
  } catch (err: any) {
    console.error('Chat error:', err?.message || err)
    return NextResponse.json({ reply: 'Sorry, I couldn\'t process your request. Please try again.' })
  }
}
