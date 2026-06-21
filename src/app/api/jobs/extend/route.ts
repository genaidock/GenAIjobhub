import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { jobId, validityDays } = await req.json();

    if (!jobId || !validityDays) {
      return NextResponse.json({ error: "Missing required fields: jobId and validityDays." }, { status: 400 });
    }

    const parsedDays = parseInt(validityDays, 10);
    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 45) {
      return NextResponse.json({ error: "Validity extension must be between 1 and 45 days." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch (_) {}
          },
        },
      }
    );

    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the job to check ownership and expiration
    const { data: job, error: fetchError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (fetchError || !job) {
      return NextResponse.json({ error: "Job listing not found." }, { status: 404 });
    }

    // Verify ownership
    if (job.employer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this job listing." }, { status: 403 });
    }

    if (!job.expires_at) {
      return NextResponse.json({ error: "This job listing does not have an expiration date." }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = new Date(job.expires_at);
    
    // Check if already expired
    if (expiresAt.getTime() < now.getTime()) {
      return NextResponse.json({ error: "This job has already expired. Please repost it instead." }, { status: 400 });
    }

    // Check if within the 5 days window of expiration
    const timeDiff = expiresAt.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff > 5) {
      return NextResponse.json({ 
        error: `Extension is only allowed within 5 days of expiration. This job still has ${Math.ceil(daysDiff)} days remaining.` 
      }, { status: 400 });
    }

    // Calculate new expiration date (NOW + validityDays)
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + parsedDays);

    const { data: updatedJob, error: updateError } = await supabase
      .from('jobs')
      .update({ expires_at: newExpiresAt.toISOString() })
      .eq('id', jobId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      message: `Job listing successfully extended by ${parsedDays} days.`,
      job: updatedJob
    });

  } catch (error: any) {
    console.error("Extend Job Error:", error);
    return NextResponse.json({ error: error.message || "Failed to extend job validity" }, { status: 500 });
  }
}
