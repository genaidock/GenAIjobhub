export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use the service role key to bypass Row Level Security for seeding
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEED_JOBS = [
  {
    title: "Senior Prompt Engineer",
    company_name: "Anthropic",
    location: "Remote (Global)",
    is_remote: true,
    salary_range: "$140k - $180k",
    description: "Looking for an expert prompt engineer.",
    is_featured: true,
  },
  {
    title: "AI Product Manager",
    company_name: "Bharat AI",
    location: "Bangalore, IN",
    is_remote: false,
    salary_range: "₹35L - ₹50L",
    description: "Lead product strategy for Generative AI.",
    is_featured: true,
  },
  {
    title: "Machine Learning Engineer",
    company_name: "OpenAI",
    location: "San Francisco, CA",
    is_remote: false,
    salary_range: "$160k - $220k",
    description: "Core ML systems engineering.",
    is_featured: false,
  },
  {
    title: "AI Automation Consultant",
    company_name: "GrowthX",
    location: "Remote (India)",
    is_remote: true,
    salary_range: "$5k - $8k / mo",
    description: "Build internal automation workflows.",
    is_featured: false,
  }
];

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Idempotency: delete matching existing seed jobs before inserting
  const titles = SEED_JOBS.map(j => j.title);
  await supabaseAdmin.from('jobs').delete().in('title', titles);

  const { data, error } = await supabaseAdmin.from('jobs').insert(SEED_JOBS).select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ message: "Database successfully seeded!", jobs: data });
}
