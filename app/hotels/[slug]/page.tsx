import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import HotelDetail from './HotelDetail'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: hotel } = await supabaseAdmin
    .from('businesses')
    .select('name, region, description')
    .eq('slug', slug)
    .single()

  if (!hotel) return { title: 'Not Found' }

  const title = `${hotel.name} — Reviews`
  const description = `Read reviews for ${hotel.name} in ${hotel.region}, Mauritius. ${hotel.description || ''}`

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
    .select('*, reviewers(name)')
    .eq('business_id', hotel.id)
    .eq('is_verified', true)
    .order('created_at', { ascending: false })

  const { data: images } = await supabaseAdmin
    .from('business_images')
    .select('*')
    .eq('business_id', hotel.id)
    .order('position')

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length).toFixed(1)
    : null

  return <HotelDetail hotel={hotel} reviews={reviews || []} avgRating={avgRating} slug={slug} images={images || []} />
}
