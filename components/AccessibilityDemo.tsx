'use client';

import { useState } from 'react';
import {
  Contrast,
  Focus,
  Gauge,
  Type as TypeIcon,
  ArrowRight,
} from 'lucide-react';

const SCALES = [
  { label: 'A', value: 1 },
  { label: 'A+', value: 1.15 },
  { label: 'A++', value: 1.3 },
];

function Toggle({
  on,
  onClick,
  icon: Icon,
  children,
}: {
  on: boolean;
  onClick: () => void;
  icon: typeof Contrast;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
        on
          ? 'bg-primary text-bg border-primary'
          : 'border-primary/15 text-text/60 hover:text-primary hover:border-primary/30'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {children}
    </button>
  );
}

export default function AccessibilityDemo() {
  const [highContrast, setHighContrast] = useState(false);
  const [showFocus, setShowFocus] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [scale, setScale] = useState(1);

  const bodyText = highContrast ? 'text-text' : 'text-text/70';
  const mutedText = highContrast ? 'text-text/70' : 'text-text/40';
  const border = highContrast ? 'border-primary/40' : 'border-primary/10';
  const focusRing = showFocus
    ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg'
    : 'focus:outline-none';

  return (
    <div>
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Toggle
            on={highContrast}
            onClick={() => setHighContrast((v) => !v)}
            icon={Contrast}
          >
            High contrast
          </Toggle>
          <Toggle
            on={showFocus}
            onClick={() => setShowFocus((v) => !v)}
            icon={Focus}
          >
            Focus rings
          </Toggle>
          <Toggle
            on={reduceMotion}
            onClick={() => setReduceMotion((v) => !v)}
            icon={Gauge}
          >
            Reduce motion
          </Toggle>

          <span className="mx-1 h-4 w-px bg-primary/15" />

          <span className="inline-flex items-center gap-1 rounded-full border border-primary/15 p-0.5">
            <TypeIcon className="w-3.5 h-3.5 text-text/50 ml-2" />
            {SCALES.map((s) => (
              <button
                key={s.label}
                onClick={() => setScale(s.value)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono transition-colors ${
                  scale === s.value
                    ? 'bg-primary text-bg'
                    : 'text-text/60 hover:text-primary'
                }`}
              >
                {s.label}
              </button>
            ))}
          </span>
        </div>

        {/* Preview */}
        <div
          style={{ fontSize: `${scale}rem` }}
          className={`rounded-2xl border bg-bg overflow-hidden shadow-sm ${border}`}
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-primary/10 bg-primary/[0.03]">
            <span className="mx-auto text-[10px] font-mono text-text/40">
              {highContrast ? 'high-contrast' : 'default'} ·{' '}
              {showFocus ? 'focus visible' : 'focus hidden'} ·{' '}
              {reduceMotion ? 'motion reduced' : 'motion on'}
            </span>
          </div>

          <div className="p-6 md:p-8 font-sans">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                {!reduceMotion && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-highlight opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-highlight" />
              </span>
              <span className={`text-[0.7em] font-mono uppercase tracking-widest ${mutedText}`}>
                Status: available
              </span>
            </div>

            <h3 className="text-[1.5em] font-semibold tracking-tight text-primary leading-tight">
              Contact form
            </h3>
            <p className={`text-[0.9em] mt-2 max-w-md leading-relaxed ${bodyText}`}>
              Labels are tied to inputs, the tab order follows reading order, and
              every control keeps a visible focus state when focus rings are on.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <label className="block">
                <span className={`text-[0.7em] font-mono uppercase tracking-widest ${mutedText}`}>
                  Name
                </span>
                <input
                  type="text"
                  placeholder="Ada Lovelace"
                  className={`mt-1 w-full rounded-lg border bg-bg px-3 py-2 text-[0.85em] text-text placeholder:text-text/30 ${border} ${focusRing}`}
                />
              </label>
              <label className="block">
                <span className={`text-[0.7em] font-mono uppercase tracking-widest ${mutedText}`}>
                  Email
                </span>
                <input
                  type="email"
                  placeholder="ada@example.com"
                  className={`mt-1 w-full rounded-lg border bg-bg px-3 py-2 text-[0.85em] text-text placeholder:text-text/30 ${border} ${focusRing}`}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-bg text-[0.8em] font-medium hover:opacity-90 transition-opacity ${focusRing}`}
              >
                Send message
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="#accessibility"
                className={`text-[0.8em] font-medium text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary rounded ${focusRing}`}
              >
                Read the a11y notes
              </a>
            </div>

            {!showFocus && (
              <p className="mt-5 text-[0.75em] font-mono text-text/50">
                Focus rings are off — this is the anti-pattern. Keyboard users
                can no longer tell which control is active.
              </p>
            )}
          </div>
        </div>
    </div>
  );
}
