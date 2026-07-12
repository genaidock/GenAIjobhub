import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase';

export async function PUT(req: Request) {
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

    const payload = await req.json();
    const { full_name, company_name, linkedin_url, phone, company_domain, employee_range, city, state, country, pincode, username } = payload;

    const updateData: Record<string, any> = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (company_name !== undefined) updateData.company_name = company_name;
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    if (phone !== undefined) updateData.phone = phone;
    if (company_domain !== undefined) updateData.company_domain = company_domain;
    if (employee_range !== undefined) updateData.employee_range = employee_range;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;
    if (pincode !== undefined) updateData.pincode = pincode;
    
    const adminClient = createAdminClient();
    
    // Check if the user already has a username to prevent changing it
    const { data: currentProfile } = await adminClient
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (currentProfile?.username && username !== undefined && username !== currentProfile.username) {
      return NextResponse.json({ error: 'Username cannot be changed once set' }, { status: 400 });
    }

    if (username !== undefined && !currentProfile?.username) {
      updateData.username = username;
    }

    const { error: updateError } = await adminClient
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message, code: updateError.code }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
