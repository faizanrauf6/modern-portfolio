import type { Metadata } from 'next';
import AutomationContent from '@/components/blog/posts/AutomationContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'Building AI Automation That Survives Retries';
const DESCRIPTION = 'Design reliable AI workflows with durable state, validated model outputs, bounded retries, idempotent effects, and explicit recovery.';
const SLUG = 'building-reliable-ai-automation';
const PUBLISHED = '2026-10-14';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['AI automation', 'BullMQ', 'idempotency', 'workflow retries', 'durable workflows'],
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

export default function AutomationPage() {
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
      <AutomationContent />
    </>
  );
}
