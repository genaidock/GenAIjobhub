"use client";

import React from 'react';

interface ApplyButtonProps {
  jobId: string;
  applyUrl: string;
  className?: string;
  children: React.ReactNode;
}

export default function ApplyButton({ jobId, applyUrl, className, children }: ApplyButtonProps) {
  const handleClick = () => {
    fetch('/api/track-apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_id: jobId }),
    }).catch(console.error);
  };

  return (
    <a href={applyUrl} target="_blank" rel="noopener noreferrer" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
