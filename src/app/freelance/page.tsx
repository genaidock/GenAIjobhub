import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ProposalButton from '@/components/ProposalButton';

export const metadata = {
  title: "AI Freelance Gigs | GenAIJobHub — Find Short-Term AI Contract Work",
  description: "Find short-term contracts, project-based work, and consulting opportunities in AI.",
};

export const revalidate = 0;

export default async function FreelanceBoard() {
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

  const { data: { session } } = await supabase.auth.getSession();
  let isSeeker = false;
  let isEmployer = false;
  let userProposals: any[] = [];

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single();
    
    isSeeker = profile?.user_type === 'seeker';
    isEmployer = profile?.user_type === 'employer';

    if (isSeeker) {
      const { data: proposals } = await supabase
        .from('proposals')
        .select('gig_id')
        .eq('freelancer_id', session.user.id);
      
      if (proposals) {
        userProposals = proposals;
      }
    }
  }

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
          {(!session || isEmployer) ? (
            <Link href="/post-gig" className="inline-block px-8 py-3 rounded-xl font-bold text-white border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all backdrop-blur-sm">
              Post a Gig
            </Link>
          ) : (
            <div className="inline-block px-8 py-3 rounded-xl font-bold text-white/50 border border-white/10 bg-black/20 cursor-not-allowed backdrop-blur-sm" title="Only employers can post gigs. Please log in as an employer.">
              Post a Gig (Employers Only)
            </div>
          )}
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
              {gigs.map((gig) => {
                const hasApplied = userProposals.some(p => p.gig_id === gig.id);

                return (
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
                      <ProposalButton 
                        gigId={gig.id} 
                        gigTitle={gig.title} 
                        hasApplied={hasApplied}
                        isSeeker={isSeeker}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
