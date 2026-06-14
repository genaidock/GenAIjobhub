# 💰 GenAIJobHub.com — Revenue Agent Report
**Prepared by:** Revenue Agent  
**Date:** June 13, 2026  
**Platform:** GenAIJobHub.com — AI Jobs Board & Opportunities Hub (India + Global Remote)

---

## 1. Revenue Model Overview

> **Strategic Philosophy:** Layer multiple revenue streams so no single source exceeds 40% of total revenue. Prioritize streams that scale without linear headcount increases.

### Master Revenue Stream Table

| # | Stream | Target Customer | Price Point | Est. MRR (Month 3) | Est. MRR (Month 6) | Est. MRR (Month 12) |
|---|--------|----------------|-------------|--------------------|--------------------|---------------------|
| 1 | **Featured Job Listings** | Employers / Recruiters | ₹999–₹9,999/listing | ₹15,000 | ₹55,000 | ₹1,80,000 |
| 2 | **Employer Subscriptions** | Hiring Teams / Startups | ₹4,999–₹49,999/mo | ₹10,000 | ₹60,000 | ₹2,50,000 |
| 3 | **Affiliate Commissions** | Job Seekers / AI Learners | 20–40% recurring | ₹8,000 | ₹25,000 | ₹90,000 |
| 4 | **Display Advertising** | Ad Networks / Direct Brands | RPM ₹200–₹800 | ₹3,000 | ₹12,000 | ₹45,000 |
| 5 | **Sponsored Newsletter** | AI Tool Companies | ₹15,000–₹60,000/issue | ₹0 | ₹30,000 | ₹1,20,000 |
| 6 | **Premium Memberships** | Job Seekers (India-focused) | ₹299–₹999/mo | ₹5,000 | ₹20,000 | ₹1,50,000 |
| | **TOTAL (Conservative)** | | | **₹41,000** | **₹2,02,000** | **₹8,35,000** |
| | **TOTAL (Optimistic)** | | | **₹75,000** | **₹3,50,000** | **₹14,00,000** |

> **Note:** All INR figures. USD equivalent at ₹83/USD. Month 12 optimistic scenario = ~$16,900/month.

---

## 2. Stream 1: Featured Job Listings

### 2.1 Pricing Tiers

| Feature | 🥉 Basic | ⭐ Featured | 💎 Premium |
|---------|----------|------------|------------|
| **Price (INR)** | ₹999/listing | ₹2,999/listing | ₹9,999/listing |
| **Price (USD)** | ~$12 | ~$36 | ~$120 |
| **Listing Duration** | 30 days | 30 days | 60 days |
| **Visibility** | Standard feed | Highlighted + Pinned (7 days) | Pinned homepage (30 days) |
| **Job Seeker Reach** | Organic only | Email blast to 500+ subscribers | Dedicated email feature + social posts |
| **Company Logo** | ✗ | ✓ | ✓ (Large format) |
| **"AI-Powered" Badge** | ✗ | ✓ | ✓ |
| **Application Analytics** | ✗ | Basic (view count) | Full (views, clicks, apply-rate) |
| **Social Media Promotion** | ✗ | LinkedIn post | LinkedIn + Twitter + Instagram |
| **Candidate Matching Alerts** | ✗ | ✗ | ✓ (Claude AI-powered matching) |
| **Renewal Reminder** | ✗ | ✓ | ✓ |

### 2.2 Example Listings

**Basic (₹999):**
> 🤖 **Prompt Engineer** | Bengaluru or Remote | TechStartup Pvt Ltd  
> ₹12–18 LPA | Posted 2 days ago

**Featured (₹2,999):**
> ⭐ **Senior ML Engineer** | Remote-India | DataCorp  
> ₹25–40 LPA | 🔥 47 views | **[Apply Now]**

**Premium (₹9,999):**
> 💎 **[FEATURED] Head of AI Products** | Mumbai | FinTech Unicorn  
> ₹60–90 LPA | AI-first role | Exclusive on GenAIJobHub  
> 📧 *Sent to 1,200+ AI professionals this week*

### 2.3 Razorpay Integration Plan for Job Listings

```javascript
// pages/api/create-listing-order.js (Next.js API Route)
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const LISTING_PLANS = {
  basic:    { amount: 99900,  currency: 'INR', name: 'Basic Listing' },
  featured: { amount: 299900, currency: 'INR', name: 'Featured Listing' },
  premium:  { amount: 999900, currency: 'INR', name: 'Premium Listing' },
};

export default async function handler(req, res) {
  const { plan, employer_id, job_data } = req.body;
  const planConfig = LISTING_PLANS[plan];

  const order = await razorpay.orders.create({
    amount: planConfig.amount, // in paise
    currency: planConfig.currency,
    receipt: `listing_${employer_id}_${Date.now()}`,
    notes: {
      plan,
      employer_id,
      job_title: job_data.title,
    },
  });

  // Store pending listing in Supabase
  await supabase.from('job_listing_orders').insert({
    order_id: order.id,
    employer_id,
    plan,
    job_data,
    status: 'pending',
  });

  res.json({ orderId: order.id, amount: planConfig.amount });
}
```

**Webhook handler** verifies payment signature → activates listing in Supabase → triggers Brevo confirmation email to employer.

