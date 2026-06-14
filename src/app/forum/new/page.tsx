'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function NewForumPost() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('forum_categories').select('*').order('name');
      if (data && data.length > 0) {
        setCategories(data);
        setCategoryId(data[0].id);
      } else {
        // Fallback or seed them
        const defaultCats = [
          { name: 'AI Tools & Models', description: 'Discuss the latest LLMs, frameworks, and AI products.' },
          { name: 'Job Hunting Strategy', description: 'Resume tips, interview prep, and career advice.' },
          { name: 'Code Review & Projects', description: 'Share your AI projects and get community feedback.' },
        ];
        // Only seed if we actually can
        const { data: inserted, error } = await supabase.from('forum_categories').insert(defaultCats).select();
        if (inserted && inserted.length > 0) {
          setCategories(inserted);
          setCategoryId(inserted[0].id);
        }
      }
    }
    fetchCategories();
  }, []);

  if (isLoading) return <div className="p-20 text-center text-text-primary">Loading...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center py-20 px-[5%] text-center">
        <h2 className="text-3xl font-bold mb-4">Sign in to join the discussion</h2>
        <p className="text-text-secondary mb-8">You must be logged in to create a post.</p>
        <button onClick={() => router.push('/login')} className="px-6 py-3 rounded-xl font-bold text-white bg-accent-primary">Log In</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          category_id: categoryId,
          author_id: user.id, // Auth user id mapping to profile id
          title,
          content
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/forum/post/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create post. Are you sure you have a completed profile?');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-[5%] min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-8 text-text-primary">Start a Discussion</h1>
      
      <div className="card-light p-6 md:p-8">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-text-dark-secondary mb-2">Category</label>
            <select 
              className="input-light" 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-text-dark-secondary mb-2">Title</label>
            <input 
              type="text" 
              className="input-light" 
              placeholder="e.g. How to structure a RAG pipeline?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-dark-secondary mb-2">Content</label>
            <textarea 
              className="input-light min-h-[250px]" 
              placeholder="Write your thoughts here... Markdown is supported." 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              required 
            />
          </div>
          
          <div className="flex justify-end pt-4 border-t border-border-light">
            <button 
              type="submit" 
              disabled={isSubmitting || categories.length === 0}
              className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
