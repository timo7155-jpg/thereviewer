import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for TheReviewer.mu Premium subscriptions.',
}

export default function RefundPage() {
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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Refund Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Free Plan</h2>
            <p>The Free plan on TheReviewer.mu is entirely free of charge. No payment is required, and therefore no refund applies. You can use the Free plan indefinitely with no obligation to upgrade.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Premium Subscription</h2>
            <p>The Premium plan is a monthly subscription billed at the rate displayed on our pricing page at the time of subscription. Payment is due at the beginning of each billing period.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Cancellation</h2>
            <p>You may cancel your Premium subscription at any time by contacting our team. Upon cancellation:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your Premium features will remain active until the end of your current billing period.</li>
              <li>Your account will automatically revert to the Free plan at the end of the billing period.</li>
              <li>No further charges will be applied after cancellation.</li>
              <li>Your business listing, reviews, and data will be preserved on the Free plan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Refund Eligibility</h2>
            <p>We want you to be satisfied with our service. Refunds may be issued under the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Within 7 days of first subscription:</strong> If you are not satisfied with the Premium plan within the first 7 days of your initial subscription, you may request a full refund. This applies to first-time subscribers only.</li>
              <li><strong>Service unavailability:</strong> If the platform experiences significant downtime (more than 48 consecutive hours) during your billing period, you may request a prorated refund for the affected period.</li>
              <li><strong>Billing errors:</strong> If you were charged incorrectly or charged after cancellation, we will issue a full refund for the erroneous charge.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Non-Refundable Situations</h2>
            <p>Refunds will not be issued in the following cases:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>After the 7-day satisfaction period for ongoing monthly charges.</li>
              <li>If your account was suspended due to violation of our Terms of Use.</li>
              <li>For partial months of service after the current billing period has begun (beyond the 7-day window).</li>
              <li>If you simply forgot to cancel before the renewal date.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. How to Request a Refund</h2>
            <p>To request a refund, contact us with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your account email address</li>
              <li>Business name associated with the subscription</li>
              <li>Reason for the refund request</li>
              <li>Date of the charge</li>
            </ul>
            <p className="mt-2">We will process eligible refunds within 7-14 business days. Refunds will be issued via the original payment method where possible, or by bank transfer.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Changes to This Policy</h2>
            <p>We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an updated date. Existing subscribers will be notified of material changes via email.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Contact</h2>
            <p>For refund requests or questions about this policy:</p>
            <p className="mt-2"><strong>Email:</strong> contact@thereviewer.mu<br /><strong>Phone:</strong> +230 5813 7384<br /><strong>Address:</strong> Based in Mauritius</p>
          </section>
        </div>
      </div>
    </main>
  )
}
