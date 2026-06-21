import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About Us | GenAIJobHub",
  description: "Learn more about GenAIJobHub, the leading platform connecting AI professionals with high-paying opportunities.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">
            Democratizing <span className="gradient-text">AI Opportunities</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto">
            Our mission is to help prompt engineers, ML developers, and AI builders find the highest-paying roles global startups have to offer.
          </p>
        </div>
      </section>

      {/* Transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Content Area */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[800px] mx-auto card-light p-8 md:p-12 text-text-dark-secondary leading-relaxed flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-text-dark mb-3">Our Mission</h2>
            <p>
              The emergence of Large Language Models and Generative AI has sparked a massive shift in tech hiring. New specializations like Prompt Engineering, AI Consulting, RAG Systems Engineering, and Vector Database administration have emerged overnight. 
            </p>
            <p className="mt-3">
              <strong>GenAIJobHub</strong> was built to organize these AI-native opportunities. We connect top talent with companies building the next frontier of artificial intelligence.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text-dark mb-3">What We Offer</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>
                <strong>Niche Listings:</strong> Only jobs related to machine learning, natural language processing, computer vision, and prompt engineering. Zero generic spam.
              </li>
              <li>
                <strong>AI Career Coach:</strong> Intelligent resume matching against specific roles on the platform to help you land interviews.
              </li>
              <li>
                <strong>Freelance Gigs:</strong> A dedicated portal for short-term prompt writing, fine-tuning, or workflow automation contracts.
              </li>
              <li>
                <strong>Recruiter Tools:</strong> Easy job generation and promotion (Featured spots) to draw rapid responses from top talent.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text-dark mb-3">Our Promise</h2>
            <p>
              We guarantee 100% curation. Every job posted organically is reviewed to confirm it involves Generative AI or core Machine Learning. We help you skip the line so you can spend less time filtering generic job boards and more time building.
            </p>
          </div>

          <div className="border-t border-border-light pt-6 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="font-semibold text-text-dark">Ready to find your next AI role?</span>
            <Link 
              href="/jobs" 
              className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all text-sm"
            >
              Browse Jobs Board
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
