"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface QuickApplyButtonProps {
  jobId: string;
  initialHasApplied: boolean;
}

export default function QuickApplyButton({ jobId, initialHasApplied }: QuickApplyButtonProps) {
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleApply = async () => {
    setIsApplying(true);
    setError(null);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?redirect=/jobs/${jobId}`);
          return;
        }
        throw new Error(data.error || 'Failed to submit application');
      }

      setHasApplied(true);
      router.refresh(); // Refresh page to update any server components
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  if (hasApplied) {
    return (
      <button 
        disabled 
        className="flex justify-center items-center gap-2 w-full py-3.5 rounded-xl font-bold text-white bg-green-500/80 cursor-not-allowed mb-3"
      >
        <CheckCircle2 className="w-5 h-5" />
        Application Submitted
      </button>
    );
  }

  return (
    <div className="w-full">
      <button 
        onClick={handleApply} 
        disabled={isApplying}
        className="flex justify-center items-center gap-2 w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.45)] transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isApplying ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Applying...
          </>
        ) : (
          'Quick Apply Now'
        )}
      </button>
      {error && (
        <div className="flex items-start gap-2 text-red-400 text-xs mt-2 bg-red-400/10 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
