"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

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

function PostGigContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeCompany, setUpgradeCompany] = useState('');
  const { user, userType, session, isLoading: authLoading } = useAuth();

  // Employer-only guard
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login/employer?redirect=/post-gig');
      } else if (!['employer', 'both', 'seeker', 'admin'].includes(userType as string)) {
        router.replace('/freelance');
      }
    }
  }, [user, userType, authLoading, router]);

  const [formData, setFormData] = useState({
    title: '',
    budget: '',
    estimated_duration: '',
    description: '',
    is_urgent: false,
  });

  if (authLoading || !user || !['employer', 'both', 'seeker', 'admin'].includes(userType as string)) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const resSdk = await loadRazorpayScript();
      if (!resSdk) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // 1. Post the gig (created as pending payment)
      const res = await fetch('/api/gigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post gig');

      const gigId = data.gig.id;

      // 2. Create Payment Order for Gig Listing (₹499)
      const orderRes = await fetch('/api/razorpay/create-gig-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gig_id: gigId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create payment order');

      // 3. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'GenAIJobHub',
        description: 'Gig Posting Fee',
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
              gig_id: gigId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            setSuccess(true);
            setTimeout(() => router.push('/freelance'), 3000);
          } else {
            setError('Payment verification failed. Your gig was saved but is pending payment.');
          }
          setIsSubmitting(false);
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
        setError('Payment failed or cancelled.');
        setIsSubmitting(false);
      });
      paymentObject.open();

    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center">
        <section className="hero-glow hero-grid w-full py-12 px-[5%] bg-background relative overflow-hidden" />
        <div className="section-light w-full flex flex-col items-center justify-center py-24 px-[5%]">
          <div className="text-center card-light p-10 md:p-14 max-w-lg border-accent-primary/30 shadow-[0_0_30px_rgba(109,40,217,0.12)]">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-text-dark mb-4">Gig Posted Successfully!</h2>
            <p className="text-text-dark-secondary text-lg mb-8">Freelancers can now see your listing and submit proposals.</p>
            <p className="text-sm text-text-dark-tertiary">Redirecting you to the freelance board...</p>
          </div>
        </div>
      </div>
    );
  }

  if (userType === 'seeker') {
    return (
      <div className="flex flex-col items-center">
        <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">
              Upgrade to <span className="gradient-text">Employer</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              You are currently logged in as a Job Seeker. To post gigs, you can upgrade your account to an Employer account.
            </p>
          </div>
        </section>
        <div className="section-transition-dark-to-light w-full" />
        <section className="section-light w-full py-12 md:py-16 px-[5%]">
          <div className="max-w-[500px] mx-auto card-light p-6 md:p-10">
            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">{error}</div>}
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsUpgrading(true);
              setError('');
              try {
                const res = await fetch('/api/user/upgrade', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
                  body: JSON.stringify({ company_name: upgradeCompany })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to upgrade');
                // Reload window to refresh auth context
                window.location.reload();
              } catch(err: any) {
                setError(err.message);
                setIsUpgrading(false);
              }
            }} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-text-dark-secondary mb-2">Your Company Name *</label>
                <input 
                  type="text" required
                  placeholder="e.g. Anthropic" 
                  className="input-light w-full"
                  value={upgradeCompany} onChange={(e) => setUpgradeCompany(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={isUpgrading}
                className="w-full px-6 py-3 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] transition-all disabled:opacity-50"
              >
                {isUpgrading ? 'Upgrading...' : 'Upgrade Account'}
              </button>
            </form>
          </div>
        </section>
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
            Post a <span className="gradient-text">Freelance Gig</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Hire top AI talent for short-term projects and consulting work.
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
              <div>
                <label className="block text-sm font-bold text-text-dark-secondary mb-2">Gig Title *</label>
                <input 
                  type="text" name="title" required
                  placeholder="e.g. Build a custom RAG chatbot" 
                  className="input-light"
                  value={formData.title} onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Budget *</label>
                  <input 
                    type="text" name="budget" required
                    placeholder="e.g. ₹50,000 or Hourly ($50/hr)" 
                    className="input-light"
                    value={formData.budget} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Estimated Duration *</label>
                  <input 
                    type="text" name="estimated_duration" required
                    placeholder="e.g. 2 weeks" 
                    className="input-light"
                    value={formData.estimated_duration} onChange={handleChange}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer text-text-dark-secondary w-fit text-sm">
                <input 
                  type="checkbox" name="is_urgent"
                  className="w-5 h-5 rounded border-border-light accent-accent-primary" 
                  checked={formData.is_urgent} onChange={handleChange}
                />
                Mark as URGENT (Needed ASAP)
              </label>

              <div>
                <label className="block text-sm font-bold text-text-dark-secondary mb-2">Project Details *</label>
                <textarea 
                  name="description" required
                  placeholder="Describe the project scope, deliverables, and required skills..." 
                  className="input-light min-h-[200px] resize-y"
                  value={formData.description} onChange={handleChange}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer text-text-dark-secondary text-sm mt-4 p-4 bg-slate-50 border border-border-light rounded-xl">
                <input 
                  type="checkbox" 
                  required
                  className="mt-1 w-5 h-5 rounded border-border-light accent-accent-primary shrink-0" 
                />
                <span>
                  <strong>Disclaimer:</strong> I understand and agree that GenAIJobHub is a listing portal only. We are not responsible for any disputes arising from further business, payments, or contracts related to this posting.
                </span>
              </label>

              <div className="border-t border-border-light pt-6 mt-2 flex justify-end items-center gap-6">
                <div className="text-right mr-4">
                  <div className="text-sm font-bold text-text-dark">Posting Fee</div>
                  <div className="text-xl font-extrabold text-accent-primary">₹499</div>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.45)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Processing...' : 'Checkout & Post Gig'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PostGig() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PostGigContent />
    </Suspense>
  );
}
