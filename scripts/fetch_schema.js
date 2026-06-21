const fs = require('fs');
async function fetchSchema() {
  const url = 'https://ucwljilbxplonzmxwryh.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjd2xqaWxieHBsb256bXh3cnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMjk1NTAsImV4cCI6MjA5NjkwNTU1MH0.SX0Tyl4AZy8NiRTGJxOIdeF9mSGEGoi9Jhs2bKYVoWE';
  const response = await fetch(url);
  const data = await response.json();
  fs.writeFileSync('schema.json', JSON.stringify(data, null, 2));
  
  if (data.definitions && data.definitions.profiles) {
    console.log("Profiles Table Schema:", JSON.stringify(data.definitions.profiles, null, 2));
  } else {
    console.log("Could not find profiles definition.");
  }
}
fetchSchema();
