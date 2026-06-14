"use client";

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [keywords, setKeywords] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, keywords }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');

      setStatus('success');
      // Use the message from the backend if available
      setMessage(data.message || 'Success! You have been added to the newsletter.');
      setEmail('');
      setKeywords('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <section id="newsletter" className="section-light-secondary w-full py-24 md:py-28 px-[5%] flex flex-col items-center border-t border-border-light">
      <div className="max-w-[600px] w-full text-center">
        <div className="inline-block px-4 py-1.5 bg-purple-50 text-accent-primary rounded-full font-semibold text-sm mb-6 border border-purple-100">
          📬 Weekly Newsletter
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-dark mb-4 tracking-tight">Stay Ahead in AI</h2>
        <p className="text-text-dark-secondary text-lg mb-10 leading-relaxed">
          Get the highest-paying AI jobs and top tools delivered directly to your inbox every week. No spam, ever.
        </p>
        
        {status === 'success' ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="input-light flex-grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Keywords (e.g., React, Python, Remote)" 
                className="input-light flex-grow sm:max-w-[200px]"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="px-8 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.45)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap w-full sm:w-auto mt-2"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-sm mt-4 text-left font-medium">{message}</p>
        )}
      </div>
    </section>
  );
}
