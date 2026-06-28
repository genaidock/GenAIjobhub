import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import DOMPurify from 'isomorphic-dompurify';

export async function GET() {
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

    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ gigs: data });
  } catch (error: any) {
    console.error("Error fetching gigs:", error);
    return NextResponse.json({ error: "Failed to fetch gigs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const gigData = await req.json();

    if (!gigData.title || !gigData.description || !gigData.budget || !gigData.estimated_duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (gigData.title.length > 200) {
      return NextResponse.json({ error: "Title too long" }, { status: 400 });
    }
    if (gigData.description.length > 5000) {
      return NextResponse.json({ error: "Description too long" }, { status: 400 });
    }

    const sanitizedDescription = DOMPurify.sanitize(gigData.description, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'h4'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
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

    // Verify user is an employer
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_type, company_name, full_name')
      .eq('id', user.id)
      .single();

    if (profileError || profileData?.user_type !== 'employer') {
      return NextResponse.json(
        { error: 'Forbidden: Only employers can post gigs.' },
        { status: 403 }
      );
    }

    const clientName = profileData.company_name || profileData.full_name || 'Anonymous Client';

    // Insert the gig into the database
    const { data, error } = await supabase
      .from('gigs')
      .insert([
        {
          employer_id: user.id,
          title: gigData.title,
          client_name: clientName,
          budget: gigData.budget,
          estimated_duration: gigData.estimated_duration,
          description: sanitizedDescription,
          is_urgent: gigData.is_urgent || false,
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, gig: data[0] });
  } catch (error: any) {
    console.error("Error posting gig:", error);
    return NextResponse.json({ error: error.message || "Failed to post gig" }, { status: 500 });
  }
}
