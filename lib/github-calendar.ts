export type ContributionDay = { date: string; weekday: number; count: number; level: number };
export type Calendar = { total: number; from: string; to: string; weeks: ContributionDay[][] };

function attribute(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`(?:^|\\s)${name}=["']([^"']*)["']`))?.[1];
}

function validDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// GitHub exposes exact daily counts in tooltips; color levels are not counts.
// Return null if the markup changes so the caller can use a verified snapshot.
export function parsePublicCalendar(html: string): ContributionDay[] | null {
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attribute(match[1], 'for');
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const count = /^No contributions\b/i.test(text) ? 0 : text.match(/^(\d[\d,]*) contributions?\b/i)?.[1];
    if (id && count !== undefined) counts.set(id, Number(String(count).replace(/,/g, '')));
  }

  const days: ContributionDay[] = [];
  const seen = new Set<string>();
  for (const match of html.matchAll(/<td\b[^>]*>/g)) {
    const date = attribute(match[0], 'data-date');
    if (!date) continue;
    const id = attribute(match[0], 'id');
    const level = Number(attribute(match[0], 'data-level'));
    const count = id ? counts.get(id) : undefined;
    if (!validDate(date) || seen.has(date) || count === undefined || !Number.isSafeInteger(count) || count < 0 || !Number.isInteger(level) || level < 0 || level > 4) return null;
    seen.add(date);
    days.push({ date, weekday: new Date(`${date}T00:00:00Z`).getUTCDay(), count, level });
  }
  return days.length ? days.sort((a, b) => a.date.localeCompare(b.date)) : null;
}

export function annualCalendar(days: ContributionDay[], endDate: string): Calendar | null {
  if (!validDate(endDate)) return null;
  const start = new Date(`${endDate}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - 364);
  const from = start.toISOString().slice(0, 10);
  const selected = days.filter((day) => day.date >= from && day.date <= endDate).sort((a, b) => a.date.localeCompare(b.date));
  if (!selected.length) return null;
  const weeks = new Map<string, ContributionDay[]>();
  let total = 0;
  for (const day of selected) {
    const sunday = new Date(`${day.date}T00:00:00Z`);
    sunday.setUTCDate(sunday.getUTCDate() - day.weekday);
    const key = sunday.toISOString().slice(0, 10);
    const week = weeks.get(key) ?? [];
    week.push(day);
    weeks.set(key, week);
    total += day.count;
  }
  return { total, from, to: endDate, weeks: Array.from(weeks.values()) };
}