### 2.4 Revenue Milestones

| Month | # Listings | Avg. Ticket | Revenue |
|-------|-----------|-------------|---------|
| 1 | 5 Basic, 2 Featured | ₹1,400 | ₹9,800 |
| 3 | 8 Basic, 5 Featured, 1 Premium | ₹2,100 | ₹18,900 |
| 6 | 15 Basic, 12 Featured, 5 Premium | ₹3,500 | ₹55,500 |
| 12 | 40 Basic, 30 Featured, 12 Premium | ₹3,800 | ₹1,82,000 |

---

## 3. Stream 2: Employer Subscriptions

### 3.1 Subscription Packages

| Feature | 🌱 Starter | 🚀 Growth | 🏢 Enterprise |
|---------|-----------|----------|--------------|
| **Monthly (INR)** | ₹4,999 | ₹14,999 | ₹49,999 |
| **Annual (INR)** | ₹47,988 (₹3,999/mo) | ₹1,43,988 (₹11,999/mo) | ₹4,79,988 (₹39,999/mo) |
| **Monthly (USD)** | ~$60 | ~$180 | ~$600 |
| **Annual (USD)** | ~$578 | ~$1,734 | ~$5,783 |
| **Job Postings/mo** | 3 | 10 | Unlimited |
| **Listing Type** | Basic only | Featured included | Premium included |
| **Resume Database Access** | ✗ | 50 profiles/mo | Unlimited |
| **AI Candidate Matching** | ✗ | Basic (top 10) | Advanced (ranked + scored) |
| **Employer Brand Page** | Basic | Enhanced | Custom-designed |
| **ATS Integration** | ✗ | ✗ | Webhook/API access |
| **Dedicated Account Manager** | ✗ | ✗ | ✓ |
| **Invoice/GST Billing** | ✓ | ✓ | ✓ |
| **Priority Support** | Email | Email + Chat | Phone + Slack |
| **Analytics Dashboard** | ✗ | ✓ | ✓ Advanced |
| **Social Media Amplification** | ✗ | 2 posts/mo | Weekly posts |

### 3.2 Feature Differentiation Rationale

- **Starter** targets early-stage Indian AI startups (seed/pre-A) that hire 1–3 AI roles per quarter
- **Growth** targets Series A–B companies with dedicated talent teams (e.g., Sarvam AI, Krutrim, Yellow.ai)
- **Enterprise** targets MNCs with India AI centers (Google, Microsoft, Accenture, Infosys AI), priced to compete with Naukri.com (₹60,000+/quarter) and LinkedIn Recruiter Lite (~₹16,500/mo)

### 3.3 Annual Discount Psychology

Offer **20% discount** on annual plans (standard SaaS practice). Highlight savings explicitly:
> "Save ₹12,000/year vs. monthly billing — that's a free month of AI hires!"

### 3.4 GST Compliance

- All invoices include **18% GST** (B2B employers can claim input tax credit)
- Use Razorpay's built-in GST invoice generation or integrate with **Zoho Books** (₹749/mo) or **ClearTax** for automated GST filing

### 3.5 Razorpay Subscription Setup

```javascript
// Create recurring subscription via Razorpay Subscriptions API
const subscription = await razorpay.subscriptions.create({
  plan_id: 'plan_growth_monthly', // Pre-created in Razorpay dashboard
  total_count: 12,
  quantity: 1,
  customer_notify: 1,
  notes: {
    employer_id: employer.id,
    plan: 'growth',
  },
  addons: [{
    item: {
      name: 'Extra Job Posting',
      amount: 199900, // ₹1,999 per extra posting
      currency: 'INR',
    }
  }]
});
```

---

## 4. Stream 3: Affiliate Commissions

### 4.1 The 15 Top AI Affiliate Programs

| # | Tool/Platform | Category | Commission Rate | Cookie | Avg. Order Value | Est. Monthly Revenue* |
|---|--------------|----------|-----------------|--------|-----------------|----------------------|
| 1 | **Jasper AI** | Content Writing | 30% recurring | 30 days | $49/mo | $147/mo |
| 2 | **Copy.ai** | Copywriting | 45% first payment | 60 days | $49/mo | $110/mo |
| 3 | **Writesonic** | Content AI | 30% recurring | 30 days | $19/mo | $57/mo |
| 4 | **Surfer SEO** | SEO AI | 25% recurring | 60 days | $89/mo | $111/mo |
| 5 | **Midjourney** | Image Gen | No affiliate (yet)* | — | $10/mo | — |
| 6 | **Leonardo.ai** | Image Gen | 20% recurring | 30 days | $12/mo | $24/mo |
| 7 | **ElevenLabs** | Voice AI | 22% recurring | 30 days | $22/mo | $48/mo |
| 8 | **Synthesia** | Video AI | 20% first year | 90 days | $89/mo | $178/mo |
| 9 | **Descript** | Video/Audio | 15% recurring | 30 days | $24/mo | $36/mo |
| 10 | **Notion AI** | Productivity | None (referral credit) | — | $16/mo | — |
| 11 | **Otter.ai** | Transcription | 20% first year | 30 days | $17/mo | $34/mo |
| 12 | **Zapier** | Automation | 20% first year | 90 days | $19.99/mo | $40/mo |
| 13 | **Semrush** | SEO Platform | 40% first sale | 120 days | $129/mo | $516/mo |
| 14 | **Coursera (AI courses)** | Education | 45% per sale | 30 days | $49/course | $441/mo |
| 15 | **Udemy (AI courses)** | Education | 15% per sale | 7 days | $15/course | $225/mo |

