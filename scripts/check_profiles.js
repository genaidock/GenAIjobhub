const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://ucwljilbxplonzmxwryh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfiles() {
  const { data, error } = await supabaseAdmin.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error fetching profiles:', error);
  } else {
    console.log('Profiles data:', data);
  }
}

checkProfiles();

