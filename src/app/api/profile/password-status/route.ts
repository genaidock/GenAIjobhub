import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase';

export async function GET() {
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
    
    // Query auth.users to see if encrypted_password is set
    const { data, error } = await adminClient
      .rpc('get_password_status', { user_id: user.id });
      
    // Wait, RPC? We don't have an RPC for this, but we can query auth.users directly via the postgres API if the service role key has access, or maybe not.
    // auth.users is usually not accessible via the REST API even with the service role key unless exposed.
    // Let's think. Supabase's REST API maps to the `public` schema. `auth.users` is in the `auth` schema.
    // You cannot query `auth.users` via the standard Supabase client `from('users')` because it defaults to `public`.
    // Wait, the adminClient (supabase-js) has `supabase.auth.admin.getUserById(user.id)`. Let's check what it returns.
    
    const { data: adminUser, error: adminError } = await adminClient.auth.admin.getUserById(user.id);

    if (adminError || !adminUser.user) {
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }

    // Checking if the user has an email identity is a very reliable proxy since password auth requires an email identity.
    const hasPassword = adminUser.user.app_metadata?.providers?.includes('email') || false;

    return NextResponse.json({ hasPassword }, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
