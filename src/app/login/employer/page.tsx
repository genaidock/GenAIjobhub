"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Turnstile } from '@marsidev/react-turnstile';

type Mode = 'login' | 'signup' | 'otp';

function EmployerAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/post-job';

  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [otpToken, setOtpToken] = useState('');

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

    if (mode === 'signup' && !turnstileToken) {
      setError('Please complete the security check.');
      setIsLoading(false);
      return;
    }

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
        setSuccessMsg('Account created! Check your email for the 8-digit verification code.');
        setMode('otp');
      } else if (mode === 'otp') {
        if (!otpToken.trim()) throw new Error('Please enter the OTP.');
        const { error } = await supabase.auth.verifyOtp({
          email: form.email,
          token: otpToken.trim(),
          type: 'signup',
        });
        if (error) throw error;
        router.push(redirectTo);
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

  const handleOAuth = async (provider: 'google' | 'linkedin_oidc') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?type=employer&next=${redirectTo}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
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
              {mode === 'otp' ? 'Verify Email' : mode === 'login' ? 'Employer Login' : 'Create Employer Account'}
            </h1>
            <p className="text-text-secondary text-xs">
              {mode === 'otp' ? 'Enter the code sent to your email' : 'Post AI jobs · Manage listings'}
            </p>
          </div>
        </div>

        {mode !== 'otp' && (
          <>
            <div className="flex flex-col gap-3 mb-6">
              <button
            onClick={() => handleOAuth('google')}
            type="button"
            className="flex items-center justify-center gap-3 w-full p-3 rounded-xl border border-border bg-background hover:bg-white/5 transition-all text-sm font-semibold text-text-primary"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Continue with Google
          </button>
          
          <button
            onClick={() => handleOAuth('linkedin_oidc')}
            type="button"
            className="flex items-center justify-center gap-3 w-full p-3 rounded-xl border border-border bg-background hover:bg-white/5 transition-all text-sm font-semibold text-text-primary"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0A66C2]" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Continue with LinkedIn
          </button>
        </div>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink-0 mx-4 text-text-secondary text-xs uppercase font-medium">Or continue with email</span>
          <div className="flex-grow border-t border-border"></div>
        </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'otp' ? (
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2">8-Digit Code *</label>
              <input
                type="text"
                name="otp"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                required
                placeholder="Enter code"
                className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors text-center text-2xl tracking-widest"
              />
            </div>
          ) : (
            <>
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
            </>
          )}

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

          {mode === 'signup' && (
            <div className="flex justify-center my-2">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                onSuccess={(token) => setTurnstileToken(token)}
                options={{ theme: 'dark' }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (mode === 'signup' && !turnstileToken)}
            className="w-full py-3 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none shadow-[0_4px_15px_rgba(109,40,217,0.35)]"
          >
            {isLoading ? 'Processing...' : mode === 'otp' ? 'Verify OTP' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {mode !== 'otp' && (
          <div className="mt-6 text-center text-sm text-text-secondary">
            {mode === 'login' ? "Don't have an employer account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-accent-primary hover:underline font-bold"
            >
              {mode === 'login' ? 'Sign up free' : 'Log in'}
            </button>
          </div>
        )}

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
