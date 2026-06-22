import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client — safe to use in Client Components. Uses @supabase/ssr to sync auth with cookies.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client — ONLY import in API routes / server files, never in Client Components
export function createAdminClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

