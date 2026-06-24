"use client";

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface ProposalModalProps {
  gigId: string;
  gigTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProposalModal({ gigId, gigTitle, onClose, onSuccess }: ProposalModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gig_id: gigId,
          cover_letter: coverLetter,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit proposal');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-background border border-border-light rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border-light">
          <div>
            <h2 className="text-xl font-bold text-white">Send Proposal</h2>
            <p className="text-sm text-text-dark-tertiary mt-1">Applying for: <span className="font-semibold text-text-secondary">{gigTitle}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-text-dark-tertiary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="coverLetter" className="text-sm font-semibold text-text-secondary">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you are the best fit for this gig... Highlight relevant experience, tools, and past projects."
              className="w-full p-4 min-h-[150px] bg-slate-900 border border-border rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors text-sm leading-relaxed resize-y"
              required
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer text-text-dark-tertiary text-xs mt-2">
            <input 
              type="checkbox" 
              required
              className="mt-0.5 w-4 h-4 rounded border-border-light accent-accent-primary shrink-0" 
            />
            <span>
              I agree that GenAIJobHub is not responsible for any disputes arising from further business, payments, or contracts related to this gig.
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm text-text-secondary bg-slate-800 hover:bg-slate-700 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(109,40,217,0.3)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.4)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Proposal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
