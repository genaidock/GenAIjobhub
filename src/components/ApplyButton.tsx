"use client";

import React, { useEffect, useCallback } from 'react';

interface ApplyButtonProps {
  jobId: string;
  applyUrl: string;
  className?: string;
  children: React.ReactNode;
}

export default function ApplyButton({ jobId, applyUrl, className, children }: ApplyButtonProps) {
  const processQueue = useCallback(() => {
    const queueStr = localStorage.getItem('applyQueue');
    if (queueStr) {
      try {
        const queue: string[] = JSON.parse(queueStr);
        if (queue.length > 0) {
          const currentJobId = queue[0];
          fetch('/api/track-apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ job_id: currentJobId }),
          }).then(res => {
            if (res.ok) {
              const newQueue = queue.slice(1);
              localStorage.setItem('applyQueue', JSON.stringify(newQueue));
            }
          }).catch(console.error);
        }
      } catch (e) {
        console.error('Error processing queue', e);
      }
    }
  }, []);

  useEffect(() => {
    processQueue();
    const interval = setInterval(processQueue, 30000);
    return () => clearInterval(interval);
  }, [processQueue]);

  const handleClick = () => {
    const addToQueue = () => {
      try {
        const queueStr = localStorage.getItem('applyQueue');
        const queue = queueStr ? JSON.parse(queueStr) : [];
        if (!queue.includes(jobId)) {
          queue.push(jobId);
          localStorage.setItem('applyQueue', JSON.stringify(queue));
        }
      } catch (e) {
        console.error('Error adding to queue', e);
      }
    };

    fetch('/api/track-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId }),
    })
    .then(res => {
      if (!res.ok) addToQueue();
    })
    .catch((err) => {
      console.error(err);
      addToQueue();
    });
  };

  return (
    <a href={applyUrl} target="_blank" rel="noopener noreferrer" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
