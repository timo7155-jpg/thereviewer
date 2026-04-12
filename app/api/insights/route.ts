import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json()

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 })
    }

    // Get business info
    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('name, region')
      .eq('id', businessId)
      .single()

    // Get all verified reviews
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('*, reviewers(name)')
      .eq('business_id', businessId)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({
        insights: {
          summary: 'No verified reviews yet. Once guests start leaving reviews, AI-powered insights will appear here to help you understand trends and improve your service.',
          strengths: [],
          improvements: [],
          actionItems: [],
          sentiment: 'neutral'
        }
      })
    }

    // Build review data for the prompt
    const reviewData = reviews.map(r => ({
      rating: r.overall_rating,
      service: r.service_score,
      cleanliness: r.cleanliness_score,
      location: r.location_score,
      food: r.food_score,
      value: r.value_score,
      text: r.body,
      date: r.created_at
    }))

    const avgRating = (reviews.reduce((s, r) => s + r.overall_rating, 0) / reviews.length).toFixed(1)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are an AI assistant for hotel owners in Mauritius. Analyze these ${reviews.length} guest reviews for "${business?.name}" (${business?.region}) and provide actionable insights.

Average rating: ${avgRating}/5

Reviews:
${JSON.stringify(reviewData, null, 2)}

Respond with ONLY a JSON object (no markdown, no code fences) with this exact structure:
{
  "summary": "2-3 sentence overview of guest sentiment and trends",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"],
  "actionItems": ["specific action 1", "specific action 2", "specific action 3"],
  "sentiment": "positive" | "mixed" | "negative"
}`
      }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const insights = JSON.parse(text)

    return NextResponse.json({ insights })
  } catch (err) {
    console.error('Insights error:', err)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
