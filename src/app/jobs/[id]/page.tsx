import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ArrowLeft, MapPin, Building2, Briefcase, Calendar, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ApplyButton from '@/components/ApplyButton';

// Generate SEO Metadata for this specific job
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const supabaseServer = createServerClient(
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

  const { data: job } = await supabaseServer
    .from('jobs')
    .select('title, company_name, description, moderation_status, employer_id')
    .eq('id', id)
    .single();

  if (!job) {
    return {
      title: 'Job Not Found | GenAIJobHub',
      description: 'The requested job could not be found.',
    };
  }

  // Security gate for unapproved jobs in SEO metadata
  if (job.moderation_status === 'pending' || job.moderation_status === 'rejected') {
    const { data: { user } } = await supabaseServer.auth.getUser();
    const isOwner = user && user.id === job.employer_id;
    const isAdmin = user && user.email?.toLowerCase() === 'admin@genaijobhub.com';

    if (!isOwner && !isAdmin) {
      return {
        title: 'Job Not Found | GenAIJobHub',
        description: 'The requested job could not be found.',
      };
    }
  }

  // Truncate description for SEO snippet
  const seoDesc = job.description 
    ? (job.description.length > 150 ? job.description.substring(0, 150) + '...' : job.description)
    : `Apply for ${job.title} at ${job.company_name} on GenAIJobHub.`;

  return {
    title: `${job.title} at ${job.company_name} | GenAIJobHub`,
    description: seoDesc,
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const supabaseServer = createServerClient(
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

  // Fetch full job data
  const { data: job, error } = await supabaseServer
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Security gate: if job is not approved, verify user is owner or admin
  const isPending = job.moderation_status === 'pending';
  const isRejected = job.moderation_status === 'rejected';

  if (isPending || isRejected) {
    const { data: { user } } = await supabaseServer.auth.getUser();
    const isOwner = user && user.id === job.employer_id;
    const isAdmin = user && user.email?.toLowerCase() === 'admin@genaijobhub.com';

    if (!isOwner && !isAdmin) {
      notFound();
    }
  }

  const isExpired = job.expires_at ? new Date(job.expires_at).getTime() < Date.now() : false;

  const postedDate = new Date(job.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  // Generate JSON-LD Structured Data for Google Jobs
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.description,
    'datePosted': job.created_at,
    'validThrough': job.expires_at || new Date(new Date(job.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.company_name,
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': job.location,
      }
    },
    ...(job.is_remote && {
      'jobLocationType': 'TELECOMMUTE',
    }),
    ...(job.salary_range && {
      'baseSalary': {
        '@type': 'MonetaryAmount',
        'currency': 'USD',
        'value': {
          '@type': 'QuantitativeValue',
          'value': job.salary_range,
          'unitText': 'YEAR'
        }
      }
    })
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Pending Approval Warning Banner */}
      {isPending && (
        <div className="w-full bg-amber-500/10 border-b border-amber-500/25 py-4 px-[5%] text-center text-amber-600 font-semibold text-sm flex justify-center items-center gap-2">
          <span>⚠️</span> PREVIEW: This job listing is pending admin review and is not visible to the public.
        </div>
      )}

      {/* Rejected Warning Banner */}
      {isRejected && (
        <div className="w-full bg-red-500/10 border-b border-red-500/25 py-4 px-[5%] text-center text-red-500 font-semibold text-sm flex justify-center items-center gap-2">
          <span>❌</span> PREVIEW: This job listing has been rejected by the admin and is not visible to the public.
        </div>
      )}

      {/* Expired Warning Banner */}
      {isExpired && !isPending && !isRejected && (
        <div className="w-full bg-red-500/10 border-b border-red-500/25 py-4 px-[5%] text-center text-red-400 font-semibold text-sm flex justify-center items-center gap-2">
          <span>⚠️</span> This job listing has expired and is no longer accepting applications.
        </div>
      )}

      {/* Dark Header Banner */}
      <section className="hero-glow hero-grid w-full py-12 md:py-16 px-[5%] bg-background relative overflow-hidden">
        <div className="max-w-[800px] mx-auto relative z-10">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs Board
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight leading-tight">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-text-secondary font-medium">
            <div className="flex items-center gap-2 text-accent-primary">
              <Building2 className="w-5 h-5" />
              <span>{job.company_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{job.location}</span>
            </div>
            {job.salary_range && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span>{job.salary_range}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Posted {postedDate}</span>
            </div>

          </div>
        </div>
      </section>

      <div className="section-transition-dark-to-light w-full" />

      {/* Light Content Area */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[800px] mx-auto flex flex-col md:flex-row gap-8 items-start">
          
          <div className="flex-grow card-light p-8 md:p-10 w-full">
            <h2 className="text-xl font-bold text-text-dark mb-6 border-b border-border-light pb-4">Job Description</h2>
            <div className="prose prose-purple prose-slate max-w-none text-text-dark-secondary">
              <ReactMarkdown>{job.description || "No description provided."}</ReactMarkdown>
            </div>
          </div>

          <aside className="w-full md:w-[300px] flex-shrink-0 sticky top-24 flex flex-col gap-4">
            <div className="card-light p-6 text-center">
              {isPending ? (
                <>
                  <button disabled className="block w-full py-3.5 rounded-xl font-bold text-white bg-amber-400 cursor-not-allowed opacity-50 mb-3">
                    Pending Review
                  </button>
                  <p className="text-xs text-text-dark-tertiary">Applications will open once approved.</p>
                </>
              ) : isRejected ? (
                <>
                  <button disabled className="block w-full py-3.5 rounded-xl font-bold text-white bg-red-400 cursor-not-allowed opacity-50 mb-3">
                    Listing Rejected
                  </button>
                  <p className="text-xs text-text-dark-tertiary">This listing has been rejected by admin.</p>
                </>
              ) : isExpired ? (
                <>
                  <button disabled className="block w-full py-3.5 rounded-xl font-bold text-white bg-slate-300 dark:bg-slate-800 cursor-not-allowed opacity-50 mb-3">
                    Listing Expired
                  </button>
                  <p className="text-xs text-text-dark-tertiary">This opportunity is no longer open.</p>
                </>
              ) : job.apply_url ? (
                <>
                  <ApplyButton jobId={job.id} applyUrl={job.apply_url} className="block w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.45)] transition-all mb-3 flex justify-center items-center gap-2">
                    Apply on Company Site <LinkIcon className="w-4 h-4" />
                  </ApplyButton>
                  <p className="text-xs text-text-dark-tertiary">You will be redirected to {job.company_name}'s application page.</p>
                </>
              ) : (
                <>
                  <button onClick={() => alert("Quick apply coming soon!")} className="block w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.45)] transition-all mb-3">
                    Apply Now
                  </button>
                  <p className="text-xs text-text-dark-tertiary">Apply easily with your GenAIJobHub profile.</p>
                </>
              )}
            </div>

            <div className="card-light p-6">
              <h3 className="font-bold text-text-dark mb-4 text-sm uppercase tracking-wider">Job Overview</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between border-b border-border-light pb-2">
                  <span className="text-text-dark-secondary">Remote</span>
                  <span className="font-semibold text-text-dark">{job.is_remote ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between border-b border-border-light pb-2">
                  <span className="text-text-dark-secondary">Company</span>
                  <span className="font-semibold text-text-dark">{job.company_name}</span>
                </div>
                <div className="flex justify-between border-b border-border-light pb-2">
                  <span className="text-text-dark-secondary">Posted</span>
                  <span className="font-semibold text-text-dark">{postedDate}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
