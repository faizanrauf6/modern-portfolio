'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Gauge, MousePointerClick, Timer, Zap } from 'lucide-react';

type Rating = 'good' | 'ni' | 'poor';
type Metric = {
  key: string;
  label: string;
  hint: string;
  icon: typeof Activity;
  value: number | null;
  unit: 'ms' | '';
  rate: (v: number) => Rating;
  format: (v: number) => string;
};

const RATING_CLASS: Record<Rating, string> = {
  good: 'bg-highlight/15 text-primary border-highlight/40',
  ni: 'bg-accent/20 text-primary border-accent/40',
  poor: 'bg-primary text-bg border-primary',
};
const RATING_LABEL: Record<Rating, string> = {
  good: 'Good',
  ni: 'Needs work',
  poor: 'Poor',
};

type Vitals = {
  lcp: number | null;
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  ttfb: number | null;
};

const EMPTY: Vitals = { lcp: null, cls: null, inp: null, fcp: null, ttfb: null };

export default function PerformancePanel() {
  const [vitals, setVitals] = useState<Vitals>(EMPTY);
  const { lcp, cls, inp, fcp, ttfb } = vitals;

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return;
    const observers: PerformanceObserver[] = [];

    const safeObserve = (
      cb: (list: PerformanceObserverEntryList) => void,
      opts: PerformanceObserverInit & { durationThreshold?: number },
    ) => {
      try {
        const obs = new PerformanceObserver(cb);
        obs.observe(opts);
        observers.push(obs);
      } catch {
        /* entry type unsupported in this browser */
      }
    };

    // TTFB + FCP from the navigation / paint timelines (deferred a frame so
    // this doesn't set state synchronously inside the effect body).
    const raf = requestAnimationFrame(() => {
      try {
        const nav = performance.getEntriesByType(
          'navigation',
        )[0] as PerformanceNavigationTiming | undefined;
        const fcpEntry = performance
          .getEntriesByType('paint')
          .find((e) => e.name === 'first-contentful-paint');
        setVitals((v) => ({
          ...v,
          ttfb: nav ? nav.responseStart : v.ttfb,
          fcp: fcpEntry ? fcpEntry.startTime : v.fcp,
        }));
      } catch {
        /* Performance API partially unavailable */
      }
    });

    // LCP — keep the latest reported entry
    safeObserve((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as
        | (PerformanceEntry & { renderTime?: number; loadTime?: number })
        | undefined;
      if (last) {
        const value = last.renderTime || last.startTime;
        setVitals((v) => ({ ...v, lcp: value }));
      }
    }, { type: 'largest-contentful-paint', buffered: true });

    // CLS — sum shifts without recent user input
    let clsValue = 0;
    safeObserve((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        value: number;
        hadRecentInput: boolean;
      })[]) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
      setVitals((v) => ({ ...v, cls: clsValue }));
    }, { type: 'layout-shift', buffered: true });

    // INP — largest interaction latency seen so far
    let maxInp = 0;
    safeObserve((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        interactionId?: number;
      })[]) {
        if (entry.interactionId && entry.duration > maxInp) maxInp = entry.duration;
      }
      if (maxInp > 0) setVitals((v) => ({ ...v, inp: maxInp }));
    }, { type: 'event', durationThreshold: 16, buffered: true });

    return () => {
      cancelAnimationFrame(raf);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const metrics: Metric[] = [
    {
      key: 'lcp',
      label: 'LCP',
      hint: 'Largest Contentful Paint',
      icon: Activity,
      value: lcp,
      unit: 'ms',
      rate: (v) => (v <= 2500 ? 'good' : v <= 4000 ? 'ni' : 'poor'),
      format: (v) => `${(v / 1000).toFixed(2)}s`,
    },
    {
      key: 'inp',
      label: 'INP',
      hint: 'Interaction to Next Paint',
      icon: MousePointerClick,
      value: inp,
      unit: 'ms',
      rate: (v) => (v <= 200 ? 'good' : v <= 500 ? 'ni' : 'poor'),
      format: (v) => `${Math.round(v)}ms`,
    },
    {
      key: 'cls',
      label: 'CLS',
      hint: 'Cumulative Layout Shift',
      icon: Gauge,
      value: cls,
      unit: '',
      rate: (v) => (v <= 0.1 ? 'good' : v <= 0.25 ? 'ni' : 'poor'),
      format: (v) => v.toFixed(3),
    },
    {
      key: 'fcp',
      label: 'FCP',
      hint: 'First Contentful Paint',
      icon: Zap,
      value: fcp,
      unit: 'ms',
      rate: (v) => (v <= 1800 ? 'good' : v <= 3000 ? 'ni' : 'poor'),
      format: (v) => `${(v / 1000).toFixed(2)}s`,
    },
    {
      key: 'ttfb',
      label: 'TTFB',
      hint: 'Time to First Byte',
      icon: Timer,
      value: ttfb,
      unit: 'ms',
      rate: (v) => (v <= 800 ? 'good' : v <= 1800 ? 'ni' : 'poor'),
      format: (v) => `${Math.round(v)}ms`,
    },
  ];

  return (
    <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            const rating = m.value != null ? m.rate(m.value) : null;
            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="rounded-2xl border border-primary/10 p-5 bg-bg flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 text-text/40" />
                  {rating && (
                    <span
                      className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${RATING_CLASS[rating]}`}
                    >
                      {RATING_LABEL[rating]}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-primary tabular-nums">
                  {m.value != null ? m.format(m.value) : '—'}
                </p>
                <p className="text-xs font-medium text-primary mt-1">{m.label}</p>
                <p className="text-[10px] font-mono text-text/40 mt-0.5">
                  {m.hint}
                </p>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-6 text-[10px] font-mono text-text/40">
          LCP / FCP / TTFB are one-shot page-load metrics. A dash means the
          browser hasn&apos;t reported that metric yet or doesn&apos;t support
          it.
        </p>
    </div>
  );
}
