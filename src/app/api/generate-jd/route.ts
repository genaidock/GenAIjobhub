import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

export async function POST(req: Request) {
  try {
    const { title, company_name } = await req.json();

    if (!title || !company_name) {
      return NextResponse.json({ error: "Job Title and Company Name are required." }, { status: 400 });
    }

    const systemPrompt = `You are an expert technical recruiter and copywriter. 
Write a highly engaging, professional job description for the role of "${title}" at "${company_name}".
The job description should be formatted in Markdown and include:
1. A brief, exciting company introduction.
2. The Role overview.
3. Key Responsibilities (bullet points).
4. Requirements & Qualifications (bullet points).
5. What We Offer / Benefits (bullet points).

Keep it concise, modern, and highly appealing to top-tier AI/Tech talent. DO NOT include placeholder text like [Insert Address] or [Date]. Make reasonable professional assumptions.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the job description now." }
        ],
        temperature: 0.7,
      });

      const description = response.choices[0]?.message?.content || "Could not generate description.";
      return NextResponse.json({ description });
      
    } catch (apiError: any) {
      console.warn("OpenAI API failed, falling back to mock JD:", apiError.message);
      
      const mockJD = `## About ${company_name}
We are a fast-growing, innovative AI startup looking to revolutionize the industry. At ${company_name}, we believe in pushing the boundaries of what generative AI can accomplish, and we're looking for top-tier talent to join our mission.

## The Role
We are seeking a highly skilled **${title}** to join our core engineering team. In this role, you will lead the development of our flagship AI products, working closely with researchers, product managers, and software engineers to bring state-of-the-art models to production.

## Key Responsibilities
* Design, build, and scale high-performance AI systems and data pipelines.
* Collaborate cross-functionally to define technical architecture and product roadmaps.
* Optimize large language models (LLMs) for low latency and high throughput.
* Mentor junior engineers and foster a culture of engineering excellence.

## Requirements & Qualifications
* 3+ years of experience in software engineering, with a strong focus on AI/ML.
* Proficiency in Python, TypeScript, and modern backend frameworks.
* Hands-on experience with LLMs, RAG architectures, and vector databases (e.g., Pinecone, Weaviate).
* Strong understanding of cloud platforms (AWS/GCP) and containerization (Docker/Kubernetes).
* Excellent problem-solving skills and a passion for staying up-to-date with AI research.

## What We Offer
* Competitive salary and generous equity package.
* Fully remote work flexibility.
* Top-tier health, dental, and vision insurance.
* $2,000 annual learning and development stipend.
* Unlimited PTO (and we actually encourage you to take it).`;

      return NextResponse.json({ description: mockJD });
    }

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