> *Estimated at 10 conversions/month per tool at Month 6. Midjourney has no public affiliate program as of 2026 — use Leonardo.ai as substitute.

**Total estimated affiliate MRR at Month 6:** ~$1,967 (~₹1,63,261)

### 4.2 Integration Strategy

#### Step 1: Affiliate Resource Hub Page
Create `/resources` page with curated AI tools:
```
/resources
  /ai-writing-tools      → Jasper, Writesonic, Copy.ai
  /ai-image-tools        → Leonardo.ai, Canva AI
  /ai-productivity       → Zapier, Otter.ai, Descript
  /ai-courses            → Coursera AI, Udemy AI, DeepLearning.ai
  /ai-career-tools       → Resume AI, LinkedIn AI features
```

#### Step 2: Contextual Placement
- **Job detail pages**: "This role requires Midjourney experience — learn it here [affiliate link]"
- **Resume builder pages**: "Enhance your AI resume with Jasper [affiliate link]"
- **Blog posts**: "Top 10 AI Tools Every ML Engineer Must Know in 2026"
- **Newsletter**: Dedicated "Tool of the Week" sponsored section (affiliate + paid)

#### Step 3: Affiliate Tracking
Use **Lasso** ($39/month) or **ThirstyAffiliates** ($99/year) for:
- Cloaking links: `genaijobhub.com/go/jasper`
- Click & conversion tracking
- Auto-updating broken affiliate links
- Revenue reporting dashboard

#### Step 4: Signup Process
| Tool | Affiliate Network | Sign-up URL |
|------|------------------|-------------|
| Jasper | Impact.com | jasper.ai/affiliates |
| Surfer SEO | FirstPromoter | surferseo.com/affiliate |
| Semrush | Semrush | semrush.com/kb/998-affiliate |
| Coursera | Coursera Affiliates | coursera.org/affiliates |
| ElevenLabs | Direct | elevenlabs.io/affiliate |
| Synthesia | Impact.com | synthesia.io/affiliate |

#### Step 5: Content SEO Funnel
Target keywords like:
- "best AI tools for data scientists India" (3,600/mo searches)
- "Jasper AI review India" (1,200/mo)
- "AI course with certificate India 2026" (8,100/mo)

---

## 5. Stream 4: Display Advertising

### 5.1 Google AdSense Strategy

#### Application Requirements
- Minimum **50+ high-quality pages** (job listings + blog posts)
- At least **1,000 unique visitors/month** before applying
- Privacy Policy, Terms of Service, Contact page required
- No AI-generated thin content — all pages must have original value

#### Expected RPM (Revenue Per 1,000 Impressions) for AI Niche

| Traffic Source | Expected RPM | Rationale |
|---------------|-------------|-----------|
| India traffic | ₹80–₹150 | Lower advertiser CPCs in IN market |
| US/UK traffic | ₹400–₹800 | High-value AI sector advertisers |
| Blended (60% IN) | ₹180–₹350 | Weighted average |

#### Ad Placement Map

```
┌─────────────────────────────────────────┐
│  HEADER (728x90 Leaderboard)            │  ← High CTR, above fold
├─────────────────┬───────────────────────┤
│  JOB LISTINGS   │  300x250 Rectangle   │  ← Sidebar, sticky scroll
│  (Main Feed)    │  (Ad Unit #1)         │
│                 │                       │
│  [Job Card]     │  Native Ad            │  ← In-feed native ads
│  [Job Card]     │  300x250 Rectangle   │
│  [Ad - Native]  │  (Ad Unit #2)         │
│  [Job Card]     │                       │
├─────────────────┴───────────────────────┤
│  IN-ARTICLE (728x90) after 3rd listing  │  ← High viewability
├─────────────────────────────────────────┤
│  FOOTER (320x50 Mobile Banner)          │  ← Mobile-only
└─────────────────────────────────────────┘
```

#### AdSense Revenue Projection

| Month | Monthly Visitors | Page Views | Blended RPM | Monthly Revenue |
|-------|-----------------|------------|-------------|-----------------|
| 3 | 2,500 | 7,500 | ₹200 | ₹1,500 |
| 6 | 8,000 | 24,000 | ₹250 | ₹6,000 |
| 9 | 20,000 | 60,000 | ₹280 | ₹16,800 |
| 12 | 40,000 | 120,000 | ₹320 | ₹38,400 |

### 5.2 When to Switch to Direct Ad Sales

**Trigger point:** When monthly AdSense revenue exceeds **₹20,000** (~Month 9-10)

**Direct Ad Sales Advantages:**
- 3–5x higher CPM than AdSense (no Google 30% cut)
- Preferred brand relationships
- Custom sponsorship packages

