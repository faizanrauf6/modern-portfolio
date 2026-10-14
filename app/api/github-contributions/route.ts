import portfolioData from '@/data/portfolio.json';
import snapshot from '@/data/github-contributions.json';
import { annualCalendar, parsePublicCalendar, type ContributionDay } from '@/lib/github-calendar';

export const revalidate = 86400;

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks { contributionDays { date weekday contributionCount contributionLevel } }
      }
    }
  }
}`;
const LEVEL: Record<string, number> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

type ApiDay = { date: string; weekday: number; contributionCount: number; contributionLevel: string };

function response(days: ContributionDay[], username: string) {
  const endDate = days.map((day) => day.date).sort().at(-1);
  const calendar = endDate ? annualCalendar(days, endDate) : null;
  // Reject partial upstream calendars rather than present missing days as zeros.
  if (!calendar || calendar.weeks.flat().length !== 365) return null;
  return Response.json({ enabled: true, username, ...calendar, updatedAt: new Date().toISOString(), source: 'github' });
}

export async function GET() {
  const username = portfolioData.github.username;
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    try {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: QUERY, variables: { login: username } }),
        next: { revalidate },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const json = await res.json();
        const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
        if (Array.isArray(weeks)) {
          const days = weeks.flatMap((week: { contributionDays: ApiDay[] }) => week.contributionDays.map((day) => ({
            date: day.date, weekday: day.weekday, count: day.contributionCount, level: LEVEL[day.contributionLevel] ?? 0,
          })));
          const result = response(days, username);
          if (result) return result;
        }
      }
    } catch { /* Try the public calendar before falling back to the snapshot. */ }
  }

  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      headers: { Accept: 'text/html', 'User-Agent': 'faizan-portfolio', 'Accept-Language': 'en-US' },
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const days = parsePublicCalendar(await res.text());
      const result = days ? response(days, username) : null;
      if (result) return result;
    }
  } catch { /* Keep the dated, verified calendar visible when GitHub is unavailable. */ }

  return Response.json(snapshot.username === username ? { ...snapshot, source: 'snapshot' } : { enabled: false });
}
