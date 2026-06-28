import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS for updating profiles
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { company_name } = body;

    if (!company_name || typeof company_name !== 'string' || !company_name.trim()) {
      return NextResponse.json({ error: 'Company name is required.' }, { status: 400 });
    }

    // Upgrade the user type to 'both' and set their company name
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        user_type: 'both',
        company_name: company_name.trim() 
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update profile:', updateError);
      return NextResponse.json({ error: 'Failed to upgrade account' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Account upgraded successfully' });
  } catch (error: any) {
    console.error('Error in upgrade API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
