-- We need to add the missing columns to the jobs table that our UI expects
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS is_remote BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS salary_range TEXT;

-- Drop the old salary column as it was replaced by salary_range
ALTER TABLE public.jobs DROP COLUMN IF EXISTS salary;

-- Make employer_id nullable temporarily so our seed script can run without failing
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
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

-- Add job credits for packages
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_credits_remaining INTEGER DEFAULT 5;

-- Enable RLS and add basic policies for unprotected tables

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.subscribers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin')
);

ALTER TABLE public.gigs ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed'));
ALTER TABLE public.gigs ADD COLUMN IF NOT EXISTS employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gigs are viewable by everyone" ON public.gigs FOR SELECT USING (true);
CREATE POLICY "Admins can manage gigs" ON public.gigs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin')
);
CREATE POLICY "Employers can insert their own gigs" ON public.gigs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'employer')
  AND auth.uid() = employer_id
);
CREATE POLICY "Employers can update their own gigs" ON public.gigs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'employer')
  AND auth.uid() = employer_id
);
CREATE POLICY "Employers can delete their own gigs" ON public.gigs FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'employer')
  AND auth.uid() = employer_id
);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tools are viewable by everyone" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Admins can manage tools" ON public.tools FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin')
);

ALTER TABLE public.salary_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Salary trends are viewable by everyone" ON public.salary_trends FOR SELECT USING (true);
CREATE POLICY "Admins can manage salary trends" ON public.salary_trends FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin')
);

ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forum categories are viewable by everyone" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage forum categories" ON public.forum_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin')
);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forum posts are viewable by everyone" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert forum posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = author_id);

ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Forum comments are viewable by everyone" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert forum comments" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON public.forum_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own comments" ON public.forum_comments FOR DELETE USING (auth.uid() = author_id);

ALTER TABLE public.generated_cvs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own CVs" ON public.generated_cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own CVs" ON public.generated_cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own CVs" ON public.generated_cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own CVs" ON public.generated_cvs FOR DELETE USING (auth.uid() = user_id);

-- Add slug to forum categories for more robust routing
ALTER TABLE public.forum_categories ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID REFERENCES public.gigs(id) ON DELETE CASCADE NOT NULL,
    freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    cover_letter TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(gig_id, freelancer_id)
);
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Freelancers can view own proposals" ON public.proposals FOR SELECT USING (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can insert own proposals" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "Clients can view proposals for their gigs" ON public.proposals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.gigs WHERE gigs.id = proposals.gig_id AND gigs.employer_id = auth.uid())
);

-- Add phone column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add status and closed_reason to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
ADD COLUMN IF NOT EXISTS closed_reason TEXT;
