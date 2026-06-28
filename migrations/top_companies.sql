-- Create top_companies table
CREATE TABLE IF NOT EXISTS public.top_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    ai_focus TEXT NOT NULL,
    estimated_salary_range TEXT NOT NULL,
    hiring_insight TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.top_companies ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on top_companies"
    ON public.top_companies FOR SELECT
    USING (true);

-- Insert initial data
INSERT INTO public.top_companies (name, ai_focus, estimated_salary_range, hiring_insight)
VALUES
    ('OpenAI', 'AGI & Core LLMs', '$300k - $900k+', 'Aggressively hiring RLHF specialists & systems engineers.'),
    ('Anthropic', 'Constitutional AI', '$250k - $800k+', 'Strong focus on AI alignment, safety research, and scaling.'),
    ('Google DeepMind', 'Applied AI & AGI', '$250k - $750k+', 'Hiring across research and applied AI product teams.'),
    ('Meta (FAIR)', 'Open Source AI', '$250k - $700k+', 'Investing heavily in LLaMA ecosystem and PyTorch infrastructure.'),
    ('xAI', 'Grok & Core AI', '$300k - $800k+', 'Fast-paced environment; prioritizing hardcore engineering talent.'),
    ('Hugging Face', 'Open Source ML', '$180k - $400k+', 'Hiring remote-first open-source contributors and ML engineers.')
ON CONFLICT DO NOTHING;
