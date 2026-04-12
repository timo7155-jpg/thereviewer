'use client'

import { useState } from 'react'
import AdminShell from '../AdminShell'
import { emailTemplate, emailButton, emailInfoRow, emailTable, emailNote } from '@/lib/email'

const sampleEmails = {
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
