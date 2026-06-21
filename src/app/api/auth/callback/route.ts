import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  
  // Custom params passed in options.redirectTo
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type') as string | null;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Ignore if called from a Server Component
          }
        },
      },
    }
  );

  let isSuccess = false;

  if (token_hash && type) {
    // Handle Magic Link (new Supabase format using token_hash)
    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });
    if (!error) {
      isSuccess = true;
    }
  } else if (code) {
    // Handle traditional OAuth / PKCE code exchange
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      isSuccess = true;
    }
  }

  if (isSuccess) {
    // If it's a new user signing up via OAuth, we need to ensure their type is set.
    const { data: { user } } = await supabase.auth.getUser();
    if (user && type && !user.user_metadata?.user_type) {
      // Update user metadata
      await supabase.auth.updateUser({
        data: { user_type: type }
      });
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
