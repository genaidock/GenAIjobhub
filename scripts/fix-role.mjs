import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }
  
  console.log('Current profiles:');
  console.log(profiles);

  for (const profile of profiles) {
    if (profile.user_type !== 'employer') {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_type: 'employer', job_credits_remaining: 10 })
        .eq('id', profile.id);
        
      if (updateError) {
        console.error(`Failed to update ${profile.id}:`, updateError);
      } else {
        console.log(`Updated ${profile.id} to employer`);
      }
    }
  }
}

run();
