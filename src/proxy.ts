import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that require EMPLOYER role
const EMPLOYER_ONLY = ['/post-job', '/dashboard/employer'];

// Routes that require SEEKER role
const SEEKER_ONLY = ['/applications'];
// Note: /coach has a soft block in the UI (not a hard redirect) to preserve
// its use as a lead-gen page for unauthenticated visitors

// Routes that require ANY authenticated user
const AUTH_REQUIRED = ['/dashboard'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsEmployer = EMPLOYER_ONLY.some(p => pathname.startsWith(p));
  const needsSeeker = SEEKER_ONLY.some(p => pathname.startsWith(p));
  const needsAuth = AUTH_REQUIRED.some(p => pathname.startsWith(p));

  if (!needsEmployer && !needsSeeker && !needsAuth) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Not authenticated → redirect to login with return URL
  if (authError || !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fetch role from profiles (needed for role-specific routes)
  if (needsEmployer || needsSeeker) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    const userType = profile?.user_type;

    if (needsEmployer && !['employer', 'admin'].includes(userType)) {
      // Seeker trying employer route → redirect to jobs
      return NextResponse.redirect(new URL('/jobs', request.url));
    }

    if (needsSeeker && !['seeker', 'admin'].includes(userType)) {
      // Employer trying seeker route → redirect to their dashboard
      return NextResponse.redirect(new URL('/dashboard/employer', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
