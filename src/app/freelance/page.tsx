import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const metadata = {
  title: "AI Freelance Gigs | GenAIJobHub — Find Short-Term AI Contract Work",
  description: "Find short-term contracts, project-based work, and consulting opportunities in AI.",
};

export const revalidate = 0;

export default async function FreelanceBoard() {
  const { data: gigs } = await supabase
    .from('gigs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col items-center">
      {/* Dark Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-[350px] h-[350px] rounded-full bg-purple-600/15 blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            AI <span className="gradient-text">Freelance Gigs</span>
          </h1>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            Short-term contracts, project-based work, and consulting opportunities.
          </p>
          <Link href="/post-job" className="inline-block px-8 py-3 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all backdrop-blur-sm">
            Post a Gig
          </Link>
        </div>
      </section>

      {/* Smooth transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Light Content Area */}
      <section className="section-light w-full py-12 md:py-20 px-[5%]">
        <div className="max-w-[1200px] mx-auto">
          {(!gigs || gigs.length === 0) ? (
             <div className="text-center py-20 card-light">
               <p className="text-text-dark-secondary text-lg mb-4">✨ Exciting freelance gigs coming soon — check back daily!</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gigs.map((gig) => (
                <div key={gig.id} className="card-light p-8 flex flex-col relative overflow-hidden">
                  {gig.is_urgent && (
                     <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                       URGENT
                     </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="pill pill-purple font-bold text-sm">
                      {gig.budget}
                    </span>
                    <span className="pill pill-blue text-sm">
                      ⏱ {gig.estimated_duration}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-text-dark pr-12">{gig.title}</h3>
                  <p className="text-text-dark-secondary text-sm mb-6 flex-grow leading-relaxed">{gig.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-border-light pt-5 mt-auto">
                    <div className="text-sm text-text-dark-secondary">
                      Client: <span className="font-semibold text-text-dark">{gig.client_name}</span>
                    </div>
                    {/* Assuming gig.apply_url might exist in the future, otherwise just show a button */}
                    <button className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(109,40,217,0.3)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.4)] transition-all">
                      Send Proposal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
