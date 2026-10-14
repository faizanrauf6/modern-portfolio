import type { Metadata } from 'next';
import EventDrivenContent from '@/components/blog/posts/EventDrivenContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'Designing Reliable Event-Driven Integrations';
const DESCRIPTION = 'Design durable event-driven integrations with transactional outboxes, idempotent processing, tenant boundaries, ordering, and explicit recovery.';
const SLUG = 'designing-reliable-event-driven-integrations';
const PUBLISHED = '2026-10-14';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['event-driven architecture', 'transactional outbox', 'idempotency', 'multi-tenant integrations', 'distributed systems'],
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

export default function EventDrivenPage() {
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
      <EventDrivenContent />
    </>
  );
}
