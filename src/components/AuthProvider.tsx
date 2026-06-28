"use client";

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// ── Types ────────────────────────────────────────────────────────────────────

export type UserType = 'employer' | 'seeker' | 'admin' | null;

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  linkedin_url: string | null;
  user_type: UserType;
  plan: 'free' | 'pro' | 'elite';
  coach_credits_remaining: number;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  userType: UserType;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  userType: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[AuthProvider] Failed to fetch profile:', error.message);
        return null;
      }
      return data as Profile;
    } catch (err: any) {
      console.error('[AuthProvider] Unexpected error fetching profile:', err.message);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    setProfile(p);
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Explicitly get the session on mount to prevent infinite loading if INITIAL_SESSION is missed
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        if (mounted) setProfile(p);
      }
      if (mounted) setIsLoading(false);
    });

    // Listen to auth state changes (which includes INITIAL_SESSION in v2)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const p = await fetchProfile(session.user.id);
          if (mounted) setProfile(p);
        } else {
          if (mounted) setProfile(null);
        }
        if (mounted) setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const userType: UserType = profile?.user_type ? (profile.user_type.toLowerCase() as UserType) : null;

  return (
    <AuthContext.Provider value={{ user, profile, userType, session, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
