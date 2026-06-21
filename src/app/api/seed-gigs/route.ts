import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SEED_GIGS = [
  {
    title: "Implement RAG Pipeline for Customer Support",
    client_name: "FinTech Startup Inc.",
    budget: "$3,000 - $5,000",
    estimated_duration: "2-4 Weeks",
    description: "Looking for an expert to build a robust Retrieval-Augmented Generation (RAG) pipeline using LangChain and Pinecone to handle our customer support queries based on our internal docs.",
    is_urgent: true,
  },
  {
    title: "Fine-tune Llama 3 for Medical Summarization",
    client_name: "HealthTech Solutions",
    budget: "$8,000",
    estimated_duration: "1 Month",
    description: "We need an ML engineer to fine-tune Llama 3 on a proprietary dataset of medical records to generate highly accurate patient summaries. Must have experience with LoRA/QLoRA.",
    is_urgent: false,
  },
  {
    title: "Build Custom AI Voice Agent",
    client_name: "Real Estate Agency",
    budget: "$2,500",
    estimated_duration: "2 Weeks",
    description: "Need a developer to connect ElevenLabs, Twilio, and OpenAI to build an inbound AI voice receptionist that can answer basic questions about our property listings.",
    is_urgent: true,
  },
  {
    title: "Prompt Engineering Consultant",
    client_name: "Marketing Agency",
    budget: "$100/hr",
    estimated_duration: "Ongoing (Part-time)",
    description: "We are looking for a prompt engineer to help our copywriting team write better prompts for Claude and ChatGPT to generate high-converting ad copy.",
    is_urgent: false,
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

  const titles = SEED_GIGS.map(g => g.title);
  await supabaseAdmin.from('gigs').delete().in('title', titles);

  const { data, error } = await supabaseAdmin.from('gigs').insert(SEED_GIGS).select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ message: "Gigs database successfully seeded!", gigs: data });
}
