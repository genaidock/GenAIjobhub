import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'admin@genaijobhub.com';
const EXPECTED_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'genai-admin-key-2026';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key !== EXPECTED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );

    // 1. Fetch user list to check if admin already exists
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      throw listError;
    }

    const users = listData?.users || [];
    const existingAdmin = users.find(u => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

    if (!existingAdmin) {
      // 2. Create admin user
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        email_confirm: true,
        user_metadata: { user_type: 'admin' }
      });

      if (createError) {
        throw createError;
      }

      const adminUser = createData.user;

      // 3. Upsert profile row to ensure it exists and has 'admin' user_type
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: adminUser.id,
          email: ADMIN_EMAIL,
          user_type: 'admin',
          plan: 'free',
          coach_credits_remaining: 9999
        });

      if (profileError) {
        throw profileError;
      }

      return NextResponse.json({ 
        success: true, 
        message: "Admin user account created and initialized successfully." 
      });
    } else {
      // 4. Update existing user metadata and profile to ensure 'admin' type and verification
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingAdmin.id, {
        user_metadata: { user_type: 'admin' },
        email_confirm: true
      });

      if (updateError) {
        throw updateError;
      }

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: existingAdmin.id,
          email: ADMIN_EMAIL,
          user_type: 'admin',
          plan: 'free',
          coach_credits_remaining: 9999
        });

      if (profileError) {
        throw profileError;
      }

      return NextResponse.json({ 
        success: true, 
        message: "Admin user account verified and profile ensured successfully." 
      });
    }

  } catch (error: any) {
    console.error("Admin setup failed:", error);
    return NextResponse.json({ error: error.message || "Failed to setup admin user" }, { status: 500 });
  }
}
