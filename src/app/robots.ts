import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/login/'],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended'],
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/login/'],
      }
    ],
    host: 'https://gen-a-ijobhub.vercel.app',
    sitemap: 'https://gen-a-ijobhub.vercel.app/sitemap.xml',
  };
}
