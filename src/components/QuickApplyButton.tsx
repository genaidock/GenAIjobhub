"use client";

import React from 'react';

export default function QuickApplyButton() {
  return (
    <button 
      onClick={() => alert("Quick apply coming soon!")} 
      className="block w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.45)] transition-all mb-3"
    >
      Apply Now
    </button>
  );
}
