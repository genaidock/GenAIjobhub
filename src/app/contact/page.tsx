"use client";

import { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Mock API call simulation
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto">
            Have questions, feedback, or business inquiries? Drop us a line and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Content Area */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 items-start">
          
          {/* Info Column */}
          <div className="flex flex-col gap-4">
            <div className="card-light p-6">
              <h3 className="font-bold text-text-dark text-sm uppercase tracking-wider mb-4">Contact Info</h3>
              <div className="flex flex-col gap-4 text-sm text-text-dark-secondary">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent-primary shrink-0" />
                  <div>
                    <div className="font-bold text-text-dark">Email Us</div>
                    <a href="mailto:support@genaijobhub.com" className="hover:underline">support@genaijobhub.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent-primary shrink-0" />
                  <div>
                    <div className="font-bold text-text-dark">Location</div>
                    <div>Pune, Maharashtra, India</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-light p-6">
              <h3 className="font-bold text-text-dark text-sm uppercase tracking-wider mb-2">Office Hours</h3>
              <p className="text-text-dark-secondary text-sm leading-relaxed">
                Monday – Friday: 9:00 AM – 6:00 PM IST
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="card-light p-8 md:p-10 w-full">
            <h2 className="text-2xl font-bold text-text-dark mb-6 border-b border-border-light pb-4">Send a Message</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Your message has been sent successfully! We will get back to you soon.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Your Name *</label>
                  <input 
                    type="text" name="name" required
                    className="input-light"
                    placeholder="Enter name"
                    value={formData.name} onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-dark-secondary mb-2">Email Address *</label>
                  <input 
                    type="email" name="email" required
                    className="input-light"
                    placeholder="you@email.com"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-dark-secondary mb-2">Subject *</label>
                <select 
                  name="subject" required
                  className="input-light"
                  value={formData.subject} onChange={handleChange}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Employer Account Help">Employer Account Help</option>
                  <option value="Candidate Support">Candidate Support</option>
                  <option value="Partnership Proposal">Partnership Proposal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-dark-secondary mb-2">Message *</label>
                <textarea 
                  name="message" required
                  placeholder="How can we help you?"
                  className="input-light min-h-[160px] resize-y"
                  value={formData.message} onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
