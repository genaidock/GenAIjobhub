"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Menu, X, ChevronDown, LogOut, LayoutDashboard, Brain, FileText } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, profile, userType, isLoading, signOut } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    await signOut();
    router.push('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? '?';

  const displayName = userType === 'employer'
    ? (profile?.company_name || profile?.full_name || 'Employer')
    : (profile?.full_name || 'Job Seeker');

  return (
    <nav className="navbar-glow flex justify-between items-center py-4 px-[5%] bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-extrabold text-text-primary flex items-center gap-2.5 tracking-tight">
        <Briefcase className="text-accent-primary w-6 h-6" />
        GenAI<span className="text-accent-primary">JobHub</span>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8 lg:gap-10">
        <Link href="/jobs" className="font-medium text-text-secondary hover:text-text-primary transition-colors text-[0.925rem]">Jobs Board</Link>
        <Link href="/forum" className="font-medium text-text-secondary hover:text-text-primary transition-colors text-[0.925rem]">Forum</Link>
        <Link href="/freelance" className="font-medium text-text-secondary hover:text-text-primary transition-colors text-[0.925rem]">Freelance</Link>
        <Link href="/salaries" className="font-medium text-text-secondary hover:text-text-primary transition-colors text-[0.925rem]">Salaries</Link>
        <Link href="/tools" className="font-medium text-text-secondary hover:text-text-primary transition-colors text-[0.925rem]">Tools</Link>
        {/* AI Coach: visible to seekers and logged-out users; hidden for employers */}
        {(!user || userType === 'seeker') && (
          <Link href="/coach" className="font-medium text-text-secondary hover:text-text-primary transition-colors text-[0.925rem]">AI Coach</Link>
        )}
      </div>

      {/* Desktop Auth Area */}
      <div className="hidden md:flex items-center gap-3">
        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
        ) : user && profile ? (
          <>
            {/* Role-specific primary CTA */}
            {userType === 'employer' ? (
              <Link
                href="/post-job"
                className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(109,40,217,0.35)] transition-all"
              >
                Post a Job
              </Link>
            ) : (
              <Link
                href="/coach"
                className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-accent-secondary hover:-translate-y-0.5 transition-all"
              >
                AI Coach
              </Link>
            )}

            {/* User Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(s => !s)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center text-xs font-bold text-accent-primary">
                  {initials}
                </div>
                <span className="text-sm font-medium text-text-primary max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs text-text-secondary">Signed in as</p>
                    <p className="text-sm font-semibold text-text-primary truncate">{profile.email}</p>
                    <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary capitalize">
                      {userType}
                    </span>
                  </div>

                  {/* Role-specific menu items */}
                  {userType === 'employer' ? (
                    <>
                      <Link href="/post-job" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                        <FileText className="w-4 h-4" /> Post a Job
                      </Link>
                      <Link href="/dashboard/employer" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> My Listings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/coach" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                        <Brain className="w-4 h-4" /> AI Coach
                      </Link>
                      <Link href="/applications" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                        <FileText className="w-4 h-4" /> My Applications
                      </Link>
                    </>
                  )}

                  <div className="border-t border-border">
                    <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/5 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Logged out state */
          <>
            <Link href="/login" className="px-5 py-2.5 rounded-lg font-semibold text-sm text-text-primary border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all">
              Log In
            </Link>
            <Link href="/login/employer" className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(109,40,217,0.35)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.45)] transition-all">
              Post a Job
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="text-text-primary w-6 h-6" /> : <Menu className="text-text-primary w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-white/10 flex flex-col p-5 gap-4 md:hidden z-40">
          <Link href="/jobs" onClick={() => setIsMenuOpen(false)} className="font-medium text-text-secondary hover:text-text-primary">Jobs Board</Link>
          <Link href="/forum" onClick={() => setIsMenuOpen(false)} className="font-medium text-text-secondary hover:text-text-primary">Forum</Link>
          <Link href="/freelance" onClick={() => setIsMenuOpen(false)} className="font-medium text-text-secondary hover:text-text-primary">Freelance</Link>
          <Link href="/salaries" onClick={() => setIsMenuOpen(false)} className="font-medium text-text-secondary hover:text-text-primary">Salaries</Link>
          <Link href="/tools" onClick={() => setIsMenuOpen(false)} className="font-medium text-text-secondary hover:text-text-primary">Tools</Link>
          {(!user || userType === 'seeker') && (
            <Link href="/coach" onClick={() => setIsMenuOpen(false)} className="font-medium text-text-secondary hover:text-text-primary">AI Coach</Link>
          )}
          <hr className="border-white/10" />
          {user && profile ? (
            <>
              <p className="text-sm text-text-secondary">
                Signed in as <span className="text-text-primary font-semibold">{displayName}</span>
                <span className="ml-2 text-xs text-accent-primary capitalize">({userType})</span>
              </p>
              {userType === 'employer' ? (
                <>
                  <Link href="/post-job" onClick={() => setIsMenuOpen(false)} className="font-medium text-accent-primary">Post a Job</Link>
                  <Link href="/dashboard/employer" onClick={() => setIsMenuOpen(false)} className="font-medium text-text-secondary hover:text-text-primary">My Listings</Link>
                </>
              ) : (
                <>
                  <Link href="/coach" onClick={() => setIsMenuOpen(false)} className="font-medium text-accent-secondary">AI Coach</Link>
                  <Link href="/applications" onClick={() => setIsMenuOpen(false)} className="font-medium text-text-secondary hover:text-text-primary">My Applications</Link>
                </>
              )}
              <button onClick={handleSignOut} className="font-medium text-red-400 text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="font-medium text-text-secondary hover:text-text-primary">Log In</Link>
              <Link href="/login/employer" onClick={() => setIsMenuOpen(false)} className="font-medium text-accent-primary">Post a Job</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
