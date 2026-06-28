import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#08080c] border-t border-white/5">
      {/* Main Footer Grid */}
      <div className="max-w-[1200px] mx-auto px-[5%] pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-extrabold text-text-primary mb-4 flex items-center gap-2">
              <div className="w-8 h-8 relative flex-shrink-0">
                <Image src="/logo.png" alt="GenAIJobHub Logo" fill sizes="32px" className="object-contain" />
              </div>
              GenAI<span className="text-accent-primary">JobHub</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-[280px]">
              Empowering the next generation of AI professionals with the best opportunities worldwide.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="https://twitter.com/genaijobhub" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com/company/genaijobhub" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://github.com/genaijobhub" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-5">Product</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/jobs" className="text-text-secondary text-sm hover:text-white transition-colors">Jobs Board</Link></li>
              <li><Link href="/freelance" className="text-text-secondary text-sm hover:text-white transition-colors">Freelance Gigs</Link></li>
              <li><Link href="/news" className="text-text-secondary text-sm hover:text-white transition-colors">AI News</Link></li>
              <li><Link href="/post-job" className="text-text-secondary text-sm hover:text-white transition-colors">Post a Job</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-5">Resources</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/tools" className="text-text-secondary text-sm hover:text-white transition-colors">AI Tools</Link></li>
              <li><Link href="/salaries" className="text-text-secondary text-sm hover:text-white transition-colors">Salary Explorer</Link></li>
              <li><Link href="/blog" className="text-text-secondary text-sm hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/#newsletter" className="text-text-secondary text-sm hover:text-white transition-colors">Newsletter</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-5">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-text-secondary text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="text-text-secondary text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-text-secondary text-sm hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-text-secondary text-sm hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-[5%] py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#5a5a6a] text-sm">
            &copy; {new Date().getFullYear()} GenAIJobHub.com. All rights reserved.
          </p>
          <p className="text-[#5a5a6a] text-xs">
            Built for the AI community 🤖
          </p>
        </div>
      </div>
    </footer>
  );
}
