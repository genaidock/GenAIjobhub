"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ApplyButton from './ApplyButton';

export default function JobsBoardClient({ initialJobs }: { initialJobs: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dynamic Locations
  const allLocations = useMemo(() => {
    const locs = new Set<string>();
    initialJobs.forEach(job => {
      if (job.location) locs.add(job.location);
    });
    return Array.from(locs).sort();
  }, [initialJobs]);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<string>('All');
  const [datePosted, setDatePosted] = useState<string>('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 20;

  const jobTypes = ['Full-time', 'Contract', 'Freelance', 'Internship'];
  const experienceLevels = ['Junior', 'Mid', 'Senior', 'Staff', 'Executive'];

  // Filter logic
  const filteredJobs = useMemo(() => {
    return initialJobs.filter(job => {
      // 1. Search text match
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Location match
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(job.location);

      // 3. Job Type match
      const matchesJobType = selectedJobTypes.length === 0 || 
        (job.job_type && selectedJobTypes.includes(job.job_type));

      // 4. Experience match
      const matchesExperience = selectedExperience.length === 0 || 
        (job.experience_level && selectedExperience.includes(job.experience_level));

      // 5. Date posted match
      let matchesDate = true;
      if (datePosted !== 'All' && job.created_at) {
        const postedDate = new Date(job.created_at);
        const now = new Date();
        const diffDays = (now.getTime() - postedDate.getTime()) / (1000 * 3600 * 24);
        if (datePosted === '7') matchesDate = diffDays <= 7;
        else if (datePosted === '30') matchesDate = diffDays <= 30;
        else if (datePosted === '90') matchesDate = diffDays <= 90;
      }

      // 6. Salary Range match (basic implementation based on string search for now, assuming standard bands)
      let matchesSalary = true;
      if (salaryRange !== 'All' && job.salary_range) {
        // Very basic text matching or fallback for demo
        matchesSalary = job.salary_range.toLowerCase().includes(salaryRange.toLowerCase());
      }

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience && matchesDate && matchesSalary;
    });
  }, [initialJobs, searchTerm, selectedLocations, selectedJobTypes, selectedExperience, datePosted, salaryRange]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const getDaysAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24);
    const days = Math.floor(diff);
    if (days === 0) return 'Posted today';
    if (days === 1) return 'Posted 1 day ago';
    return `Posted ${days} days ago`;
  };

  const getCompanyDomain = (url: string) => {
    try {
      if (!url) return null;
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mt-8">
      {/* Sidebar Filters */}
      <aside className="card-light p-6 h-fit lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
        <div className="mb-8">
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            className="input-light w-full"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Date Posted */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 text-text-dark uppercase tracking-wider">Date Posted</h3>
          <select 
            className="input-light w-full text-sm"
            value={datePosted}
            onChange={(e) => { setDatePosted(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">Any Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {/* Location */}
        {allLocations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-3 text-text-dark uppercase tracking-wider">Location</h3>
            <div className="flex flex-col gap-2.5">
              {allLocations.map(loc => (
                <label key={loc} className="flex items-center gap-3 cursor-pointer text-text-dark-secondary hover:text-text-dark transition-colors text-sm">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border-light accent-accent-primary" 
                    checked={selectedLocations.includes(loc)} 
                    onChange={() => toggleArrayItem(setSelectedLocations, loc)} 
                  /> 
                  <span className="truncate">{loc}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Job Type */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 text-text-dark uppercase tracking-wider">Job Type</h3>
          <div className="flex flex-col gap-2.5">
            {jobTypes.map(type => (
              <label key={type} className="flex items-center gap-3 cursor-pointer text-text-dark-secondary hover:text-text-dark transition-colors text-sm">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-border-light accent-accent-primary" 
                  checked={selectedJobTypes.includes(type)} 
                  onChange={() => toggleArrayItem(setSelectedJobTypes, type)} 
                /> 
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 text-text-dark uppercase tracking-wider">Experience Level</h3>
          <div className="flex flex-col gap-2.5">
            {experienceLevels.map(level => (
              <label key={level} className="flex items-center gap-3 cursor-pointer text-text-dark-secondary hover:text-text-dark transition-colors text-sm">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-border-light accent-accent-primary" 
                  checked={selectedExperience.includes(level)} 
                  onChange={() => toggleArrayItem(setSelectedExperience, level)} 
                /> 
                {level}
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 text-text-dark uppercase tracking-wider">Salary Range</h3>
          <select 
            className="input-light w-full text-sm"
            value={salaryRange}
            onChange={(e) => { setSalaryRange(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">Any Salary</option>
            <option value="100">~ $100k</option>
            <option value="150">~ $150k</option>
            <option value="200">~ $200k+</option>
          </select>
        </div>
      </aside>

      {/* Job Listings List */}
      <main className="flex flex-col gap-4">
        {paginatedJobs.length === 0 ? (
          <div className="text-center py-20 card-light">
            <p className="text-text-dark-secondary text-lg">No jobs found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm(''); 
                setSelectedLocations([]);
                setSelectedJobTypes([]);
                setSelectedExperience([]);
                setDatePosted('All');
                setSalaryRange('All');
                setCurrentPage(1);
              }} 
              className="mt-4 text-accent-primary hover:underline font-semibold text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {paginatedJobs.map((job) => {
              const domain = getCompanyDomain(job.apply_url);
              
              return (
                <div key={job.id} className={`card-light p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-accent-primary transition-all relative ${job.is_featured ? 'border-accent-primary/50 bg-accent-primary/[0.02] shadow-sm shadow-accent-primary/10' : ''}`}>
                  {job.is_featured && (
                    <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                      ⭐ Featured
                    </div>
                  )}
                  <div className="flex gap-6 w-full md:w-auto items-start">
                    {/* Company Logo */}
                    <div className="w-16 h-16 rounded-xl bg-background border border-border-light flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                      {domain ? (
                        <img 
                          src={`https://logo.clearbit.com/${domain}`} 
                          alt={`${job.company_name} logo`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to initial if logo fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl font-bold text-accent-primary">${job.company_name.charAt(0).toUpperCase()}</span>`;
                          }}
                        />
                      ) : (
                        <span className="text-2xl font-bold text-accent-primary">
                          {job.company_name ? job.company_name.charAt(0).toUpperCase() : '?'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <Link href={`/jobs/${job.id}`} className="hover:underline">
                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-text-dark group-hover:text-accent-primary transition-colors">{job.title}</h3>
                      </Link>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm items-center mb-3">
                        <span className="font-bold text-accent-secondary">{job.company_name}</span>
                        <span className="text-text-dark-secondary flex items-center gap-1">📍 {job.location}</span>
                        {job.salary_range && <span className="text-text-dark-secondary flex items-center gap-1">💼 {job.salary_range}</span>}
                        {job.job_type && <span className="text-text-dark-secondary bg-background px-2 py-0.5 rounded-md border border-border-light">{job.job_type}</span>}
                      </div>

                      <div className="text-xs font-medium text-text-dark-secondary">
                        {getDaysAgo(job.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 md:mt-0 flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:pl-4">
                    {job.is_remote && (
                      <span className="pill pill-green whitespace-nowrap">✓ Remote</span>
                    )}
                    <div className="flex gap-3 w-full md:w-auto justify-end">
                      <Link href={`/jobs/${job.id}`} className="px-5 py-2 rounded-lg font-semibold text-text-dark border-2 border-border-light hover:border-accent-primary hover:text-accent-primary transition-all text-sm whitespace-nowrap">
                        View Details
                      </Link>
                      {job.apply_url && (
                        <ApplyButton jobId={job.id} applyUrl={job.apply_url} className="px-5 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                          Apply
                        </ApplyButton>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-semibold text-text-dark border-2 border-border-light hover:border-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Previous
                </button>
                <span className="text-text-dark-secondary text-sm font-medium">
                  Page <span className="text-text-dark">{currentPage}</span> of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-semibold text-text-dark border-2 border-border-light hover:border-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
