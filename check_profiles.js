const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://ucwljilbxplonzmxwryh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjd2xqaWxieHBsb256bXh3cnloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTMyOTU1MCwiZXhwIjoyMDk2OTA1NTUwfQ.Gm2WfGwrGKx81botIuj64wAEKSBygEqS8mhZpswVmo0'
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
