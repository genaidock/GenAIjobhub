const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://ucwljilbxplonzmxwryh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function testInsertProfile() {
  const dummyId = generateUUID();
  const { data, error } = await supabaseAdmin.from('profiles').insert([
    { id: dummyId, non_existent_col_abc123: 'test' }
  ]);
  
  if (error) {
    console.error('Insert Profile Error:', error);
  } else {
    console.log('Insert Profile Success:', data);
  }
}

testInsertProfile();

