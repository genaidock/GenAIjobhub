'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="card-light p-6 text-center border-dashed border-2 border-border-light bg-background/5">
        <p className="text-text-dark-secondary mb-3">Sign in to join the discussion.</p>
        <button onClick={() => router.push('/login')} className="px-5 py-2 rounded-lg font-bold text-white bg-accent-primary text-sm shadow-md">
          Log In to Reply
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const { error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          author_id: user.id, // Auth user id mapping to profile id
          content
        });

      if (error) throw error;

      setContent('');
      router.refresh(); // Refresh page to show new comment
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to post reply. Do you have a completed profile?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea 
          className="input-light min-h-[120px]" 
          placeholder="Write a reply..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          required 
        />
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
