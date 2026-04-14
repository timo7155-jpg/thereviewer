'use client'

import Link from 'next/link'

export default function ProposalPage() {
  return (
    <main className="bg-white min-h-screen print:bg-white">
      {/* Print button — hidden when printing */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg text-sm">
          Print / Save as PDF
        </button>
        <Link href="/admin" className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-200 text-sm">
          Back
        </Link>
      </div>

      {/* ========== PAGE 1 ========== */}
      <div className="max-w-[210mm] mx-auto print:max-w-none">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-blue-800 via-blue-600 to-cyan-500 text-white px-12 pt-12 pb-16 relative overflow-hidden print:break-after-avoid">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/3" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-extrabold text-xl">R</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold">TheReviewer<span className="text-cyan-300">.mu</span></span>
                <p className="text-blue-200 text-xs">Discover, Rate & Book — Mauritius</p>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Take Control of Your<br />
              <span className="text-cyan-300">Online Reputation</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-lg">
              Join 200+ Mauritius businesses already using AI-powered insights to understand their customers and grow.
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-gray-900 text-white px-12 py-5 flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-extrabold">200+</div>
            <div className="text-gray-400 text-xs">Businesses Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold">289K+</div>
            <div className="text-gray-400 text-xs">Reviews Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold">7</div>
            <div className="text-gray-400 text-xs">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold">EN/FR</div>
            <div className="text-gray-400 text-xs">Bilingual</div>
          </div>
        </div>

        {/* The Problem / Solution */}
        <div className="px-12 py-10">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 text-sm">!</span>
                The Challenge
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-red-400">&#10007;</span> Customers rely on scattered reviews across platforms</li>
                <li className="flex gap-2"><span className="text-red-400">&#10007;</span> Business owners don&apos;t know what customers truly think</li>
                <li className="flex gap-2"><span className="text-red-400">&#10007;</span> No local, trusted platform dedicated to Mauritius</li>
                <li className="flex gap-2"><span className="text-red-400">&#10007;</span> Negative reviews go unaddressed, damaging reputation</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-500 text-sm">&#10003;</span>
                Our Solution
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-green-500">&#10003;</span> AI analyzes thousands of reviews into actionable scores</li>
                <li className="flex gap-2"><span className="text-green-500">&#10003;</span> Owners see strengths, weaknesses & improvement tips</li>
                <li className="flex gap-2"><span className="text-green-500">&#10003;</span> Mauritius-first platform, bilingual (EN/FR)</li>
                <li className="flex gap-2"><span className="text-green-500">&#10003;</span> Reply to reviews and engage with customers directly</li>
              </ul>
            </div>
          </div>
        </div>

        {/* What owners get — visual */}
        <div className="px-12 pb-10">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">What You See on Your Dashboard</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Score card mockup */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white text-center">
              <div className="text-4xl font-extrabold mb-1">4.6</div>
              <div className="text-yellow-300 text-sm mb-1">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <div className="text-blue-200 text-xs">Overall Score</div>
              <div className="text-blue-300 text-xs mt-2">Based on 5,270 reviews</div>
            </div>

            {/* Score breakdown mockup */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Score Breakdown</h3>
              {[
                { label: 'Service', score: 4.8, color: 'bg-blue-500' },
                { label: 'Cleanliness', score: 4.5, color: 'bg-emerald-500' },
                { label: 'Location', score: 4.7, color: 'bg-violet-500' },
                { label: 'Food', score: 4.3, color: 'bg-amber-500' },
                { label: 'Value', score: 4.1, color: 'bg-cyan-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 w-16">{s.label}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.score / 5) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-6">{s.score}</span>
                </div>
              ))}
            </div>

            {/* Insights mockup */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">AI Insights</h3>
              <div className="bg-emerald-50 rounded-lg p-3 mb-2 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-700 mb-1">Strengths</p>
                <p className="text-xs text-emerald-600">Exceptional service, prime location, outstanding breakfast</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                <p className="text-xs font-bold text-amber-700 mb-1">To Improve</p>
                <p className="text-xs text-amber-600">Room maintenance, WiFi speed, value perception</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PAGE 2 ========== */}
      <div className="max-w-[210mm] mx-auto print:max-w-none print:break-before-page">
        {/* Pricing */}
        <div className="px-12 pt-10 pb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Plans for Business Owners</h2>
            <p className="text-gray-500 text-sm mt-1">Searching and reading reviews is always free for everyone</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900">Free</h3>
              <div className="text-3xl font-extrabold text-gray-900 mt-2">MUR 0<span className="text-sm font-normal text-gray-500">/month</span></div>
              <p className="text-xs text-gray-500 mt-1 mb-5">Get started with basic visibility</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex gap-2 text-gray-600"><span className="text-green-500">&#10003;</span> Create your account</div>
                <div className="flex gap-2 text-gray-600"><span className="text-green-500">&#10003;</span> Claim your business listing</div>
                <div className="flex gap-2 text-gray-600"><span className="text-green-500">&#10003;</span> View all reviews &amp; analysis</div>
                <div className="flex gap-2 text-gray-600"><span className="text-green-500">&#10003;</span> 1 free AI improvement tip</div>
                <div className="flex gap-2 text-gray-300"><span>&#10007;</span> Cannot reply to reviews</div>
                <div className="flex gap-2 text-gray-300"><span>&#10007;</span> No full analytics</div>
                <div className="flex gap-2 text-gray-300"><span>&#10007;</span> Cannot upload photos</div>
              </div>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">RECOMMENDED</div>
              <h3 className="text-lg font-bold text-gray-900">Premium</h3>
              <div className="mt-2">
                <span className="text-lg text-gray-400 line-through">MUR 3,000</span>
                <span className="text-3xl font-extrabold text-blue-600 ml-2">MUR 2,490</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
              <p className="text-xs text-red-500 font-bold mt-1 mb-5">Launch offer — limited to first 50 subscribers</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex gap-2 text-gray-700"><span className="text-blue-600">&#9733;</span> Everything in Free</div>
                <div className="flex gap-2 text-gray-700"><span className="text-blue-600">&#9733;</span> Reply to all reviews</div>
                <div className="flex gap-2 text-gray-700"><span className="text-blue-600">&#9733;</span> Upload &amp; manage photos</div>
                <div className="flex gap-2 text-gray-700"><span className="text-blue-600">&#9733;</span> Full AI analytics dashboard</div>
                <div className="flex gap-2 text-gray-700"><span className="text-blue-600">&#9733;</span> Reviewer contact details</div>
                <div className="flex gap-2 text-gray-700"><span className="text-blue-600">&#9733;</span> Service quality tracking</div>
                <div className="flex gap-2 text-gray-700"><span className="text-blue-600">&#9733;</span> Receive booking requests</div>
                <div className="flex gap-2 text-gray-700"><span className="text-blue-600">&#9733;</span> Priority support</div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="px-12 py-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Get Started in 4 Steps</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { num: '1', title: 'Create Account', desc: 'Free signup in 30 seconds' },
              { num: '2', title: 'Claim Business', desc: 'Verified in 24-48 hours' },
              { num: '3', title: 'See Your Data', desc: 'AI analysis & dashboard' },
              { num: '4', title: 'Go Premium', desc: 'Unlock full control' },
            ].map(step => (
              <div key={step.num} className="text-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">{step.num}</div>
                <h3 className="font-bold text-gray-900 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Founder & Contact */}
        <div className="px-12 py-8">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white flex gap-8 items-center">
            <div className="shrink-0">
              <img src="/founder.jpg" alt="Timothee Lisette" className="w-24 h-24 rounded-full border-4 border-white/30 object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold mb-1">Let&apos;s Talk</h3>
              <p className="text-blue-100 text-sm mb-4">
                I&apos;d love to show you how TheReviewer.mu can help your business. No obligation — just a quick conversation about your reputation goals.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-blue-200 text-xs">Founder &amp; CEO</p>
                  <p className="font-bold">Timothee Lisette</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Phone / WhatsApp</p>
                  <p className="font-bold">+230 5813 7384</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Email</p>
                  <p className="font-bold">contact@thereviewer.mu</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Website</p>
                  <p className="font-bold">thereviewer.mu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="bg-gray-900 text-gray-400 px-12 py-4 text-center text-xs">
          &copy; 2026 TheReviewer.mu — Discover, rate, and book the best businesses in Mauritius
        </div>
      </div>
    </main>
  )
}
