import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import NewsletterForm from '@/components/NewsletterForm';
import ApplyButton from '@/components/ApplyButton';

export const revalidate = 0; // Disable caching for MVP so you see live updates instantly

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch (_) {}
        },
      },
    }
  );

  // Fetch live featured jobs from your Supabase database
  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_featured', true)
    .or('is_api_fetched.eq.true,moderation_status.eq.approved')
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch real count for metrics
  const { count } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('moderation_status', 'approved')
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());
  
  const realCount = count || 0;

  return (
    <div className="flex flex-col items-center">
      {/* ────────────────────────────────────────
          HERO SECTION — Dark with animated glows
          ──────────────────────────────────────── */}
      <section className="hero-glow hero-grid relative w-full py-32 md:py-40 px-[5%] text-center overflow-hidden flex flex-col items-center justify-center bg-background">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/15 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s', animationDuration: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '1s', animationDuration: '5s' }} />

        <div className="relative z-10 max-w-[850px] flex flex-col items-center">
          <div className="animate-fade-in-up inline-block px-5 py-2.5 bg-accent-primary/10 text-accent-primary rounded-full font-semibold mb-8 border border-accent-primary/20 text-sm tracking-wide">
            🚀 The #1 AI Opportunity Hub
          </div>
          <h1 className="animate-fade-in-up-delay-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-8 tracking-tight">
            Monetize Your <span className="gradient-text">AI Skills</span> Today
          </h1>
          <p className="animate-fade-in-up-delay-2 text-lg md:text-xl text-text-secondary mb-12 max-w-2xl leading-relaxed">
            Discover the highest-paying machine learning roles, prompt engineering gigs, and AI product manager positions across India and the globe.
          </p>
          <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row gap-5 mb-20">
            <Link href="/jobs" className="px-10 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.4)] hover:shadow-[0_8px_30px_rgba(109,40,217,0.5)] transition-all">
              Find AI Jobs
            </Link>
            <Link href="#newsletter" className="px-10 py-4 rounded-xl font-semibold text-lg text-text-primary border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all backdrop-blur-sm">
              Join Newsletter
            </Link>
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row justify-center gap-10 sm:gap-16 pt-10 border-t border-white/10 w-full">
            <div className="text-center">
              <strong className="block text-3xl md:text-5xl font-extrabold gradient-text mb-2">{realCount > 100 ? `${realCount}+` : realCount}</strong>
              <span className="text-text-secondary text-sm tracking-wide uppercase">Active Jobs</span>
            </div>
            <div className="text-center">
              <strong className="block text-3xl md:text-5xl font-extrabold gradient-text mb-2">Growing</strong>
              <span className="text-text-secondary text-sm tracking-wide uppercase">Daily 🚀</span>
            </div>
            <div className="text-center">
              <strong className="block text-3xl md:text-5xl font-extrabold gradient-text mb-2">100%</strong>
              <span className="text-text-secondary text-sm tracking-wide uppercase">AI Focused</span>
            </div>
          </div>
        </div>
      </section>

      {/* Smooth dark → light transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* ────────────────────────────────────────
          FEATURED JOBS — Light section
          ──────────────────────────────────────── */}
      <section className="section-light w-full py-20 md:py-28 px-[5%]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-text-dark mb-4 tracking-tight">
              Featured AI <span className="gradient-text-dark">Opportunities</span>
            </h2>
            <p className="text-text-dark-secondary text-lg max-w-xl mx-auto">
              Browse top roles from leading AI startups and enterprises.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {(!featuredJobs || featuredJobs.length === 0) ? (
               <div className="text-center py-16 card-light p-8">
                 <p className="text-text-dark-secondary text-lg mb-4">✨ Amazing AI jobs coming soon — check back daily!</p>
               </div>
            ) : (
              featuredJobs.map((job) => (
                <div key={job.id} className="card-light p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <Link href={`/jobs/${job.id}`} className="hover:underline">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-text-dark">{job.title}</h3>
                    </Link>
                    <div className="flex flex-wrap gap-4 text-sm mb-3 items-center">
                      <span className="font-bold text-accent-primary">{job.company_name}</span>
                      <span className="text-text-dark-secondary">📍 {job.location}</span>
                      <span className="text-text-dark-secondary">💼 {job.salary_range}</span>
                    </div>
                  </div>
                  <div className="mt-5 md:mt-0 flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                    {job.is_remote && (
                      <span className="pill pill-green">✓ Remote</span>
                    )}
                    <Link href={`/jobs/${job.id}`} className="px-6 py-2.5 rounded-lg font-semibold text-text-dark border-2 border-border-light hover:border-accent-primary hover:text-accent-primary transition-all text-sm text-center">
                      View Details
                    </Link>
                    {job.apply_url && (
                      <ApplyButton jobId={job.id} applyUrl={job.apply_url} className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(109,40,217,0.3)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.4)] transition-all text-sm text-center">
                        Apply Now
                      </ApplyButton>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-14">
            <Link href="/jobs" className="inline-block px-8 py-3.5 rounded-xl font-semibold text-text-dark border-2 border-border-light hover:border-accent-primary hover:text-accent-primary transition-all">
              View All Jobs &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          NEWSLETTER — Light secondary section
          ──────────────────────────────────────── */}
      <NewsletterForm />
    </div>
  );
}
