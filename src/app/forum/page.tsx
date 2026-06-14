import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Community Forum | GenAIJobHub',
  description: 'Discuss AI tools, job hunting strategies, and review code with the community.',
};

export const revalidate = 0;

export default async function ForumHomePage() {
  // Try to fetch categories. If the user hasn't run the SQL migration, this will fail.
  let categories: any[] = [];
  let errorMsg = '';
  
  try {
    const { data, error } = await supabase.from('forum_categories').select('*').order('name');
    if (error) throw error;
    categories = data || [];
  } catch (err: any) {
    console.error('Failed to load forum categories:', err);
    errorMsg = "Database tables not found. Please ensure you've run the Phase 1 SQL migration.";
  }

  // If no categories exist but no error, we might need to seed them
  const predefinedCategories = [
    { name: 'AI Tools & Models', description: 'Discuss the latest LLMs, frameworks, and AI products.', count: 0 },
    { name: 'Job Hunting Strategy', description: 'Resume tips, interview prep, and career advice.', count: 0 },
    { name: 'Code Review & Projects', description: 'Share your AI projects and get community feedback.', count: 0 },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Dark Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-600/15 blur-[100px] animate-pulse pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Community <span className="gradient-text">Forum</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Join the conversation. Share knowledge, ask questions, and network with other AI professionals.
          </p>
          <div className="mt-8">
            <Link href="/forum/new" className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-lg transition-all inline-block">
              Start a Discussion
            </Link>
          </div>
        </div>
      </section>

      {/* Smooth transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Light Content Area */}
      <section className="section-light w-full py-16 px-[5%] min-h-[50vh]">
        <div className="max-w-[1000px] mx-auto">
          {errorMsg && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <h3 className="text-red-800 font-bold text-lg mb-2">⚠️ Database Migration Required</h3>
              <p className="text-red-700">{errorMsg}</p>
              <p className="text-sm text-red-600 mt-2">Please run the SQL snippet from the implementation plan in your Supabase SQL Editor.</p>
            </div>
          )}

          <h2 className="text-2xl font-bold text-text-dark mb-6">Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link key={cat.id} href={`/forum/${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="card-light p-6 block group hover:border-accent-primary transition-colors">
                  <h3 className="text-xl font-bold text-text-dark mb-2 group-hover:text-accent-primary transition-colors">{cat.name}</h3>
                  <p className="text-text-dark-secondary text-sm">{cat.description}</p>
                </Link>
              ))
            ) : (
              // Mock UI until DB is seeded
              predefinedCategories.map((cat, i) => (
                <div key={i} className="card-light p-6 opacity-70 cursor-not-allowed">
                  <h3 className="text-xl font-bold text-text-dark mb-2">{cat.name}</h3>
                  <p className="text-text-dark-secondary text-sm mb-3">{cat.description}</p>
                  <span className="text-xs font-semibold px-2 py-1 bg-background text-text-dark-secondary rounded-md border border-border-light">Coming Soon</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
