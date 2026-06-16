import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as pdfParseMod from 'pdf-parse';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Handle CommonJS export difference
const pdfParse = (pdfParseMod as any).default || pdfParseMod;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch (_) {}
          },
        },
      }
    );

    const authHeader = req.headers.get('authorization');
    
    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader ? authHeader.replace('Bearer ', '') : undefined);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('cv_file') as File;
    const userId = user.id;

    if (!file) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 });
    }

    // Convert file to Buffer for pdf-parse
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let parsedText = '';
    try {
      const pdfData = await pdfParse(buffer);
      parsedText = pdfData.text;
    } catch (err) {
      console.error('Failed to parse PDF:', err);
      return NextResponse.json({ error: 'Failed to parse the PDF file. Ensure it is a valid PDF.' }, { status: 400 });
    }

    if (!parsedText || parsedText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract sufficient text from the PDF.' }, { status: 400 });
    }

    // Construct the prompt for OpenAI
    const prompt = `You are an elite Tech Recruiter and Expert Resume Writer specializing in AI, Machine Learning, and Software Engineering roles.
I am providing you with the raw text extracted from a user's uploaded CV/Resume.

Your task is to rewrite, polish, and optimize this CV. 
- Fix any grammatical issues.
- Rephrase bullet points to be action-driven (using strong action verbs) and impact-focused (highlighting metrics and results).
- Structure the CV cleanly into the following sections:
  1. Contact Info & Professional Summary
  2. Core Competencies & Technical Skills
  3. Professional Experience
  4. Key Projects (if applicable)
  5. Education

Output the final polished CV in beautifully formatted Markdown. DO NOT include any conversational filler (like "Here is your CV"). Just output the Markdown.

RAW CV TEXT:
${parsedText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using fast/cheap model for MVP
      messages: [
        { role: "system", content: "You are an expert resume writer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const generatedCV = response.choices[0].message.content || '';

    // Save to database
    const { data: insertedCV, error: dbError } = await supabase
      .from('generated_cvs')
      .insert({
        user_id: userId,
        source_data: { filename: file.name, original_text: parsedText },
        generated_content: generatedCV
      })
      .select()
      .single();

    if (dbError) {
      console.error('Failed to save CV to DB:', dbError);
      // We still return the generated CV even if DB save fails to not block the user, 
      // but ideally we should track this.
    }

    return NextResponse.json({ 
      success: true, 
      generated_content: generatedCV,
      id: insertedCV?.id
    });

  } catch (error: any) {
    console.error('CV Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during CV generation' },
      { status: 500 }
    );
  }
}
