import type { MetadataRoute } from 'next';
import { HAS_SITE_URL, SITE_URL as BASE } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      ...(HAS_SITE_URL ? { allow: '/' } : { disallow: '/' }),
    },
    sitemap: HAS_SITE_URL ? `${BASE}/sitemap.xml` : undefined,
    host: HAS_SITE_URL ? BASE : undefined,
  };
}
