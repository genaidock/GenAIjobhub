"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

export default function CareerCoach() {
  const [resume, setResume] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { user, profile, userType, isLoading: authLoading } = useAuth();

  const copyToClipboard = async () => {
    if (!feedback) return;
    try {
      await navigator.clipboard.writeText(feedback);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy feedback", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !targetRole) return;

    if (!user) return; // Safeguard, handled by button onClick

    setIsLoading(true);
    setFeedback('');

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, targetRole }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get feedback');
      
      setFeedback(data.feedback);
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Dark Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-600/15 blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[200px] h-[200px] rounded-full bg-indigo-500/10 blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }} />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            AI <span className="gradient-text">Career Coach</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Paste your resume and target role below to receive instant, harsh-but-fair feedback powered by our AI.
          </p>
        </div>
      </section>

      {/* Smooth transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Light Form Content */}
      <section className="section-light w-full py-12 md:py-16 px-[5%]">
        <div className="max-w-[800px] mx-auto">

          {/* Employer soft block */}
          {!authLoading && user && userType === 'employer' && (
            <div className="card-light p-8 text-center mb-10 border border-amber-200">
              <p className="text-2xl mb-3">🎯</p>
              <p className="text-text-dark text-lg font-semibold mb-2">AI Coach is for Job Seekers</p>
              <p className="text-text-dark-secondary mb-4 text-sm">
                You're logged in as an employer. The AI Career Coach helps candidates improve their applications.
              </p>
              <Link
                href="/post-job"
                className="inline-block px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary"
              >
                Go to Post a Job →
              </Link>
            </div>
          )}

          {/* Personalized greeting for logged-in seekers */}
          {!authLoading && user && userType === 'seeker' && profile?.full_name && (
            <div className="mb-6 p-4 bg-accent-primary/5 border border-accent-primary/10 rounded-xl text-sm text-text-dark">
              Welcome back, <span className="font-bold">{profile.full_name}</span>! You have{' '}
              <span className="font-bold text-accent-primary">{profile.coach_credits_remaining}</span>{' '}
              coaching credit{profile.coach_credits_remaining !== 1 ? 's' : ''} remaining.
            </div>
          )}

          {/* Soft sign-in prompt for unauthenticated users */}
          {!authLoading && !user && (
            <div className="mb-6 p-4 bg-white/5 border border-border rounded-xl text-sm text-text-dark-secondary">
              💡 <Link href="/login/seeker?redirect=/coach" className="text-accent-primary font-bold hover:underline">Sign in</Link> to save your sessions and track credits.
            </div>
          )}

          <div className="card-light p-6 md:p-10 mb-10">

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-text-dark-secondary mb-2">Target AI Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Prompt Engineer, AI Product Manager, ML Researcher..." 
                  className="input-light"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-dark-secondary mb-2">Your Resume (Text format)</label>
                <textarea 
                  placeholder="Paste the text contents of your resume here..." 
                  className="input-light min-h-[250px] resize-y"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  required
                />
              </div>

              <button 
                type={user ? "submit" : "button"}
                onClick={() => {
                  if (!user) {
                    window.location.href = '/login/seeker?redirect=/coach';
                  }
                }}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.45)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {!user ? 'Log in to Get AI Feedback' : isLoading ? 'Analyzing Resume...' : 'Get AI Feedback'}
              </button>
            </form>
          </div>

          {/* Feedback Response — Light card with left accent border */}
          {feedback && (
            <div className="card-light p-6 md:p-10 border-l-4 border-l-accent-primary animate-fade-in-up">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-border/50 pb-4">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-text-dark">
                  <span className="text-2xl">🤖</span> Coach&apos;s Feedback
                </h2>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-xl text-text-dark border border-border hover:border-accent-primary hover:text-accent-primary bg-background/50 transition-all shadow-sm"
                  title="Copy Feedback"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Feedback</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-text-dark-secondary leading-relaxed text-[0.95rem]">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-text-dark mt-6 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-text-dark mt-5 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-text-dark mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-text-dark-secondary" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-text-dark-secondary" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-text-dark-secondary" {...props} />,
                    li: ({node, ...props}) => <li className="marker:text-accent-primary" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-text-dark" {...props} />,
                    a: ({node, ...props}) => <a className="text-accent-primary hover:underline font-medium" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-accent-primary/50 pl-4 py-1 italic text-text-dark-secondary bg-accent-primary/5 rounded-r-lg mb-4" {...props} />,
                    code: ({node, className, children, ...props}: any) => {
                      const isBlock = className || (typeof children === 'string' && children.includes('\n'));
                      return isBlock ? (
                        <code className={className} {...props}>{children}</code>
                      ) : (
                        <code className="bg-accent-primary/10 px-1.5 py-0.5 rounded-md text-[0.9em] text-accent-primary font-mono font-medium" {...props}>{children}</code>
                      );
                    },
                    pre: ({node, ...props}) => (
                      <div className="bg-[#1a1a2e] p-4 rounded-xl overflow-x-auto mb-4 shadow-inner border border-gray-800">
                        <pre className="text-[0.9rem] text-gray-200 font-mono" {...props} />
                      </div>
                    ),
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto mb-4 border border-border rounded-xl">
                        <table className="w-full text-left text-sm" {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-background text-text-dark font-bold border-b border-border" {...props} />,
                    th: ({node, ...props}) => <th className="p-3" {...props} />,
                    td: ({node, ...props}) => <td className="p-3 border-b border-border/50" {...props} />,
                    tbody: ({node, ...props}) => <tbody className="divide-y divide-border/50" {...props} />,
                  }}
                >
                  {feedback}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
