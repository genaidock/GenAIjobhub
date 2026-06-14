import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 w-full">
      <div className="mb-8 relative">
        <div className="text-[120px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-border-color/80 to-background opacity-30 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Page <span className="gradient-text">Not Found</span>
          </h2>
        </div>
      </div>
      
      <p className="text-text-secondary max-w-md mb-10 text-lg">
        We couldn't find the page you were looking for. It might have been removed, renamed, or simply doesn't exist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/jobs" className="px-6 py-3 rounded-lg font-bold text-white bg-accent-primary hover:bg-accent-secondary transition-colors shadow-md shadow-accent-primary/20">
          Browse AI Jobs
        </Link>
        <Link href="/" className="px-6 py-3 rounded-lg font-medium border border-border-color hover:bg-bg-card transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
