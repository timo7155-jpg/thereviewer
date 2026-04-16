import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import IslandLanding from '@/app/IslandLanding'

export const revalidate = 300 // 5 minutes

export const metadata: Metadata = {
  title: 'Rodrigues — Licensed Hotels, Guest Houses & Tourist Residences',
  description: 'Discover every licensed accommodation on Rodrigues — 8 hotels, 121 tourist residences, 74 guest houses, 14 chambres d\'hôtes. Verified contacts, honest reviews, Tourism Commission-licensed listings.',
  openGraph: {
    title: 'Rodrigues — The Complete Accommodation Directory',
    description: '227+ licensed accommodations on Rodrigues. Local insights, verified listings, AI-curated highlights.',
  },
}

export default async function RodriguesPage() {
  const { data: businesses } = await supabaseAdmin
    .from('businesses')
    .select('*')
    .eq('region', 'Rodrigues')
    .eq('is_published', true)
    .order('name')

  const { data: images } = await supabaseAdmin
    .from('business_images')
    .select('business_id, url')
    .in('business_id', businesses?.map(b => b.id) || [])
    .order('position')

  const imageMap: Record<string, string> = {}
  images?.forEach(img => { if (!imageMap[img.business_id]) imageMap[img.business_id] = img.url })

  const { data: analyses } = await supabaseAdmin
    .from('business_analysis')
    .select('business_id, overall_score, source_review_count')
    .in('business_id', businesses?.map(b => b.id) || [])

  const analysisMap: Record<string, { score: number, count: number }> = {}
  analyses?.forEach(a => { analysisMap[a.business_id] = { score: a.overall_score, count: a.source_review_count } })

  const enriched = (businesses || []).map(b => ({
    ...b,
    image_url: imageMap[b.id] || null,
    analysis_score: analysisMap[b.id]?.score || null,
    analysis_review_count: analysisMap[b.id]?.count || 0,
    review_count: 0,
  }))

  return (
    <IslandLanding
      island="rodrigues"
      businesses={enriched}
    />
  )
}
