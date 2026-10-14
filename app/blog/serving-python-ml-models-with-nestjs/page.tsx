import type { Metadata } from 'next';
import NestMlContent from '@/components/blog/posts/NestMlContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'Serving Python ML Models Behind a NestJS API';
const DESCRIPTION = 'Connect a NestJS API to Python inference using FastAPI, versioned feature contracts, warm models, bounded requests, and runtime validation.';
const SLUG = 'serving-python-ml-models-with-nestjs';
const PUBLISHED = '2026-10-14';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['NestJS', 'Python machine learning', 'FastAPI', 'ML inference', 'model serving'],
  alternates: HAS_SITE_URL ? { canonical: `${SITE_URL}/blog/${SLUG}` } : undefined,
  openGraph: {
    type: 'article',
    title: TITLE,
    description: DESCRIPTION,
    url: HAS_SITE_URL ? `${SITE_URL}/blog/${SLUG}` : undefined,
    publishedTime: PUBLISHED,
    authors: ['Muhammad Faizan Rauf'],
  },
};

export default function NestMlPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd({
            slug: SLUG,
            headline: TITLE,
            description: DESCRIPTION,
            datePublished: PUBLISHED,
            author: { name: 'Muhammad Faizan Rauf' },
          })),
        }}
      />
      <NestMlContent />
    </>
  );
}
