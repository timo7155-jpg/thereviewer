import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data: businesses } = await supabaseAdmin
    .from('businesses')
    .select('*, business_owners(id, full_name, email, status)')
    .order('name')

  return NextResponse.json({ businesses: businesses || [] })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'create') {
      const { name, slug, region, address, description, website, category } = body
      const { error } = await supabaseAdmin
        .from('businesses')
        .insert({ name, slug, region, address, description, website, category: category || 'hotel', is_claimed: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    if (action === 'update') {
      const { id, name, slug, region, address, description, website, category, email, phone } = body
      const updates: any = {}
      if (name !== undefined) updates.name = name
      if (slug !== undefined) updates.slug = slug
      if (region !== undefined) updates.region = region
      if (address !== undefined) updates.address = address
      if (description !== undefined) updates.description = description
      if (website !== undefined) updates.website = website
      if (category !== undefined) updates.category = category
      if (email !== undefined) updates.email = email
      if (phone !== undefined) updates.phone = phone

      const { error } = await supabaseAdmin
        .from('businesses')
        .update(updates)
        .eq('id', id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }

    if (action === 'delete') {
      const { id } = body
      // Delete in order: replies -> reviews -> owners -> business
      const { data: reviews } = await supabaseAdmin
        .from('reviews')
        .select('id')
        .eq('business_id', id)

      if (reviews && reviews.length > 0) {
        const reviewIds = reviews.map(r => r.id)
        await supabaseAdmin
          .from('owner_replies')
          .delete()
          .in('review_id', reviewIds)
      }

      await supabaseAdmin.from('reviews').delete().eq('business_id', id)
      await supabaseAdmin.from('business_owners').delete().eq('business_id', id)
      await supabaseAdmin.from('businesses').delete().eq('id', id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
