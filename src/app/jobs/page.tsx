import { supabase } from '@/lib/supabase';
import JobsBoardClient from '@/components/JobsBoardClient';

export const metadata = {
  title: "Browse AI Jobs | GenAIJobHub — ML, Prompt Engineering, AI Product Roles",
  description: "Browse active AI, ML, and prompt engineering jobs across the globe.",
};

export const revalidate = 0; // Disable caching for MVP

export default async function JobsBoard() {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col items-center">
      {/* Dark Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-600/15 blur-[100px] animate-pulse pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            Find Your Next <span className="gradient-text">AI Role</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Browse {jobs?.length || 0} active opportunities across the globe.
          </p>
        </div>
      </section>

      {/* Smooth transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Light Content Area */}
      <section className="section-light w-full pb-20 px-[5%]">
        <div className="max-w-[1200px] w-full mx-auto">
          {/* Client Component for interactive filtering */}
          <JobsBoardClient initialJobs={jobs || []} />
        </div>
      </section>
    </div>
  );
}
