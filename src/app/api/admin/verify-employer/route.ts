import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
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

    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // Verify admin role from database profile
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.user_type !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Administrator privileges required' }, { status: 403 });
    }

    const { employerId } = await req.json();

    if (!employerId) {
      return NextResponse.json({ error: 'Employer ID is required' }, { status: 400 });
    }

    const { error: updateError } = await adminClient
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', employerId);

    if (updateError) {
      console.error('Failed to verify employer:', updateError);
      return NextResponse.json({ error: 'Failed to verify employer' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Employer verified successfully' }, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
