-- Fix missing ON DELETE CASCADE constraints for jobs and applications 
-- so that user accounts can be deleted properly.

ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_employer_id_fkey;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_employer_id_fkey FOREIGN KEY (employer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_seeker_id_fkey;
ALTER TABLE public.applications ADD CONSTRAINT applications_seeker_id_fkey FOREIGN KEY (seeker_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_job_id_fkey;
ALTER TABLE public.applications ADD CONSTRAINT applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;
