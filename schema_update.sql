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
