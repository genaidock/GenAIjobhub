import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Privacy Policy | GenAIJobHub",
  description: "Learn how GenAIJobHub protects and manages your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto">
            Your privacy is extremely important to us. Learn how we handle and protect your personal information.
          </p>
        </div>
      </section>

      {/* Transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Content Area */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[800px] mx-auto card-light p-8 md:p-12 text-text-dark-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-text-dark mb-4">1. Information We Collect</h2>
          <p className="mb-6">
            We collect information you provide directly to us when creating an account, posting jobs, uploading resumes, or applying to roles. This includes your name, email address, LinkedIn profile URL, company info, payment information (for premium job listings), and resume files.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">2. How We Use Your Information</h2>
          <p className="mb-6">
            We use your details to power the jobs board, authenticate users, facilitate applications between seekers and recruiters, process transactions securely, improve our resume-feedback tools, and send platform-relevant notifications.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">3. Data Sharing & Third-Parties</h2>
          <p className="mb-6">
            * **Employers:** When you apply for a job posting, your application details and resume are shared directly with the posting Employer.
            <br />
            * **Payment Processors:** Transactions are handled securely through **Razorpay**. We do not store your credit card or net banking credentials.
            <br />
            * **AI Services:** Resumes sent for review are processed securely using third-party APIs (like OpenAI or Gemini). These services do not use your resume details to train their underlying models.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">4. Security Measures</h2>
          <p className="mb-6">
            We deploy standard security protocols and row-level security (RLS) policies within our database (Supabase) to prevent unauthorized access or disclosure of candidate resumes and profiles. However, no internet transmission is 100% secure, and we cannot guarantee complete security.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">5. Cookies & Analytics</h2>
          <p className="mb-6">
            We use cookies to maintain user sessions and track traffic/interaction patterns to optimize page load speeds. You can configure your browser to reject cookies, though doing so might disable certain portal features.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">6. Your Rights & Choice</h2>
          <p className="mb-6">
            You can modify, update, or completely delete your profile details and listings at any time through your dashboard settings. If you wish to delete your account entirely, please contact us at support.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">7. Contact Us</h2>
          <p>
            For any queries or concerns regarding this policy, please reach out to us at <a href="mailto:privacy@genaijobhub.com" className="text-accent-primary hover:underline font-semibold">privacy@genaijobhub.com</a> or visit our <Link href="/contact" className="text-accent-primary hover:underline font-semibold">Contact Page</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
