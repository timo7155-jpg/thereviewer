import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Export all tables
    const [
      { data: businesses },
      { data: reviews },
      { data: reviewers },
      { data: businessOwners },
      { data: ownerReplies },
      { data: bookingRequests },
      { data: businessImages },
      { data: businessAnalysis },
      { data: externalScores },
    ] = await Promise.all([
      supabaseAdmin.from('businesses').select('*').order('name'),
      supabaseAdmin.from('reviews').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('reviewers').select('*'),
      supabaseAdmin.from('business_owners').select('*'),
      supabaseAdmin.from('owner_replies').select('*'),
      supabaseAdmin.from('booking_requests').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('business_images').select('*'),
      supabaseAdmin.from('business_analysis').select('*'),
      supabaseAdmin.from('external_scores').select('*'),
    ])

    const backup = {
      exported_at: new Date().toISOString(),
      platform: 'TheReviewer.mu',
      tables: {
        businesses: { count: businesses?.length || 0, data: businesses || [] },
        reviews: { count: reviews?.length || 0, data: reviews || [] },
        reviewers: { count: reviewers?.length || 0, data: reviewers || [] },
        business_owners: { count: businessOwners?.length || 0, data: businessOwners || [] },
        owner_replies: { count: ownerReplies?.length || 0, data: ownerReplies || [] },
        booking_requests: { count: bookingRequests?.length || 0, data: bookingRequests || [] },
        business_images: { count: businessImages?.length || 0, data: businessImages || [] },
        business_analysis: { count: businessAnalysis?.length || 0, data: businessAnalysis || [] },
        external_scores: { count: externalScores?.length || 0, data: externalScores || [] },
      }
    }

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="thereviewer-backup-${new Date().toISOString().split('T')[0]}.json"`,
      }
    })
  } catch (err) {
    console.error('Backup error:', err)
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 })
  }
}
