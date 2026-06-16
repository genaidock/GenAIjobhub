import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, keywords } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
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

    // Insert the email and keywords into the subscribers table, defaulting to unverified
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email, keywords, is_verified: false }])
      .select();

    if (error) {
      // Supabase throws a unique constraint error if the email already exists
      if (error.code === '23505') {
        return NextResponse.json({ error: "You are already subscribed!" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: "Please check your email to verify your subscription.",
      subscriber: data[0] 
    });
  } catch (error: any) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}
