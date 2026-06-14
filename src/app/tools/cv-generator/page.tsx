import Link from 'next/link';

export const metadata = {
  title: 'Premium AI CV Generator | GenAIJobHub',
  description: 'Upload your old resume and let our AI transform it into an ATS-friendly, high-impact CV designed for AI & ML roles.',
};

export default function CVGeneratorLanding() {
  return (
    <div className="flex flex-col items-center">
      {/* Dark Header Banner */}
      <section className="hero-glow hero-grid w-full py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-accent-primary/20 border border-accent-primary/30 text-accent-primary font-bold text-sm tracking-wide uppercase">
            Premium Service
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            The Ultimate <span className="gradient-text">AI CV Generator</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl mb-10 leading-relaxed">
            Stop getting filtered out by ATS. Upload your current PDF resume, and our elite AI recruiter will rewrite, structure, and optimize it for top-tier Machine Learning and Software Engineering roles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tools/cv-generator/builder" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_8px_25px_rgba(109,40,217,0.45)] transition-all">
              Build My CV Now
            </Link>
          </div>
        </div>
      </section>

      {/* Smooth transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Features Section */}
      <section className="section-light w-full py-20 px-[5%]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-dark mb-4">How It Works</h2>
            <p className="text-text-dark-secondary">Three simple steps to your dream job.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-light p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-3xl mb-6 shadow-sm">
                📄
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-3">1. Upload PDF</h3>
              <p className="text-text-dark-secondary leading-relaxed">
                Upload your old, outdated resume. We securely parse all your experience, education, and skills.
              </p>
            </div>

            <div className="card-light p-8 text-center flex flex-col items-center border-accent-primary/30 relative">
              <div className="absolute -top-4 bg-accent-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Magic Happens Here
              </div>
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-3xl mb-6 shadow-sm">
                ✨
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-3">2. AI Optimization</h3>
              <p className="text-text-dark-secondary leading-relaxed">
                Our GPT-4 powered engine rewrites your bullet points to be action-driven, impact-focused, and ATS-friendly.
              </p>
            </div>

            <div className="card-light p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-3xl mb-6 shadow-sm">
                🚀
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-3">3. Export & Apply</h3>
              <p className="text-text-dark-secondary leading-relaxed">
                Review your stunning new Markdown-formatted CV, copy it, and start landing interviews immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
