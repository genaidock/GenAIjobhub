import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import CommentForm from './CommentForm';

export const revalidate = 0;

export default async function ForumPostPage({ params }: { params: { id: string } }) {
  // Fetch post with author and category
  const { data: post } = await supabase
    .from('forum_posts')
    .select('*, author:profiles(full_name, user_type), category:forum_categories(name)')
    .eq('id', params.id)
    .single();

  if (!post) return notFound();

  // Fetch comments for this post
  const { data: comments } = await supabase
    .from('forum_comments')
    .select('*, author:profiles(full_name, user_type)')
    .eq('post_id', post.id)
    .order('created_at', { ascending: true });

  const categorySlug = post.category?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Dark Header */}
      <section className="w-full pt-10 pb-6 px-[5%] bg-background border-b border-white/10">
        <div className="max-w-[800px] mx-auto w-full">
          <Link href={`/forum/${categorySlug}`} className="text-accent-primary hover:underline text-sm font-bold mb-6 inline-block">
            ← Back to {post.category?.name}
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">{post.title}</h1>
          
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold">
              {post.author?.full_name?.charAt(0) || '?'}
            </div>
            <div>
              <p className="font-bold text-white">{post.author?.full_name || 'Anonymous'}</p>
              <p className="text-xs">{new Date(post.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Light Content Area */}
      <section className="section-light w-full py-12 px-[5%] flex-grow">
        <div className="max-w-[800px] mx-auto">
          
          {/* Main Post Content */}
          <div className="card-light p-6 md:p-8 mb-10 prose prose-lg prose-indigo max-w-none text-text-dark">
            {/* Simple split for basic paragraph support if user didn't use real markdown renderer */}
            {post.content.split('\n').map((p: string, i: number) => (
              <p key={i} className="mb-4 whitespace-pre-wrap">{p}</p>
            ))}
          </div>

          <hr className="border-border-light mb-10" />

          {/* Comments Section */}
          <h3 className="text-2xl font-bold text-text-dark mb-6">Discussion ({comments?.length || 0})</h3>
          
          <div className="flex flex-col gap-6 mb-10">
            {comments && comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="card-light bg-white p-5 border-l-4 border-l-accent-primary rounded-r-xl rounded-l-none shadow-sm">
                  <div className="flex items-center gap-3 text-sm mb-3">
                    <span className="font-bold text-text-dark">{comment.author?.full_name || 'Anonymous'}</span>
                    <span className="text-text-dark-tertiary text-xs">{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-text-dark-secondary whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-text-dark-tertiary italic">No replies yet. Be the first to share your thoughts!</p>
            )}
          </div>

          {/* Reply Form (Client Component) */}
          <CommentForm postId={post.id} />
          
        </div>
      </section>
    </div>
  );
}
