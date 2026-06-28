import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import sanitizeHtml from 'sanitize-html';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const jobData = await req.json();

    // Basic server-side validation
    if (!jobData.title || !jobData.company_name || !jobData.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (jobData.title.length > 200 || jobData.company_name.length > 100) {
      return NextResponse.json({ error: "Title or company name too long" }, { status: 400 });
    }
    if (jobData.description.length > 10000) {
      return NextResponse.json({ error: "Description too long" }, { status: 400 });
    }

    // Basic sanitization
    const sanitizedDescription = sanitizeHtml(jobData.description, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'h4'],
      allowedAttributes: {
        'a': ['href', 'target', 'rel']
      }
    });

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
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }

    // Verify ownership
    const { data: existingJob, error: fetchError } = await supabase
      .from('jobs')
      .select('employer_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingJob) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }

    if (existingJob.employer_id !== user.id) {
      const { data: profile } = await supabase.from('profiles').select('user_type').eq('id', user.id).single();
      if (!profile || profile.user_type !== 'admin') {
        return NextResponse.json({ error: 'Forbidden: You can only edit your own jobs.' }, { status: 403 });
      }
    }

    // Update the job in the database
    const { data, error } = await supabase
      .from('jobs')
      .update({
        title: jobData.title,
        company_name: jobData.company_name,
        location: jobData.location || 'Remote',
        is_remote: jobData.is_remote ?? true,
        salary_range: jobData.salary_range || 'Not Specified',
        description: sanitizedDescription,
        apply_url: jobData.apply_url || ''
      })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, job: data[0] });
  } catch (error: any) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: error.message || "Failed to update job" }, { status: 500 });
  }
}
