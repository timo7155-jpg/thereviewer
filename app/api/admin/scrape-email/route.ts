import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Scrape a business website for email addresses
export async function POST(req: NextRequest) {
  try {
    const { businessId } = await req.json()
    if (!businessId) return NextResponse.json({ error: 'Business ID required' }, { status: 400 })

    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('name, website, email')
      .eq('id', businessId)
      .single()

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    if (business.email) return NextResponse.json({ skipped: true, email: business.email, message: 'Already has email' })
    if (!business.website) {
      // Mark as attempted with reason so batch skips it
      await supabaseAdmin
        .from('businesses')
        .update({
          email_scrape_attempted_at: new Date().toISOString(),
          email_scrape_result: 'no_website',
        })
        .eq('id', businessId)
      return NextResponse.json({ error: 'No website to scrape', found: false })
    }

    // Clean the URL
    let url = business.website
    if (!url.startsWith('http')) url = 'https://' + url

    const emails = new Set<string>()

    // Try main page + common contact pages
    const pagesToTry = [
      url,
      url.replace(/\/$/, '') + '/contact',
      url.replace(/\/$/, '') + '/contact-us',
      url.replace(/\/$/, '') + '/about',
      url.replace(/\/$/, '') + '/about-us',
    ]

    for (const pageUrl of pagesToTry) {
      try {
        const res = await fetch(pageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TheReviewer.mu bot)',
            'Accept': 'text/html',
          },
          signal: AbortSignal.timeout(8000),
          redirect: 'follow',
        })

        if (!res.ok) continue

        const html = await res.text()

        // Extract emails using regex
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
        const found = html.match(emailRegex) || []

        found.forEach(email => {
          const lower = email.toLowerCase()
          // Filter out common false positives
          if (
            !lower.includes('example.com') &&
            !lower.includes('email.com') &&
            !lower.includes('domain.com') &&
            !lower.includes('yoursite') &&
            !lower.includes('sentry') &&
            !lower.includes('webpack') &&
            !lower.includes('.png') &&
            !lower.includes('.jpg') &&
            !lower.includes('.svg') &&
            !lower.includes('wixpress') &&
            !lower.includes('schema.org') &&
            !lower.endsWith('.js') &&
            !lower.endsWith('.css') &&
            lower.length < 60
          ) {
            emails.add(lower)
          }
        })

        // Also try mailto: links
        const mailtoRegex = /mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
        let match
        while ((match = mailtoRegex.exec(html)) !== null) {
          const mailtoEmail = match[1].toLowerCase()
          if (mailtoEmail.length < 60) emails.add(mailtoEmail)
        }

        if (emails.size > 0) break // Found emails, no need to try more pages

      } catch {
        // Page failed, try next
        continue
      }
    }

    const nowIso = new Date().toISOString()

    if (emails.size === 0) {
      // Record the miss so "Scrape new only" can skip this next time
      await supabaseAdmin
        .from('businesses')
        .update({
          email_scrape_attempted_at: nowIso,
          email_scrape_result: 'no_email_found',
        })
        .eq('id', businessId)
      return NextResponse.json({ found: false, message: 'No email found on website' })
    }

    // Pick the best email (prefer info@, contact@, reservations@, booking@, reception@)
    const emailArray = Array.from(emails)
    const preferred = ['info@', 'contact@', 'reservations@', 'reservation@', 'booking@', 'reception@', 'hello@', 'enquiry@', 'enquiries@']
    let bestEmail = emailArray[0]

    for (const prefix of preferred) {
      const match = emailArray.find(e => e.startsWith(prefix))
      if (match) { bestEmail = match; break }
    }

    // Save to DB with success flag
    await supabaseAdmin
      .from('businesses')
      .update({
        email: bestEmail,
        email_scrape_attempted_at: nowIso,
        email_scrape_result: 'found',
      })
      .eq('id', businessId)

    return NextResponse.json({
      success: true,
      email: bestEmail,
      allFound: emailArray,
      businessName: business.name
    })
  } catch (err) {
    console.error('Scrape email error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
