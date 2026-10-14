import portfolioData from '@/data/portfolio.json';

// Set SITE_URL or profile.website once the portfolio has a public domain.
const configuredUrl = process.env.SITE_URL?.trim() || portfolioData.profile.website.trim();
export const HAS_SITE_URL = Boolean(configuredUrl);
export const SITE_URL = configuredUrl
  ? `${/^https?:\/\//.test(configuredUrl) ? '' : 'https://'}${configuredUrl}`.replace(/\/$/, '')
  : 'http://localhost:3000';
