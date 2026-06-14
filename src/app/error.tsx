'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 w-full">
      <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Something went wrong!</h2>
      <p className="text-text-secondary max-w-md mb-10 text-lg">
        An unexpected error occurred while trying to process your request. We've been notified and are looking into it.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-lg font-bold text-white bg-accent-primary hover:bg-accent-secondary transition-colors shadow-md shadow-accent-primary/20"
        >
          Try Again
        </button>
        <Link href="/" className="px-6 py-3 rounded-lg font-medium border border-border-color hover:bg-bg-card transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
