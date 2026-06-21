const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const jobsToSeed = [
  {
    title: "Senior Machine Learning Engineer, Generative AI",
    company_name: "OpenAI",
    location: "San Francisco, CA",
    is_remote: false,
    salary_range: "$200,000 - $370,000",
    description: "We are looking for a Senior Machine Learning Engineer to join our core model training team. You will be responsible for scaling up our pre-training pipelines and optimizing distributed training across thousands of GPUs.\n\nRequirements:\n- 5+ years of experience in deep learning.\n- Experience with PyTorch and distributed training (Megatron-LM, DeepSpeed).\n- Strong systems programming skills (C++, CUDA is a plus).",
    apply_url: "https://openai.com/careers",
    is_featured: true
  },
  {
    title: "Prompt Engineer & LLM Evaluator",
    company_name: "Anthropic",
    location: "Remote",
    is_remote: true,
    salary_range: "$130,000 - $180,000",
    description: "As a Prompt Engineer at Anthropic, you will work closely with our alignment and safety teams to develop complex prompts that test the boundaries of our Claude models. You will help build evaluation datasets and measure model capabilities.\n\nRequirements:\n- Excellent written communication skills.\n- Deep understanding of prompt engineering techniques (few-shot, chain-of-thought, tree-of-thoughts).\n- Python scripting experience for automating evaluations.",
    apply_url: "https://www.anthropic.com/careers",
    is_featured: true
  },
  {
    title: "AI Product Manager",
    company_name: "Hugging Face",
    location: "New York, NY or Remote",
    is_remote: true,
    salary_range: "$150,000 - $220,000",
    description: "Join Hugging Face to democratize good machine learning! We are looking for an AI Product Manager to lead the development of our enterprise Inference API platform. You will work with engineers to deliver scalable LLM hosting solutions.\n\nRequirements:\n- 3+ years in product management.\n- Deep familiarity with the open-source AI ecosystem (Transformers, Diffusers).\n- Experience working with B2B SaaS products.",
    apply_url: "https://huggingface.co/careers",
    is_featured: false
  },
  {
    title: "RAG Systems Engineer",
    company_name: "Pinecone",
    location: "Remote",
    is_remote: true,
    salary_range: "$160,000 - $210,000",
    description: "Pinecone is looking for an engineer to build reference architectures and tooling for Retrieval-Augmented Generation (RAG) applications using our vector database. You will create open-source examples and help our largest customers implement scalable semantic search.\n\nRequirements:\n- Strong backend engineering skills (Python, Go, or Node.js).\n- Experience with LangChain, LlamaIndex, or Haystack.\n- Knowledge of vector embeddings and similarity search.",
    apply_url: "https://www.pinecone.io/careers/",
    is_featured: false
  },
  {
    title: "Applied AI Researcher - Diffusion Models",
    company_name: "Midjourney",
    location: "San Francisco, CA",
    is_remote: false,
    salary_range: "$250,000 - $400,000",
    description: "Help us build the future of visual imagination. We are seeking a researcher with deep expertise in diffusion models to improve the quality, coherence, and speed of our image generation models.\n\nRequirements:\n- Published research in top-tier conferences (NeurIPS, CVPR, ICML) on generative models.\n- Hands-on experience training large-scale diffusion models from scratch.",
    apply_url: "https://www.midjourney.com/",
    is_featured: true
  },
  {
    title: "Full Stack AI Engineer",
    company_name: "Vercel",
    location: "Remote",
    is_remote: true,
    salary_range: "$140,000 - $190,000",
    description: "Vercel is looking for a Full Stack Engineer to integrate AI capabilities into our v0 platform. You will work on the intersection of generative UI and developer tools, making it easier for developers to build AI-native applications.\n\nRequirements:\n- Expert in React, Next.js, and TypeScript.\n- Experience integrating LLM APIs (OpenAI, Anthropic, Gemini) into production apps.\n- Understanding of streaming responses and AI UI patterns.",
    apply_url: "https://vercel.com/careers",
    is_featured: false
  }
];

async function run() {
  console.log("Checking if apply_url exists...");
  
  // We'll just try to insert one job first to see if it fails due to column missing
  console.log("Seeding jobs...");
  const { data, error } = await supabase
    .from('jobs')
    .insert(jobsToSeed)
    .select();

  if (error) {
    if (error.code === 'PGRST204' || error.message.includes('apply_url')) {
        console.log("apply_url column is missing. Adding it via REST API won't work easily if we don't have exec_sql.");
        console.error("Please run this in Supabase SQL editor: ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS apply_url TEXT;");
    } else {
        console.error("Error inserting jobs:", error);
    }
  } else {
    console.log(`Successfully inserted ${data.length} jobs.`);
  }
}

run();
