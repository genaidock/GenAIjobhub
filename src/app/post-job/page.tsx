"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Dynamically load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => { resolve(true); };
    script.onerror = () => { resolve(false); };
    document.body.appendChild(script);
  });
};

function PostJobContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);
  const { user, userType, session, isLoading: authLoading } = useAuth();

  // Employer-only guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login/employer?redirect=/post-job');
      } else if (userType !== 'employer') {
        router.replace('/jobs');
      }
    }
  }, [user, userType, authLoading, router]);

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    is_remote: true,
    salary_range: '',
    description: '',
    apply_url: '',
    validity_days: '30', // Default validity is 30 days
  });

  // Repost logic: prefill form if ?repost=[id] is in query parameters
  useEffect(() => {
    const repostId = searchParams.get('repost');
    if (repostId && user) {
      async function fetchRepostJob() {
        try {
          const { data: job, error: fetchErr } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', repostId)
            .single();

          if (fetchErr) throw fetchErr;

          if (job) {
            setFormData({
              title: job.title || '',
              company_name: job.company_name || '',
              location: job.location || '',
              is_remote: job.is_remote ?? true,
              salary_range: job.salary_range || '',
              description: job.description || '',
              apply_url: job.apply_url || '',
              validity_days: '30', // Reset to default 30 days for the new listing
            });
          }
        } catch (err: any) {
          console.error("Failed to fetch job for reposting:", err.message);
          setError("Failed to prefill job details for reposting.");
        }
      }
      fetchRepostJob();
    }
  }, [user, searchParams]);

  if (authLoading || !user || userType !== 'employer') {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Type narrowing for checkbox vs other inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const [isFeatured, setIsFeatured] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // 1. Load Razorpay if featuring
      if (isFeatured) {
        const res = await loadRazorpayScript();
        if (!res) {
          throw new Error('Razorpay SDK failed to load. Are you online?');
        }
      }
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to post job');

      const jobId = data.job.id;

      // 3. Handle Payment if Featured
      if (isFeatured) {
        // Create Order
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_id: jobId }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create payment order');

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey',
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'GenAIJobHub',
          description: 'Featured Job Listing',
          order_id: orderData.order.id,
          handler: async function (response: any) {
            // Verify Payment
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                job_id: jobId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccess(true);
              setTimeout(() => router.push('/jobs'), 3000);
            } else {
              setError('Payment verification failed. Your job was posted but is not featured.');
              setSuccess(true);
              setTimeout(() => router.push('/jobs'), 4000);
            }
          },
          prefill: {
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
          },
          theme: {
            color: '#6d28d9',
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
          setError('Payment failed. Your job was posted but is not featured.');
          setSuccess(true);
          setTimeout(() => router.push('/jobs'), 4000);
        });
        paymentObject.open();
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/jobs'), 3000);
      }
      
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false); // Only reset if not moving to Razorpay
    }
  };

  const handleGenerateJD = async () => {
    if (!formData.title || !formData.company_name) {
      setError('Please enter a Job Title and Company Name to generate a description.');
      return;
    }
    setError('');
    setIsGeneratingJD(true);
    try {
      const res = await fetch('/api/generate-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, company_name: formData.company_name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate job description');
      setFormData(prev => ({ ...prev, description: data.description }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingJD(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center">
        {/* Dark banner even on success */}
        <section className="hero-glow hero-grid w-full py-12 px-[5%] bg-background relative overflow-hidden" />
        <div className="section-light w-full flex flex-col items-center justify-center py-24 px-[5%]">
          <div className="text-center card-light p-10 md:p-14 max-w-lg border-accent-primary/30 shadow-[0_0_30px_rgba(109,40,217,0.12)]">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-text-dark mb-4">Job Posted Successfully!</h2>
            <p className="text-text-dark-secondary text-lg mb-8">Your listing is now live on the jobs board.</p>
            <p className="text-sm text-text-dark-tertiary">Redirecting you to the jobs board...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Dark Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full bg-purple-600/15 blur-[100px] animate-pulse pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            Post an <span className="gradient-text">AI Job</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Reach thousands of top-tier AI professionals, prompt engineers, and ML researchers.
          </p>
        </div>
      </section>

      {/* Smooth transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Light Form Area */}
      <section className="section-light w-full py-12 md:py-16 px-[5%]">
        <div className="max-w-[800px] mx-auto">
          <div className="card-light p-6 md:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Job Title *</label>
                  <input 
                    type="text" name="title" required
                    placeholder="e.g. Senior Machine Learning Engineer" 
                    className="input-light"
                    value={formData.title} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Company Name *</label>
                  <input 
                    type="text" name="company_name" required
                    placeholder="e.g. Anthropic" 
                    className="input-light"
                    value={formData.company_name} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Location</label>
                  <input 
                    type="text" name="location"
                    placeholder="e.g. San Francisco, CA" 
                    className="input-light"
                    value={formData.location} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Salary Range</label>
                  <input 
                    type="text" name="salary_range"
                    placeholder="e.g. $150k - $200k" 
                    className="input-light"
                    value={formData.salary_range} onChange={handleChange}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer text-text-dark-secondary w-fit text-sm">
                <input 
                  type="checkbox" name="is_remote"
                  className="w-5 h-5 rounded border-border-light accent-accent-primary" 
                  checked={formData.is_remote} onChange={handleChange}
                />
                This is a fully remote role
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Application URL (Optional)</label>
                  <input 
                    type="url" name="apply_url"
                    placeholder="https://your-company.com/careers/apply" 
                    className="input-light"
                    value={formData.apply_url} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Job Listing Validity *</label>
                  <select 
                    name="validity_days" required
                    className="input-light"
                    value={formData.validity_days} onChange={handleChange}
                  >
                    <option value="10">10 Days</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="45">45 Days (Max)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-text-dark-secondary">Job Description *</label>
                  <button
                    type="button"
                    onClick={handleGenerateJD}
                    disabled={isGeneratingJD || !formData.title || !formData.company_name}
                    className="text-sm font-bold text-accent-primary hover:text-accent-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  >
                    {isGeneratingJD ? '✨ Generating...' : '✨ Auto-Generate with AI'}
                  </button>
                </div>
                <textarea 
                  name="description" required
                  placeholder="Describe the role, responsibilities, and requirements..." 
                  className="input-light min-h-[250px] resize-y"
                  value={formData.description} onChange={handleChange}
                />
              </div>

              <div className="border-t border-border-light pt-6 mt-2 flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Featured Toggle */}
                <div className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer w-full md:w-auto ${isFeatured ? 'border-accent-primary bg-accent-primary/5' : 'border-border-light bg-white hover:border-accent-primary/30'}`}
                  onClick={() => setIsFeatured(!isFeatured)}
                >
                  <div className="pt-1">
                    <input 
                      type="checkbox"
                      className="w-5 h-5 rounded border-border-light accent-accent-primary cursor-pointer pointer-events-none"
                      checked={isFeatured}
                      readOnly
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className={`w-5 h-5 ${isFeatured ? 'text-accent-primary fill-accent-primary' : 'text-text-dark-tertiary'}`} />
                      <span className="font-bold text-text-dark">Boost to Featured</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-accent-primary/10 text-accent-primary">₹999</span>
                    </div>
                    <p className="text-sm text-text-dark-secondary">
                      Highlight your job at the top of the board for 30 days.
                    </p>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.45)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting 
                    ? (isFeatured ? 'Processing...' : 'Posting Job...') 
                    : (isFeatured ? 'Checkout & Post' : 'Post Job for Free')}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PostJob() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PostJobContent />
    </Suspense>
  );
}

