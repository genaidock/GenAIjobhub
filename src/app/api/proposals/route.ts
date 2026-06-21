import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
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

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "You must be logged in to send a proposal." }, { status: 401 });
    }

    // Verify user is a seeker
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single();

    if (profile?.user_type !== 'seeker') {
      return NextResponse.json({ error: "Only freelancers (seekers) can submit proposals." }, { status: 403 });
    }

    const { gig_id, cover_letter } = await req.json();

    if (!gig_id || !cover_letter) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        gig_id,
        freelancer_id: session.user.id,
        cover_letter,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: "You have already submitted a proposal for this gig." }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, proposal: data });
  } catch (error: any) {
    console.error("Proposal Submission Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit proposal" }, { status: 500 });
  }
}
