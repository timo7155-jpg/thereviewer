import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { emailTemplate, emailInfoRow, emailTable, emailNote } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'timo7155@gmail.com'

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
      from: 'TheReviewer.mu <contact@thereviewer.mu>',
      to: ADMIN_EMAIL,
      subject: `[Contact] ${reasonLabels[reason] || reason} — ${name}`,
      html: emailTemplate('New contact form submission', `
        ${emailTable(
          emailInfoRow('Name', name) +
          emailInfoRow('Email', `<a href="mailto:${email}" style="color:#2563eb;">${email}</a>`) +
          emailInfoRow('Phone', phone || '—') +
          emailInfoRow('Reason', `<strong>${reasonLabels[reason] || reason}</strong>`)
        )}
        ${message ? emailNote(`<strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}`) : ''}
      `)
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
