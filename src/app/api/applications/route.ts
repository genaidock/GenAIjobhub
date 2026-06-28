import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "Missing required field: jobId" }, { status: 400 });
    }

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

    // Verify user is a seeker
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profileError || profileData?.user_type !== 'seeker') {
      return NextResponse.json(
        { error: 'Forbidden: Only job seekers can apply.' },
        { status: 403 }
      );
    }

    // Insert the application into the database
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          job_id: jobId,
          seeker_id: user.id,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation (already applied)
        return NextResponse.json({ error: "You have already applied to this job." }, { status: 400 });
      }
      console.error("Supabase insert application error:", error);
      throw error;
    }

    return NextResponse.json({ message: "Application submitted successfully", application: data });
  } catch (error: any) {
    console.error("Error submitting application:", error);
    return NextResponse.json({ error: "Failed to submit application. Please try again later." }, { status: 500 });
  }
}
