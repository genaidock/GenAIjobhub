"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen, Newspaper, RefreshCw, ExternalLink, User } from 'lucide-react';

export const BLOG_POSTS = [
  {
    slug: 'land-prompt-engineering-job-2026',
    title: 'How to Land a Prompt Engineering Job in 2026',
    category: 'Career Advice',
    readTime: '5 min read',
    author: 'Arjun Sharma',
    date: 'June 18, 2026',
    excerpt: 'Prompt engineering has matured from a simple trial-and-error hack to a systematic software engineering discipline. Here is what recruiters are looking for this year.',
  },
  {
    slug: 'fine-tuning-vs-rag',
    title: 'Fine-Tuning vs RAG: Which Skill is More Valuable?',
    category: 'AI Engineering',
    readTime: '7 min read',
    author: 'Sarah Connor',
    date: 'June 15, 2026',
    excerpt: 'Both Retrieval-Augmented Generation (RAG) and Fine-Tuning are critical for custom LLMs, but they solve entirely different business needs. Here is where you should invest your learning time.',
  },
  {
    slug: 'top-remote-ai-companies',
    title: 'Top AI Startups Hiring Remote Developers Right Now',
    category: 'Job Search',
    readTime: '4 min read',
    author: 'Vikram Rao',
    date: 'June 10, 2026',
    excerpt: 'Looking to work from home? These fast-growing AI/ML startups offer global remote work policies, stock options, and highly competitive packages.',
  }
];

export default function BlogIndex() {
  const [activeTab, setActiveTab] = useState<'articles' | 'news'>('articles');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // News states
  const [news, setNews] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState('');

  const categories = ['All', 'Career Advice', 'AI Engineering', 'Job Search'];

  // Filtered articles list
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter(post => post.category === selectedCategory);
  }, [selectedCategory]);

  // Fetch news feed when news tab is selected
  useEffect(() => {
    if (activeTab === 'news' && news.length === 0) {
      async function fetchNews() {
        setIsLoadingNews(true);
        setNewsError('');
        try {
          const res = await fetch('/api/news');
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to load news');
          setNews(data.news || []);
        } catch (err: any) {
          setNewsError(err.message || 'Failed to load live AI news.');
        } finally {
          setIsLoadingNews(false);
        }
      }
      fetchNews();
    }
  }, [activeTab, news.length]);

  return (
    <div className="flex flex-col items-center">
      {/* Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-24 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-accent-primary/10 text-accent-primary rounded-full font-semibold text-xs tracking-wider uppercase mb-6 border border-accent-primary/20">
            Insights & Live Updates
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-white">
            GenAIJobHub <span className="gradient-text">Blog & News</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Deep dives, career tutorials, and real-time open AI industry updates for developers, builders, and recruiters.
          </p>
        </div>
      </section>

      {/* Transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Content Area */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[1200px] mx-auto w-full">
          
          {/* Main Segment Tabs */}
          <div className="flex gap-4 border-b border-border-light pb-4 mb-8 justify-center">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'articles'
                  ? 'bg-accent-primary text-white shadow-md'
                  : 'text-text-dark-secondary hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Career Guides
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'news'
                  ? 'bg-accent-primary text-white shadow-md'
                  : 'text-text-dark-secondary hover:bg-slate-100'
              }`}
            >
              <Newspaper className="w-4 h-4" /> Open Source AI News
            </button>
          </div>

          {/* TAB 1: GUIDES & ARTICLES */}
          {activeTab === 'articles' && (
            <>
              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-2.5 mb-10 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all border ${
                      selectedCategory === cat
                        ? 'bg-accent-primary text-white border-accent-primary shadow-[0_4px_12px_rgba(109,40,217,0.25)]'
                        : 'bg-white text-text-dark-secondary border-border-light hover:border-accent-primary/40 hover:text-accent-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article 
                    key={post.slug} 
                    className="card-light flex flex-col h-full hover:border-accent-primary/50 hover:shadow-[0_8px_30px_rgba(109,40,217,0.05)] transition-all group"
                  >
                    <div className="p-6 md:p-8 flex flex-col h-full">
                      <span className="text-[11px] font-bold text-accent-secondary uppercase tracking-widest mb-3 block">
                        {post.category}
                      </span>
                      <h2 className="text-xl font-bold text-text-dark mb-3 group-hover:text-accent-primary transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-text-dark-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-text-dark-tertiary font-medium pt-4 border-t border-border-light mt-auto">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1.5 text-accent-primary text-sm font-bold mt-5 group-hover:translate-x-1 transition-all"
                      >
                        Read Article <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* TAB 2: LIVE AI NEWS */}
          {activeTab === 'news' && (
            <div className="max-w-[800px] mx-auto w-full flex flex-col gap-6">
              {isLoadingNews ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <RefreshCw className="w-8 h-8 text-accent-primary animate-spin mb-4" />
                  <p className="text-text-dark-secondary text-sm font-medium">Fetching latest open-source AI news...</p>
                </div>
              ) : newsError ? (
                <div className="text-center py-16 card-light border-red-200/50">
                  <p className="text-red-500 font-medium mb-3">⚠️ {newsError}</p>
                  <button 
                    onClick={() => { setNews([]); }}
                    className="text-xs font-bold text-accent-primary hover:underline"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center px-4">
                    <span className="text-xs text-text-dark-tertiary font-medium">Live feeds from verified open sources</span>
                    <button 
                      onClick={() => setNews([])} 
                      className="text-xs font-bold text-accent-primary hover:underline flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" /> Refresh Feed
                    </button>
                  </div>

                  <div className="px-4 text-[10px] text-text-dark-tertiary italic leading-relaxed">
                    Note: All articles displayed in this feed are pulled from open public feeds for informational purposes and do not represent paid promotions or endorsements of any brand, product, or source.
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {news.map((item, index) => (
                      <div 
                        key={index}
                        className="card-light p-6 hover:border-accent-secondary/40 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                      >
                        <div className="flex-1">
                          {item.is_india && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 border border-green-500/20 mb-2">
                              🇮🇳 India AI News
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-text-dark mb-2 group-hover:text-accent-secondary transition-colors leading-snug">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              {item.title}
                            </a>
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-text-dark-tertiary font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {item.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" /> Source: {item.author}
                            </span>
                          </div>
                        </div>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg border border-border-light text-text-dark-secondary hover:text-accent-secondary hover:border-accent-secondary/50 font-semibold text-xs whitespace-nowrap flex items-center gap-1 transition-all"
                        >
                          Read Source <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
