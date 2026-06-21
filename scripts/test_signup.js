const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ucwljilbxplonzmxwryh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjd2xqaWxieHBsb256bXh3cnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMjk1NTAsImV4cCI6MjA5NjkwNTU1MH0.SX0Tyl4AZy8NiRTGJxOIdeF9mSGEGoi9Jhs2bKYVoWE'
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
