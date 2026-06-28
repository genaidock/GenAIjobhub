-- Add status and closed_reason to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
ADD COLUMN IF NOT EXISTS closed_reason TEXT;