**Direct Ad Pricing (Month 10+):**
| Placement | Format | Rate |
|-----------|--------|------|
| Homepage Hero Banner | 970x250 | ₹25,000/week |
| Sidebar Sticky | 300x600 | ₹15,000/week |
| Newsletter Top Slot | 600x200 | ₹20,000/issue |
| Job Category Sponsor | Exclusive | ₹40,000/month |

**Tools for Direct Ad Sales:**
- **BuySellAds.com** — marketplace to sell ad inventory
- **Carbon Ads** — dev/tech-focused network, premium CPMs
- **AdButler** ($25/mo) — self-serve ad server to manage direct deals

---

## 6. Stream 5: Sponsored Newsletter

### 6.1 Newsletter Sponsorship Tiers

| Package | Price (INR) | Price (USD) | What's Included |
|---------|-------------|-------------|-----------------|
| **Bronze Sponsor** | ₹15,000/issue | ~$180 | Logo + 50-word mention in footer |
| **Silver Sponsor** | ₹30,000/issue | ~$360 | 100-word blurb + logo in body |
| **Gold Sponsor** | ₹60,000/issue | ~$720 | Dedicated top-of-email section, 200 words, custom CTA, social mention |
| **Exclusive Sponsor** | ₹1,00,000/issue | ~$1,200 | Full single-sponsor issue, editorial integration, 3 social posts |
| **Monthly Bundle (4x Gold)** | ₹2,00,000/mo | ~$2,400 | 20% discount on 4 Gold spots/month |

**Unlock sponsorship pricing when:** Newsletter hits **500+ subscribers** (Month 3-4 target)  
**Raise rates when:** Newsletter hits **2,000+ subscribers** (Month 7-8 target)

### 6.2 Newsletter Format (Weekly)

