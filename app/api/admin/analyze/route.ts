import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST: Analyze a single business using Google reviews + AI
export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json()
    if (!businessId) return NextResponse.json({ error: 'Business ID required' }, { status: 400 })

    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('name, region, category')
      .eq('id', businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    // Step 1: Find on Google Places
    const searchQuery = `${business.name} ${business.region} Mauritius`
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id,rating,user_ratings_total&key=${GOOGLE_API_KEY}`
    )
    const searchData = await searchRes.json()

    if (!searchData.candidates?.[0]) {
      return NextResponse.json({ error: 'Business not found on Google', found: false })
    }

    const place = searchData.candidates[0]
    const googleRating = place.rating
    const googleReviewCount = place.user_ratings_total || 0

    if (!googleRating || googleReviewCount < 3) {
      return NextResponse.json({ error: 'Not enough Google reviews to analyze', reviewCount: googleReviewCount })
    }

    // Step 2: Fetch detailed reviews from Google
    let reviews: any[] = []
    if (place.place_id) {
      const detailsRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=reviews&reviews_sort=newest&key=${GOOGLE_API_KEY}`
      )
      const details = await detailsRes.json()
      reviews = details.result?.reviews || []
    }

    // Step 3: Send to Claude for analysis
    const reviewTexts = reviews.map((r: any) =>
      `Rating: ${r.rating}/5 — "${r.text}"`
    ).join('\n\n')

    const categoryContext = business.category === 'restaurant' ? 'restaurant' :
      business.category === 'spa' ? 'spa and wellness centre' :
      business.category === 'tour' ? 'tour and activity operator' :
      business.category === 'car_rental' ? 'car rental company' :
      business.category === 'retail' ? 'retail shop or market' :
      'hotel or resort'

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are analyzing public reviews for "${business.name}", a ${categoryContext} in ${business.region}, Mauritius.

Google rating: ${googleRating}/5 based on ${googleReviewCount} reviews.

Here are ${reviews.length} recent reviews:
${reviewTexts || 'No review text available — base your analysis on the overall rating and category.'}

Based on this data, provide an ORIGINAL analysis (do not quote or copy any review text). Respond with ONLY a JSON object (no markdown, no code fences):
{
  "overall_score": number (1-5, one decimal),
  "service_score": number (1-5, one decimal),
  "cleanliness_score": number (1-5, one decimal),
  "location_score": number (1-5, one decimal),
  ${business.category === 'restaurant' || business.category === 'hotel' ? '"food_score": number (1-5, one decimal),' : '"food_score": null,'}
  "value_score": number (1-5, one decimal),
  "summary": "2-3 sentence original summary of what reviewers generally think about this business. Do NOT quote any review.",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area to improve 1", "area to improve 2"],
  "best_review": "Write a 2-3 sentence ORIGINAL positive review summary as if a happy customer wrote it. Based on positive themes from reviews, but do NOT copy any text. Write naturally.",
  "worst_review": "Write a 2-3 sentence ORIGINAL critical review summary as if a disappointed customer wrote it. Based on negative themes from reviews, but do NOT copy any text. Write constructively.",
  "teaser_insight": "One specific, actionable improvement suggestion for the business owner (e.g. 'Your service score trails your food score by 0.8 points — training front-of-house staff could close this gap'). Be concrete with numbers."
}`
      }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const analysis = JSON.parse(text)

    // Step 4: Save to DB
    await supabaseAdmin
      .from('business_analysis')
      .upsert({
        business_id: businessId,
        source: 'google',
        source_rating: googleRating,
        source_review_count: googleReviewCount,
        overall_score: analysis.overall_score,
        service_score: analysis.service_score,
        cleanliness_score: analysis.cleanliness_score,
        location_score: analysis.location_score,
        food_score: analysis.food_score,
        value_score: analysis.value_score,
        summary: analysis.summary,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        best_review: analysis.best_review,
        worst_review: analysis.worst_review,
        teaser_insight: analysis.teaser_insight,
        analyzed_at: new Date().toISOString()
      }, { onConflict: 'business_id,source' })

    return NextResponse.json({ success: true, analysis })
  } catch (err) {
    console.error('Analysis error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

// GET: Fetch analysis for a business
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId')
  if (!businessId) return NextResponse.json({ analysis: null })

  const { data } = await supabaseAdmin
    .from('business_analysis')
    .select('*')
    .eq('business_id', businessId)
    .single()

  return NextResponse.json({ analysis: data })
}
