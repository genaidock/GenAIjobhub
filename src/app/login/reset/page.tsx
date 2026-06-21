"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function ResetContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') ?? 'seeker';
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/${role}`,
    });
    setMessage(
      error ? `Error: ${error.message}` : 'Check your email for a password reset link.'
    );
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-md w-full bg-bg-card border border-border rounded-2xl p-8 shadow-lg">
        <Link
          href={`/login/${role}`}
          className="flex items-center gap-2 text-text-secondary text-sm mb-6 hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
        <h1 className="text-2xl font-bold mb-2 text-text-primary">Reset Password</h1>
        <p className="text-text-secondary text-sm mb-6">
          Enter your email and we'll send a reset link.
        </p>
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div>
            <label htmlFor="reset-email" className="sr-only">Email Address</label>
            <input
              id="reset-email"
              type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@email.com"
              className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>
          {message && (
            <p className={`text-sm rounded-lg px-3 py-2 ${
              message.startsWith('Error')
                ? 'text-red-400 bg-red-400/10 border border-red-400/20'
                : 'text-green-400 bg-green-400/10 border border-green-400/20'
            }`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary disabled:opacity-50 hover:-translate-y-0.5 transition-all"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetContent />
    </Suspense>
  );
}
