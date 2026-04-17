import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SiteFooter from '@/app/SiteFooter'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meet the founder behind TheReviewer.mu — Mauritius\' platform for discovering, rating, and booking businesses with AI-powered insights.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 font-medium">← Home</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">About TheReviewer.mu</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Building trust between businesses and customers across Mauritius — one verified review at a time.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-14">
        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            TheReviewer.mu was created to fill a critical gap in the Mauritian market — a trusted, local-first platform
            where customers can share honest experiences and businesses can understand, respond to, and improve
            based on real feedback. We believe that transparency builds trust, and trust drives growth.
          </p>
        </section>

        {/* What we do */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email-verified Reviews</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Every review submitted directly on TheReviewer.mu is email-verified before publication — no paid endorsements, no fake user accounts. Separately, we may display AI summaries of publicly available Google Maps reviews, clearly labelled as such.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-gray-600 leading-relaxed">We analyse thousands of public reviews using AI to provide business owners with actionable insights — what&apos;s working, what needs attention, and how to improve.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">All Business Types</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Hotels, restaurants, spas, car rentals, tours, retail — we cover every sector. One platform for all of Mauritius&apos;s business landscape.</p>
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Meet the Founder</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-rich overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />
            <div className="p-8 md:flex gap-8 items-start">
              {/* Photo */}
              <div className="shrink-0 mb-6 md:mb-0">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-100 mx-auto md:mx-0 relative">
                  <Image src="/founder.jpg" alt="Yanny Timothée Lisette — Founder of TheReviewer.mu" fill className="object-cover" sizes="160px" priority />
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">Yanny Timothée Lisette</h3>
                <p className="text-blue-600 font-semibold text-sm mb-4">Founder & CEO</p>

                <p className="text-gray-600 leading-relaxed mb-4">
                  With over 10 years of experience in relationship management, financial services, and digital strategy,
                  Yanny brings a unique blend of business acumen and technology expertise to TheReviewer.mu. His career
                  spans banking, microfinance, corporate social responsibility, and web development — giving him deep
                  insight into what businesses need to grow and what customers expect.
                </p>

                <p className="text-gray-600 leading-relaxed mb-6">
                  Having managed portfolios of hundreds of businesses and individual clients across Mauritius,
                  Yanny understands firsthand what drives customer satisfaction and business growth. This experience in
                  relationship management and client advisory is what inspired TheReviewer.mu — a platform that bridges the
                  gap between businesses and their customers through transparent, verified feedback.
                </p>

                {/* Qualifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    BSc Web &amp; Multimedia — University of Mauritius
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    PGDip International Business Management — SQA UK
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Financial Accounting — IIM Bangalore
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    CBCA® — Corporate Finance Institute
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Customer Interaction &amp; Negotiation — Maingard Associates
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Marketing Strategy &amp; Digital Identity — Michigan Corp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Mauritius */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Why Mauritius Needs This</h2>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <p className="text-gray-700 leading-relaxed mb-4">
              Mauritius has world-class hotels, incredible restaurants, and vibrant local businesses — but until now,
              there has been no dedicated local platform for verified reviews. Customers rely on scattered Google reviews
              or international platforms that don&apos;t understand the Mauritian market.
            </p>
            <p className="text-gray-700 leading-relaxed">
              TheReviewer.mu changes that. We&apos;re built in Mauritius, for Mauritius — bilingual (English &amp; French),
              covering all business categories, and powered by AI to give both customers and business owners the insights
              they need. Based in Mauritius, we&apos;re proud to serve the entire Republic of Mauritius.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Ready to get started?</h2>
          <p className="text-gray-500 mb-6">Whether you&apos;re a customer looking for honest reviews or a business owner wanting to manage your reputation.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Explore businesses
            </Link>
            <Link href="/dashboard/login" className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Claim your business
            </Link>
            <Link href="/contact" className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Contact us
            </Link>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  )
}
