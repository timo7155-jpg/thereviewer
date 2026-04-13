import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { emailTemplate, emailButton, emailSignature } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'timo7155@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const { businessName, businessSlug, businessRegion, recipientEmail, score, reviewCount, serviceScore, subject } = await req.json()

    if (!businessName) return NextResponse.json({ error: 'Business name required' }, { status: 400 })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thereviewer.vercel.app'
    const businessUrl = `${siteUrl}/hotels/${businessSlug}`

    const html = emailTemplate(subject || 'Helping Mauritius businesses grow through customer insights', `
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        Dear <strong>${businessName} Management</strong>,
      </p>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        My name is Timothee Lisette, founder of <strong>TheReviewer.mu</strong>. With over 10 years in relationship management and client advisory across the banking and business sectors in Mauritius, I built this platform to solve a problem I saw firsthand — businesses often don't know what their customers truly think, and customers struggle to find honest, local reviews.
      </p>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        <strong>${businessName}</strong> is already featured on our platform, and I wanted to share some insights we've gathered from publicly available reviews:
      </p>

      <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="text-align:center;padding:8px;">
              <div style="font-size:28px;font-weight:800;color:white;">${score}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:2px;">Overall Score</div>
            </td>
            <td style="text-align:center;padding:8px;">
              <div style="font-size:28px;font-weight:800;color:white;">${reviewCount}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:2px;">Reviews Analyzed</div>
            </td>
            <td style="text-align:center;padding:8px;">
              <div style="font-size:28px;font-weight:800;color:white;">${serviceScore}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:2px;">Service Score</div>
            </td>
          </tr>
        </table>
      </div>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        These scores are visible to anyone visiting your page. By claiming your business (free), you take control of how you're represented and can start engaging with your customers directly.
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 6px;font-weight:600;">What you get for free:</p>
      <table style="border-collapse:collapse;margin:0 0 16px;">
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">&#10003;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Claim and verify your business listing</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">&#10003;</td><td style="padding:4px 0;color:#475569;font-size:13px;">View all reviews and ratings about your business</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">&#10003;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Get one free AI-powered improvement tip</td></tr>
      </table>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 6px;font-weight:600;">For businesses serious about reputation management, our Premium plan includes:</p>
      <table style="border-collapse:collapse;margin:0 0 16px;">
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">&#9733;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Reply directly to all customer reviews</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">&#9733;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Full AI analysis with strengths, weaknesses & action items</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">&#9733;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Upload and manage your business photos</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">&#9733;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Receive booking requests directly through your listing</td></tr>
      </table>

      <div style="background:#f8fafc;border:2px solid #2563eb;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Launch offer — limited to first 50 owners</p>
        <p style="margin:0 0 4px;">
          <span style="font-size:16px;color:#94a3b8;text-decoration:line-through;">MUR 3,000</span>
          <span style="font-size:32px;font-weight:800;color:#2563eb;margin-left:8px;">MUR 2,490</span>
          <span style="font-size:14px;color:#64748b;">/month</span>
        </p>
      </div>

      <div style="text-align:center;margin:24px 0 16px;">
        ${emailButton('Claim your business — Free', `${siteUrl}/dashboard/login`)}
      </div>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        Your business page is live at:<br>
        <a href="${businessUrl}" style="color:#2563eb;font-weight:600;text-decoration:none;">${businessUrl.replace('https://', '')}</a>
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        I genuinely believe this can help you better understand your guests and improve your service. I'd welcome the chance to walk you through the platform — no obligation, just a quick conversation.
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0;">
        Warm regards,
      </p>
    `)

    // Send to admin for now (Resend free plan only allows sending to verified emails)
    const to = ADMIN_EMAIL

    await resend.emails.send({
      from: 'TheReviewer.mu <onboarding@resend.dev>',
      to,
      subject: `[Outreach] ${businessName} — ${subject}`,
      html,
    })

    return NextResponse.json({ success: true, to })
  } catch (err) {
    console.error('Outreach error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
