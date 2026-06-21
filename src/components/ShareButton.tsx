"use client";

import { Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="text-xs font-semibold px-4 py-2 bg-slate-50 border border-border-light hover:bg-slate-100 rounded-lg text-text-dark transition-colors w-full"
    >
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}
