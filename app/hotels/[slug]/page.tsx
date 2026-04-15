import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import HotelDetail from './HotelDetail'

// Revalidate every 60 seconds so new reviews / owner replies appear
export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: hotel } = await supabaseAdmin
    .from('businesses')
    .select('name, region, description')
    .eq('slug', slug)
    .single()

  if (!hotel) return { title: 'Not Found' }

  const title = `${hotel.name} — Reviews & Booking`
  const description = `Read reviews, see ratings, and book ${hotel.name} in ${hotel.region}, Mauritius. ${hotel.description || ''}`

  return {
    title,
    description,
    openGraph: {
      title: `${hotel.name} — Reviews | TheReviewer.mu`,
      description,
    },
  }
}

export default async function HotelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: hotel } = await supabaseAdmin
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!hotel) return notFound()

  const { data: reviews } = await supabaseAdmin
    .from('reviews')
    .select('*, reviewers(name), owner_replies(body, created_at)')
    .eq('business_id', hotel.id)
    .eq('is_verified', true)
    .order('created_at', { ascending: false })

  const { data: images } = await supabaseAdmin
    .from('business_images')
    .select('*')
    .eq('business_id', hotel.id)
    .order('position')

  // Get analysis score as fallback
  const { data: analysis } = await supabaseAdmin
    .from('business_analysis')
    .select('overall_score, source_review_count')
    .eq('business_id', hotel.id)
    .single()

  const nativeAvg = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length).toFixed(1)
    : null

  // Use native rating if available, otherwise analysis score
  const avgRating = nativeAvg || (analysis?.overall_score ? analysis.overall_score.toFixed(1) : null)
  const reviewCountDisplay = reviews && reviews.length > 0
    ? reviews.length
    : (analysis?.source_review_count || 0)

  return <HotelDetail hotel={hotel} reviews={reviews || []} avgRating={avgRating} reviewCountDisplay={reviewCountDisplay} slug={slug} images={images || []} />
}
