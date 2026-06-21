const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ucwljilbxplonzmxwryh.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testSignup() {
  const email1 = `test+no_meta_${Date.now()}@example.com`;
  console.log('Attempting signup WITHOUT metadata:', email1);
  const res1 = await supabase.auth.signUp({
    email: email1,
    password: 'password123'
  });
  console.log('Result 1:', res1.error ? res1.error.message : 'Success');

  const email2 = `test+with_meta_${Date.now()}@example.com`;
  console.log('Attempting signup WITH metadata:', email2);
  const res2 = await supabase.auth.signUp({
    email: email2,
    password: 'password123',
    options: {
      data: {
        user_type: 'seeker',
        full_name: 'Test User',
      }
    }
  });
  console.log('Result 2:', res2.error ? res2.error.message : 'Success');
}

testSignup();

