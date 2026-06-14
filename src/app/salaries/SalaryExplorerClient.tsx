'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

type ExperienceLevel = 'Entry-Level' | 'Mid-Level' | 'Senior/Lead';

interface SalaryRole {
  role_title: string;
  experience_level: ExperienceLevel;
  market_avg_global: string;
  market_avg_india: string;
  global_width: string;
  india_width: string;
  ai_market_insight: string;
  last_updated: string;
}

export default function SalaryExplorerClient({ roles, errorMsg, lastUpdated }: { roles: SalaryRole[], errorMsg: string, lastUpdated: string }) {
  const [activeExperience, setActiveExperience] = useState<ExperienceLevel>('Mid-Level');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter roles based on selected experience level and search query
  const filteredRoles = useMemo(() => {
    return roles.filter(role => 
      role.experience_level === activeExperience &&
      role.role_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roles, activeExperience, searchQuery]);

  return (
    <div className="flex flex-col items-center py-12 px-[5%] min-h-screen">
      <div className="max-w-[1200px] w-full">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Discover What You're Worth in the <span className="gradient-text">AI Era</span>
          </h1>
          <p className="text-text-secondary text-lg mb-6">
            Compare average compensation for the hottest AI roles globally vs. in India across all experience levels.
          </p>
          <div className="inline-block px-4 py-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg max-w-3xl text-left">
            <p className="text-sm text-text-primary leading-relaxed">
              <span className="font-bold text-accent-primary block mb-1">⚡ AI Market Intelligence</span> 
              These figures are dynamically aggregated from our continuous market research and AI analysis. Actual salaries may vary based on company size, specific skills, equity offerings, and your negotiation leverage.
              {lastUpdated && <span className="block mt-2 text-text-secondary text-xs">Last Updated: {lastUpdated}</span>}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl max-w-3xl mx-auto">
            <h3 className="text-red-800 font-bold text-lg mb-2">⚠️ Configuration Required</h3>
            <p className="text-red-700">{errorMsg}</p>
          </div>
        )}

        {/* Interactive Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-background border border-border p-4 rounded-2xl shadow-md sticky top-20 z-10">
          
          {/* Experience Toggles */}
          <div className="flex p-1 bg-white/5 rounded-xl w-full md:w-auto">
            {['Entry-Level', 'Mid-Level', 'Senior/Lead'].map((level) => (
              <button
                key={level}
                onClick={() => setActiveExperience(level as ExperienceLevel)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeExperience === level 
                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-md' 
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text"
              placeholder="Search roles (e.g. MLOps)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl mb-12 min-h-[400px]">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {activeExperience} Compensation
            </h2>
            {roles.length > 0 && (
              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> LIVE DATA
              </span>
            )}
          </div>
          
          {filteredRoles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">No roles found matching "{searchQuery}" for {activeExperience}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredRoles.map((role, idx) => (
                <div key={`${role.role_title}-${role.experience_level}`} className="flex flex-col gap-4 bg-background/50 border border-white/5 p-6 rounded-2xl hover:border-accent-primary/50 transition-colors group">
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">{role.role_title}</h3>
                  
                  <div className="flex flex-col gap-4">
                    {/* Global Bar */}
                    <div className="flex items-center gap-3">
                      <span className="w-14 text-sm text-text-secondary font-semibold">Global</span>
                      <div className="flex-grow bg-background rounded-full h-7 overflow-hidden relative border border-white/5">
                        <div className={`h-full bg-gradient-to-r from-accent-primary to-accent-secondary ${role.global_width} transition-all duration-1000 ease-out flex items-center px-3 min-w-[60px]`}>
                          <span className="text-white text-xs font-bold">{role.market_avg_global}</span>
                        </div>
                      </div>
                    </div>

                    {/* India Bar */}
                    <div className="flex items-center gap-3">
                      <span className="w-14 text-sm text-text-secondary font-semibold">India</span>
                      <div className="flex-grow bg-background rounded-full h-7 overflow-hidden relative border border-white/5">
                        <div className={`h-full bg-[#10b981] ${role.india_width} transition-all duration-1000 ease-out flex items-center px-3 min-w-[60px]`}>
                          <span className="text-white text-xs font-bold">{role.market_avg_india}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Insight Block */}
                  <div className="mt-2 bg-accent-primary/5 border border-accent-primary/10 p-3 rounded-lg">
                    <p className="text-xs text-text-secondary leading-relaxed">
                      <span className="text-accent-primary font-bold mr-1">Insight:</span>
                      {role.ai_market_insight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
