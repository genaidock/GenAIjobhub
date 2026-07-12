import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import PasswordForm from '@/components/PasswordForm';

export const metadata = {
  title: 'My Profile - GenAIJobhub',
  description: 'Manage your profile and account settings.',
};

export default async function ProfilePage() {
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
    redirect('/login/seeker');
  }

  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login/seeker');
  }

  // Combine auth user email and profile data
  const initialData = {
    full_name: profile.full_name,
    username: profile.username,
    company_name: profile.company_name,
    linkedin_url: profile.linkedin_url,
    company_domain: profile.company_domain,
    employee_range: profile.employee_range,
    city: profile.city,
    state: profile.state,
    country: profile.country,
    pincode: profile.pincode,
    phone: profile.phone || user.phone,
    user_type: profile.user_type,
    email: user.email || profile.email,
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Account Settings</h1>
          <p className="text-text-secondary mt-2">Manage your public profile and personal details.</p>
        </div>

        <ProfileForm initialData={initialData} />
        <PasswordForm />
      </div>
    </div>
  );
}
