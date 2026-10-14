import type { Metadata } from 'next';
import RedisContent from '@/components/blog/posts/RedisContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How Redis Caching Works — Cache Hits, Misses & Invalidation Explained';
const DESCRIPTION =
  'How does Redis caching actually work? A beginner-friendly, animated walkthrough of cache hits vs misses, TTLs, invalidation, eviction policies, and why the second request is always faster.';
const SLUG = 'how-redis-caching-works';
const PUBLISHED = '2026-10-08';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'how Redis caching works',
    'what is Redis',
    'cache hit vs cache miss',
    'Redis TTL explained',
    'cache invalidation explained',
    'cache stampede',
    'Redis eviction policy',
    'Redis for beginners',
    'in-memory caching explained',
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

export default function RedisPage() {
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
      <RedisContent />
    </>
  );
}
