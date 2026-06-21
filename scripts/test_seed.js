
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SEED_JOBS = [
  {
    title: "Senior Prompt Engineer",
    company_name: "Anthropic",
    location: "Remote (Global)",
    is_remote: true,
    salary_range: "$140k - $180k",
    description: "Looking for an expert prompt engineer.",
    is_featured: true,
  }
];

async function seed() {
  const { data, error } = await supabaseAdmin.from('jobs').insert(SEED_JOBS).select();
  if (error) {
    console.error("Error seeding:", error);
  } else {
    console.log("Successfully seeded via script!", data);
  }
}

seed();

