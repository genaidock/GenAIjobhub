const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://ucwljilbxplonzmxwryh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedMoreTools() {
  const toolsToInsert = [
    // Coding & Development
    { name: "GitHub Copilot", category: "Coding Assistant", description: "AI pair programmer that suggests code and entire functions in real-time.", website_url: "https://github.com/features/copilot", is_featured: true },
    { name: "Cursor", category: "Coding Assistant", description: "The AI-first code editor designed to help you write software faster.", website_url: "https://cursor.sh", is_featured: true },
    { name: "v0 by Vercel", category: "UI Generation", description: "Generative UI tool that creates React and Tailwind components from text prompts.", website_url: "https://v0.dev", is_featured: false },
    
    // Research & Search
    { name: "Perplexity AI", category: "Search & Research", description: "AI search engine that provides cited, conversational answers to complex questions.", website_url: "https://www.perplexity.ai", is_featured: true },
    { name: "Hugging Face", category: "Platform & Models", description: "The collaboration platform for the machine learning community to build, train and deploy models.", website_url: "https://huggingface.co", is_featured: false },
    
    // Image Generation
    { name: "Midjourney", category: "Image Generation", description: "Incredibly high-quality AI image generation tool accessible via Discord.", website_url: "https://midjourney.com", is_featured: true },
    { name: "DALL-E 3", category: "Image Generation", description: "OpenAI's latest image generation model integrated directly into ChatGPT.", website_url: "https://openai.com/dall-e-3", is_featured: false },
    { name: "Stable Diffusion", category: "Image Generation", description: "Open-source latent text-to-image diffusion model for high quality imagery.", website_url: "https://stability.ai", is_featured: false },
    
    // Video Generation
    { name: "Runway ML", category: "Video Generation", description: "Applied AI research company building the next generation of creative video tools (Gen-2).", website_url: "https://runwayml.com", is_featured: true },
    { name: "Sora", category: "Video Generation", description: "OpenAI's groundbreaking text-to-video model capable of highly realistic scenes.", website_url: "https://openai.com/sora", is_featured: false },
    { name: "Pika Labs", category: "Video Generation", description: "An idea-to-video platform that brings your creativity to motion.", website_url: "https://pika.art", is_featured: false },
    
    // Audio & Voice
    { name: "ElevenLabs", category: "Audio Generation", description: "The most realistic AI voice generator and text to speech software.", website_url: "https://elevenlabs.io", is_featured: true },
    { name: "Suno", category: "Music Generation", description: "Create incredible, full-length songs with vocals and instruments from just a text prompt.", website_url: "https://suno.com", is_featured: false },
    
    // Writing & Productivity
    { name: "Notion AI", category: "Productivity", description: "Write better, think bigger, and work faster directly inside your Notion workspace.", website_url: "https://notion.so/product/ai", is_featured: false },
    { name: "Jasper", category: "Copywriting", description: "AI copilot for enterprise marketing teams to generate brand-aligned copy.", website_url: "https://jasper.ai", is_featured: false },
    
    // Other LLMs
    { name: "Mistral AI", category: "LLM & Chatbots", description: "Fast, open-weight AI models pushing the boundaries of performance and efficiency.", website_url: "https://mistral.ai", is_featured: false },
    { name: "Groq", category: "Inference Engine", description: "The LPU Inference Engine providing insanely fast token generation for open-source LLMs.", website_url: "https://groq.com", is_featured: false }
  ];

  for (const tool of toolsToInsert) {
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

seedMoreTools();

