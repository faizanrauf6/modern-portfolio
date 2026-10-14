import type { Metadata } from 'next';
import RedisNodeContent from '@/components/blog/posts/RedisNodeContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How to Use Redis in a Node.js API — With Real Examples';
const DESCRIPTION =
  'A practical, code-first guide to implementing Redis caching in a Node.js and Express API: connecting with ioredis, the cache-aside helper, invalidation on writes, fail-open error handling, and a reusable caching middleware.';
const SLUG = 'how-to-use-redis-in-nodejs';
const PUBLISHED = '2026-10-08';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'redis nodejs tutorial',
    'redis express api example',
    'ioredis example',
    'node.js caching tutorial',
    'cache aside pattern nodejs',
    'redis cache invalidation nodejs',
    'redis rate limiting nodejs',
    'how to use redis in node.js',
  ],
  alternates: HAS_SITE_URL ? { canonical: `${SITE_URL}/blog/${SLUG}` } : undefined,
  openGraph: {
    type: 'article',
    title: TITLE,
    description: DESCRIPTION,
    url: HAS_SITE_URL ? `${SITE_URL}/blog/${SLUG}` : undefined,
    publishedTime: PUBLISHED,
  },
};

export default function RedisNodePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            blogPostingJsonLd({ slug: SLUG, headline: TITLE, description: DESCRIPTION, datePublished: PUBLISHED })
          ),
        }}
      />
      <RedisNodeContent />
    </>
  );
}
