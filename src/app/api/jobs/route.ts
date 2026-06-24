import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import DOMPurify from 'isomorphic-dompurify';

export async function POST(req: Request) {
  try {
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
    const sanitizedDescription = DOMPurify.sanitize(jobData.description, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'h4'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });

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
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }

    // Verify user is an employer
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_type, job_credits_remaining')
      .eq('id', user.id)
      .single();

    if (profileError || profileData?.user_type !== 'employer') {
      return NextResponse.json(
        { error: 'Forbidden: Only employers can post jobs.' },
        { status: 403 }
      );
    }

    if (profileData.job_credits_remaining === undefined || profileData.job_credits_remaining <= 0) {
      return NextResponse.json(
        { error: 'Insufficient job credits. Please purchase a job posting package.', requiresPayment: true },
        { status: 403 }
      );
    }

    // Parse and validate validity_days (max 45 days)
    let validityDays = 30; // Default validity
    if (jobData.validity_days !== undefined) {
      const parsed = parseInt(jobData.validity_days, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 45) {
        return NextResponse.json({ error: "Validity days must be between 1 and 45." }, { status: 400 });
      }
      validityDays = parsed;
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validityDays);

    // Insert the job into the database
    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          title: jobData.title,
          company_name: jobData.company_name,
          location: jobData.location || 'Remote',
          is_remote: jobData.is_remote ?? true,
          salary_range: jobData.salary_range || 'Not Specified',
          description: sanitizedDescription,
          apply_url: jobData.apply_url || '',
          is_featured: false, // Free jobs are not featured by default
          employer_id: user.id, // Tie job to authenticated user
          expires_at: expiresAt.toISOString(),
          is_api_fetched: false,
          moderation_status: 'pending'
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    // Decrement credits
    const { error: decrementError } = await supabase
      .from('profiles')
      .update({ job_credits_remaining: profileData.job_credits_remaining - 1 })
      .eq('id', user.id);

    if (decrementError) {
      console.error("Failed to decrement job credits:", decrementError);
    }

    return NextResponse.json({ success: true, job: data[0] });
  } catch (error: any) {
    console.error("Error inserting job:", error);
    return NextResponse.json({ error: error.message || "Failed to post job" }, { status: 500 });
  }
}
