import type { MetadataRoute } from 'next';
import { HAS_SITE_URL, SITE_URL as BASE } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!HAS_SITE_URL) return [];
  const now = new Date();
  const routes = ['', '/experience', '/skills', '/project', '/playground'];
  const posts = [
    '/blog',
    '/blog/from-requirements-to-solution-architecture',
    '/blog/designing-reliable-event-driven-integrations',
    '/blog/building-observable-resilient-aws-systems',
    '/blog/how-mcp-tool-calling-works',
    '/blog/building-reliable-ai-automation',
    '/blog/evaluating-phishing-detection-models',
    '/blog/serving-python-ml-models-with-nestjs',
    '/blog/how-rag-works',
    '/blog/how-claude-skills-and-harnesses-work',
    '/blog/how-sessions-work',
    '/blog/how-cicd-works',
    '/blog/how-redis-caching-works',
    '/blog/how-to-use-redis-in-nodejs',
  ];

  return [
    ...routes.map((route) => ({
      url: `${BASE}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    ...posts.map((route) => ({
      url: `${BASE}${route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: route === '/blog' ? 0.8 : 0.9,
    })),
  ];
}
