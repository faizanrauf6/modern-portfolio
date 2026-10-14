import type { Metadata } from 'next';
import SessionsContent from '@/components/blog/posts/SessionsContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How Sessions Work — Cookie-Based Authentication Explained for Beginners';
const DESCRIPTION =
  'How does session-based login actually work? A beginner-friendly, animated walkthrough: how login creates a server-side record, what the cookie actually holds, and how logout revokes it instantly.';
const SLUG = 'how-sessions-work';
const PUBLISHED = '2026-10-07';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'how sessions work',
    'session based authentication',
    'session vs JWT',
    'cookie authentication explained',
    'what is a session cookie',
    'HttpOnly cookie explained',
    'session authentication for beginners',
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

export default function SessionsPage() {
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
      <SessionsContent />
    </>
  );
}
