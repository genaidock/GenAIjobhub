-- Add employer verification and new fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS company_domain TEXT,
ADD COLUMN IF NOT EXISTS employee_range TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT;

-- Drop github_url if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'github_url'
    ) THEN
        ALTER TABLE public.profiles DROP COLUMN github_url;
    END IF;
END $$;

-- Set existing users to verified so they don't lose access
UPDATE public.profiles SET is_verified = true;
