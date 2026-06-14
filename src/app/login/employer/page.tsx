"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Mode = 'login' | 'signup';

function EmployerAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/post-job';

  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'signup') {
        if (!form.full_name.trim()) throw new Error('Please enter your full name.');
        if (!form.company_name.trim()) throw new Error('Please enter your company name.');
        if (form.password.length < 8) throw new Error('Password must be at least 8 characters.');

        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              user_type: 'employer',
              full_name: form.full_name.trim(),
              company_name: form.company_name.trim(),
            },
          },
        });

        if (error) throw error;
        setSuccessMsg('Account created! Check your email to verify, then log in.');
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-16">
      <div className="max-w-md w-full bg-bg-card border border-border rounded-2xl p-8 shadow-lg">
        <Link
          href="/login"
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to role selection
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
            <Briefcase className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {mode === 'login' ? 'Employer Login' : 'Create Employer Account'}
            </h1>
            <p className="text-text-secondary text-xs">Post AI jobs · Manage listings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Your Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Jane Smith"
                  className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Company Name *</label>
                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  required
                  placeholder="Anthropic, OpenAI, Acme Corp..."
                  className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-text-secondary mb-2">Work Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@company.com"
              className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-secondary mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full p-3 pr-12 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {successMsg && (
            <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none shadow-[0_4px_15px_rgba(109,40,217,0.35)]"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          {mode === 'login' ? "Don't have an employer account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); }}
            className="text-accent-primary hover:underline font-bold"
          >
            {mode === 'login' ? 'Sign up free' : 'Log in'}
          </button>
        </div>

        {mode === 'login' && (
          <div className="mt-3 text-center text-sm">
            <Link
              href="/login/reset?role=employer"
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmployerAuthPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EmployerAuthContent />
    </Suspense>
  );
}
