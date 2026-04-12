import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = 'timo7155@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, reason, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !reason) {
      return NextResponse.json({ error: 'Name, email, and reason are required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const reasonLabels: Record<string, string> = {
      onboard: 'Onboard my business',
      premium: 'Subscribe to Premium',
      report: 'Report something',
      partnership: 'Partnership enquiry',
      support: 'Technical support',
      other: 'Other enquiry',
    }

    await resend.emails.send({
      from: 'TheReviewer.mu <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `[Contact] ${reasonLabels[reason] || reason} — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #1d4ed8;">New contact form submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 100px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0;">${phone || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Reason</td><td style="padding: 8px 0; font-weight: 600;">${reasonLabels[reason] || reason}</td></tr>
          </table>
          ${message ? `
            <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; margin-bottom: 8px;">Message</p>
              <p style="margin: 0; color: #1e293b;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
