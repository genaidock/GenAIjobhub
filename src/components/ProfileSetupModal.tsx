"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function ProfileSetupModal() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // We only show this if the user is fully logged in, we finished loading, 
  // and the profile is missing either full_name or username.
  const needsSetup = !isLoading && user && profile && (!profile.full_name || !profile.username);

  useEffect(() => {
    if (needsSetup) {
      // Pre-fill if we have partial data
      if (profile?.full_name) {
        const parts = profile.full_name.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (profile?.username) {
        setUsername(profile.username);
      }
    }
  }, [needsSetup, profile]);

  if (!needsSetup) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fName = firstName.trim();
    const lName = lastName.trim();
    const uname = username.trim();

    if (!fName || !lName) {
      setError("First and Last name are required.");
      return;
    }

    if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(uname)) {
      setError("Username must be 3-30 characters long and can only contain letters, numbers, dots, underscores, and dashes.");
      return;
    }

    setIsSubmitting(true);
    const fullName = `${fName} ${lName}`;

    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, username: uname }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.code === "23505") { // Unique violation
          setError("That username is already taken. Please choose another.");
        } else {
          setError("An error occurred while saving your profile.");
          console.error(errorData);
        }
        setIsSubmitting(false);
        return;
      }

      await refreshProfile();
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-bg-card border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-accent-primary/20 blur-[60px] pointer-events-none" />

        <h2 className="text-2xl font-extrabold text-white mb-2 relative z-10">Complete Your Profile</h2>
        <p className="text-text-secondary text-sm mb-6 relative z-10">
          Please provide your name and choose a unique username to continue using GenAIJobHub.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="firstName" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-[#121214] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                placeholder="John"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="lastName" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-[#121214] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                placeholder="Doe"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Username <span className="text-red-400">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-text-secondary font-bold">@</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#121214] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-primary transition-colors"
                placeholder="johndoe123"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              3-30 characters. Letters, numbers, dots, hyphens, and underscores only.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(109,40,217,0.35)] transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
