import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'admin@genaijobhub.com';

async function getAdminClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch (_) {}
        },
      },
    }
  );
}

// GET: Fetch all pending job listings under review
export async function GET() {
  try {
    const supabase = await getAdminClient();

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Strict Email Verification
    if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden: Admin access only" }, { status: 403 });
    }

    // 3. Fetch pending jobs
    const { data: pendingJobs, error: fetchError } = await supabase
      .from('jobs')
      .select('*')
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    return NextResponse.json({ success: true, jobs: pendingJobs || [] });

  } catch (error: any) {
    console.error("Admin Fetch Pending Jobs Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch pending jobs" }, { status: 500 });
  }
}

// POST: Approve or Reject a job listing
export async function POST(req: Request) {
  try {
    const { jobId, action } = await req.json();

    if (!jobId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: "Missing or invalid arguments. Required: jobId, action ('approve' | 'reject')" }, { status: 400 });
    }

    const supabase = await getAdminClient();

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Strict Email Verification
    if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden: Admin access only" }, { status: 403 });
    }

    // Determine target status
    const targetStatus = action === 'approve' ? 'approved' : 'rejected';

    // 3. Update the job
    const { data: updatedJob, error: updateError } = await supabase
      .from('jobs')
      .update({ moderation_status: targetStatus })
      .eq('id', jobId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ 
      success: true, 
      message: `Job has been successfully ${targetStatus}.`,
      job: updatedJob
    });

  } catch (error: any) {
    console.error("Admin Moderate Job Error:", error);
    return NextResponse.json({ error: error.message || "Moderation failed" }, { status: 500 });
  }
}
