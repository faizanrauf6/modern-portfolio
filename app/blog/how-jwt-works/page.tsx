import type { Metadata } from 'next';
import JwtContent from '@/components/blog/posts/JwtContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How JWT Works — JSON Web Token Authentication Explained for Beginners';
const DESCRIPTION =
  'How does JWT authentication actually work? A beginner-friendly, animated walkthrough of JSON Web Tokens: how login issues a token, what’s inside it, and why the server never has to look it up again.';
const SLUG = 'how-jwt-works';
const PUBLISHED = '2026-10-07';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'how JWT works',
    'what is JWT',
    'JSON Web Token explained',
    'JWT authentication tutorial',
    'JWT vs session',
    'JWT for beginners',
    'stateless authentication',
    'access token refresh token',
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

export default function JwtPage() {
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
      <JwtContent />
    </>
  );
}
