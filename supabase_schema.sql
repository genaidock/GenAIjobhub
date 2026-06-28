-- Run this in your Supabase SQL Editor

-- Create profiles table to track credits and plans
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'elite')),
    coach_credits_remaining INTEGER DEFAULT 1,
    coach_credits_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_type TEXT,
    full_name TEXT,
    company_name TEXT,
    linkedin_url TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    plan, 
    coach_credits_remaining,
    user_type,
    full_name,
    company_name,
    linkedin_url
  )
  VALUES (
    new.id, 
    new.email, 
    'free', 
    1,
    new.raw_user_meta_data->>'user_type',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'linkedin_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger/Function to reset credits monthly (can be called via Supabase pg_cron or an edge function)
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS void AS $$
BEGIN
  -- Reset Free users to 1
  UPDATE public.profiles 
  SET coach_credits_remaining = 1, coach_credits_reset_at = NOW() 
  WHERE plan = 'free' AND coach_credits_reset_at < NOW() - INTERVAL '1 month';

  -- Reset Pro users to 5
  UPDATE public.profiles 
  SET coach_credits_remaining = 5, coach_credits_reset_at = NOW() 
  WHERE plan = 'pro' AND coach_credits_reset_at < NOW() - INTERVAL '1 month';

  -- Elite users don't need reset as they might be unlimited, but we can set them to 9999
  UPDATE public.profiles 
  SET coach_credits_remaining = 9999, coach_credits_reset_at = NOW() 
  WHERE plan = 'elite' AND coach_credits_reset_at < NOW() - INTERVAL '1 month';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    salary TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Job Policies: anyone can read jobs
CREATE POLICY "Anyone can view jobs"
ON public.jobs FOR SELECT
USING (true);

-- Job Policies: employers can insert their own jobs
CREATE POLICY "Employers can insert their own jobs"
ON public.jobs FOR INSERT
WITH CHECK (auth.uid() = employer_id);

-- Job Policies: employers can update their own jobs
CREATE POLICY "Employers can update their own jobs"
ON public.jobs FOR UPDATE
USING (auth.uid() = employer_id);

-- Job Policies: employers can delete their own jobs
CREATE POLICY "Employers can delete their own jobs"
ON public.jobs FOR DELETE
USING (auth.uid() = employer_id);

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    seeker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, seeker_id) -- Prevent multiple applications for the same job by the same user
);

-- Enable RLS for applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applications Policies: employers can view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs"
ON public.applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = public.applications.job_id
    AND jobs.employer_id = auth.uid()
  )
);

-- Applications Policies: seekers can view their own applications
CREATE POLICY "Seekers can view their own applications"
ON public.applications FOR SELECT
USING (auth.uid() = seeker_id);

-- Applications Policies: seekers can apply to jobs
CREATE POLICY "Seekers can insert their own applications"
ON public.applications FOR INSERT
WITH CHECK (auth.uid() = seeker_id);
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
