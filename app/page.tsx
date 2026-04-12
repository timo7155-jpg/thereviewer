import { supabaseAdmin } from '@/lib/supabase'
import { HomeNav } from './HomeNav'
import HotelSearch from './HotelSearch'
import PricingSection from './PricingSection'
import SiteFooter from './SiteFooter'

export default async function HomePage() {
  const { data: businesses } = await supabaseAdmin
    .from('businesses')
    .select('*')
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

  const businessesWithCounts = (businesses || []).map(h => ({
    ...h,
    review_count: countMap[h.id] || 0,
    image_url: imageMap[h.id] || null
  }))

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNav />
      <HotelSearch initialHotels={businessesWithCounts} />
      <PricingSection />
      <SiteFooter />
    </main>
  )
}
