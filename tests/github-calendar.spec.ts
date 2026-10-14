import { test, expect } from '@playwright/test';
import { parsePublicCalendar, annualCalendar } from '../lib/github-calendar';
import { GET } from '../app/api/github-contributions/route';

test('reads exact contribution counts independently of color levels and cell order', () => {
  const html = `
    <td id="day-b" data-level="4" data-date="2026-10-14"></td>
    <td data-date="2026-10-13" data-level="1" id="day-a"></td>
    <tool-tip for="day-a">2 contributions on October 13th.</tool-tip>
    <tool-tip for="day-b">14 contributions on October 14th.</tool-tip>`;
  expect(parsePublicCalendar(html)).toEqual([
    { date: '2026-10-13', weekday: 2, count: 2, level: 1 },
    { date: '2026-10-14', weekday: 3, count: 14, level: 4 },
  ]);
});

test('recognizes a genuinely empty contribution day', () => {
  expect(parsePublicCalendar('<td data-date="2026-10-14" id="day" data-level="0"></td><tool-tip for="day">No contributions on October 14th.</tool-tip>'))
    .toEqual([{ date: '2026-10-14', weekday: 3, count: 0, level: 0 }]);
});

test('rejects incomplete upstream markup instead of fabricating zero contributions', () => {
  expect(parsePublicCalendar('<td data-date="2026-10-14" id="day" data-level="2"></td>')).toBeNull();
  expect(parsePublicCalendar('<html>Rate limited</html>')).toBeNull();
});

test('limits the annual calendar to 365 days and retains partial weekday positions', () => {
  const result = annualCalendar([
    { date: '2025-10-14', weekday: 2, count: 100, level: 4 },
    { date: '2025-10-15', weekday: 3, count: 1, level: 1 },
    { date: '2026-10-11', weekday: 0, count: 6, level: 2 },
    { date: '2026-10-14', weekday: 3, count: 2, level: 1 },
    { date: '2026-10-15', weekday: 4, count: 100, level: 4 },
  ], '2026-10-14');
  expect(result?.total).toBe(9);
  expect(result?.from).toBe('2025-10-15');
  expect(result?.to).toBe('2026-10-14');
  expect(result?.weeks[0][0].weekday).toBe(3);
  expect(result?.weeks.at(-1)?.map((day) => day.date)).toEqual(['2026-10-11', '2026-10-14']);
});

test('serves a dated real calendar when upstream GitHub requests fail', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Upstream unavailable'); };
  try {
    const response = await GET();
    const calendar = await response.json();
    expect(calendar.enabled).toBe(true);
    expect(calendar.source).toBe('snapshot');
    expect(calendar.username).toBe('faizanrauf6');
    expect(calendar.updatedAt).toBeTruthy();
    const days = calendar.weeks.flat();
    expect(days).toHaveLength(365);
    expect(calendar.total).toBe(days.reduce((total: number, day: { count: number }) => total + day.count, 0));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
