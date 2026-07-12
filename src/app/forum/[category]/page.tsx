import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ForumCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryParam } = await params;
  
  const cookieStore = await cookies();
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch (_) {}
        },
      },
    }
  );

  const { data: categories } = await supabaseServer.from('forum_categories').select('*');
  
  if (!categories || categories.length === 0) {
    return notFound();
  }

  const category = categories.find(c => c.slug === categoryParam || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === categoryParam);
  
  if (!category) return notFound();

  // Fetch posts for this category
  const { data: posts } = await supabaseServer
    .from('forum_posts')
    .select('*, author:profiles(full_name, username, company_name, email, user_type)')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false });

  const getAuthorName = (author: any) => author?.username ? `@${author.username}` : 'Anonymous';

  return (
    <div className="flex flex-col items-center min-h-[80vh]">
      <section className="hero-glow hero-grid w-full py-12 px-[5%] bg-background border-b border-white/10">
        <div className="max-w-[1000px] mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/forum" className="text-accent-primary hover:underline text-sm font-bold mb-4 inline-block">← Back to Forum</Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">{category.name}</h1>
            <p className="text-text-secondary mt-2">{category.description}</p>
          </div>
          <Link href="/forum/new" className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-0.5 shadow-lg transition-all text-sm whitespace-nowrap">
            + New Post
          </Link>
        </div>
      </section>

      <section className="section-light w-full py-12 px-[5%] flex-grow">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-4">
          {!posts || posts.length === 0 ? (
            <div className="text-center py-20 card-light">
              <p className="text-text-dark-secondary text-lg">No discussions in this category yet.</p>
              <p className="text-sm text-text-dark-tertiary mt-1">Be the first to start a conversation!</p>
            </div>
          ) : (
            posts.map(post => (
              <Link key={post.id} href={`/forum/post/${post.id}`} className="card-light p-6 group hover:border-accent-primary transition-all flex flex-col md:flex-row justify-between gap-4 md:items-center">
                <div>
                  <h3 className="text-xl font-bold text-text-dark group-hover:text-accent-primary transition-colors mb-2">{post.title}</h3>
                  <div className="flex gap-4 items-center text-sm text-text-dark-secondary font-medium">
                    <span className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-accent-primary/20 flex items-center justify-center text-xs text-accent-primary font-bold">
                        {getAuthorName(post.author).charAt(0).toUpperCase()}
                      </div>
                      <span>{getAuthorName(post.author)}</span>
                    </span>
                    <span className="opacity-50">•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-accent-secondary bg-accent-primary/5 px-3 py-1 rounded-full whitespace-nowrap w-fit">
                  Join Discussion
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
