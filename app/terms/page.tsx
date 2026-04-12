import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for TheReviewer.mu — Trusted business reviews platform in Mauritius.',
}

export default function TermsPage() {
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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Use</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using TheReviewer.mu ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Platform. The Platform is operated by TheReviewer.mu, based in Terre Rouge, Rodrigues, Mauritius.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p>TheReviewer.mu is a business review and discovery platform for Mauritius. We provide a space where customers can submit verified reviews of businesses, and business owners can manage their online reputation, respond to reviews, and access analytics tools.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <p>To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.</p>
            <p className="mt-2">You must be at least 18 years old to create an account. You may not create accounts for other people without their consent.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Reviews and Content</h2>
            <p>By submitting a review, you represent that your review is based on a genuine experience with the business. Reviews must be honest, fair, and not contain:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>False, misleading, or defamatory statements</li>
              <li>Offensive, abusive, or discriminatory language</li>
              <li>Personal information about other individuals</li>
              <li>Spam, advertising, or promotional content</li>
              <li>Content that infringes intellectual property rights</li>
            </ul>
            <p className="mt-2">We reserve the right to remove any review that violates these guidelines without prior notice. All reviews are subject to email verification before publication.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Business Owner Accounts</h2>
            <p>Business owners may claim their business listing by providing proof of ownership or management authority. Claims are subject to manual verification by our team. Once approved, business owners can access their dashboard, respond to reviews (Premium plan), and manage their listing.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Subscription Plans</h2>
            <p>The Platform offers Free and Premium subscription plans. The Premium plan is billed monthly at the rate displayed on our pricing page. Subscription details, pricing, and features are subject to change with reasonable notice.</p>
            <p className="mt-2">Payments are processed via bank transfer or other agreed-upon methods. Subscriptions can be cancelled at any time by contacting our team.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Booking Requests</h2>
            <p>The Platform facilitates booking requests between customers and businesses. Booking requests are not automatic confirmations. We act solely as an intermediary and are not responsible for the fulfilment, quality, or outcome of any booking.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Intellectual Property</h2>
            <p>All content, design, and technology on TheReviewer.mu is owned by or licensed to the Platform. You may not copy, reproduce, distribute, or create derivative works from any part of the Platform without written permission.</p>
            <p className="mt-2">By submitting reviews, you grant TheReviewer.mu a non-exclusive, royalty-free licence to display, reproduce, and distribute your content on the Platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>TheReviewer.mu is provided "as is" without warranties of any kind. We are not liable for the accuracy of reviews, the quality of listed businesses, or any damages arising from your use of the Platform. Our total liability shall not exceed the amount you have paid to us in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Governing Law</h2>
            <p>These Terms are governed by the laws of the Republic of Mauritius. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mauritius.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">11. Contact</h2>
            <p>For questions about these Terms, contact us at:</p>
            <p className="mt-2"><strong>Email:</strong> contact@thereviewer.mu<br /><strong>Phone:</strong> +230 5813 7384<br /><strong>Address:</strong> Terre Rouge, Rodrigues, Mauritius</p>
          </section>
        </div>
      </div>
    </main>
  )
}
