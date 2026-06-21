import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase admin client to bypass RLS for sync processes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simulated Mock External Job Feed
const MOCK_EXTERNAL_JOBS = [
  {
    external_id: "ext-openai-mle",
    title: "Research Engineer, GPT-5 Team",
    company_name: "OpenAI",
    location: "San Francisco, CA",
    is_remote: false,
    salary_range: "$220,000 - $380,000",
    description: "Join the GPT-5 research and training team. Help push the boundaries of reasoning and large-scale model optimization.\n\nRequirements:\n- Strong ML systems expertise.\n- PyTorch and CUDA experience.",
    apply_url: "https://openai.com/careers",
    is_featured: true,
  },
  {
    external_id: "ext-anthropic-prompt",
    title: "AI Safety Evaluator & Prompt Lead",
    company_name: "Anthropic",
    location: "Remote",
    is_remote: true,
    salary_range: "$140,000 - $200,000",
    description: "Develop automated prompt test suites and red-teaming scripts to verify safety properties of Claude models.\n\nRequirements:\n- Deep experience in Prompt Engineering.\n- Python script automation skills.",
    apply_url: "https://anthropic.com/careers",
    is_featured: false,
  },
  {
    external_id: "ext-google-deepmind",
    title: "Research Scientist, Gemini Vision",
    company_name: "Google DeepMind",
    location: "London, UK",
    is_remote: false,
    salary_range: "£120,000 - £180,000",
    description: "Build next-generation multimodal vision models for Gemini. Focus on video understanding and spatial representation.\n\nRequirements:\n- PhD in Computer Vision / Machine Learning.\n- Publications in CVPR, ICCV, or NeurIPS.",
    apply_url: "https://deepmind.google/careers",
    is_featured: true,
  }
];

export async function POST(req: Request) {
  try {
    // Auth Check: Require Supabase service role key
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      return NextResponse.json({ error: "Unauthorized: Invalid service token" }, { status: 401 });
    }

    // 1. Fetch current external jobs (in a real app, this would be a fetch() call to a partner API)
    // For demonstration, we allow filtering this list via query parameters (e.g. ?test_batch=2)
    const { searchParams } = new URL(req.url);
    const testBatch = searchParams.get('test_batch');
    
    let activeExternalJobs = MOCK_EXTERNAL_JOBS;
    
    // If testing batch 2, we simulate one job being closed/removed (ext-google-deepmind)
    if (testBatch === '2') {
      activeExternalJobs = MOCK_EXTERNAL_JOBS.slice(0, 2);
    }

    const activeExternalIds = activeExternalJobs.map(job => job.external_id);

    // 2. Prune old API jobs: Delete any jobs where is_api_fetched = true and the external_id is NOT in the active external list
    if (activeExternalIds.length > 0) {
      const { error: pruneError } = await supabaseAdmin
        .from('jobs')
        .delete()
        .eq('is_api_fetched', true)
        .not('external_id', 'in', `(${activeExternalIds.join(',')})`);
      
      if (pruneError) throw pruneError;
    } else {
      // If no jobs returned, delete all api fetched jobs
      const { error: pruneError } = await supabaseAdmin
        .from('jobs')
        .delete()
        .eq('is_api_fetched', true);
      
      if (pruneError) throw pruneError;
    }

    // 3. Upsert active jobs: Insert or update current active jobs with new expiration dates (30 days validity)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // API-fetched jobs get 30 days validity

    const jobsToUpsert = activeExternalJobs.map(job => ({
      ...job,
      is_api_fetched: true,
      expires_at: expiresAt.toISOString(),
      employer_id: null, // Sourced from API, not a registered employer
    }));

    const { data: upsertedJobs, error: upsertError } = await supabaseAdmin
      .from('jobs')
      .upsert(jobsToUpsert, { onConflict: 'external_id' })
      .select();

    if (upsertError) throw upsertError;

    return NextResponse.json({
      success: true,
      message: `Sync completed. Current active external jobs: ${upsertedJobs?.length || 0}. Expired/closed jobs pruned.`,
      jobs: upsertedJobs
    });

  } catch (error: any) {
    console.error("External Job Sync Error:", error);
    return NextResponse.json({ error: error.message || "Sync failed" }, { status: 500 });
  }
}
