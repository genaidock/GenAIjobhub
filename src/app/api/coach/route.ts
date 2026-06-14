import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key', // Prevent crash if key is entirely missing
});

export async function POST(req: Request) {
  try {
    const { resume, targetRole } = await req.json();

    if (!resume || !targetRole) {
      return NextResponse.json({ error: "Resume and Target Role are required." }, { status: 400 });
    }

    const systemPrompt = `You are an elite, harsh-but-fair tech recruiter specializing in AI roles. 
You are reviewing a candidate's resume for the role of "${targetRole}". 
Provide brutally honest, structured feedback in 3 short sections:
1. Strengths: What they did right.
2. Weaknesses: Where they fall short for this specific role.
3. Actionable Advice: 3 bullet points on exactly what to change on the resume to get an interview.
Keep it concise, professional, and highly specific to AI/tech hiring.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is my resume:\n\n${resume}` }
        ],
        temperature: 0.7,
      });

      const feedback = response.choices[0]?.message?.content || "Could not generate feedback.";
      return NextResponse.json({ feedback });
      
    } catch (apiError: any) {
      console.warn("OpenAI API failed, falling back to mock response:", apiError.message);
      
      // Fallback response for out-of-quota (429) or invalid keys
      const mockFeedback = `**[MOCK FEEDBACK - API QUOTA EXCEEDED]**

### 1. Strengths
* You clearly stated your target role as **${targetRole}**.
* You have a solid foundation in the text provided, showing initiative to get feedback.

### 2. Weaknesses
* The resume lacks quantifiable metrics (e.g., "Improved model latency by 25%"). 
* There's not enough emphasis on modern AI stacks (RAG architectures, LLM fine-tuning, vector databases).
* It reads too much like a list of responsibilities rather than a list of accomplishments.

### 3. Actionable Advice
* **Add Hard Numbers:** For every bullet point, ask yourself "So what?". Add the impact in numbers.
* **Highlight AI-Specific Tools:** Explicitly mention frameworks like LangChain, LlamaIndex, PyTorch, or cloud AI services you've used.
* **Showcase Projects:** Link directly to a GitHub repo where you've deployed an actual AI/ML project.`;

      return NextResponse.json({ feedback: mockFeedback });
    }

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
