"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Turnstile } from '@marsidev/react-turnstile';
import { COUNTRIES } from '@/lib/countries';
import { FREE_EMAIL_DOMAINS } from '@/lib/free-domains';

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
    company_domain: '',
    employee_range: '',
    country: 'India',
    pincode: '',
    city: '',
    state: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm(prev => ({ ...prev, pincode: val }));
    
    if (form.country === 'India' && val.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setForm(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
        }
      } catch (err) {
        console.error('Error fetching pincode:', err);
      }
    } else if (['United States', 'United Kingdom', 'Canada', 'Australia'].includes(form.country) && val.length >= 4) {
      try {
        const countryCode = form.country === 'United States' ? 'us' : form.country === 'United Kingdom' ? 'gb' : form.country === 'Canada' ? 'ca' : 'au';
        const res = await fetch(`https://api.zippopotam.us/${countryCode}/${val}`);
        if (res.ok) {
          const data = await res.json();
          const place = data.places[0];
          setForm(prev => ({ ...prev, city: place['place name'], state: place['state'] }));
        }
      } catch (err) {
        console.error('Error fetching zipcode:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    if ((mode === 'signup' || mode === 'login') && !turnstileToken) {
      setError('Please complete the security check.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const emailDomain = form.email.split('@')[1]?.toLowerCase();
        if (FREE_EMAIL_DOMAINS.includes(emailDomain)) {
          throw new Error('Please use your official corporate email. Free providers are not allowed. If you are an official employee of this provider, please contact support@genaijobhub.com.');
        }

        if (!form.full_name.trim()) throw new Error('Please enter your full name.');
        if (!form.company_name.trim()) throw new Error('Please enter your company name.');
        if (!form.company_domain.trim()) throw new Error('Please enter your company domain.');
        if (!form.employee_range) throw new Error('Please select number of employees.');
        if (!form.city.trim() || !form.state.trim() || !form.pincode.trim()) throw new Error('Please complete the location details.');
        if (form.password.length < 8) throw new Error('Password must be at least 8 characters.');

        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            captchaToken: turnstileToken,
            data: {
              user_type: 'employer',
              full_name: form.full_name.trim(),
              company_name: form.company_name.trim(),
              company_domain: form.company_domain.trim(),
              employee_range: form.employee_range,
              city: form.city.trim(),
              state: form.state.trim(),
              country: form.country,
              pincode: form.pincode.trim()
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
        let loginEmail = form.email.trim();
        
        // If they entered a username (no @ symbol), we resolve it to an email
        if (!loginEmail.includes('@')) {
          const res = await fetch('/api/auth/lookup-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: loginEmail })
          });
          
          if (!res.ok) {
            throw new Error('Invalid username or password.');
          }
          
          const data = await res.json();
          loginEmail = data.email;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: form.password,
          options: { captchaToken: turnstileToken },
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
          redirectTo: `${window.location.origin}/api/auth/callback?role=employer&next=${redirectTo}`,
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Company Domain *</label>
                  <input
                    type="text"
                    name="company_domain"
                    value={form.company_domain}
                    onChange={handleChange}
                    required
                    placeholder="example.com"
                    className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Employees *</label>
                  <select
                    name="employee_range"
                    value={form.employee_range}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                  >
                    <option value="" disabled>Select range</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Country *</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Pincode/Zip *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handlePincodeChange}
                    required
                    placeholder="100001"
                    className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="New Delhi"
                    className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    placeholder="Delhi"
                    className="w-full p-3 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-text-secondary mb-2">
              {mode === 'login' ? 'Email or Username *' : 'Work Email *'}
            </label>
            <input
              type={mode === 'login' ? 'text' : 'email'}
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder={mode === 'login' ? "you@company.com or @username" : "you@company.com"}
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

          {(mode === 'signup' || mode === 'login') && (
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
            disabled={isLoading || ((mode === 'signup' || mode === 'login') && !turnstileToken)}
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
