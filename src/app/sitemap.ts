import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gen-a-ijobhub.vercel.app';

  // Static routes
  const routes = [
    '',
    '/jobs',
    '/freelance',
    '/tools',
    '/coach',
    '/about',
    '/contact',
    '/salaries',
    '/news'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch approved jobs for dynamic routes
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, updated_at')
    .eq('moderation_status', 'approved')
    .order('updated_at', { ascending: false })
    .limit(100);

  const jobRoutes = (jobs || []).map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: new Date(job.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...jobRoutes];
}
