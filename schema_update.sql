-- We need to add the missing columns to the jobs table that our UI expects
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS is_remote BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS salary_range TEXT;

-- Drop the old salary column as it was replaced by salary_range
ALTER TABLE public.jobs DROP COLUMN IF EXISTS salary;

-- Make employer_id nullable temporarily so our seed script can run without failing
ALTER TABLE public.jobs ALTER COLUMN employer_id DROP NOT NULL;

-- Add columns for job expiration and API sync features
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_api_fetched BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;

-- Add moderation_status for job review pipeline
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected'));

-- Set existing seed/active jobs to approved so they are visible
UPDATE public.jobs SET moderation_status = 'approved' WHERE is_api_fetched = true OR moderation_status IS NULL;


-- Allow 'admin' user_type in profiles table
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_type_check CHECK (user_type IN ('employer', 'seeker', 'admin'));



