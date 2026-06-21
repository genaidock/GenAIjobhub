import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEED_TOOLS = [
  {
    name: "ChatGPT",
    description: "The most popular conversational AI model by OpenAI, capable of coding, writing, and analysis.",
    category: "LLMs",
    website_url: "https://chatgpt.com",
    is_featured: true,
  },
  {
    name: "Midjourney",
    description: "Generates breathtaking, highly artistic images from natural language text prompts.",
    category: "Image Generation",
    website_url: "https://midjourney.com",
    is_featured: true,
  },
  {
    name: "Cursor",
    description: "The AI-first code editor built for pair-programming with LLMs like Claude 3.5 Sonnet.",
    category: "Developer Tools",
    website_url: "https://cursor.sh",
    is_featured: true,
  },
  {
    name: "Make",
    description: "Visually design, build, and automate tasks and workflows combining various AI APIs.",
    category: "Automation",
    website_url: "https://make.com",
    is_featured: false,
  },
  {
    name: "ElevenLabs",
    description: "Incredibly realistic and versatile AI voice generator for text-to-speech.",
    category: "Audio / Voice",
    website_url: "https://elevenlabs.io",
    is_featured: false,
  }
];

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const names = SEED_TOOLS.map(t => t.name);
  await supabaseAdmin.from('tools').delete().in('name', names);

  const { data, error } = await supabaseAdmin.from('tools').insert(SEED_TOOLS).select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ message: "Tools database successfully seeded!", tools: data });
}
