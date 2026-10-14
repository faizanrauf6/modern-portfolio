import type { Metadata } from 'next';
import ClaudeSkillsContent from '@/components/blog/posts/ClaudeSkillsContent';
import { blogPostingJsonLd, HAS_SITE_URL, SITE_URL } from '@/lib/blog-seo';

const TITLE = 'How Claude Skills and Agent Harnesses Work';
const DESCRIPTION = 'Follow a Claude skill from SKILL.md discovery to a verified result, and understand how the agent harness manages tools, context, permissions, and recovery.';
const SLUG = 'how-claude-skills-and-harnesses-work';
const PUBLISHED = '2026-10-14';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['Claude skills', 'SKILL.md', 'agent harness', 'Claude Code', 'progressive disclosure', 'AI agents'],
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

export default function ClaudeSkillsPage() {
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
      <ClaudeSkillsContent />
    </>
  );
}
