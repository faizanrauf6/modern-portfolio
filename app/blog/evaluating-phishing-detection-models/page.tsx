import type { Metadata } from 'next';
import PhishingContent from '@/components/blog/posts/PhishingContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'Evaluating a Phishing Detector Beyond Accuracy';
const DESCRIPTION = 'Evaluate phishing detection with precision, recall, temporal holdouts, campaign leakage checks, and thresholds tied to real error costs.';
const SLUG = 'evaluating-phishing-detection-models';
const PUBLISHED = '2026-10-14';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['phishing detection', 'machine learning evaluation', 'precision recall', 'data leakage', 'temporal split'],
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

export default function PhishingPage() {
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
      <PhishingContent />
    </>
  );
}
