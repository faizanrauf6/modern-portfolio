'use client';

import { useState } from 'react';
import { Check, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-colors';

const BUTTON_STATES: { label: string; className: string; content: React.ReactNode }[] = [
  { label: 'Default', className: 'bg-primary text-bg', content: <>Submit</> },
  { label: 'Hover', className: 'bg-primary text-bg opacity-90 shadow-lg shadow-primary/20', content: <>Submit</> },
  { label: 'Focus', className: 'bg-primary text-bg ring-2 ring-primary ring-offset-2 ring-offset-bg', content: <>Submit</> },
  { label: 'Active', className: 'bg-primary text-bg scale-95', content: <>Submit</> },
  { label: 'Loading', className: 'bg-primary/70 text-bg cursor-wait', content: <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving</> },
  { label: 'Disabled', className: 'bg-primary/40 text-bg/70 cursor-not-allowed', content: <>Submit</> },
];

const INPUT_STATES: { label: string; wrap: string; note?: string }[] = [
  { label: 'Default', wrap: 'border-primary/15' },
  { label: 'Focus', wrap: 'border-primary ring-2 ring-primary/20' },
  { label: 'Filled', wrap: 'border-primary/25' },
  { label: 'Error', wrap: 'border-accent ring-2 ring-accent/20', note: 'Enter a valid email' },
  { label: 'Disabled', wrap: 'border-primary/10 bg-primary/[0.03] opacity-60' },
];

const BADGES: { label: string; className: string }[] = [
  { label: 'Neutral', className: 'bg-primary/10 text-primary border-primary/20' },
  { label: 'Success', className: 'bg-highlight/15 text-primary border-highlight/40' },
  { label: 'Warning', className: 'bg-accent/20 text-primary border-accent/40' },
  { label: 'Solid', className: 'bg-primary text-bg border-primary' },
];

export default function ComponentStates() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const run = () => {
    if (status !== 'idle') return;
    setStatus('loading');
    setTimeout(() => setStatus('done'), 1100);
    setTimeout(() => setStatus('idle'), 2600);
  };

  return (
    <div className="space-y-10">
      {/* Interactive button */}
      <section>
        <h3 className="text-xs font-mono uppercase tracking-widest text-text/50 mb-3">
          Live state machine
        </h3>
        <button
          onClick={run}
          disabled={status !== 'idle'}
          className={`${BUTTON_BASE} px-5 py-2.5 text-sm ${
            status === 'done'
              ? 'bg-highlight/20 text-primary border border-highlight/40'
              : 'bg-primary text-bg hover:opacity-90'
          } disabled:cursor-wait`}
        >
          {status === 'idle' && (
            <>
              Save changes
              <ArrowRight className="w-4 h-4" />
            </>
          )}
          {status === 'loading' && (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving
            </>
          )}
          {status === 'done' && (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          )}
        </button>
        <p className="text-[10px] font-mono text-text/40 mt-2">
          idle → loading → done → idle
        </p>
      </section>

      {/* Button states */}
      <section>
        <h3 className="text-xs font-mono uppercase tracking-widest text-text/50 mb-4">
          Button · every state
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BUTTON_STATES.map((s) => (
            <div key={s.label} className="flex flex-col items-start gap-2">
              <span className={`${BUTTON_BASE} ${s.className}`}>{s.content}</span>
              <span className="text-[10px] font-mono text-text/40">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Input states */}
      <section>
        <h3 className="text-xs font-mono uppercase tracking-widest text-text/50 mb-4">
          Input · every state
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-2xl">
          {INPUT_STATES.map((s) => (
            <div key={s.label}>
              <div
                className={`rounded-lg border px-3 py-2 text-sm text-text bg-bg ${s.wrap}`}
              >
                {s.label === 'Default' || s.label === 'Focus'
                  ? 'ada@…'
                  : s.label === 'Disabled'
                    ? 'unavailable'
                    : 'ada@example.com'}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                {s.note ? (
                  <>
                    <AlertCircle className="w-3 h-3 text-accent" />
                    <span className="text-[10px] font-mono text-accent">
                      {s.note}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-mono text-text/40">
                    {s.label}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Badges */}
      <section>
        <h3 className="text-xs font-mono uppercase tracking-widest text-text/50 mb-4">
          Badge · variants
        </h3>
        <div className="flex flex-wrap gap-3">
          {BADGES.map((b) => (
            <span
              key={b.label}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border ${b.className}`}
            >
              {b.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
