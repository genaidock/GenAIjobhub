import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Calendar, CheckCircle, Clock, ExternalLink, XCircle } from 'lucide-react';

export const revalidate = 0;

export default async function ApplicationsPage() {
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
  if (!session) {
    redirect('/login');
  }

  // Fetch user profile to ensure they are a seeker
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', session.user.id)
    .single();

  if (profile?.user_type !== 'seeker') {
    redirect('/dashboard/employer'); // or wherever appropriate
  }

  // Fetch applications with joined job details
  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      job_id,
      jobs (
        title,
        company_name,
        location,
        is_remote
      )
    `)
    .eq('seeker_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20"><CheckCircle className="w-3.5 h-3.5" /> Accepted</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      case 'reviewed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20"><CheckCircle className="w-3.5 h-3.5" /> Reviewed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Dark Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-accent-primary/15 blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">
            My <span className="gradient-text">Applications</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Track the status of your job applications and proposals.
          </p>
        </div>
      </section>

      {/* Light Content Area */}
      <section className="section-light w-full py-12 px-[5%] min-h-[50vh]">
        <div className="max-w-[1000px] w-full mx-auto">
          {!applications || applications.length === 0 ? (
            <div className="card-light p-12 text-center flex flex-col items-center justify-center border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-text-dark-tertiary" />
              </div>
              <h2 className="text-xl font-bold text-text-dark mb-2">No Applications Yet</h2>
              <p className="text-text-dark-secondary mb-6 max-w-md">
                You haven't applied to any jobs on GenAIJobHub yet. Explore the jobs board to find your next AI role.
              </p>
              <Link 
                href="/jobs"
                className="px-6 py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-md transition-all"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {applications.map((app: any) => {
                // Determine if 'jobs' is an array or object depending on Supabase mapping (usually object for 1:1)
                const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
                
                return (
                  <div key={app.id} className="card-light p-6 hover:border-accent-secondary/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-dark mb-1">
                        {job?.title || "Unknown Job"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-text-dark-secondary mb-3">
                        <span className="font-semibold">{job?.company_name || "Unknown Company"}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{job?.is_remote ? 'Remote' : (job?.location || 'Unspecified Location')}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-text-dark-tertiary">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> 
                          Applied on {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                      {getStatusBadge(app.status)}
                      <Link 
                        href={`/jobs/${app.job_id}`}
                        className="text-xs font-bold text-accent-primary hover:underline flex items-center gap-1"
                      >
                        View Job <ExternalLink className="w-3 h-3" />
                      </Link>
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
