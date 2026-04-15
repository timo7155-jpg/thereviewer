import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { emailTemplate, emailInfoRow, emailTable, emailNote } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'timo7155@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const { ownerName, email, phone, businessName, category, region, website, message } = await req.json()

    if (!ownerName?.trim() || !email?.trim() || !businessName?.trim()) {
      return NextResponse.json({ error: 'Your name, email, and business name are required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // 1) Email admin
    await resend.emails.send({
      from: 'TheReviewer.mu <contact@thereviewer.mu>',
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `[New Business Request] ${businessName} — ${ownerName}`,
      html: emailTemplate(`New business listing request`, `
        <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
          A new business owner wants to add their business to TheReviewer.mu.
        </p>
        ${emailTable(
          emailInfoRow('Owner name', ownerName) +
          emailInfoRow('Email', `<a href="mailto:${email}" style="color:#2563eb;">${email}</a>`) +
          emailInfoRow('Phone', phone || '—') +
          emailInfoRow('Business', `<strong>${businessName}</strong>`) +
          emailInfoRow('Category', category || '—') +
          emailInfoRow('Region', region || '—') +
          emailInfoRow('Website', website ? `<a href="${website}" style="color:#2563eb;">${website}</a>` : '—')
        )}
        ${message ? emailNote(`<strong>Notes from owner:</strong><br>${message.replace(/\n/g, '<br>')}`) : ''}
        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:16px 0 0;">
          Next step: contact the owner directly, then add the business via the admin panel (Google Places API search or manual entry).
        </p>
      `)
    })

    // 2) Confirmation to the owner
    const firstName = ownerName.trim().split(' ')[0]
    await resend.emails.send({
      from: 'TheReviewer.mu <contact@thereviewer.mu>',
      to: email,
      replyTo: ADMIN_EMAIL,
      subject: `We've received your request to add ${businessName}`,
      html: emailTemplate(`Thanks, ${firstName} — we're on it`, `
        <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
          Hi ${firstName.replace(/[<>]/g, '')},
        </p>
        <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
          Thank you for requesting to add <strong>${businessName}</strong> to TheReviewer.mu. Your request has been received.
        </p>
        <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
          <strong>What happens next:</strong>
        </p>
        <table style="border-collapse:collapse;margin:0 0 16px;">
          <tr><td style="padding:4px 10px 4px 0;color:#10b981;font-weight:700;">1.</td><td style="color:#475569;font-size:13px;padding:4px 0;">I'll personally review your submission within 24 hours.</td></tr>
          <tr><td style="padding:4px 10px 4px 0;color:#10b981;font-weight:700;">2.</td><td style="color:#475569;font-size:13px;padding:4px 0;">I'll contact you to confirm details and verify your ownership.</td></tr>
          <tr><td style="padding:4px 10px 4px 0;color:#10b981;font-weight:700;">3.</td><td style="color:#475569;font-size:13px;padding:4px 0;">Once verified, your listing goes live — free — and you can start managing reviews.</td></tr>
        </table>
        <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
          If you need to reach me sooner, reply to this email or call <a href="tel:+23058137384" style="color:#2563eb;text-decoration:none;">+230 5813 7384</a>.
        </p>
        <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 4px;">Warm regards,</p>
        <p style="color:#0f172a;font-size:14px;font-weight:600;margin:0;">Timothée Lisette</p>
        <p style="color:#64748b;font-size:12.5px;margin:0;">Founder, TheReviewer.mu</p>
      `)
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Business request error:', err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
