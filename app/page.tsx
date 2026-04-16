export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase'
import { HomeNav } from './HomeNav'
import HotelSearch from './HotelSearch'
import PricingSection from './PricingSection'
import SiteFooter from './SiteFooter'

export default async function HomePage() {
  const { data: businesses } = await supabaseAdmin
    .from('businesses')
    .select('*')
    .eq('is_published', true)
    .order('name')

  // Get review counts per business
  const { data: reviewCounts } = await supabaseAdmin
    .from('reviews')
    .select('business_id')
    .eq('is_verified', true)

  const countMap: Record<string, number> = {}
  reviewCounts?.forEach(r => {
    countMap[r.business_id] = (countMap[r.business_id] || 0) + 1
  })

  // Get first image per business
  const { data: allImages } = await supabaseAdmin
    .from('business_images')
    .select('business_id, url')
    .order('position')

  const imageMap: Record<string, string> = {}
  allImages?.forEach(img => {
    if (!imageMap[img.business_id]) imageMap[img.business_id] = img.url
  })

  // Get AI analysis scores per business (from Google review analysis)
  const { data: allAnalysis } = await supabaseAdmin
    .from('business_analysis')
    .select('business_id, overall_score, source_review_count')

  const analysisMap: Record<string, { score: number, count: number }> = {}
  allAnalysis?.forEach(a => {
    analysisMap[a.business_id] = { score: a.overall_score, count: a.source_review_count }
  })

  const businessesWithCounts = (businesses || []).map(h => {
    const nativeReviews = countMap[h.id] || 0
    const analysis = analysisMap[h.id]
    return {
      ...h,
      review_count: nativeReviews,
      analysis_score: analysis?.score || null,
      analysis_review_count: analysis?.count || 0,
      image_url: imageMap[h.id] || null
    }
  }).sort((a, b) => {
    // Highest rated first; businesses without a score sink to the bottom, then alphabetical
    const aScore = a.analysis_score ?? -1
    const bScore = b.analysis_score ?? -1
    if (bScore !== aScore) return bScore - aScore
    return a.name.localeCompare(b.name)
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNav />
      <HotelSearch initialHotels={businessesWithCounts} />
      <PricingSection />
      <SiteFooter />
    </main>
  )
}
