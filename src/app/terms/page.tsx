import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Terms of service | GenAIJobHub",
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
            Terms of <span className="gradient-text">service</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto">
            Last updated: August 27, 2026. Please read these terms carefully before using our platform.
          </p>
        </div>
      </section>

      {/* Transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Content Area */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[800px] mx-auto card-light p-8 md:p-12 text-text-dark-secondary leading-relaxed">
          <h2 className="text-xl font-bold text-text-dark mb-4">1. Acceptance of terms</h2>
          <p className="mb-6">
            By accessing, registering for, or using GenAIJobHub.com (the "Platform" or "Service"), you agree to be bound by these Terms of service ("Terms"). If you do not agree to these Terms, you must not use or access the Platform. These Terms constitute a binding legal agreement between you and GenAIJobHub.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">2. Services and account registration</h2>
          <p className="mb-6">
            GenAIJobHub is a specialized job board connecting job seekers ("Candidates") with employers ("Employers") for roles related to artificial intelligence, machine learning, prompt engineering, and related domains. To access certain features, you must register for an account. You agree to provide accurate, current, and complete information, and to safeguard your credentials. You are responsible for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">3. Employer listings and validity</h2>
          <p className="mb-6">
            Employers are solely responsible for the content and validity of the job listings they publish. All listings require a mandatory validity period (maximum 45 days). Once a listing expires, it is hidden from public view but remains accessible in the Employer's dashboard history for reposting. GenAIJobHub reserves the right, in its sole discretion, to remove any job posting that is fraudulent, discriminatory, misleading, or violates applicable labor laws.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">4. Payment and refund policy</h2>
          <p className="mb-6">
            Premium features, such as boosting a listing to Featured, require payment processed securely through our third-party payment gateway, Razorpay. All fees paid are non-refundable except as required by law. If a payment fails but the listing is not featured, please contact support to verify the transaction status. GenAIJobHub is not liable for payment gateway processing errors, downtime, or security issues originating from Razorpay.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">5. API-fetched and external listings</h2>
          <p className="mb-6">
            Some job listings on our board are synced dynamically from external partner platforms via APIs. While we refresh these listings daily, changes or active status updates on the source sites may take up to 24 hours to reflect. GenAIJobHub does not guarantee the availability or accuracy of externally sourced listings. You apply to external jobs at your own risk.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">6. AI tools and resume suggestions disclaimer</h2>
          <p className="mb-6">
            GenAIJobHub offers AI-powered features, including AI resume analysis, feedback, and matching tools. You acknowledge and agree that these AI tools utilize advanced artificial intelligence models (such as OpenAI and Gemini) to generate suggestions, and these suggestions are provided on an "as-is" and "as-available" basis. GenAIJobHub makes no warranty regarding the accuracy, completeness, or suitability of the feedback, nor do we guarantee that using these tools will result in job applications, interviews, or employment. Candidates remain solely responsible for the accuracy and editing of their resumes.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">7. Prohibited activities</h2>
          <p className="mb-6">
            You agree not to use the Platform to:
          </p>
          <ul className="list-disc pl-6 mb-6 flex flex-col gap-2">
            <li>Post any false, incomplete, or inaccurate resume or job details.</li>
            <li>Post discriminatory, offensive, or unlawful content.</li>
            <li>Impersonate any person or entity, or misrepresent your affiliation.</li>
            <li>Scrape, harvest, spider, or systematically extract data from the Platform without our prior written consent.</li>
            <li>Attempt to bypass security, interfere with the proper working of the Platform, or transmit any malware or virus.</li>
          </ul>

          <h2 className="text-xl font-bold text-text-dark mb-4">8. Disclaimer of warranties</h2>
          <p className="mb-6">
            To the maximum extent permitted under applicable law, the Platform and all services, content, and tools are provided "as-is" and "as-available", without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or that the services will be uninterrupted or error-free.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">9. Limitation of liability</h2>
          <p className="mb-6">
            To the maximum extent permitted by law, GenAIJobHub, its founders, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, employment opportunities, or goodwill, arising out of or related to your use of the Platform. In no event shall our total aggregate liability exceed the amount paid by you to us in the 12 months preceding the claim, or INR 5,000, whichever is lower.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">10. Indemnification</h2>
          <p className="mb-6">
            You agree to indemnify, defend, and hold harmless GenAIJobHub, its founders, officers, and affiliates from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in any way connected with your access to or use of the Platform, your user content, or your violation of these Terms.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">11. Termination</h2>
          <p className="mb-6">
            We reserve the right to suspend, disable, or terminate your account, remove job listings, or restrict your access to the Service at our sole discretion, without notice or liability, for conduct that violates these Terms or is harmful to the Platform or other users.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">12. Governing law and jurisdiction</h2>
          <p className="mb-6">
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any legal actions or proceedings arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Pune, Maharashtra, India.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">13. Modifications to terms</h2>
          <p className="mb-6">
            We reserve the right to modify these Terms at any time. When we make updates, we will revise the "Last updated" date at the top. Your continued use of the Platform after updates constitute your acceptance of the revised Terms.
          </p>

          <h2 className="text-xl font-bold text-text-dark mb-4">14. Contact information</h2>
          <p>
            If you have any questions or concerns regarding these Terms, please reach out to us at <a href="mailto:support@genaijobhub.com" className="text-accent-primary hover:underline font-semibold">support@genaijobhub.com</a> or visit our <Link href="/contact" className="text-accent-primary hover:underline font-semibold">Contact Page</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
