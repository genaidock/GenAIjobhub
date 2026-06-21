const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://ucwljilbxplonzmxwryh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

