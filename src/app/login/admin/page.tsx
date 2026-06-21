"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Eye, Key } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'admin@genaijobhub.com';

function AdminAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const secretKey = searchParams.get('key');
  const expectedSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'genai-admin-key-2026';
  
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If secret key is incorrect or missing, display a 404 fallback page to keep URL unpredictable
  if (secretKey !== expectedSecret) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-6xl font-extrabold text-white tracking-tight mb-4">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Page Not Found</h2>
        <p className="text-text-secondary mb-6 max-w-sm">The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-md">
          Back to Homepage
        </Link>
      </div>
    );
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    // Strict client-side check
    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError(`Unauthorized: Access restricted to system administrator.`);
      setIsLoading(false);
      return;
    }

    try {
      // 1. Run the self-healing setup API to verify/create admin user in Supabase
      const setupRes = await fetch(`/api/admin/setup?key=${encodeURIComponent(secretKey || '')}`);
      if (!setupRes.ok) {
        const setupData = await setupRes.json();
        throw new Error(setupData.error || 'Failed to initialize admin session.');
      }

      // 2. Now standard Supabase OTP sign in (which will now succeed since the account is guaranteed to exist)
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: false, // Prevent unwanted registrations of non-admin users
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard/admin`
        }
      });

      if (otpError) throw otpError;

      setIsOtpSent(true);
      setSuccessMsg('A verification code has been sent to the administrator email inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP code. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!otpToken.trim()) {
      setError('Please enter the OTP verification code.');
      setIsLoading(false);
      return;
    }

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otpToken.trim(),
        type: 'signup', // Try signup type first, or magiclink/email based on supabase config
      });

      // If signup type fails or isn't applicable, fallback to magiclink type
      if (verifyError) {
        const { error: fallbackError } = await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: otpToken.trim(),
          type: 'magiclink',
        });
        if (fallbackError) throw fallbackError;
      }

      setSuccessMsg('Verified successfully! Redirecting...');
      router.push('/dashboard/admin');

    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP verification code.');
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
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Admin Portal
            </h1>
            <p className="text-text-secondary text-xs">
              {isOtpSent ? 'Enter OTP Verification Code' : 'Restricted Secure Console'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium leading-relaxed">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-semibold">
            {successMsg}
          </div>
        )}

        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2">Administrator Email *</label>
              <input
                type="email"
                required
                className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none shadow-[0_4px_15px_rgba(220,38,38,0.25)]"
            >
              {isLoading ? 'Sending...' : 'Request Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2">Enter OTP Verification Code *</label>
              <input
                type="text"
                required
                className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors text-center text-2xl tracking-widest"
                placeholder="12345678"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
              />
              <p className="text-[10px] text-text-secondary mt-1.5 text-center leading-relaxed">
                Check the inbox of {email} for the 8-digit verification code.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Log In'}
            </button>

            <button
              type="button"
              onClick={() => { setIsOtpSent(false); setOtpToken(''); setError(''); setSuccessMsg(''); }}
              className="text-xs text-text-secondary hover:text-text-primary text-center mt-2 font-semibold hover:underline"
            >
              Change Email Address
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CardFallbackBoundary />
    </Suspense>
  );
}

function CardFallbackBoundary() {
  return <AdminAuthContent />;
}
