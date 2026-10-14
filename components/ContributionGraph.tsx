'use client';

import { useEffect, useState } from 'react';
import snapshot from '@/data/github-contributions.json';
import portfolioData from '@/data/portfolio.json';

type Day = { date: string; weekday: number; count: number; level: number };
type Data = { enabled: boolean; total?: number; weeks?: Day[][]; from?: string; to?: string; updatedAt?: string; source?: string };

const LEVEL_CLASS = [
  'bg-primary/[0.06]',
  'bg-highlight/30',
  'bg-highlight/50',
  'bg-highlight/75',
  'bg-highlight',
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function ContributionGraph() {
  const [data, setData] = useState<Data | null>(snapshot.username === portfolioData.github.username ? { ...snapshot, source: 'snapshot' } : null);

  useEffect(() => {
    let alive = true;
    fetch('/api/github-contributions')
      .then((r) => r.ok ? r.json() : null)
      .then((d: Data | null) => { if (alive && d?.enabled && d.weeks) setData(d); })
      .catch(() => { /* Preserve the verified snapshot on network failure. */ });
    return () => {
      alive = false;
    };
  }, []);

  // Render nothing until we know there's a graph to show.
  if (!data?.enabled || !data.weeks) return null;

  // Place each day in its real weekday row (0 = Sun … 6 = Sat). Partial first
  // and last weeks leave the missing rows empty, exactly like GitHub.
  const columns = data.weeks.map((week) => {
    const col: (Day | null)[] = [null, null, null, null, null, null, null];
    for (const d of week) col[d.weekday] = d;
    return col;
  });

  const monthOf = (col: (Day | null)[]) => {
    const first = col.find((d): d is Day => d != null);
    return first ? new Date(first.date + 'T00:00:00').getMonth() : -1;
  };

  const monthLabels = columns.map((col, ci) => {
    if (ci === 0 || ci >= columns.length - 1) return null;
    const m = monthOf(col);
    return m !== monthOf(columns[ci - 1]) ? MONTHS[m] : null;
  });

  return (
    <div className="mb-10 rounded-2xl border border-primary/10 bg-bg p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <p className="text-xs font-mono uppercase tracking-widest text-text/50">
          Contributions
        </p>
        <p className="text-xs font-mono text-text/60">
          <span className="text-primary font-medium">{data.total}</span>{' '}
          contributions in the last year
        </p>
      </div>

      <div className="overflow-x-auto custom-scrollbar -mx-1 px-1">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-1.5 h-3">
            {monthLabels.map((label, ci) => (
              <div key={ci} className="w-2.5 relative">
                {label && (
                  <span className="absolute left-0 top-0 text-[9px] font-mono text-text/40 whitespace-nowrap">
                    {label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="flex gap-[3px]" role="img" aria-label={`${data.total} GitHub contributions from ${data.from} to ${data.to}`}>
            {columns.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-[3px]">
                {col.map((day, di) =>
                  day ? (
                    <span
                      key={di}
                      title={`${day.count} contribution${
                        day.count === 1 ? '' : 's'
                      } on ${day.date}`}
                      className={`w-2.5 h-2.5 rounded-[2px] ${LEVEL_CLASS[day.level]}`}
                    />
                  ) : (
                    <span key={di} className="w-2.5 h-2.5" />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-[10px] font-mono text-text/40">
        <a href={`https://github.com/${portfolioData.github.username}`} target="_blank" rel="noreferrer" className="hover:text-primary">
          {data.source === 'snapshot' ? 'GitHub snapshot' : 'GitHub calendar'}
          {data.updatedAt ? ` · Updated ${new Date(data.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}` : ''}
        </a>
        <div className="flex items-center gap-1.5">
        Less
        {LEVEL_CLASS.map((c, i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-[2px] ${c}`} />
        ))}
        More
        </div>
      </div>
    </div>
  );
}
