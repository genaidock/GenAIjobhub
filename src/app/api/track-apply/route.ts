import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Simple in-memory rate limit for demo/audit purposes
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();

export async function POST(request: Request) {
  try {
    // Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10; // Allow 10 applies per minute

    let record = rateLimitMap.get(ip);
    if (!record || now - record.lastReset > windowMs) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      if (record.count >= maxRequests) {
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
      }
      record.count += 1;
    }

    const { job_id } = await request.json();
    
    if (!job_id) {
      return NextResponse.json({ error: 'job_id is required' }, { status: 400 });
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please log in to apply" }, { status: 401 });
    }

    const { error } = await supabase
      .from('applications')
      .insert([{ job_id, seeker_id: user.id }]);

    if (error) {
      console.error('Error tracking application:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error tracking application:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
