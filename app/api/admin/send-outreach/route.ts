import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { emailTemplate, emailButton } from '@/lib/email'
import Anthropic from '@anthropic-ai/sdk'

const resend = new Resend(process.env.RESEND_API_KEY)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'timo7155@gmail.com'
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://thereviewer.mu'

type Segment = 'high' | 'mid' | 'low' | 'unknown'

function segmentFromScore(score: number | null): Segment {
  if (!score) return 'unknown'
  if (score >= 4.5) return 'high'
  if (score >= 3.5) return 'mid'
  return 'low'
}

function segmentHeadline(seg: Segment, businessName: string): string {
  switch (seg) {
    case 'high': return `${businessName} — your reputation deserves protecting`
    case 'mid':  return `${businessName} — small changes, measurable growth`
    case 'low':  return `${businessName} — let's turn the conversation around`
    default:     return `${businessName} — take control of your online reputation`
  }
}

async function generateIntro(businessName: string, analysis: any, segment: Segment): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return ''
  try {
    const ctx = analysis
      ? `Overall score: ${analysis.overall_score}/5 from ${analysis.source_review_count} public reviews.
Strengths reviewers mention: ${(analysis.strengths || []).slice(0, 3).join('; ') || 'n/a'}
Areas to improve: ${(analysis.improvements || []).slice(0, 2).join('; ') || 'n/a'}`
      : 'No analysis available — keep the intro general but warm.'

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 220,
      messages: [{
        role: 'user',
        content: `Write a SHORT 2-sentence personalized opening for a business outreach email to "${businessName}" in Mauritius.

Context:
${ctx}
Segment: ${segment} (high = 4.5+, mid = 3.5-4.4, low = <3.5)

Tone: warm, peer-to-peer, professional. Show you've LOOKED at their specific business — mention one concrete observation from the strengths or improvements (paraphrase, do NOT quote). Do NOT start with "I hope this email finds you well" or generic greetings.

Return ONLY the two sentences — no preamble, no salutation, no line breaks.`
      }]
    })
    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    return text.trim().replace(/\n+/g, ' ')
  } catch (e) {
    console.error('Intro gen failed:', e)
    return ''
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessName, businessSlug, businessId, businessIds, recipientEmail, subject } = await req.json()

    if (!businessName) return NextResponse.json({ error: 'Business name required' }, { status: 400 })
    if (!recipientEmail) return NextResponse.json({ error: 'Recipient email required' }, { status: 400 })

    // Load analysis (if we have a businessId) to personalize
    let analysis: any = null
    if (businessId) {
      const { data } = await supabaseAdmin
        .from('business_analysis')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle()
      analysis = data
    }

    const score = analysis?.overall_score?.toFixed(1) || 'N/A'
    const serviceScore = analysis?.service_score?.toFixed(1) || 'N/A'
    const reviewCount = analysis?.source_review_count?.toString() || '0'
    const teaser = analysis?.teaser_insight
      ? String(analysis.teaser_insight).split('|||')[0].trim()
      : null

    const segment = segmentFromScore(analysis?.overall_score || null)
    const personalizedIntro = await generateIntro(businessName, analysis, segment)

    // Tracking token for opens/clicks
    const token = randomBytes(16).toString('hex')
    const trackPixelUrl = `${SITE}/api/outreach/track?t=${token}&type=open`
    const claimUrl = `${SITE}/api/outreach/track?t=${token}&type=click&r=${encodeURIComponent(`${SITE}/dashboard/login`)}`
    const businessUrl = `${SITE}/hotels/${businessSlug}`

    const subjectLine = subject || segmentHeadline(segment, businessName)

    const segmentBadge = segment === 'high'
      ? '<span style="background:#dcfce7;color:#166534;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px;">Top-Rated</span>'
      : segment === 'mid'
      ? '<span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px;">Opportunity to Grow</span>'
      : segment === 'low'
      ? '<span style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px;">Recovery Ready</span>'
      : ''

    const html = emailTemplate(subjectLine, `
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        Dear <strong>${businessName} Management</strong>,
      </p>

      ${personalizedIntro ? `
      <p style="color:#1e293b;font-size:14px;line-height:1.7;margin:0 0 14px;font-style:italic;border-left:3px solid #2563eb;padding-left:14px;">
        ${personalizedIntro.replace(/[<>]/g, '')}
      </p>` : ''}

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        My name is Timothée Lisette, founder of <strong>TheReviewer.mu</strong> — Mauritius' local platform for verified reviews and AI-powered business insights.
      </p>

      ${analysis ? `
      <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
        <div style="margin-bottom:10px;">${segmentBadge}</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="text-align:center;padding:8px;">
              <div style="font-size:28px;font-weight:800;color:white;">${score}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.75);margin-top:2px;">Overall</div>
            </td>
            <td style="text-align:center;padding:8px;">
              <div style="font-size:28px;font-weight:800;color:white;">${reviewCount}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.75);margin-top:2px;">Reviews analysed</div>
            </td>
            <td style="text-align:center;padding:8px;">
              <div style="font-size:28px;font-weight:800;color:white;">${serviceScore}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.75);margin-top:2px;">Service</div>
            </td>
          </tr>
        </table>
      </div>` : ''}

      ${teaser ? `
      <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:14px 18px;margin:16px 0;">
        <p style="font-size:11px;color:#6d28d9;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px;">🎁 Free AI insight for you</p>
        <p style="font-size:14px;color:#4c1d95;line-height:1.6;margin:0;">${teaser.replace(/[<>]/g, '')}</p>
      </div>` : ''}

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 6px;font-weight:600;">Free account includes:</p>
      <table style="border-collapse:collapse;margin:0 0 16px;">
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">&#10003;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Claim and verify your listing</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">&#10003;</td><td style="padding:4px 0;color:#475569;font-size:13px;">View every review about your business</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">&#10003;</td><td style="padding:4px 0;color:#475569;font-size:13px;">One free monthly AI improvement tip</td></tr>
      </table>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 6px;font-weight:600;">Premium (MUR 2,490/mo) adds:</p>
      <table style="border-collapse:collapse;margin:0 0 16px;">
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">&#9733;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Reply publicly to every customer review</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">&#9733;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Full monthly AI analysis with 3 tailored actions</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">&#9733;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Upload and manage photos</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">&#9733;</td><td style="padding:4px 0;color:#475569;font-size:13px;">Receive booking requests through your listing</td></tr>
      </table>

      <div style="background:#f8fafc;border:2px solid #2563eb;border-radius:12px;padding:18px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Launch offer — first 50 owners</p>
        <p style="margin:0;">
          <span style="font-size:15px;color:#94a3b8;text-decoration:line-through;">MUR 3,000</span>
          <span style="font-size:30px;font-weight:800;color:#2563eb;margin-left:8px;">MUR 2,490</span>
          <span style="font-size:13px;color:#64748b;">/month</span>
        </p>
      </div>

      <div style="text-align:center;margin:24px 0 16px;">
        ${emailButton('Claim your business — Free', claimUrl)}
      </div>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        Your live business page:<br>
        <a href="${businessUrl}" style="color:#2563eb;font-weight:600;text-decoration:none;">${businessUrl.replace('https://', '')}</a>
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        I'd welcome a short conversation — no obligation.
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0;">Warm regards,</p>

      <!-- tracking pixel -->
      <img src="${trackPixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />
    `)

    // Send email
    let resendId: string | null = null
    let sendError: string | null = null
    try {
      const result = await resend.emails.send({
        from: 'TheReviewer.mu <contact@thereviewer.mu>',
        to: recipientEmail,
        bcc: [ADMIN_EMAIL],
        replyTo: ADMIN_EMAIL,
        subject: subjectLine,
        html,
      })
      resendId = (result as any).data?.id || null
    } catch (e: any) {
      sendError = e?.message || 'send failed'
    }

    // Log the outreach (best-effort; won't block send)
    try {
      await supabaseAdmin.from('outreach_logs').insert({
        token,
        business_id: businessId || null,
        business_ids: businessIds || null,
        recipient_email: recipientEmail,
        subject: subjectLine,
        segment,
        personalized_intro: personalizedIntro || null,
        resend_id: resendId,
        error: sendError,
      })
    } catch (e) {
      console.error('Outreach log insert failed (table may not exist yet):', e)
    }

    if (sendError) return NextResponse.json({ error: sendError }, { status: 500 })

    return NextResponse.json({ success: true, to: recipientEmail, segment, token })
  } catch (err: any) {
    console.error('Outreach error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to send' }, { status: 500 })
  }
}
