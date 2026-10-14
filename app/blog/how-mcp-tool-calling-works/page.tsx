import type { Metadata } from 'next';
import McpContent from '@/components/blog/posts/McpContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How MCP Tool Calling Works';
const DESCRIPTION = 'A practical walkthrough of Model Context Protocol tool discovery, schemas, authorization, execution, and safe result handling.';
const SLUG = 'how-mcp-tool-calling-works';
const PUBLISHED = '2026-10-14';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['MCP', 'Model Context Protocol', 'tool calling', 'AI agents', 'tool permissions'],
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

export default function McpPage() {
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
      <McpContent />
    </>
  );
}
