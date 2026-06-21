"use client";

import { useState, useEffect } from 'react';
import { Calendar, RefreshCw, ExternalLink, User, Newspaper } from 'lucide-react';

export default function AINewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load news');
      setNews(data.news || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load live AI news feed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Header Banner */}
      <section className="hero-glow hero-grid w-full py-16 md:py-24 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-accent-primary/10 text-accent-primary rounded-full font-semibold text-xs tracking-wider uppercase mb-6 border border-accent-primary/20 flex items-center gap-1.5 w-fit mx-auto">
            <Newspaper className="w-3.5 h-3.5" /> Real-time Updates
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-white">
            AI Industry <span className="gradient-text">News</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Latest artificial intelligence, machine learning, LLM releases, and tech funding updates from verified open-source feeds.
          </p>
        </div>
      </section>

      {/* Transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Content Area */}
      <section className="section-light w-full py-12 px-[5%]">
        <div className="max-w-[800px] mx-auto w-full flex flex-col gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-accent-primary animate-spin mb-4" />
              <p className="text-text-dark-secondary text-sm font-medium">Fetching latest open-source AI news...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 card-light border-red-200/50">
              <p className="text-red-500 font-medium mb-3">⚠️ {error}</p>
              <button 
                onClick={fetchNews}
                className="px-5 py-2.5 bg-accent-primary text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all shadow-md"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-4">
                <span className="text-xs text-text-dark-tertiary font-medium">Live feeds from verified open sources</span>
                <button 
                  onClick={fetchNews} 
                  className="text-xs font-bold text-accent-primary hover:underline flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh Feed
                </button>
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

              <div className="mt-6 px-4 text-[10px] text-text-dark-tertiary italic leading-relaxed text-center">
                Note: All articles displayed in this feed are pulled from open public feeds for informational purposes and do not represent paid promotions or endorsements of any brand, product, or source.
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
