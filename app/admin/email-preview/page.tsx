'use client'

import { useState } from 'react'
import AdminShell from '../AdminShell'
import { emailTemplate, emailButton, emailInfoRow, emailTable, emailNote } from '@/lib/email'

const sampleEmails = {
  business_outreach: {
    label: '🎯 Business Outreach',
    html: emailTemplate('Helping Mauritius businesses grow through customer insights', `
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        Dear <strong>General Manager</strong>,
      </p>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        My name is Timothée Lisette, founder of <strong>TheReviewer.mu</strong>. With over 10 years in relationship management and client advisory across the banking and business sectors in Mauritius, I built this platform to solve a problem I saw firsthand — businesses often don't know what their customers truly think, and customers struggle to find honest, local reviews.
      </p>
      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        <strong>Royal Palm Beachcomber</strong> is already featured on our platform, and I wanted to share some insights we've gathered from publicly available reviews:
      </p>

      <!-- Stats highlight -->
      <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="text-align:center;padding:8px;">
              <div style="font-size:28px;font-weight:800;color:white;">4.6</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:2px;">Overall Score</div>
            </td>
            <td style="text-align:center;padding:8px;">
              <div style="font-size:28px;font-weight:800;color:white;">5,270</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:2px;">Reviews Analyzed</div>
            </td>
            <td style="text-align:center;padding:8px;">
              <div style="font-size:28px;font-weight:800;color:white;">4.8</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:2px;">Service Score</div>
            </td>
          </tr>
        </table>
      </div>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        These scores are visible to anyone visiting your page. By claiming your business (free), you take control of how you're represented and can start engaging with your customers directly.
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 6px;font-weight:600;">
        What you get for free:
      </p>
      <table style="border-collapse:collapse;margin:0 0 16px;">
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">✓</td><td style="padding:4px 0;color:#475569;font-size:13px;">Claim and verify your business listing</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">✓</td><td style="padding:4px 0;color:#475569;font-size:13px;">View all reviews and ratings about your business</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">✓</td><td style="padding:4px 0;color:#475569;font-size:13px;">Get one free AI-powered improvement tip</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#10b981;font-size:16px;">✓</td><td style="padding:4px 0;color:#475569;font-size:13px;">Access your basic owner dashboard</td></tr>
      </table>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 6px;font-weight:600;">
        For businesses serious about reputation management, our Premium plan includes:
      </p>
      <table style="border-collapse:collapse;margin:0 0 16px;">
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">★</td><td style="padding:4px 0;color:#475569;font-size:13px;">Reply directly to all customer reviews</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">★</td><td style="padding:4px 0;color:#475569;font-size:13px;">Full AI analysis with strengths, weaknesses & action items</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">★</td><td style="padding:4px 0;color:#475569;font-size:13px;">Upload and manage your business photos</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">★</td><td style="padding:4px 0;color:#475569;font-size:13px;">Access reviewer contact details (site reviews)</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">★</td><td style="padding:4px 0;color:#475569;font-size:13px;">Competitive benchmarking & service quality tracking</td></tr>
        <tr><td style="padding:4px 8px 4px 0;color:#2563eb;font-size:16px;">★</td><td style="padding:4px 0;color:#475569;font-size:13px;">Receive booking requests directly through your listing</td></tr>
      </table>

      <!-- Promo pricing -->
      <div style="background:#f8fafc;border:2px solid #2563eb;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Launch offer — limited to first 50 owners</p>
        <p style="margin:0 0 4px;">
          <span style="font-size:16px;color:#94a3b8;text-decoration:line-through;">MUR 3,000</span>
          <span style="font-size:32px;font-weight:800;color:#2563eb;margin-left:8px;">MUR 2,490</span>
          <span style="font-size:14px;color:#64748b;">/month</span>
        </p>
        <p style="margin:4px 0 0;font-size:12px;color:#ef4444;font-weight:700;">⚡ Almost fully booked — secure your spot now</p>
      </div>

      <div style="text-align:center;margin:24px 0 16px;">
        ${emailButton('Claim your business — Free', 'https://thereviewer.vercel.app/dashboard/login')}
      </div>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        Your business page is live at:<br>
        <a href="https://thereviewer.vercel.app/hotels/royal-palm-beachcomber" style="color:#2563eb;font-weight:600;text-decoration:none;">thereviewer.mu/hotels/royal-palm-beachcomber</a>
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        I genuinely believe this can help you better understand your guests and improve your service. I'd welcome the chance to walk you through the platform — no obligation, just a quick conversation.
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 14px;">
        Feel free to reply to this email, call me on <strong>+230 5813 7384</strong>, or simply click the button above to get started on your own.
      </p>

      <p style="color:#475569;font-size:14px;line-height:1.7;margin:0;">
        Warm regards,
      </p>
    `)
  },
  review_verification: {
    label: 'Review Verification',
    html: emailTemplate('Thank you for your review!', `
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 12px;">
        Hi <strong>Jean-Pierre</strong>, you reviewed <strong>Beachcomber Trou aux Biches Resort</strong> and gave it <strong>5/5 stars</strong>.
      </p>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 16px;">
        Please click the button below to confirm and publish your review:
      </p>
      <div style="text-align:center;">
        ${emailButton('Confirm my review', '#')}
      </div>
      ${emailNote('If you did not submit this review, you can safely ignore this email.')}
    `)
  },
  claim_approved: {
    label: 'Claim Approved',
    html: emailTemplate('Your claim has been approved!', `
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 12px;">
        Hi <strong>Marie Dupont</strong>,
      </p>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 16px;">
        Your ownership claim for <strong>Paradise Cove Boutique Hotel</strong> has been verified and approved. You can now log in to manage your reviews and reputation.
      </p>
      <div style="text-align:center;">
        ${emailButton('Go to my dashboard', '#')}
      </div>
    `)
  },
  booking_request: {
    label: 'Booking Request',
    html: emailTemplate('New Hotel Booking', `
      <p style="color:#475569;font-size:14px;margin:0 0 16px;">For <strong>Royal Palm Beachcomber</strong></p>
      ${emailTable(
        emailInfoRow('Name', 'Alexandre Martin') +
        emailInfoRow('Email', '<a href="#" style="color:#2563eb;">alexandre@email.com</a>') +
        emailInfoRow('Phone', '+230 5712 3456') +
        emailInfoRow('Check-in', '2026-05-15') +
        emailInfoRow('Check-out', '2026-05-22') +
        emailInfoRow('Guests', '2 adults, 1 child')
      )}
      ${emailNote('<strong>Notes:</strong> Anniversary trip. Would love a sea-view room if available.')}
      ${emailNote('Please forward this to the business owner or contact them directly.')}
    `)
  },
  contact_form: {
    label: 'Contact Form',
    html: emailTemplate('New contact form submission', `
      ${emailTable(
        emailInfoRow('Name', 'Sophie Laurent') +
        emailInfoRow('Email', '<a href="#" style="color:#2563eb;">sophie@business.mu</a>') +
        emailInfoRow('Phone', '+230 5834 5678') +
        emailInfoRow('Reason', '<strong>Onboard my business</strong>')
      )}
      ${emailNote('<strong>Message:</strong><br>I own a boutique spa in Grand Baie and would like to list my business on TheReviewer.mu. Please contact me to discuss the Premium plan.')}
    `)
  },
  premium_request: {
    label: 'Premium Subscription Request',
    html: emailTemplate('New Premium subscription request', `
      <p style="color:#475569;font-size:14px;margin:0 0 16px;">A business owner wants to upgrade to Premium.</p>
      ${emailTable(
        emailInfoRow('Owner', 'Patrick Ng') +
        emailInfoRow('Email', '<a href="#" style="color:#2563eb;">patrick@hotel.mu</a>') +
        emailInfoRow('Phone', '+230 5929 1234') +
        emailInfoRow('Business', '<strong>Le Chamarel Restaurant</strong>')
      )}
      ${emailNote('Contact the owner to arrange payment and activate their Premium plan.')}
    `)
  },
}

export default function EmailPreviewPage() {
  const [selected, setSelected] = useState<keyof typeof sampleEmails>('review_verification')

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Email Preview</h1>
        <p className="text-gray-500 text-sm mb-6">Preview how emails look to recipients. This page is for testing only.</p>

        {/* Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(sampleEmails).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelected(key as keyof typeof sampleEmails)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selected === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="bg-gray-200 rounded-2xl p-4 md:p-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-[600px] mx-auto">
            <div
              dangerouslySetInnerHTML={{ __html: sampleEmails[selected].html }}
              className="email-preview"
            />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
