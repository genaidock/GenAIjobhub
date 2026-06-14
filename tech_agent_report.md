# Tech Agent Report: GenAIJobHub.com

## 1. Architecture Diagram
```
[User (Browser/Mobile)] 
       | (Next.js 15 SSR/SSG)
[Cloudflare Pages Edge Network]
       |
+------+------+
|             |
[Supabase]  [Next.js API Routes]
(DB & Auth)   |
              +--> [Razorpay] (Payments)
              +--> [Brevo API] (Transactional Emails)
              +--> [Claude API] (AI Features)
```

## 2. Next.js 15 App Router Structure
- `app/page.tsx` - Homepage and featured jobs
- `app/jobs/[id]/page.tsx` - Dynamic job details page (SEO optimized)
- `app/api/checkout/route.ts` - Razorpay order creation
- `app/api/webhook/razorpay/route.ts` - Payment confirmation
- `components/` - Reusable UI components (JobCard, Navbar)
- `lib/supabase.ts` - DB Client

## 3. Supabase Schema Highlights
- **profiles:** `id`, `role`, `full_name`, `avatar_url`
- **jobs:** `id`, `employer_id`, `title`, `description`, `salary`, `is_featured`, `created_at`
- **applications:** `job_id`, `seeker_id`, `status`
- **Row Level Security (RLS):** Jobs can be read by anyone, but only updated by their `employer_id`.

## 4. API Design
- `POST /api/jobs`: Create new job listing (Auth required)
- `POST /api/checkout`: Initiates Razorpay payment for featured job.
- `POST /api/newsletter`: Adds email to Brevo list.

## 5. Claude API Integration Plan
- **AI Career Coach:** Contextual chatbot using Claude 3.5 Sonnet to give interview tips based on job descriptions.
- **Job Description Generator:** Helps employers write better JDs with a single click.

## 6. Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `BREVO_API_KEY`
- `ANTHROPIC_API_KEY`

## 7. Performance & SEO
- **SSG:** Job listings are statically generated with Incremental Static Regeneration (ISR) to ensure lightning-fast load times while keeping data fresh.
- **Sitemap:** Dynamic `/sitemap.xml` generated automatically for all active jobs.

## 8. Cost Optimization
- Entire stack sits on free tiers for Month 1. Cloudflare Pages keeps bandwidth free. Supabase 500MB limit allows for ~100k job postings before needing a paid plan.
