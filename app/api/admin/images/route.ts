import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET: Fetch images for a business
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId')
  if (!businessId) return NextResponse.json({ images: [] })

  const { data: images } = await supabaseAdmin
    .from('business_images')
    .select('*')
    .eq('business_id', businessId)
    .order('position')

  return NextResponse.json({ images: images || [] })
}

// POST: Upload image or delete image
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const action = formData.get('action') as string

    if (action === 'delete') {
      const imageId = formData.get('imageId') as string
      const url = formData.get('url') as string

      // Delete from storage
      if (url) {
        const path = url.split('/business-images/')[1]
        if (path) {
          await supabaseAdmin.storage.from('business-images').remove([path])
        }
      }

      // Delete from DB
      await supabaseAdmin.from('business_images').delete().eq('id', imageId)
      return NextResponse.json({ success: true })
    }

    // Upload
    const file = formData.get('file') as File
    const businessId = formData.get('businessId') as string

    if (!file || !businessId) {
      return NextResponse.json({ error: 'File and business ID required' }, { status: 400 })
    }

    // Check max 10 images
    const { count } = await supabaseAdmin
      .from('business_images')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)

    if ((count || 0) >= 10) {
      return NextResponse.json({ error: 'Maximum 10 images per business' }, { status: 400 })
    }

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${businessId}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('business-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('business-images')
      .getPublicUrl(fileName)

    // Save to DB
    const { data: image, error: dbError } = await supabaseAdmin
      .from('business_images')
      .insert({
        business_id: businessId,
        url: urlData.publicUrl,
        position: (count || 0)
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ image })
  } catch (err) {
    console.error('Image upload error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
