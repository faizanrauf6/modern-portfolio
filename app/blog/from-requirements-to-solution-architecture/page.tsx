import type { Metadata } from 'next';
import SolutionArchitectureContent from '@/components/blog/posts/SolutionArchitectureContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'From Requirements to a Solution Architect’s Plan';
const DESCRIPTION = 'Translate business requirements into measurable quality attributes, service boundaries, architecture decisions, and validation evidence.';
const SLUG = 'from-requirements-to-solution-architecture';
const PUBLISHED = '2026-10-14';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['solution architect', 'distributed systems', 'C4 model', 'architecture decision records', 'quality attributes'],
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

export default function SolutionArchitecturePage() {
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
      <SolutionArchitectureContent />
    </>
  );
}
