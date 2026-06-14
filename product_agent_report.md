# Product Agent Report: GenAIJobHub.com

## 1. User Personas
1. **Aarav, AI Job Seeker (India):** 24yo Python developer upskilling in GenAI. Looking for remote US/EU jobs or high-paying Indian startups. Values transparency in salary and tech stack.
2. **Sarah, Global AI Employer (US):** 35yo Founder of an AI SaaS. Needs cost-effective but highly skilled prompt engineers and ML ops talent. Values speed of hiring and pre-vetted candidates.
3. **Priya, AI Freelancer:** 28yo experienced data scientist doing side gigs building custom ChatGPT wrappers. Needs a steady stream of contract work.

## 2. User Journey Maps
- **Seeker Flow:** Lands on Homepage via SEO -> Browses Jobs -> Filters by "Remote" and "Prompt Engineering" -> Creates free profile -> Applies to 3 jobs -> Gets added to weekly newsletter.
- **Employer Flow:** Lands on Homepage via LinkedIn Ad -> Clicks "Post a Job" -> Chooses ₹2,999 Featured Tier -> Fills Job Details -> Pays via Razorpay -> Job goes live -> Receives applications in dashboard.

## 3. MVP Feature Scope (MoSCoW)
- **Must Have:** Job listing feed, Job detail pages, Basic search/filter, Employer job posting flow, Razorpay integration.
- **Should Have:** Email alerts for new jobs, User profiles for seekers.
- **Could Have:** AI Resume scoring, Salary benchmarking.
- **Won't Have (MVP):** Freelance gig marketplace, In-platform messaging, Courses platform.

## 4. Platform Modules Breakdown
1. **Jobs Board:** Core MVP feature. Connects seekers and employers.
2. **Tools Directory:** Phase 2. List of AI tools with affiliate links.
3. **News Feed:** Phase 3. Aggregated AI industry news.
4. **Courses:** Phase 2. Curated AI courses (affiliate revenue).
5. **Freelance Gigs:** Phase 3. Contract project listings.
6. **Startup Tracker:** Phase 3. Tracking funded Indian AI startups.
7. **Community:** Phase 4. Forum or Discord integration.
8. **Salary Explorer:** Phase 2. Data visualization of AI salaries in India vs Global.
9. **Newsletter:** Core MVP. Weekly roundups.
10. **AI Career Coach:** Phase 4. Claude API powered chat for interview prep.

## 5. User Flow Diagrams
**Job Apply Flow:**
`Home -> Search -> Job Detail -> Click Apply -> (If external) Redirect to ATS / (If internal) Upload Resume -> Success Modal`

**Post Job Flow:**
`Home -> Post Job Page -> Select Tier -> Fill Details -> Preview -> Razorpay Checkout -> Success -> Live Listing`

## 6. Product Metrics Dashboard
- **Month 1:** Traffic (10k), Job Posts (50), Newsletter Subs (1k).
- **Month 3:** Traffic (30k), Paid Job Posts (10), Apply Clicks (5k).
- **Month 6:** Traffic (100k), Paid Job Posts (50), MRR (₹2L).

## 7. Accessibility & Localization
- **Mobile First:** 80% of Indian job seekers use mobile devices.
- **Performance:** Optimized for 4G networks using Cloudflare edge caching.
- **Payments:** UPI priority over Credit Cards via Razorpay.
