import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thereviewer.mu'

  // Get all businesses for dynamic pages
  const { data: businesses } = await supabaseAdmin
    .from('businesses')
    .select('slug, created_at')
    .order('name')

  const businessPages = (businesses || []).map(b => ({
    url: `${baseUrl}/hotels/${b.slug}`,
    lastModified: new Date(b.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...businessPages,
  ]
}
