import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Privacy policy | GenAIJobHub",
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
            Privacy <span className="gradient-text">policy</span>
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
          <h2 className="text-xl font-bold text-text-dark mb-4">1. Information we collect</h2>
          <p className="mb-6">
            We collect information you provide directly to us when creating an account, posting jobs, uploading resumes, or applying to roles. This includes your name, email address, LinkedIn profile URL, company info, payment information (for premium job listings), and resume files. We also automatically collect device and usage data (such as IP addresses, browser types, and interaction patterns) to optimize your experience.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">2. How we use your information</h2>
          <p className="mb-6">
            We use your details to operate the jobs board, authenticate users, facilitate applications between seekers and recruiters, process transactions securely, improve our resume-feedback tools, and send platform-relevant notifications, updates, and newsletters.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">3. Data sharing and third parties</h2>
          <p className="mb-4">
            We share your information only under the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-6 flex flex-col gap-2">
            <li>
              <strong>Employers:</strong> When you apply for a job posting, your application details and resume are shared directly with the posting Employer.
            </li>
            <li>
              <strong>Payment processors:</strong> Transactions are handled securely through <strong>Razorpay</strong>. We do not store your credit card, debit card, or net banking credentials.
            </li>
            <li>
              <strong>AI services:</strong> Resumes sent for review are processed securely using third-party APIs (such as OpenAI and Gemini). These services do not use your resume details or personal information to train their underlying models.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-text-dark mb-4">4. Data retention</h2>
          <p className="mb-6">
            We retain your personal data only as long as your account is active, or as needed to fulfill the purposes outlined in this policy, including complying with legal, tax, accounting, or reporting requirements. Resumes uploaded for transient AI analysis are discarded immediately after processing unless explicitly saved to your profile.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">5. Security measures</h2>
          <p className="mb-6">
            We deploy standard security protocols, encryption, and row-level security (RLS) policies within our database (Supabase) to prevent unauthorized access, alteration, disclosure, or destruction of candidate resumes and profiles. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">6. Your data privacy rights</h2>
          <p className="mb-4">
            Depending on your jurisdiction (such as under India's Digital Personal Data Protection Act 2023), you have specific rights regarding your personal data:
          </p>
          <ul className="list-disc pl-6 mb-6 flex flex-col gap-2">
            <li><strong>Right to access:</strong> You can request a summary of the personal data we hold about you.</li>
            <li><strong>Right to correction:</strong> You can modify or correct outdated or inaccurate profile details through your dashboard at any time.</li>
            <li><strong>Right to erasure (right to be forgotten):</strong> You can request the complete deletion of your account and associated personal data by contacting us.</li>
            <li><strong>Right to withdraw consent:</strong> You can withdraw your consent to data processing (including email newsletters or AI analysis) at any time.</li>
          </ul>

          <h2 className="text-xl font-bold text-text-dark mb-4">7. Children's privacy</h2>
          <p className="mb-6">
            Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors. If we learn that we have collected information from a minor, we will delete it immediately.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">8. Changes to this privacy policy</h2>
          <p className="mb-6">
            We may update this Privacy Policy from time to time. When we make updates, we will revise the "Last updated" date at the top of the policy. We encourage you to review this policy regularly to stay informed about how we protect your information.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">9. Contact us</h2>
          <p>
            For any queries or concerns regarding this policy, or to exercise your privacy rights, please reach out to us at <a href="mailto:privacy@genaijobhub.com" className="text-accent-primary hover:underline font-semibold">privacy@genaijobhub.com</a> or visit our <Link href="/contact" className="text-accent-primary hover:underline font-semibold">Contact Page</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
