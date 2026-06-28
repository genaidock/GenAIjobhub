"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { 
  ShieldAlert, 
  Briefcase, 
  MapPin, 
  Check, 
  X, 
  RefreshCw, 
  Clock, 
  ExternalLink,
  ChevronDown,
  Building,
  Users
} from 'lucide-react';

const ADMIN_EMAIL = 'admin@genaijobhub.com';

function AdminDashboardContent() {
  const router = useRouter();
  const { user, profile, session, isLoading: authLoading } = useAuth();
  
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionJobId, setActionJobId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'jobs' | 'employers'>('jobs');
  const [pendingEmployers, setPendingEmployers] = useState<any[]>([]);
  const [isLoadingEmployers, setIsLoadingEmployers] = useState(true);
  const [actionEmployerId, setActionEmployerId] = useState<string | null>(null);

  // Expanded card state to view descriptions
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Strict Admin Guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login/admin');
      } else if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.replace('/jobs');
      }
    }
  }, [user, authLoading, router]);

  const fetchPendingJobs = async () => {
    if (!user || !session) return;
    setIsLoadingJobs(true);
    setError('');
    try {
      const res = await fetch('/api/admin/moderate', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch pending jobs');
      setPendingJobs(data.jobs || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const fetchPendingEmployers = async () => {
    if (!user || !session) return;
    setIsLoadingEmployers(true);
    setError('');
    try {
      const res = await fetch('/api/admin/employers', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch pending employers');
      setPendingEmployers(data.employers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingEmployers(false);
    }
  };

  useEffect(() => {
    if (user && session && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      fetchPendingJobs();
      fetchPendingEmployers();
    }
  }, [user, session]);

  const handleVerifyEmployer = async (employerId: string) => {
    if (!session) return;
    setActionEmployerId(employerId);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/verify-employer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ employerId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to verify employer`);

      setSuccessMsg(`Employer successfully verified!`);
      setPendingEmployers(prev => prev.filter(emp => emp.id !== employerId));

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionEmployerId(null);
    }
  };

  const handleModerate = async (jobId: string, action: 'approve' | 'reject') => {
    if (!session) return;
    setActionJobId(jobId);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ jobId, action })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${action} job`);

      setSuccessMsg(`Job listing successfully ${action}d!`);
      
      // Update local state to remove the processed job
      setPendingJobs(prev => prev.filter(job => job.id !== jobId));

      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionJobId(null);
    }
  };

  if (authLoading || !user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Dark Header Banner */}
      <section className="hero-glow hero-grid w-full py-12 md:py-16 px-[5%] bg-background relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto w-full relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-red-500 shrink-0" />
              Admin <span className="gradient-text">Console</span>
            </h1>
            <p className="text-text-secondary text-sm md:text-base mt-2 max-w-xl">
              Strict moderation pipeline. Review, approve, or reject new employer job listings.
            </p>
          </div>
          <button 
            onClick={() => { fetchPendingJobs(); fetchPendingEmployers(); }}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs text-text-primary font-bold flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Lists
          </button>
        </div>
      </section>

      <div className="section-transition-dark-to-light w-full" />

      {/* Tabs */}
      <div className="w-full bg-white border-b border-border-light sticky top-16 z-20">
        <div className="max-w-[800px] mx-auto w-full px-[5%] flex gap-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'jobs' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-dark-secondary hover:text-text-dark'}`}
          >
            <Briefcase className="w-4 h-4" /> Pending Jobs
            {pendingJobs.length > 0 && (
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{pendingJobs.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('employers')}
            className={`py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'employers' ? 'border-accent-primary text-accent-primary' : 'border-transparent text-text-dark-secondary hover:text-text-dark'}`}
          >
            <Users className="w-4 h-4" /> Pending Employers
            {pendingEmployers.length > 0 && (
              <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-xs">{pendingEmployers.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[800px] mx-auto w-full">
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm font-semibold flex items-center gap-2">
              <Check className="w-5 h-5" /> {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              Error: {error}
            </div>
          )}

          {activeTab === 'jobs' && (isLoadingJobs ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-red-500 animate-spin mb-4" />
              <p className="text-text-dark-secondary text-sm font-medium">Loading pending job listings...</p>
            </div>
          ) : pendingJobs.length === 0 ? (
            <div className="text-center py-20 card-light p-10 max-w-md mx-auto">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-bold text-text-dark mb-3">All Clear!</h2>
              <p className="text-text-dark-secondary text-sm">
                No job postings currently pending review. Check back later.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <h2 className="font-bold text-text-dark text-lg px-2">
                Pending Listings ({pendingJobs.length})
              </h2>

              {pendingJobs.map((job) => {
                const isExpanded = expandedJobId === job.id;
                const postedDate = new Date(job.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                });

                return (
                  <div 
                    key={job.id} 
                    className="card-light overflow-hidden transition-all duration-200 hover:border-red-500/20"
                  >
                    <div className="p-6 md:p-8">
                      {/* Job Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-text-dark mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-dark-secondary font-medium">
                            <span className="flex items-center gap-1 text-accent-primary font-bold">
                              <Building className="w-3.5 h-3.5" /> {job.company_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}
                            </span>
                            {job.salary_range && (
                              <span>💼 {job.salary_range}</span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Posted {postedDate}
                            </span>
                          </div>
                        </div>

                        {/* Status label */}
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 whitespace-nowrap">
                          Pending Review
                        </span>
                      </div>

                      {/* Expand description trigger */}
                      <button
                        onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:underline mt-4 mb-2"
                      >
                        {isExpanded ? 'Hide Description' : 'View Full Description'} 
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Expanded description */}
                      {isExpanded && (
                        <div className="mt-4 p-4 bg-slate-50 border border-border-light rounded-xl text-sm text-text-dark-secondary leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                          {job.description}
                        </div>
                      )}

                      {/* Moderation Controls */}
                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-6 pt-6 border-t border-border-light">
                        {job.apply_url && (
                          <a 
                            href={job.apply_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-text-dark-secondary hover:text-text-dark flex items-center gap-1"
                          >
                            Verify Apply Link <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <div className="flex gap-3 ml-auto">
                          {/* Reject button */}
                          <button
                            disabled={actionJobId !== null}
                            onClick={() => handleModerate(job.id, 'reject')}
                            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <X className="w-4 h-4" /> Reject Listing
                          </button>
                          {/* Approve button */}
                          <button
                            disabled={actionJobId !== null}
                            onClick={() => handleModerate(job.id, 'approve')}
                            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
                          >
                            <Check className="w-4 h-4" /> Approve & Go Live
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {activeTab === 'employers' && (isLoadingEmployers ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-4" />
              <p className="text-text-dark-secondary text-sm font-medium">Loading pending employers...</p>
            </div>
          ) : pendingEmployers.length === 0 ? (
            <div className="text-center py-20 card-light p-10 max-w-md mx-auto">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-bold text-text-dark mb-3">All Clear!</h2>
              <p className="text-text-dark-secondary text-sm">
                No employers currently pending verification.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <h2 className="font-bold text-text-dark text-lg px-2">
                Pending Employers ({pendingEmployers.length})
              </h2>

              {pendingEmployers.map((emp) => {
                const joinedDate = new Date(emp.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                });

                return (
                  <div 
                    key={emp.id} 
                    className="card-light overflow-hidden transition-all duration-200 hover:border-amber-500/20"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-text-dark mb-2">{emp.company_name}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-dark-secondary font-medium">
                            <span className="flex items-center gap-1 font-bold text-text-dark">
                              👤 {emp.full_name}
                            </span>
                            <span className="flex items-center gap-1">
                              ✉️ {emp.email}
                            </span>
                            <span className="flex items-center gap-1">
                              🌐 {emp.company_domain}
                            </span>
                            <span className="flex items-center gap-1">
                              👥 {emp.employee_range} employees
                            </span>
                            <span className="flex items-center gap-1">
                              📍 {emp.city}, {emp.state}, {emp.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Joined {joinedDate}
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 whitespace-nowrap">
                          Unverified
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-4 mt-6 pt-6 border-t border-border-light">
                        <button
                          disabled={actionEmployerId !== null}
                          onClick={() => handleVerifyEmployer(emp.id)}
                          className="px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-secondary text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
                        >
                          <Check className="w-4 h-4" /> Verify Employer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
