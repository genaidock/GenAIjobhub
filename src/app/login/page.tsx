"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Search, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, isLoading } = useAuth();
  const redirectTo = searchParams.get('redirect') ?? '';

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (!isLoading && user && profile) {
      if (redirectTo) {
        router.replace(redirectTo);
      } else if (profile.user_type === 'employer') {
        router.replace('/post-job');
      } else {
        router.replace('/jobs');
      }
    }
  }, [user, profile, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null; // Will redirect via useEffect

  const employerHref = redirectTo
    ? `/login/employer?redirect=${encodeURIComponent(redirectTo)}`
    : '/login/employer';
  const seekerHref = redirectTo
    ? `/login/seeker?redirect=${encodeURIComponent(redirectTo)}`
    : '/login/seeker';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to <span className="gradient-text">GenAIJobHub</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-md mx-auto">
          The #1 platform for AI jobs. Tell us who you are to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Employer Card */}
        <Link
          href={employerHref}
          className="group relative flex flex-col items-start p-8 bg-bg-card border border-border rounded-2xl hover:border-accent-primary/60 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-[0_8px_30px_rgba(109,40,217,0.2)]"
        >
          <div className="p-3 rounded-xl bg-accent-primary/10 border border-accent-primary/20 mb-5">
            <Briefcase className="w-8 h-8 text-accent-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-text-primary">I'm Hiring</h2>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            Post AI jobs, browse top candidates, and find your next ML engineer, prompt expert, or AI researcher.
          </p>
          <div className="flex items-center gap-2 text-accent-primary font-semibold text-sm mt-auto">
            Continue as Employer
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="absolute top-4 right-4 text-xs font-bold text-accent-primary bg-accent-primary/10 px-2 py-1 rounded-full">
            Employer
          </div>
        </Link>

        {/* Seeker Card */}
        <Link
          href={seekerHref}
          className="group relative flex flex-col items-start p-8 bg-bg-card border border-border rounded-2xl hover:border-accent-secondary/60 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)]"
        >
          <div className="p-3 rounded-xl bg-accent-secondary/10 border border-accent-secondary/20 mb-5">
            <Search className="w-8 h-8 text-accent-secondary" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-text-primary">I'm Job Hunting</h2>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            Browse AI-first jobs, track your applications, and prepare for your next career move.
          </p>
          <div className="flex items-center gap-2 text-accent-secondary font-semibold text-sm mt-auto">
            Continue as Job Seeker
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="absolute top-4 right-4 text-xs font-bold text-accent-secondary bg-accent-secondary/10 px-2 py-1 rounded-full">
            Job Seeker
          </div>
        </Link>
      </div>

      <p className="mt-8 text-text-secondary text-sm">
        Already have an account?{' '}
        <Link href="/login/employer" className="text-accent-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
