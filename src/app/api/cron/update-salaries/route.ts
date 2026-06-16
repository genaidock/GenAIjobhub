import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const revalidate = 0; // Prevent caching

export async function GET(req: Request) {
  try {
    // In production, verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new Response('Unauthorized', { status: 401 });

    const coreRoles = [
      "Prompt Engineer", "AI Product Manager", "Machine Learning Engineer", 
      "AI Ethics Researcher", "Data Scientist", "MLOps Engineer", 
      "NLP Researcher", "Computer Vision Engineer"
    ];
    const experienceLevels = ["Entry-Level", "Mid-Level", "Senior/Lead"];
    
    const prompt = `You are a Senior Tech Compensation Analyst specializing in the Artificial Intelligence market.
Your task is to provide the absolute latest, realistic average salaries for the following AI roles across THREE experience levels:
Roles: ${coreRoles.join(', ')}
Levels: ${experienceLevels.join(', ')}

For EACH role and EACH experience level permutation, please provide:
1. role_title: The exact role name.
2. experience_level: The exact experience level string.
3. market_avg_global: The average salary string (e.g., "$150,000").
4. market_avg_india: The average salary string in INR (e.g., "₹25,00,000").
5. global_width: A Tailwind width string relative to the max salary (e.g., "w-[85%]").
6. india_width: A Tailwind width string relative to the max in India (e.g., "w-[50%]").
7. ai_market_insight: A 1-2 sentence compelling insight explaining WHY the salary is at this level.

Respond ONLY with valid JSON. Root object must have a "roles" array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert market analyst who returns valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });

    let rawData = response.choices[0].message.content || '{}';
    rawData = rawData.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(rawData);

    if (!data.roles || !Array.isArray(data.roles)) {
      throw new Error('Invalid JSON structure returned from OpenAI');
    }

    for (const role of data.roles) {
      const { error } = await supabaseAdmin
        .from('salary_trends')
        .upsert({
          role_title: role.role_title,
          experience_level: role.experience_level,
          market_avg_global: role.market_avg_global,
          market_avg_india: role.market_avg_india,
          global_width: role.global_width,
          india_width: role.india_width,
          ai_market_insight: role.ai_market_insight,
          last_updated: new Date().toISOString()
        }, { onConflict: 'role_title, experience_level' });

      if (error) console.error('Upsert Error for role', role.role_title, error);
    }

    return NextResponse.json({ success: true, updated_roles: data.roles.length });

  } catch (error: any) {
    console.error('Cron Update Error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
