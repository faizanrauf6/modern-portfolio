import type { Metadata } from 'next';
import AwsResilienceContent from '@/components/blog/posts/AwsResilienceContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'Building Observable, Resilient AWS Systems';
const DESCRIPTION = 'Connect AWS observability, bounded failure handling, reversible deployments, and recovery exercises to build resilient cloud applications.';
const SLUG = 'building-observable-resilient-aws-systems';
const PUBLISHED = '2026-10-14';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['AWS architecture', 'CloudWatch', 'observability', 'cloud reliability', 'disaster recovery'],
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

export default function AwsResiliencePage() {
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
      <AwsResilienceContent />
    </>
  );
}
