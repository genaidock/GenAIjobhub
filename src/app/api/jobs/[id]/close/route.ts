import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { closed_reason } = await req.json();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch (_) {}
          },
        },
      }
    );

    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: Please log in." }, { status: 401 });
    }

    // Verify ownership
    const { data: job, error: fetchError } = await supabase
      .from('jobs')
      .select('employer_id')
      .eq('id', id)
      .single();

    if (fetchError || !job) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }

    if (job.employer_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only close your own jobs.' }, { status: 403 });
    }

    // Update job status
    const { data: updatedJob, error: updateError } = await supabase
      .from('jobs')
      .update({ 
        status: 'closed',
        closed_reason: closed_reason || 'Not specified'
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error("Supabase job close error:", updateError);
      throw updateError;
    }

    return NextResponse.json({ message: "Job closed successfully", job: updatedJob });
  } catch (error: any) {
    console.error("Error closing job:", error);
    return NextResponse.json({ error: "Failed to close job. Please try again later." }, { status: 500 });
  }
}
