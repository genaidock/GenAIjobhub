"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Save, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

type ProfileFormProps = {
  initialData: {
    full_name: string | null;
    company_name: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    phone: string | null;
    user_type: string | null;
    email: string | null;
  };
};

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || '',
    company_name: initialData.company_name || '',
    linkedin_url: initialData.linkedin_url || '',
    github_url: initialData.github_url || '',
    phone: initialData.phone || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Mobile OTP State
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [newPhone, setNewPhone] = useState(formData.phone);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          company_name: formData.company_name,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!newPhone.trim()) return;
    setIsSendingOtp(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const { error } = await supabase.auth.updateUser({ phone: newPhone });
      if (error) throw error;
      
      setOtpSuccess(`OTP sent to ${newPhone}`);
      setIsPhoneModalOpen(true);
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpToken.trim()) return;
    setIsSendingOtp(true);
    setOtpError('');

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: newPhone,
        token: otpToken,
        type: 'phone_change',
      });

      if (verifyError) throw verifyError;

      // Update public.profiles table
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: newPhone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to sync phone number to profile');
      }

      setFormData(prev => ({ ...prev, phone: newPhone }));
      setIsPhoneModalOpen(false);
      setSuccess('Phone number verified and updated successfully!');
      router.refresh();
    } catch (err: unknown) {
      setOtpError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-text-primary mb-6">Profile Details</h2>

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3 text-green-400">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleProfileSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email (Uneditable)</label>
            <input
              type="text"
              disabled
              value={initialData.email || ''}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white/5 text-text-secondary cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
            />
          </div>

          {initialData.user_type === 'employer' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">GitHub URL</label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 transition-colors"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>

      {/* Phone Number Section */}
      <div className="mt-10 pt-8 border-t border-border">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-accent-primary" />
          Mobile Verification
        </h3>
        <p className="text-sm text-text-secondary mb-5">
          Verify your mobile number to receive text notifications about your applications and gig proposals.
        </p>

        <div className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-grow w-full">
            <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number (with country code, e.g. +1...)</label>
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
            />
          </div>
          <button
            onClick={handleSendOtp}
            disabled={isSendingOtp || !newPhone || newPhone === formData.phone}
            className="w-full md:w-auto px-6 py-2.5 rounded-lg font-medium text-white bg-background border border-border hover:bg-white/5 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {isSendingOtp ? 'Sending...' : formData.phone && newPhone === formData.phone ? 'Verified' : 'Send Code'}
          </button>
        </div>

        {otpError && <p className="text-red-400 text-sm mt-3">{otpError}</p>}
        {otpSuccess && <p className="text-green-400 text-sm mt-3">{otpSuccess}</p>}
      </div>

      {/* OTP Verification Modal */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-text-primary mb-2">Enter Verification Code</h3>
            <p className="text-sm text-text-secondary mb-6">
              We sent a 6-digit code to <span className="font-medium text-text-primary">{newPhone}</span>.
            </p>

            <input
              type="text"
              value={otpToken}
              onChange={(e) => setOtpToken(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text-primary text-center tracking-[0.5em] text-xl font-bold focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all mb-4"
            />

            {otpError && <p className="text-red-400 text-sm mb-4 text-center">{otpError}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setIsPhoneModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg font-medium text-text-primary bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={isSendingOtp || otpToken.length < 6}
                className="flex-1 py-2.5 rounded-lg font-medium text-white bg-accent-primary hover:bg-accent-secondary disabled:opacity-50 transition-colors"
              >
                {isSendingOtp ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