```
📧 GenAI Weekly — Every Tuesday 9:00 AM IST

Subject: "7 AI Jobs Paying ₹50L+ This Week + The Tool Every LLM Eng Needs"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[GOLD SPONSOR BLOCK]
Brought to you by [AI Tool Company]
"[Compelling one-liner about the tool]"
[CTA Button]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 TOP 5 AI JOBS THIS WEEK
1. [Job Title] @ [Company] — ₹XX LPA
...

💡 AI TOOL OF THE WEEK (Affiliate)
[Tool Name] — [What it does for AI professionals]
→ Try it free [affiliate link]

📰 AI NEWS IN 60 SECONDS
• [3 bullet news items]

🎓 LEARNING CORNER
[Course recommendation with affiliate link]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[BRONZE SPONSOR LOGO FOOTER]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 6.3 Sponsor Pitch Deck Outline

**Slide 1: The Opportunity**
> "India has 500,000+ AI professionals with no dedicated job platform. GenAIJobHub.com fills this gap."

**Slide 2: Our Audience**
> - X% Machine Learning Engineers
> - X% Data Scientists
> - X% AI/ML Researchers
> - X% AI Product Managers
> Demographics: 78% 25–35 years old, 65% Bengaluru/Hyderabad/Pune/Mumbai

**Slide 3: Newsletter Stats**
> Open Rate: XX% (Industry avg: 21%)  
> Click Rate: XX%  
> Subscribers: X,XXX growing at XX%/week

**Slide 4: Sponsorship Packages** (table from 6.1)

**Slide 5: Past Sponsors / Social Proof** (add after first 2-3 sponsors)

**Slide 6: ROI Calculator**
> "Gold Sponsor = ₹60,000 | ~2,000 impressions | CPM = ₹30 | Lower than Google Ads for same audience"

**Slide 7: Next Steps**
> Book a 15-min call: calendly.com/genaijobhub

### 6.4 Target Sponsors (AI Tool Companies)

| Company | Why They'd Sponsor | Decision Maker | Approach |
|---------|-------------------|----------------|----------|
| **Sarvam AI** | India-focused LLM, needs AI talent | Head of Marketing | LinkedIn DM + Email |
| **Yellow.ai** | Hiring AI engineers, brand building | Talent + Marketing | Cold email |
| **Krutrim (Ola)** | Indian LLM, massive hiring push | PR team | Twitter + Email |
| **Agara Labs** | Voice AI, niche audience match | CMO | LinkedIn |
| **Jasper AI** | Wants Indian market penetration | Affiliate/Partner team | Via Impact.com |
| **Coursera** | AI courses → job seekers | Partner team | Coursera for Business |
| **upGrad** | AI certification programs | Brand partnerships | Direct pitch |
| **AWS India** | Sells ML services to AI teams | Partner marketing | AWS Partner Network |
| **Weights & Biases** | MLOps tool, dev audience | Developer advocate | Slack community |
| **LambdaLabs** | GPU cloud, ML engineer audience | Marketing | Email |

---

## 7. Stream 6: Premium Memberships (Job Seekers)

### 7.1 Free vs. Paid Tier Comparison

| Feature | 🆓 Free | ⚡ Pro (₹299/mo) | 🚀 Elite (₹999/mo) |
|---------|--------|-----------------|-------------------|
| **Browse Jobs** | All listings | All listings | All listings |
| **Apply to Jobs** | 5/month | Unlimited | Unlimited |
| **AI Resume Review** | ✗ | 1x/month (Claude-powered) | 3x/month (priority) |
| **Salary Insights** | ✗ | Basic (city-level) | Detailed (company-level) |
| **Early Job Alerts** | 24hr delay | 4hr head start | Instant (push + email) |
| **Skills Gap Analysis** | ✗ | ✗ | ✓ (AI-powered) |
| **Interview Prep** | ✗ | 5 AI practice Q&A | Unlimited AI mock interviews |
| **Resume Builder** | ✗ | ATS-optimized template | Custom AI-written bullets |
| **Profile Visibility** | Standard | Boosted to employers | Top-ranked (searchable) |
| **Job Match Score** | ✗ | ✓ | ✓ Advanced |
| **Career Coach Access** | ✗ | ✗ | 1 session/mo (human expert) |
| **Exclusive Communities** | ✗ | Discord Pro channel | Discord Elite + events |

### 7.2 Pricing Strategy

- **Pro ₹299/mo** (~$3.60) — impulse-buy price, lower than a coffee in Bengaluru
- **Elite ₹999/mo** (~$12) — positioned against LinkedIn Premium India (₹1,600/mo)
- **Annual Pro ₹2,499/year** (₹208/mo — 30% off)
- **Annual Elite ₹8,499/year** (₹708/mo — 29% off)

**Free trial:** 7-day full Elite access for email signup → drives conversion funnel

### 7.3 Claude AI-Powered Resume Review Implementation

```javascript
// pages/api/resume-review.js
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req) {
  const { resumeText, targetJobDescription } = await req.json();

  // Verify user has Pro/Elite membership via Supabase
  const { data: user } = await supabase
    .from('memberships')
    .select('plan, resume_reviews_remaining')
    .eq('user_id', userId)
    .single();

  if (!user || user.resume_reviews_remaining < 1) {
    return Response.json({ error: 'Upgrade to Pro for AI resume review' }, { status: 403 });
  }

  const client = new Anthropic();
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are an expert AI career coach specializing in the Indian tech market.
      Review this resume for an AI/ML role:

      RESUME: ${resumeText}

      JOB DESCRIPTION: ${targetJobDescription}

      Provide:
      1. ATS compatibility score (0-100)
      2. Top 3 missing keywords
      3. 3 specific improvements for Indian AI job market
      4. Salary benchmark for this profile (INR range)
      5. Which companies in India would be a fit`
    }]
  });

  // Decrement review counter
  await supabase.from('memberships')
    .update({ resume_reviews_remaining: user.resume_reviews_remaining - 1 })
    .eq('user_id', userId);

  return Response.json({ review: message.content[0].text });
}
```

### 7.4 Conversion Funnel

```
[Free Signup]
     ↓ (Day 1)
[Onboarding: "Complete your profile for better job matches"]
     ↓ (Day 2)
[Job Alert Email: "3 jobs match your profile — apply now (2 require Pro)"]
     ↓ (Day 3)
[Feature Gate: "You've used 5/5 free applications this month"]
     ↓ (Day 4)
[AI Preview Email: "Here's a snippet of your AI resume score: 62/100"]
     ↓ (Day 7)
[Trial Offer: "7-day Elite trial — no credit card needed"]
     ↓ (Day 14)
[Conversion: "Your trial ends in 2 days. Lock in Pro for ₹299/mo"]
     ↓
[Paid Member → Upsell Elite at Month 3]
```

**Brevo automation sequences** handle all above emails (free tier up to 300 emails/day).

### 7.5 Target Conversion Rates

| Stage | Benchmark | Target |
|-------|-----------|--------|
| Visitor → Free Signup | 3–5% | 5% |
| Free → Trial | 10–15% | 12% |
| Trial → Paid (Pro) | 20–30% | 25% |
| Pro → Elite Upgrade | 10–15% | 12% |

---

## 8. Financial Projections

### 8.1 Assumptions

- **Traffic growth:** 30% month-over-month (organic SEO + social)
- **Base Month 1 traffic:** 500 unique visitors
- **Razorpay processing fee:** 2% + ₹3 per transaction
- **Claude API costs:** ~₹0.50/resume review (model: claude-haiku for cost efficiency)
- **Infrastructure costs:** ~₹4,000/month (Cloudflare Pages free, Supabase free tier, Brevo free, Claude API)
- **No paid marketing spend in first 6 months** (organic/content-led growth)

### 8.2 Month-by-Month Revenue Model — Conservative Scenario

| Month | Traffic | Listings Revenue | Employer Subs | Affiliates | Ads | Newsletter Sponsors | Memberships | **Total MRR** | Cumulative |
|-------|---------|-----------------|---------------|------------|-----|--------------------|-----------|-----------|----|
| 1 | 500 | ₹5,000 | ₹0 | ₹1,000 | ₹300 | ₹0 | ₹0 | **₹6,300** | ₹6,300 |
| 2 | 650 | ₹8,000 | ₹4,999 | ₹3,000 | ₹600 | ₹0 | ₹1,500 | **₹18,099** | ₹24,399 |
| 3 | 900 | ₹15,000 | ₹9,998 | ₹8,000 | ₹1,500 | ₹0 | ₹5,000 | **₹39,498** | ₹63,897 |
| 4 | 1,200 | ₹22,000 | ₹14,997 | ₹12,000 | ₹2,500 | ₹15,000 | ₹8,000 | **₹74,497** | ₹1,38,394 |
| 5 | 1,600 | ₹32,000 | ₹24,995 | ₹17,000 | ₹4,000 | ₹30,000 | ₹14,000 | **₹1,21,995** | ₹2,60,389 |
| 6 | 2,200 | ₹55,000 | ₹44,993 | ₹25,000 | ₹6,000 | ₹30,000 | ₹20,000 | **₹1,80,993** | ₹4,41,382 |
| 7 | 3,000 | ₹70,000 | ₹59,990 | ₹35,000 | ₹9,000 | ₹45,000 | ₹32,000 | **₹2,50,990** | ₹6,92,372 |
| 8 | 4,000 | ₹90,000 | ₹74,988 | ₹48,000 | ₹13,000 | ₹60,000 | ₹50,000 | **₹3,35,988** | ₹10,28,360 |
| 9 | 5,500 | ₹1,10,000 | ₹89,985 | ₹60,000 | ₹17,000 | ₹60,000 | ₹72,000 | **₹4,08,985** | ₹14,37,345 |
| 10 | 7,500 | ₹1,35,000 | ₹1,09,982 | ₹72,000 | ₹22,000 | ₹75,000 | ₹95,000 | **₹5,08,982** | ₹19,46,327 |
| 11 | 10,000 | ₹1,55,000 | ₹1,29,979 | ₹82,000 | ₹32,000 | ₹90,000 | ₹1,20,000 | **₹6,08,979** | ₹25,55,306 |
| 12 | 14,000 | ₹1,80,000 | ₹1,74,975 | ₹90,000 | ₹38,000 | ₹1,20,000 | ₹1,50,000 | **₹7,52,975** | ₹33,08,281 |

> **Year 1 Conservative Total: ₹33,08,281 (~$39,860 USD)**

### 8.3 Month-by-Month Revenue Model — Optimistic Scenario

| Month | Traffic | Listings | Employer Subs | Affiliates | Ads | Newsletter | Memberships | **Total MRR** |
|-------|---------|----------|---------------|------------|-----|------------|-------------|---------------|
| 1 | 800 | ₹10,000 | ₹4,999 | ₹3,000 | ₹500 | ₹0 | ₹2,000 | **₹20,499** |
| 3 | 2,000 | ₹35,000 | ₹29,994 | ₹18,000 | ₹4,000 | ₹30,000 | ₹12,000 | **₹1,28,994** |
| 6 | 6,000 | ₹1,00,000 | ₹89,985 | ₹50,000 | ₹15,000 | ₹75,000 | ₹45,000 | **₹3,74,985** |
| 12 | 40,000 | ₹3,50,000 | ₹3,49,960 | ₹1,65,000 | ₹85,000 | ₹2,40,000 | ₹2,50,000 | **₹14,39,960** |

> **Year 1 Optimistic Total: ~₹70,00,000 (~$84,337 USD)**

### 8.4 Break-Even Analysis

| Fixed Costs/Month | Amount |
|------------------|--------|
| Domain + Hosting (Cloudflare + Supabase Pro) | ₹2,000 |
| Brevo Pro (if >300 emails/day) | ₹1,800 |
| Claude API (production usage) | ₹3,000 |
| Lasso/ThirstyAffiliates | ₹3,200 |
| Razorpay fees (2% of revenue) | Variable |
| **Total Fixed** | **~₹10,000/month** |

**Break-even:** Month 2 (conservative scenario)  
**First ₹1L/month MRR:** Month 5–6 (conservative) or Month 3 (optimistic)  
**First ₹10L/month MRR:** Month 12 (optimistic)

---

## 9. Payment Integration — Full Razorpay Implementation

### 9.1 Razorpay Account Setup

1. **Register at** razorpay.com/in → Business type: "Technology — Job Portal"
2. **KYC documents required:**
   - PAN Card (personal or company)
   - Bank account details (cancelled cheque)
   - Business registration (GST certificate or Udyam registration)
   - Address proof
3. **Activation timeline:** 2–5 business days
4. **Settlement cycle:** T+2 business days to bank account

### 9.2 Payment Methods Supported (India-specific)

| Method | % of Users (India) | Notes |
|--------|------------------|-------|
| **UPI** (GPay, PhonePe, Paytm) | 65% | Instant, zero MDR for users |
| **Net Banking** | 15% | 60+ banks supported |
| **Credit/Debit Cards** | 12% | Visa, Mastercard, RuPay |
| **Razorpay Pay Later** | 5% | BNPL via Lazypay, ZestMoney |
| **EMI** (Credit card) | 3% | 3/6/9/12 month EMI |

### 9.3 Complete Frontend Integration (Next.js 15)

```javascript
// components/PaymentButton.jsx
'use client';
import { useState } from 'react';

export default function PaymentButton({ plan, amount, productId }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    // 1. Create order on server
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, amount, productId }),
    });
    const { orderId, razorpayAmount } = await res.json();

    // 2. Load Razorpay checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayAmount,
      currency: 'INR',
      name: 'GenAI Opportunities',
      description: `${plan} Plan`,
      image: 'https://genaijobhub.com/logo.png',
      order_id: orderId,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: { color: '#6C63FF' }, // Brand purple
      modal: {
        ondismiss: () => setLoading(false),
      },
      handler: async (response) => {
        // 3. Verify payment on server
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan,
            productId,
          }),
        });
        const result = await verifyRes.json();
        if (result.success) {
          window.location.href = `/success?plan=${plan}`;
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      console.error('Payment failed:', response.error);
      setLoading(false);
    });
    rzp.open();
    setLoading(false);
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : `Pay ₹${(amount/100).toLocaleString('en-IN')}`}
    </button>
  );
}
```

### 9.4 Payment Verification Webhook (Secure)

```javascript
// pages/api/verify-payment.js
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    productId
  } = req.body;

  // CRITICAL: Always verify signature server-side
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, error: 'Invalid signature' });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  if (plan === 'featured' || plan === 'premium') {
    await supabase.from('job_listings')
      .update({ status: 'active', tier: plan, activated_at: new Date() })
      .eq('id', productId);
  } else if (['pro', 'elite'].includes(plan)) {
    await supabase.from('memberships')
      .upsert({ user_id: productId, plan, valid_until: addMonths(new Date(), 1) });
  }

  // Send confirmation email via Brevo
  await sendBrevoEmail({
    to: user.email,
    templateId: BREVO_TEMPLATES.PAYMENT_SUCCESS,
    params: { plan, payment_id: razorpay_payment_id }
  });

  return res.json({ success: true });
}
```

### 9.5 Razorpay Webhook Events to Handle

| Event | Action |
|-------|--------|
| `payment.captured` | Activate listing/subscription |
| `payment.failed` | Send failure email, retry prompt |
| `subscription.activated` | Start employer subscription |
| `subscription.charged` | Renew subscription, send invoice |
| `subscription.cancelled` | Downgrade account, send win-back email |
| `refund.processed` | Update Supabase, notify user |

### 9.6 International Payments (Global Employers)

For USD/GBP/EUR payments from international employers:
- Enable **Razorpay International** (requires FIRA/FIRC for RBI compliance)
- Alternatively use **Stripe** for non-Indian customers (2.9% + 30¢)
- **DLocal** for Southeast Asian employers

### 9.7 GST Invoice Automation

```javascript
// Auto-generate GST invoice after payment
const invoice = await razorpay.invoices.create({
  type: 'invoice',
  description: `GenAI Opportunities - ${plan} Plan`,
  amount: amount,
  currency: 'INR',
  customer: {
    name: employer.company_name,
    email: employer.email,
    gstin: employer.gstin, // Optional, for B2B input credit
  },
  line_items: [{
    name: plan,
    amount: amount,
    quantity: 1,
  }],
  sms_notify: 1,
  email_notify: 1,
});
```

---

## 10. Revenue Dashboard

### 10.1 Key Metrics to Track (North Star Metrics)

#### Primary Revenue Metrics
| Metric | Definition | Target (Month 6) | Target (Month 12) |
|--------|-----------|------------------|-------------------|
| **MRR** | Monthly Recurring Revenue | ₹1,50,000 | ₹7,00,000 |
| **ARR** | Annual Run Rate (MRR × 12) | ₹18,00,000 | ₹84,00,000 |
| **MRR Growth Rate** | Month-over-month % change | 25%+ | 20%+ |
| **Net Revenue Retention** | Revenue retained from existing customers | 90%+ | 95%+ |
| **LTV** | Customer Lifetime Value | ₹8,000+ | ₹15,000+ |
| **CAC** | Customer Acquisition Cost | <₹500 | <₹300 |
| **LTV:CAC Ratio** | | >5:1 | >10:1 |

#### Stream-Specific Metrics
| Stream | Key Metric | Tracked Via |
|--------|-----------|-------------|
| Job Listings | Avg. ticket, listing renewal rate | Supabase + Razorpay |
| Employer Subs | Churn rate, expansion MRR | Baremetrics |
| Affiliates | EPC (Earnings per Click), conversion rate | Lasso / Impact.com |
| Display Ads | RPM, CTR, viewability | Google AdSense dashboard |
| Newsletter | Open rate, click rate, sponsor fill rate | Brevo analytics |
| Memberships | Trial-to-paid rate, DAU, feature usage | Supabase + PostHog |

#### Growth & Engagement Metrics
| Metric | Tool | Target |
|--------|------|--------|
| Organic traffic | Google Search Console + Plausible | +25%/mo |
| Newsletter subscribers | Brevo | 2,000 by Month 6 |
| Job applications submitted | Supabase | 500+/month |
| Employer DAU/WAU | PostHog | 20+ active employers |
| Resume reviews completed | Supabase | 200+/month |

### 10.2 Recommended Revenue Dashboard Tools

#### Tier 1 — Free/Freemium (Months 1–4)

| Tool | Cost | Use Case |
|------|------|----------|
| **Razorpay Dashboard** | Free | Payment transactions, settlements, refunds |
| **Supabase Studio** | Free | Database metrics, user counts, query analytics |
| **Google Search Console** | Free | Organic traffic, keyword rankings |
| **Brevo Analytics** | Free tier | Newsletter open/click rates, automation performance |
| **Plausible Analytics** | $9/mo (~₹750) | Privacy-friendly web analytics, traffic by page |
| **Google Analytics 4** | Free | Funnel analysis, conversion events |

#### Tier 2 — Paid Tools (Month 4+ when MRR > ₹50,000)

| Tool | Cost | Use Case |
|------|------|----------|
| **Baremetrics** | $108/mo | MRR, ARR, LTV, churn, revenue forecasting |
| **ChartMogul** | $100/mo | SaaS revenue analytics, cohort analysis |
| **PostHog** | Free up to 1M events | Product analytics, feature flags, session recordings |
| **Stripe Revenue Recognition** | 0.25% of revenue | If using Stripe for international |
| **Metabase** | $500/mo or self-host free | Custom SQL dashboards from Supabase |

#### Tier 3 — Enterprise (Month 9+)

| Tool | Cost | Use Case |
|------|------|----------|
| **Looker Studio** | Free | Multi-source dashboard (Supabase + AdSense + Brevo) |
| **Segment** | $120/mo | Customer data platform, unified analytics |
| **Amplitude** | Free up to 10M events | User behavior analytics |

### 10.3 Recommended Revenue Dashboard Layout (Looker Studio)

```
┌─────────────────────────────────────────────────────────┐
│  GenAIJobHub.com — Revenue Dashboard (Live)      │
├──────────┬──────────┬──────────┬──────────┬────────────┤
│  MRR     │  MRR Δ  │  ARR     │  Churn   │  LTV:CAC   │
│ ₹2,50,000│ +22%    │ ₹30,00,000│  2.1%   │   18:1     │
├──────────┴──────────┴──────────┴──────────┴────────────┤
│  REVENUE BY STREAM (Bar Chart — Last 12 Months)         │
│  [Listings] [Subs] [Affiliate] [Ads] [News] [Members]   │
├───────────────────────────┬────────────────────────────┤
│  MRR TREND (Line Chart)   │  COHORT RETENTION HEATMAP  │
│                           │                            │
├───────────────────────────┴────────────────────────────┤
│  TOP EMPLOYERS BY REVENUE │  AFFILIATE PERFORMANCE     │
│  1. TechCorp — ₹49,999   │  1. Semrush — $516/mo      │
│  2. FinAI — ₹29,997      │  2. Coursera — $441/mo     │
├───────────────────────────┴────────────────────────────┤
│  NEWSLETTER OPEN RATE: 34%   TRIAL→PAID: 28%           │
└─────────────────────────────────────────────────────────┘
```

### 10.4 Revenue Alerts & Automation

Set up automated alerts via **Supabase Edge Functions + Brevo**:

| Trigger | Alert | Action |
|---------|-------|--------|
| Employer subscription expires in 3 days | Email to employer | Include renewal discount code |
| Affiliate revenue drops >30% MoM | Internal Slack alert | Audit affiliate links |
| Newsletter open rate <20% | Internal alert | A/B test subject lines |
| Job listing not renewed in 25 days | Email to employer | "Renew for 20% off" offer |
| MRR drops from previous month | Founder email | Investigate churn reasons |
| Payment failure | Email to customer within 1hr | Smart retry link via Razorpay |

---

## 11. 90-Day Revenue Launch Roadmap

### Month 1: Foundation
- [ ] Razorpay account verified + KYC complete
- [ ] Basic listing payment flow live (₹999 tier)
- [ ] Affiliate links set up for top 5 tools (Jasper, Semrush, Coursera, Synthesia, ElevenLabs)
- [ ] Brevo newsletter setup with welcome sequence
- [ ] Google AdSense application submitted (needs 50+ pages first)
- [ ] Plausible Analytics installed

### Month 2: Activation
- [ ] Featured + Premium listing tiers live
- [ ] Starter employer subscription (₹4,999) launched
- [ ] Pro membership (₹299) launched with Claude resume review
- [ ] Affiliate resource hub page live with SEO optimization
- [ ] First 10 blog posts targeting affiliate keywords
- [ ] AdSense approved and live

### Month 3: Scale
- [ ] Growth + Enterprise employer subscriptions live
- [ ] Elite membership (₹999) launched
- [ ] Newsletter hits 500 subscribers → first sponsor pitch
- [ ] Baremetrics or ChartMogul integrated
- [ ] First direct employer subscription customer (target: 2 Starter + 1 Growth)
- [ ] Revenue: Target ₹40,000+ MRR

---

## 12. Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Low employer adoption early | High | High | Offer 1 free Featured listing to first 10 employers |
| Razorpay settlement delays | Low | Medium | Maintain ₹20,000 operating buffer |
| AdSense rejection | Medium | Low | Focus on affiliate as primary passive revenue |
| Newsletter unsubscribes | Medium | Medium | Strict value-first content, max 1 ad/issue |
| Affiliate program termination | Low | Medium | Diversify across 15+ programs, never >30% from 1 |
| Supabase free tier limits | Low | Medium | Monitor usage, upgrade ($25/mo) when near limits |
| Competitor undercutting | Medium | Medium | Focus on India-specific value (GST invoices, INR, local salary data) |

---

*Report generated by Revenue Agent for GenAIJobHub.com*
*Version 1.0 | June 2026 | Confidential*
