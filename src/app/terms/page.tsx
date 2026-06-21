import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Terms of Service | GenAIJobHub",
  description: "Terms and conditions of using the GenAIJobHub platform.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto">
            Last updated: June 20, 2026. Please read these terms carefully before using our platform.
          </p>
        </div>
      </section>

      {/* Transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Content Area */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[800px] mx-auto card-light p-8 md:p-12 text-text-dark-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-text-dark mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing or using GenAIJobHub.com (the "Portal", "Platform", or "Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">2. Services Offered</h2>
          <p className="mb-6">
            GenAIJobHub is a specialized job board connecting job seekers ("Candidates") with employers ("Employers") hiring for roles related to artificial intelligence, machine learning, prompt engineering, and related domains. We also offer career-building tools (like AI resume suggestions) and premium featured job postings.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">3. Employer Postings & Validity</h2>
          <p className="mb-6">
            Employers are solely responsible for the job postings they publish. 
            All job listings require selecting a mandatory validity period (maximum 45 days). 
            Once a listing expires, it will be hidden from public view but will remain accessible in the Employer's dashboard history, from where it can be reposted.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">4. Payment & Refund Policy</h2>
          <p className="mb-6">
            Certain features (like boosting a listing to Featured) require payment, which is processed securely through Razorpay. All fees paid are non-refundable. If a payment fails but the listing is not featured, please contact support to verify the payment status.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">5. API-Fetched Listings</h2>
          <p className="mb-6">
            Some job listings on our board are synced dynamically from external partner platforms. While we refresh our listings daily, active status changes on the source site may take up to 24 hours to reflect. GenAIJobHub does not guarantee the availability or accuracy of externally sourced listings.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">6. Account Security</h2>
          <p className="mb-6">
            You are responsible for safeguarding the credentials you use to access the Portal. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">7. Termination</h2>
          <p className="mb-6">
            We reserve the right to suspend or terminate accounts, remove job postings, or restrict access to the Service at our sole discretion, without notice, for conduct that violates these Terms or is harmful to other users of the Platform.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">8. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please reach out to us at <a href="mailto:support@genaijobhub.com" className="text-accent-primary hover:underline font-semibold">support@genaijobhub.com</a> or visit our <Link href="/contact" className="text-accent-primary hover:underline font-semibold">Contact Page</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
