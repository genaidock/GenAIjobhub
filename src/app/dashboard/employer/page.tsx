"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  FileText
} from 'lucide-react';

function EmployerDashboardContent() {
  const router = useRouter();
  const { user, userType, session, isLoading: authLoading } = useAuth();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState('');
  
  // Extension Modal State
  const [extensionJob, setExtensionJob] = useState<any | null>(null);
  const [extensionDays, setExtensionDays] = useState('30');
  const [isSubmittingExtension, setIsSubmittingExtension] = useState(false);
  const [extensionSuccessMsg, setExtensionSuccessMsg] = useState('');
  const [extensionErrorMsg, setExtensionErrorMsg] = useState('');

  // Employer guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login/employer?redirect=/dashboard/employer');
      } else if (userType !== 'employer') {
        router.replace('/jobs');
      }
    }
  }, [user, userType, authLoading, router]);

  // Fetch jobs function
  const fetchEmployerJobs = async () => {
    if (!user || !session) return;
    setIsLoadingJobs(true);
    setError('');
    try {
      const res = await fetch('/api/jobs/employer', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch jobs');
      setJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (user && session) {
      fetchEmployerJobs();
    }
  }, [user, session]);

  if (authLoading || !user || userType !== 'employer') {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Helper to determine status details
  const getJobStatus = (expiresAtStr: string | null, moderationStatus: string | null) => {
    // 1. Check moderation status first
    if (moderationStatus === 'pending') {
      return { 
        label: 'Pending Review', 
        color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', 
        extendable: false,
        daysRemaining: null,
        isExpired: false
      };
    }
    
    if (moderationStatus === 'rejected') {
      return { 
        label: 'Rejected', 
        color: 'bg-red-500/10 text-red-500 border-red-500/20', 
        extendable: false,
        daysRemaining: null,
        isExpired: false
      };
    }

    // 2. Fallback to standard validity checks
    if (!expiresAtStr) {
      return { 
        label: 'Active', 
        color: 'bg-green-500/10 text-green-400 border-green-500/20', 
        extendable: false,
        daysRemaining: null,
        isExpired: false
      };
    }

    const now = new Date();
    const expiresAt = new Date(expiresAtStr);
    
    if (expiresAt.getTime() < now.getTime()) {
      return { 
        label: 'Expired', 
        color: 'bg-white/5 text-text-secondary border-white/10', 
        extendable: false,
        daysRemaining: null,
        isExpired: true
      };
    }

    const timeDiff = expiresAt.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    const ceilDays = Math.ceil(daysDiff);

    if (ceilDays <= 5) {
      return { 
        label: 'Expiring Soon', 
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', 
        extendable: true,
        daysRemaining: ceilDays,
        isExpired: false
      };
    }

    return { 
      label: 'Active', 
      color: 'bg-green-500/10 text-green-400 border-green-500/20', 
      extendable: false,
      daysRemaining: ceilDays,
      isExpired: false
    };
  };

  // Submit Extension Handler
  const handleExtendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extensionJob) return;

    setIsSubmittingExtension(true);
    setExtensionErrorMsg('');
    setExtensionSuccessMsg('');

    try {
      const res = await fetch('/api/jobs/extend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          jobId: extensionJob.id,
          validityDays: extensionDays
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to extend job');

      setExtensionSuccessMsg(`Job listing successfully extended for ${extensionDays} days!`);
      
      // Refresh listings and close modal after a brief delay
      setTimeout(() => {
        setExtensionJob(null);
        setExtensionSuccessMsg('');
        fetchEmployerJobs();
      }, 1500);

    } catch (err: any) {
      setExtensionErrorMsg(err.message);
    } finally {
      setIsSubmittingExtension(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Dark Banner */}
      <section className="hero-glow hero-grid w-full py-12 md:py-16 px-[5%] bg-background relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto w-full relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Recruiter <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base mt-2 max-w-xl">
              Manage your active listings, view application counts, and extend or repost job roles.
            </p>
          </div>
          <Link 
            href="/post-job" 
            className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2"
          >
            Post a New Job <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <div className="section-transition-dark-to-light w-full" />

      {/* Main Content Dashboard */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[1200px] mx-auto w-full">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              Error: {error}
            </div>
          )}

          {isLoadingJobs ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-text-dark-secondary text-sm">Loading listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 card-light p-10 max-w-md mx-auto">
              <div className="text-6xl mb-6">💼</div>
              <h2 className="text-2xl font-bold text-text-dark mb-3">No jobs posted yet</h2>
              <p className="text-text-dark-secondary text-sm mb-6">
                Post your first AI role to reach thousands of prompt engineers and ML researchers.
              </p>
              <Link 
                href="/post-job" 
                className="inline-block px-6 py-3 rounded-xl font-bold text-white bg-accent-primary hover:bg-accent-primary/95 transition-all text-sm"
              >
                Post Job Now
              </Link>
            </div>
          ) : (
            <div className="card-light overflow-hidden">
              <div className="px-6 py-4 border-b border-border-light bg-[#f9fafb]">
                <h2 className="font-bold text-text-dark text-lg">My Job Listings ({jobs.length})</h2>
              </div>
              <div className="divide-y divide-border-light overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-text-dark-tertiary uppercase tracking-wider border-b border-border-light">
                      <th className="px-6 py-4">Job Role</th>
                      <th className="px-6 py-4">Date Posted</th>
                      <th className="px-6 py-4">Expires On</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {jobs.map((job) => {
                      const status = getJobStatus(job.expires_at, job.moderation_status);
                      const postedDate = new Date(job.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      });
                      const expiresDate = job.expires_at 
                        ? new Date(job.expires_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })
                        : 'Never';

                      return (
                        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors text-text-dark-secondary text-sm">
                          {/* Title */}
                          <td className="px-6 py-5">
                            <div className="font-semibold text-text-dark text-base hover:text-accent-primary transition-colors">
                              <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                            </div>
                            <div className="text-xs text-text-dark-tertiary font-medium mt-1">{job.location || 'Remote'}</div>
                          </td>
                          {/* Date Posted */}
                          <td className="px-6 py-5 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-text-dark-tertiary" />
                              {postedDate}
                            </div>
                          </td>
                          {/* Expiration Date */}
                          <td className="px-6 py-5 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-text-dark-tertiary" />
                              <span className={status.isExpired ? 'text-red-400 line-through' : ''}>
                                {expiresDate}
                              </span>
                            </div>
                          </td>
                          {/* Status */}
                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border w-fit ${status.color}`}>
                                {status.label}
                              </span>
                              {status.daysRemaining !== null && status.daysRemaining > 0 && (
                                <span className="text-[10px] text-text-dark-tertiary font-medium">
                                  {status.daysRemaining} days remaining
                                </span>
                              )}
                            </div>
                          </td>
                          {/* Actions */}
                          <td className="px-6 py-5 text-right font-medium">
                            <div className="flex gap-3 justify-end">
                              {/* Extend Button */}
                              {status.extendable && (
                                <button
                                  onClick={() => setExtensionJob(job)}
                                  className="px-3.5 py-1.5 rounded-lg border border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors text-xs font-bold"
                                >
                                  Extend Validity
                                </button>
                              )}
                              {/* Repost Button */}
                              <Link
                                href={`/post-job?repost=${job.id}`}
                                className="px-3.5 py-1.5 rounded-lg border border-border-light text-text-dark hover:bg-slate-100 transition-colors text-xs font-bold flex items-center gap-1"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-text-dark-secondary" /> Repost
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* EXTEND VALIDITY MODAL */}
      {extensionJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-border-light shadow-2xl w-full max-w-md overflow-hidden relative p-6 md:p-8">
            <button 
              onClick={() => setExtensionJob(null)}
              className="absolute top-4 right-4 text-text-dark-tertiary hover:text-text-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-text-dark text-lg">Extend Job Listing</h3>
                <p className="text-text-dark-tertiary text-xs">For: {extensionJob.title}</p>
              </div>
            </div>

            {extensionSuccessMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {extensionSuccessMsg}
              </div>
            )}

            {extensionErrorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                {extensionErrorMsg}
              </div>
            )}

            <form onSubmit={handleExtendSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-text-dark-secondary mb-2">Select Extension Period *</label>
                <select
                  value={extensionDays}
                  onChange={(e) => setExtensionDays(e.target.value)}
                  className="input-light w-full"
                  required
                >
                  <option value="10">10 Days</option>
                  <option value="15">15 Days</option>
                  <option value="30">30 Days</option>
                  <option value="45">45 Days (Max)</option>
                </select>
                <p className="text-[11px] text-text-dark-tertiary font-medium mt-1.5 leading-relaxed">
                  * Job listing will expire {extensionDays} days from the moment of extension.
                </p>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setExtensionJob(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-text-dark border-2 border-border-light hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExtension}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {isSubmittingExtension ? 'Extending...' : 'Confirm Extension'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployerDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EmployerDashboardContent />
    </Suspense>
  );
}
