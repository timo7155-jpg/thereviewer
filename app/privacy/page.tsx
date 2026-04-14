import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for TheReviewer.mu — how we collect, use, and protect your data on our business review and booking platform.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 font-medium">← Home</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>TheReviewer.mu ("we", "our", "the Platform") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal information when you use our platform. By using TheReviewer.mu, you consent to the practices described in this policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p><strong>Account information:</strong> When you create an account, we collect your email address and password. Business owners also provide their name, phone number, role, and business details during the claim process.</p>
            <p className="mt-2"><strong>Review information:</strong> When you submit a review, we collect your name, email address, rating scores, and review text. Your email is used for verification purposes.</p>
            <p className="mt-2"><strong>Booking information:</strong> When you submit a booking request, we collect your name, email, phone number, and booking details (dates, number of guests, etc.).</p>
            <p className="mt-2"><strong>Contact information:</strong> When you use our contact form, we collect your name, email, phone number, reason for contact, and message.</p>
            <p className="mt-2"><strong>Usage data:</strong> We automatically collect information about how you interact with the Platform, including pages visited, time spent, and device information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain the Platform and its features</li>
              <li>To verify review submissions via email</li>
              <li>To verify business ownership claims</li>
              <li>To process and forward booking requests to businesses</li>
              <li>To respond to your enquiries and provide customer support</li>
              <li>To send service-related notifications (claim approvals, booking updates)</li>
              <li>To improve the Platform and develop new features</li>
              <li>To prevent fraud and ensure platform integrity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information in the following cases:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Reviews:</strong> Your name and review content are publicly displayed on the Platform. Your email is never shown publicly.</li>
              <li><strong>Booking requests:</strong> Your contact details and booking information are forwarded to the relevant business to fulfil your request.</li>
              <li><strong>Service providers:</strong> We use third-party services (Supabase for data storage, Resend for email delivery) that process your data on our behalf.</li>
              <li><strong>Legal requirements:</strong> We may disclose your information if required by law or to protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Data Storage and Security</h2>
            <p>Your data is stored securely using Supabase (hosted infrastructure with encryption at rest and in transit). We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse.</p>
            <p className="mt-2">However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us. Reviews may be retained in anonymised form after account deletion.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p>Under the Data Protection Act 2017 of Mauritius, you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at contact@thereviewer.mu.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Cookies</h2>
            <p>We use essential cookies to maintain your login session and language preference. We do not use advertising or tracking cookies. By using the Platform, you consent to the use of these essential cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Third-Party Links</h2>
            <p>The Platform may contain links to third-party websites (e.g., Google Maps, business websites). We are not responsible for the privacy practices of these external sites.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the Platform after changes constitutes acceptance of the revised policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">11. Contact</h2>
            <p>For questions about this Privacy Policy or to exercise your data rights, contact us at:</p>
            <p className="mt-2"><strong>Email:</strong> contact@thereviewer.mu<br /><strong>Phone:</strong> +230 5813 7384<br /><strong>Address:</strong> Based in Mauritius</p>
          </section>
        </div>
      </div>
    </main>
  )
}
