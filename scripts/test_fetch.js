const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  console.log("Fetching all jobs...");
  const { data: jobs, error: err1 } = await supabase.from('jobs').select('*');
  
  if (err1) {
    console.error("Error fetching jobs:", err1);
    return;
  }
  
  console.log(`Found ${jobs.length} jobs.`);
  if (jobs.length === 0) return;
  
  const testId = jobs[0].id;
  console.log(`Fetching single job with id: ${testId}`);
  
  const { data: singleJob, error: err2 } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', testId)
    .single();
    
  if (err2) {
    console.error("Error fetching single job:", err2);
  } else {
    console.log("Successfully fetched single job:", singleJob.title);
  }
}

testFetch();

