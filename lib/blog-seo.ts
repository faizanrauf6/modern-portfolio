import portfolioData from '@/data/portfolio.json';
import { HAS_SITE_URL, SITE_URL } from '@/lib/site-url';

export { HAS_SITE_URL, SITE_URL };

const { profile } = portfolioData;

export function blogPostingJsonLd({
  slug,
  headline,
  description,
  datePublished,
  author = { name: 'Muddusar Zulfiqar', url: 'https://github.com/MuddusarZulfiqar' },
}: {
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
  author?: { name: string; url?: string };
}) {
  const url = HAS_SITE_URL ? `${SITE_URL}/blog/${slug}` : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: HAS_SITE_URL ? { '@type': 'WebPage', '@id': url } : undefined,
    headline,
    description,
    url,
    datePublished,
    dateModified: datePublished,
    author: { '@type': 'Person', ...author },
    publisher: { '@type': 'Person', name: profile.name, url: HAS_SITE_URL ? SITE_URL : undefined },
    image: HAS_SITE_URL ? `${SITE_URL}/opengraph-image` : undefined,
  };
}
