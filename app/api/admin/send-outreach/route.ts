import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { emailTemplate } from '@/lib/email'

// Wider wrapper for outreach emails (640px), no duplicate signature
function outreachWrapper(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="max-width:640px;margin:0 auto;padding:20px 16px;">
    <div style="text-align:center;padding:20px 0 14px;">
      <div style="display:inline-block;background:#2563eb;color:white;font-weight:bold;font-size:20px;width:44px;height:44px;line-height:44px;border-radius:12px;text-align:center;">R</div>
      <p style="margin:8px 0 0;font-size:19px;font-weight:800;color:#0f172a;">TheReviewer<span style="color:#2563eb;">.mu</span></p>
      <p style="margin:3px 0 0;font-size:11px;color:#64748b;letter-spacing:0.5px;text-transform:uppercase;font-weight:600;">Business Insight Report</p>
    </div>
    <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
      <div style="height:5px;background:linear-gradient(90deg,#06b6d4,#2563eb,#7c3aed);"></div>
      <div style="padding:28px 28px 26px;">
        <h2 style="margin:0 0 18px;color:#0f172a;font-size:22px;line-height:1.3;">${title}</h2>
        ${body}
      </div>
    </div>
    <div style="text-align:center;padding:20px 0 8px;color:#94a3b8;font-size:11px;line-height:1.6;">
      <p style="margin:0;">&copy; 2026 TheReviewer.mu — Based in Mauritius</p>
      <p style="margin:4px 0 0;">
        <a href="https://thereviewer.mu" style="color:#2563eb;text-decoration:none;font-weight:600;">thereviewer.mu</a>
        &nbsp;·&nbsp;
        <a href="mailto:contact@thereviewer.mu" style="color:#2563eb;text-decoration:none;">contact@thereviewer.mu</a>
      </p>
    </div>
  </div>
</body>
</html>`
}
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

function segmentSubject(seg: Segment, businessName: string): string {
  switch (seg) {
    case 'high': return `${businessName} — what your customers are saying`
    case 'mid':  return `${businessName} — insights from your recent public reviews`
    case 'low':  return `${businessName} — customer feedback analysis`
    default:     return `${businessName} — your online reputation summary`
  }
}

// Pick an icon + colour based on text content (emoji icons work reliably in all mail clients)
function iconForText(text: string): { icon: string; color: string } {
  const t = text.toLowerCase()
  if (/(service|staff|team|hospital|welcom|warm|friendly|polite|courteous)/.test(t))
    return { icon: '👥', color: '#2563eb' }
  if (/(clean|tidy|spotless|hygien|well.maintained)/.test(t))
    return { icon: '✨', color: '#059669' }
  if (/(food|cuisine|restaurant|breakfast|dinner|meal|dining|chef|menu)/.test(t))
    return { icon: '🍽️', color: '#d97706' }
  if (/(location|beach|view|position|scenic|surrounding|sea|pool)/.test(t))
    return { icon: '📍', color: '#7c3aed' }
  if (/(value|price|cost|expensive|cheap|affordable|money)/.test(t))
    return { icon: '💰', color: '#0891b2' }
  if (/(room|bed|accommoda|sleep|facil|amenity|amenit|villa|suite)/.test(t))
    return { icon: '🏠', color: '#4f46e5' }
  if (/(wifi|internet|tech|slow|connect|booking|reservation)/.test(t))
    return { icon: '📶', color: '#0284c7' }
  if (/(check.?in|check.?out|arriv|wait|queue|delay)/.test(t))
    return { icon: '⏱️', color: '#ea580c' }
  if (/(noise|quiet|loud|music)/.test(t))
    return { icon: '🔊', color: '#b45309' }
  return { icon: '•', color: '#64748b' }
}

async function generateIntro(businessName: string, analysis: any, segment: Segment): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) return ''
  try {
    const ctx = analysis
      ? `Overall score: ${analysis.overall_score}/5 from ${analysis.source_review_count} public reviews.
Strengths reviewers mention: ${(analysis.strengths || []).slice(0, 3).join('; ') || 'n/a'}
Areas to improve: ${(analysis.improvements || []).slice(0, 2).join('; ') || 'n/a'}`
      : 'No analysis available.'

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 220,
      messages: [{
        role: 'user',
        content: `Write a SHORT 2-sentence opening for an INFORMATIVE business report email to "${businessName}" in Mauritius. This is NOT a sales email — it's a neutral summary from a local review analytics platform.

Context:
${ctx}
Segment: ${segment}

Tone: professional analyst, not salesperson. State one factual observation from their data. Avoid hype, urgency, or "click here" language. Do not greet ("Hello", "I hope this finds you well") — go straight to the observation.

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

// Render a horizontal bar for a category score (CSS only — works everywhere)
function scoreBar(label: string, score: number | null, color: string): string {
  if (score == null) return ''
  const pct = Math.round((score / 5) * 100)
  return `
    <tr>
      <td style="padding:8px 14px 8px 0;vertical-align:middle;width:110px;color:#475569;font-size:13px;font-weight:500;">${label}</td>
      <td style="padding:8px 0;vertical-align:middle;">
        <div style="background:#f1f5f9;border-radius:999px;height:10px;width:100%;position:relative;overflow:hidden;">
          <div style="background:${color};height:10px;width:${pct}%;border-radius:999px;"></div>
        </div>
      </td>
      <td style="padding:8px 0 8px 12px;vertical-align:middle;width:48px;color:#0f172a;font-size:14px;font-weight:700;text-align:right;">${score.toFixed(1)}</td>
    </tr>`
}

export async function POST(req: NextRequest) {
  try {
    const { businessName, businessSlug, businessId, businessIds, recipientEmail, subject } = await req.json()

    if (!businessName) return NextResponse.json({ error: 'Business name required' }, { status: 400 })
    if (!recipientEmail) return NextResponse.json({ error: 'Recipient email required' }, { status: 400 })

    // Load analysis for personalization
    let analysis: any = null
    if (businessId) {
      const { data } = await supabaseAdmin
        .from('business_analysis')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle()
      analysis = data
    }

    const overallScore: number | null = analysis?.overall_score ?? null
    const reviewCount: number = analysis?.source_review_count ?? 0
    const strengths: string[] = (analysis?.strengths || []).slice(0, 3)
    const improvements: string[] = (analysis?.improvements || []).slice(0, 3)
    const segment = segmentFromScore(overallScore)
    const personalizedIntro = await generateIntro(businessName, analysis, segment)

    // Tracking token
    const token = randomBytes(16).toString('hex')
    const trackPixelUrl = `${SITE}/api/outreach/track?t=${token}&type=open`
    const businessUrl = `${SITE}/hotels/${businessSlug}`
    const dashboardUrl = `${SITE}/api/outreach/track?t=${token}&type=click&r=${encodeURIComponent(`${SITE}/dashboard/login`)}`
    const pageUrl = `${SITE}/api/outreach/track?t=${token}&type=click&r=${encodeURIComponent(businessUrl)}`

    const subjectLine = subject || segmentSubject(segment, businessName)

    const segmentBadge =
      segment === 'high' ? { label: 'Strong Reputation', bg: '#dcfce7', fg: '#166534' } :
      segment === 'mid'  ? { label: 'Room to Grow',     bg: '#fef3c7', fg: '#92400e' } :
      segment === 'low'  ? { label: 'Recovery Opportunity', bg: '#fee2e2', fg: '#991b1b' } :
                           { label: 'Your Business',    bg: '#e2e8f0', fg: '#334155' }

    // Score breakdown bars (ordered by score desc for visual impact)
    const bars = [
      { label: 'Service',     score: analysis?.service_score ?? null,     color: '#2563eb' },
      { label: 'Cleanliness', score: analysis?.cleanliness_score ?? null, color: '#10b981' },
      { label: 'Location',    score: analysis?.location_score ?? null,    color: '#7c3aed' },
      { label: 'Food',        score: analysis?.food_score ?? null,        color: '#f59e0b' },
      { label: 'Value',       score: analysis?.value_score ?? null,       color: '#06b6d4' },
    ].filter(b => b.score != null).sort((a, b) => (b.score! - a.score!))

    // Strengths and improvements HTML
    const strengthsHtml = strengths.length === 0 ? '' : strengths.map(s => {
      const { icon, color } = iconForText(s)
      return `
        <tr>
          <td style="vertical-align:top;padding:10px 12px 10px 0;width:40px;">
            <div style="width:32px;height:32px;background:${color}15;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">${icon}</div>
          </td>
          <td style="vertical-align:top;padding:10px 0;color:#065f46;font-size:13px;line-height:1.55;">${s.replace(/[<>]/g, '')}</td>
        </tr>`
    }).join('')

    const improvementsHtml = improvements.length === 0 ? '' : improvements.map(s => {
      const { icon, color } = iconForText(s)
      return `
        <tr>
          <td style="vertical-align:top;padding:10px 12px 10px 0;width:40px;">
            <div style="width:32px;height:32px;background:${color}15;border-radius:8px;text-align:center;line-height:32px;font-size:16px;">${icon}</div>
          </td>
          <td style="vertical-align:top;padding:10px 0;color:#7c2d12;font-size:13px;line-height:1.55;">${s.replace(/[<>]/g, '')}</td>
        </tr>`
    }).join('')

    const html = outreachWrapper(subjectLine, `
      <!-- Opening -->
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 12px;">
        Dear <strong>${businessName} team</strong>,
      </p>

      ${personalizedIntro ? `
      <p style="color:#1e293b;font-size:14.5px;line-height:1.75;margin:0 0 18px;font-style:italic;border-left:3px solid #2563eb;padding-left:14px;">
        ${personalizedIntro.replace(/[<>]/g, '')}
      </p>` : ''}

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 22px;">
        This is a short, no-obligation summary we've prepared for <strong>${businessName}</strong> based on publicly available reviews. Nothing here is promotional — it's the same analysis your listing already shows on <a href="${pageUrl}" style="color:#2563eb;text-decoration:none;font-weight:600;">TheReviewer.mu</a>.
      </p>

      ${overallScore !== null ? `
      <!-- Score overview card -->
      <div style="background:linear-gradient(135deg,#1e3a8a,#6366f1,#7c3aed);border-radius:14px;padding:24px;margin:0 0 20px;">
        <table width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="color:rgba(255,255,255,0.8);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;padding-bottom:6px;">
              <span style="background:${segmentBadge.bg};color:${segmentBadge.fg};padding:3px 10px;border-radius:999px;font-size:10px;">${segmentBadge.label}</span>
            </td>
            <td style="text-align:right;color:rgba(255,255,255,0.7);font-size:11px;padding-bottom:6px;">Based on ${reviewCount.toLocaleString()} public reviews</td>
          </tr>
        </table>
        <div style="color:white;font-size:52px;font-weight:800;line-height:1;margin:8px 0 4px;">${overallScore.toFixed(1)}<span style="font-size:20px;color:rgba(255,255,255,0.6);font-weight:500;"> / 5</span></div>
        <div style="color:rgba(255,255,255,0.85);font-size:13px;">${businessName} — overall customer rating</div>
      </div>` : ''}

      ${bars.length > 0 ? `
      <!-- Bar chart -->
      <div style="background:white;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin:0 0 20px;">
        <p style="color:#0f172a;font-size:14px;font-weight:700;margin:0 0 4px;">Score breakdown by category</p>
        <p style="color:#64748b;font-size:12px;margin:0 0 14px;">How your customers rate you across key dimensions</p>
        <table width="100%" style="border-collapse:collapse;">
          ${bars.map(b => scoreBar(b.label, b.score, b.color)).join('')}
        </table>
      </div>` : ''}

      ${strengthsHtml ? `
      <!-- Top 3 strengths -->
      <div style="background:linear-gradient(135deg,#ecfdf5,#f0fdf4);border:1px solid #bbf7d0;border-radius:14px;padding:20px;margin:0 0 16px;">
        <p style="color:#065f46;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 2px;">✓ What your customers love</p>
        <p style="color:#047857;font-size:13px;margin:0 0 12px;">Top 3 strengths identified from the ${reviewCount.toLocaleString()} reviews analysed</p>
        <table width="100%" style="border-collapse:collapse;">
          ${strengthsHtml}
        </table>
      </div>` : ''}

      ${improvementsHtml ? `
      <!-- Top 3 improvement areas -->
      <div style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #fde68a;border-radius:14px;padding:20px;margin:0 0 22px;">
        <p style="color:#92400e;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 2px;">⚠ Areas where feedback is more critical</p>
        <p style="color:#b45309;font-size:13px;margin:0 0 12px;">Top 3 concerns raised across the ${reviewCount.toLocaleString()} reviews — candid, actionable signals</p>
        <table width="100%" style="border-collapse:collapse;">
          ${improvementsHtml}
        </table>
      </div>` : ''}

      <!-- What TheReviewer.mu does -->
      <div style="border-top:1px solid #e2e8f0;padding-top:24px;margin-top:8px;">
        <p style="color:#0f172a;font-size:16px;font-weight:700;margin:0 0 4px;">What TheReviewer.mu is</p>
        <p style="color:#64748b;font-size:13px;margin:0 0 14px;">A local-first review and reputation platform built for Mauritius.</p>

        <table width="100%" style="border-collapse:collapse;margin:0 0 20px;">
          <tr>
            <td style="vertical-align:top;padding:0 8px 0 0;width:33%;">
              <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center;height:100%;">
                <div style="font-size:26px;margin-bottom:6px;">🛡️</div>
                <div style="color:#0f172a;font-weight:700;font-size:13px;margin-bottom:4px;">Verified Reviews</div>
                <div style="color:#64748b;font-size:11.5px;line-height:1.5;">Every review is email-verified — no fakes, no paid endorsements.</div>
              </div>
            </td>
            <td style="vertical-align:top;padding:0 4px;width:33%;">
              <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center;height:100%;">
                <div style="font-size:26px;margin-bottom:6px;">📊</div>
                <div style="color:#0f172a;font-weight:700;font-size:13px;margin-bottom:4px;">AI Analysis</div>
                <div style="color:#64748b;font-size:11.5px;line-height:1.5;">Monthly sentiment, strengths and action items — like the report above.</div>
              </div>
            </td>
            <td style="vertical-align:top;padding:0 0 0 8px;width:33%;">
              <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center;height:100%;">
                <div style="font-size:26px;margin-bottom:6px;">🇲🇺</div>
                <div style="color:#0f172a;font-weight:700;font-size:13px;margin-bottom:4px;">Built in Mauritius</div>
                <div style="color:#64748b;font-size:11.5px;line-height:1.5;">Bilingual EN/FR, all sectors — hotels, restaurants, retail, tours.</div>
              </div>
            </td>
          </tr>
        </table>

        <!-- Why it matters -->
        <p style="color:#0f172a;font-size:16px;font-weight:700;margin:20px 0 10px;">Why this matters to ${businessName}</p>
        <table width="100%" style="border-collapse:collapse;margin:0 0 20px;">
          <tr>
            <td style="vertical-align:top;padding:8px 10px 8px 0;width:28px;"><span style="color:#10b981;font-size:16px;">✓</span></td>
            <td style="color:#334155;font-size:13px;line-height:1.6;padding:8px 0;"><strong>Your listing is already live</strong> — customers can find and review you today, whether or not you claim it.</td>
          </tr>
          <tr>
            <td style="vertical-align:top;padding:8px 10px 8px 0;width:28px;"><span style="color:#10b981;font-size:16px;">✓</span></td>
            <td style="color:#334155;font-size:13px;line-height:1.6;padding:8px 0;"><strong>Claiming is free</strong> — you see every review, get a monthly AI tip, and keep your page accurate.</td>
          </tr>
          <tr>
            <td style="vertical-align:top;padding:8px 10px 8px 0;width:28px;"><span style="color:#10b981;font-size:16px;">✓</span></td>
            <td style="color:#334155;font-size:13px;line-height:1.6;padding:8px 0;"><strong>Premium is optional</strong> — reply publicly to reviews, full monthly analysis, photo management and direct booking.</td>
          </tr>
          <tr>
            <td style="vertical-align:top;padding:8px 10px 8px 0;width:28px;"><span style="color:#10b981;font-size:16px;">✓</span></td>
            <td style="color:#334155;font-size:13px;line-height:1.6;padding:8px 0;"><strong>No lock-in</strong> — Premium is month-to-month, cancel anytime, launch price MUR 1,990/month.</td>
          </tr>
        </table>

        <!-- Gentle CTAs -->
        <div style="background:#f8fafc;border-radius:12px;padding:18px;margin:16px 0 20px;text-align:center;">
          <p style="color:#0f172a;font-size:13px;font-weight:600;margin:0 0 10px;">If you'd like to explore:</p>
          <table style="margin:0 auto;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 6px;">
                <a href="${pageUrl}" style="display:inline-block;background:white;color:#0f172a;border:1px solid #cbd5e1;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:600;font-size:13px;">View your listing</a>
              </td>
              <td style="padding:4px 6px;">
                <a href="${dashboardUrl}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:600;font-size:13px;">Claim ${businessName} — free</a>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Sign-off -->
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:20px 0 12px;">
        If there's anything inaccurate in the summary above, or you'd like me to walk you through the dashboard in 10 minutes, just reply to this email.
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 10px;">Warm regards,</p>

      <!-- Signature with photo -->
      <table style="border-collapse:collapse;margin:0 0 18px;">
        <tr>
          <td style="vertical-align:top;padding:0 14px 0 0;">
            <img src="${SITE}/founder.jpg" alt="Timothée Lisette"
              width="60" height="60"
              style="display:block;width:60px;height:60px;border-radius:50%;border:2px solid #e0e7ff;object-fit:cover;" />
          </td>
          <td style="vertical-align:middle;">
            <p style="color:#0f172a;font-size:15px;line-height:1.4;margin:0;font-weight:700;">Timothée Lisette</p>
            <p style="color:#2563eb;font-size:12px;line-height:1.5;margin:2px 0 6px;font-weight:600;">Founder, TheReviewer.mu</p>
            <p style="color:#64748b;font-size:12px;line-height:1.6;margin:0;">
              📞 <a href="tel:+23058137384" style="color:#475569;text-decoration:none;">+230 5813 7384</a>
              &nbsp;·&nbsp;
              ✉️ <a href="mailto:contact@thereviewer.mu" style="color:#2563eb;text-decoration:none;">contact@thereviewer.mu</a>
            </p>
            <p style="color:#94a3b8;font-size:11.5px;line-height:1.5;margin:2px 0 0;">
              <a href="${SITE}" style="color:#2563eb;text-decoration:none;font-weight:600;">thereviewer.mu</a> · Based in Mauritius
            </p>
          </td>
        </tr>
      </table>

      <p style="color:#94a3b8;font-size:11px;line-height:1.5;margin:20px 0 0;border-top:1px solid #e2e8f0;padding-top:14px;">
        This is a one-off introduction. If you'd prefer not to hear from us again, simply reply with "unsubscribe" and we won't contact ${businessName} again.
      </p>

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
        replyTo: ADMIN_EMAIL,
        subject: subjectLine,
        html,
      })
      resendId = (result as any).data?.id || null
    } catch (e: any) {
      sendError = e?.message || 'send failed'
    }

    // Log
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
      console.error('Outreach log insert failed:', e)
    }

    if (sendError) return NextResponse.json({ error: sendError }, { status: 500 })
    return NextResponse.json({ success: true, to: recipientEmail, segment, token })
  } catch (err: any) {
    console.error('Outreach error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to send' }, { status: 500 })
  }
}
