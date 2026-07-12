import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    
    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Look up the user's profile by their exact username
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('username', username.trim())
      .single();

    if (error || !data || !data.email) {
      // Return 404 if the username isn't found
      return NextResponse.json({ error: 'Username not found' }, { status: 404 });
    }

    return NextResponse.json({ email: data.email });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
