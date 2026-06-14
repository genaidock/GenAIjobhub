import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the SERVICE_ROLE_KEY to bypass RLS securely on the backend
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const sanitizedDescription = jobData.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Auth Check
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized: Please log in to post a job" }, { status: 401 });
    }
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }

    // Verify user is an employer
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profileError || profileData?.user_type !== 'employer') {
      return NextResponse.json(
        { error: 'Forbidden: Only employers can post jobs.' },
        { status: 403 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_service_role_key_here') {
      return NextResponse.json({ error: "Server is not configured properly (Missing Service Role Key)" }, { status: 500 });
    }

    // Insert the job into the database
    const { data, error } = await supabaseAdmin
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
          employer_id: user.id // Tie job to authenticated user
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, job: data[0] });
  } catch (error: any) {
    console.error("Error inserting job:", error);
    return NextResponse.json({ error: error.message || "Failed to post job" }, { status: 500 });
  }
}
