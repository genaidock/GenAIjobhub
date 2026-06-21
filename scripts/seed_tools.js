const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://ucwljilbxplonzmxwryh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedTools() {
  const toolsToInsert = [
    {
      name: "ChatGPT",
      category: "LLM & Chatbots",
      description: "OpenAI's flagship conversational AI model, excellent for coding, writing, and analysis.",
      website_url: "https://chatgpt.com",
      is_featured: true
    },
    {
      name: "Claude",
      category: "LLM & Chatbots",
      description: "Anthropic's AI assistant, known for large context windows and nuanced, helpful responses.",
      website_url: "https://claude.ai",
      is_featured: true
    },
    {
      name: "Google Gemini",
      category: "LLM & Chatbots",
      description: "Google's multimodal AI model, deeply integrated with the Google ecosystem.",
      website_url: "https://gemini.google.com",
      is_featured: true
    }
  ];

  // First try to check if table exists
  const { data, error } = await supabaseAdmin.from('tools').select('*').limit(1);
  if (error) {
    console.error('Tools table might not exist or error:', error.message);
  } else {
    // Upsert or insert tools
    for (const tool of toolsToInsert) {
      // Check if exists
      const { data: existing } = await supabaseAdmin.from('tools').select('*').eq('name', tool.name);
      if (!existing || existing.length === 0) {
        console.log(`Inserting ${tool.name}...`);
        const { error: insertError } = await supabaseAdmin.from('tools').insert([tool]);
        if (insertError) {
          console.error(`Failed to insert ${tool.name}:`, insertError.message);
        } else {
          console.log(`Successfully inserted ${tool.name}!`);
        }
      } else {
        console.log(`${tool.name} already exists.`);
      }
    }
  }
}

seedTools();

