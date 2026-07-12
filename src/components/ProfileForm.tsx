"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';
import { supabase } from '@/lib/supabase';

type ProfileFormProps = {
  initialData: {
    full_name: string | null;
    username: string | null;
    company_name: string | null;
    linkedin_url: string | null;
    company_domain: string | null;
    employee_range: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    pincode: string | null;
    phone: string | null;
    user_type: string | null;
    email: string | null;
  };
};

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || '',
    username: initialData.username || '',
    company_name: initialData.company_name || '',
    linkedin_url: initialData.linkedin_url || '',
    company_domain: initialData.company_domain || '',
    employee_range: initialData.employee_range || '',
    city: initialData.city || '',
    state: initialData.state || '',
    country: initialData.country || 'India',
    pincode: initialData.pincode || '',
    phone: initialData.phone || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          username: formData.username,
          company_name: formData.company_name,
          linkedin_url: formData.linkedin_url,
          company_domain: formData.company_domain,
          employee_range: formData.employee_range,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          phone: formData.phone,
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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete account');
      }
      // Sign out client-side and redirect home
      await supabase.auth.signOut();
      window.location.href = '/?deleted=1';
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'An error occurred');
      setIsDeleting(false);
    }
  };

  return (
    <>
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
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Username {initialData.username ? '(Uneditable)' : ''}
            </label>
            <input
              type="text"
              name="username"
              required
              disabled={!!initialData.username}
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border border-border text-text-primary focus:outline-none transition-all ${
                initialData.username
                  ? 'bg-white/5 text-text-secondary cursor-not-allowed'
                  : 'bg-background focus:border-accent-primary focus:ring-1 focus:ring-accent-primary'
              }`}
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
            <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
            />
          </div>

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

          {initialData.user_type === 'employer' && (
            <>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Company Domain</label>
                <input
                  type="text"
                  name="company_domain"
                  value={formData.company_domain}
                  onChange={handleChange}
                  placeholder="example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Employees</label>
                <select
                  name="employee_range"
                  value={formData.employee_range}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                >
                  <option value="" disabled>Select range</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                >
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Pincode/Zip</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="100001"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                />
              </div>
            </>
          )}
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
    </div>

    {/* ── Danger Zone ─────────────────────────────────────────────── */}
    <div className="mt-8 bg-bg-card border border-red-500/20 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-red-400 mb-1">Danger Zone</h2>
      <p className="text-text-secondary text-sm mb-4">
        Permanently delete your account and all associated data. This action cannot be undone.
        To change your role (e.g. Seeker → Employer), delete your account and re-register.
      </p>
      <button
        onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); setDeleteError(''); }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all"
      >
        <Trash2 className="w-4 h-4" /> Delete My Account
      </button>
    </div>

    {/* ── Delete Confirmation Modal ────────────────────────────────── */}
    {showDeleteModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-bg-card border border-red-500/30 rounded-2xl shadow-2xl p-8 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-lg">Delete Account</h3>
              <p className="text-text-secondary text-xs">This is permanent and irreversible</p>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-5 text-sm text-red-300 space-y-1">
            <p>⚠️ All your data will be permanently deleted:</p>
            <ul className="list-disc list-inside text-red-400/80 text-xs space-y-0.5 mt-1">
              <li>Your profile and account</li>
              <li>All job listings you posted</li>
              <li>All applications you submitted</li>
            </ul>
          </div>

          <label className="block text-sm font-medium text-text-secondary mb-2">
            Type <span className="font-bold text-red-400">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full px-4 py-2.5 mb-4 rounded-lg border border-red-500/30 bg-background text-text-primary focus:outline-none focus:border-red-500 transition-all"
          />

          {deleteError && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mb-4">
              {deleteError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm text-text-secondary border border-border hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE' || isDeleting}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete Forever'}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
