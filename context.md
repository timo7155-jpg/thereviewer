\# TheReviewer.mu — Project Context



\## What this is

A hotel review platform for Mauritius (expanding to all business types later).

Built with Next.js, Supabase, Resend, Tailwind CSS.



\## Tech stack

\- Frontend: Next.js 16 (App Router, TypeScript, Tailwind)

\- Database: Supabase (PostgreSQL)

\- Email: Resend (using onboarding@resend.dev for now)

\- Hosting: Not deployed yet (running locally on localhost:3000)

\- AI: Anthropic API (not yet integrated)



\## Admin

\- Admin email: timo7155@gmail.com

\- Admin panel at: /admin



\## What's built

\- Homepage with hotel listings (10 hotels seeded)

\- Hotel listing page (/hotels/\[slug])

\- Review submission form with 5 sub-scores (Service, Cleanliness, Location, Food, Value)

\- Email verification for reviews (reviewer clicks link to publish)

\- Owner login/signup (/dashboard/login)

\- Owner dashboard (/dashboard) — shows claimed hotel + reviews + stats

\- Claim a hotel flow (/dashboard/claim) — manual verification by admin

\- Admin panel (/admin) with claim requests (/admin/claims)

\- API routes: /api/reviews, /api/verify, /api/claim, /api/claim/verify, /api/reply, /api/admin/claims



\## What's NOT built yet (do these in order)

1\. Admin reviews moderation page (/admin/reviews)

2\. Admin businesses management page (/admin/businesses) — add/edit hotels

3\. Reply to reviews (API exists at /api/reply but needs testing)

4\. AI insights on owner dashboard (Claude API — monthly summary, reply suggestions)

5\. Search functionality on homepage

6\. French language toggle (EN/FR)

7\. UI polish (whole site needs design improvement)

8\. Deploy to Vercel + connect thereviewer.mu domain

9\. Google Places API + TripAdvisor API integration (external scores)

10\. Stripe subscription for Premium plan (MUR 2,990/month)



\## Business rules

\- Reviews only show if is\_verified = true

\- Business claims require manual admin approval (status: pending → approved/reject)

\- Premium plan: MUR 2,990/month (not yet implemented)

\- Site covers hotels now, expanding to all business types later

\- Languages: English default, French optional



\## Database tables

\- businesses (id, name, slug, address, region, island, phone, website, email, description, google\_place\_id, tripadvisor\_id, is\_claimed, is\_premium, claimed\_at)

\- reviewers (id, name, email, is\_verified)

\- reviews (id, business\_id, reviewer\_id, source, overall\_rating, service\_score, cleanliness\_score, location\_score, food\_score, value\_score, body, is\_verified, verification\_token, language)

\- external\_scores (id, business\_id, platform, rating, review\_count, reviews\_json, fetched\_at)

\- business\_owners (id, business\_id, user\_id, email, full\_name, role, phone, notes, plan, status, stripe\_customer\_id, stripe\_subscription\_id)

\- owner\_replies (id, review\_id, owner\_id, body)



\## Environment variables (in .env.local)

\- NEXT\_PUBLIC\_SUPABASE\_URL

\- NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY

\- SUPABASE\_SERVICE\_ROLE\_KEY

\- RESEND\_API\_KEY

\- ANTHROPIC\_API\_KEY (not yet added)

\- NEXT\_PUBLIC\_SITE\_URL=http://localhost:3000



\## Important notes

\- UI needs full redesign later — functionality first

\- Resend sender: onboarding@resend.dev (temporary until thereviewer.mu domain verified)

\- Admin approval emails currently send to timo7155@gmail.com (same as admin)

\- business\_owners.status = 'pending' means waiting for admin approval

\- business\_owners.status = 'approved' means owner has full dashboard access

