"use client";

import { useState } from 'react';
import { Check } from 'lucide-react';
import ProposalModal from './ProposalModal';
import { useRouter } from 'next/navigation';

interface ProposalButtonProps {
  gigId: string;
  gigTitle: string;
  hasApplied: boolean;
  isSeeker: boolean;
}

export default function ProposalButton({ gigId, gigTitle, hasApplied: initialHasApplied, isSeeker }: ProposalButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const router = useRouter();

  const handleClick = () => {
    if (!isSeeker) {
      // Redirect to login if not a seeker
      router.push('/login?type=seeker');
      return;
    }
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setHasApplied(true);
  };

  if (hasApplied) {
    return (
      <button 
        disabled
        className="px-6 py-2.5 rounded-lg font-bold text-sm text-green-600 bg-green-500/10 border border-green-500/20 cursor-not-allowed flex items-center gap-2"
      >
        <Check className="w-4 h-4" /> Proposal Sent
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={handleClick}
        className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(109,40,217,0.3)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.4)] transition-all"
      >
        Send Proposal
      </button>

      {showModal && (
        <ProposalModal 
          gigId={gigId}
          gigTitle={gigTitle}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
