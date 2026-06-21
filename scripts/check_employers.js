const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://ucwljilbxplonzmxwryh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjd2xqaWxieHBsb256bXh3cnloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTMyOTU1MCwiZXhwIjoyMDk2OTA1NTUwfQ.Gm2WfGwrGKx81botIuj64wAEKSBygEqS8mhZpswVmo0'
);

async function fetchEmployers() {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_type', 'employer');

  if (error) {
    console.error('Error fetching employers:', error);
  } else {
    console.log(`Found ${data.length} employers.`);
    console.log(JSON.stringify(data, null, 2));
  }
}

fetchEmployers();
