'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  FlaskConical,
  MonitorSmartphone,
  Palette,
  Sparkles,
  LayoutGrid,
  Blocks,
  Accessibility,
  Gauge,
} from 'lucide-react';
import ResponsivePlayground from '@/components/ResponsivePlayground';
import ThemeBuilder from '@/components/ThemeBuilder';
import AnimationLab from '@/components/AnimationLab';
import LayoutMorph from '@/components/LayoutMorph';
import ComponentStates from '@/components/ComponentStates';
import AccessibilityDemo from '@/components/AccessibilityDemo';
import PerformancePanel from '@/components/PerformancePanel';

type Tab = {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  blurb: string;
  Component: () => React.ReactNode;
};

const TABS: Tab[] = [
  {
    id: 'responsive',
    label: 'Responsive',
    icon: MonitorSmartphone,
    title: 'Resize it yourself',
    blurb:
      'Drag the handle, pick a device, or click the ruler. The preview reflows with CSS container queries — reacting to its own width, not the browser window.',
    Component: ResponsivePlayground,
  },
  {
    id: 'theme',
    label: 'Theme',
    icon: Palette,
    title: 'Recolor the system',
    blurb:
      'The whole site runs on five color tokens and one font variable. Change them, preview live, then copy the JSON or push it to the real page.',
    Component: ThemeBuilder,
  },
  {
    id: 'motion',
    label: 'Motion',
    icon: Sparkles,
    title: 'Tune the spring',
    blurb:
      'Adjust stiffness, damping, and mass and watch the same elements respond. The Framer Motion config stays in sync and is one click to copy.',
    Component: AnimationLab,
  },
  {
    id: 'layouts',
    label: 'Layouts',
    icon: LayoutGrid,
    title: 'One dataset, three layouts',
    blurb:
      'The same records rendered as a grid, a list, or a table — with each item animating between arrangements via shared-layout transitions.',
    Component: LayoutMorph,
  },
  {
    id: 'states',
    label: 'States',
    icon: Blocks,
    title: 'Every component state',
    blurb:
      'Buttons, inputs, and badges shown in every state at once — default, hover, focus, active, loading, disabled, error — plus one live state machine.',
    Component: ComponentStates,
  },
  {
    id: 'a11y',
    label: 'A11y',
    icon: Accessibility,
    title: 'Built for everyone',
    blurb:
      'Flip contrast, focus rings, reduced motion, and text scale. Tab through the preview with a keyboard to check focus order and visible focus.',
    Component: AccessibilityDemo,
  },
  {
    id: 'perf',
    label: 'Perf',
    icon: Gauge,
    title: 'Measured, not claimed',
    blurb:
      'The real Core Web Vitals for this page, captured live in your browser via the Performance API. Click and scroll — INP and CLS keep updating.',
    Component: PerformancePanel,
  },
];

export default function PlaygroundPage() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];
  const Demo = tab.Component;

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActive((i) => (i + 1) % TABS.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActive((i) => (i - 1 + TABS.length) % TABS.length);
    }
  };

  return (
    <main className="min-h-screen bg-bg pt-28 pb-24">
      <div className="px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text/50 hover:text-primary transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text/50 border border-primary/15 rounded-full px-3 py-1.5 mb-4">
              <FlaskConical className="w-3 h-3 text-highlight" />
              Interactive
            </span>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-primary">
              Playground<span className="text-accent">.</span>
            </h1>
            <p className="max-w-xl text-sm md:text-base text-text/60 leading-relaxed mt-4 font-sans">
              Seven hands-on demos of things a portfolio usually just claims.
              Pick a tab — each one is a real, working widget built on the same
              CSS variables as the rest of the site.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sticky tab bar */}
      <div className="sticky top-16 z-20 mt-8 border-y border-primary/10 bg-bg/85 backdrop-blur-md">
        <div className="px-6 lg:px-24">
          <div
            role="tablist"
            aria-label="Playground demos"
            onKeyDown={onTabKey}
            className="max-w-7xl mx-auto flex gap-1 overflow-x-auto no-scrollbar"
          >
            {TABS.map((t, i) => {
              const Icon = t.icon;
              const isActive = i === active;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-3 text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-text/45 hover:text-text/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  {isActive && (
                    <motion.div
                      layoutId="lab-tab"
                      className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active demo */}
      <div className="px-6 lg:px-24 mt-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text/50 block mb-2">
                  {tab.label}
                </span>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary">
                  {tab.title}
                  <span className="text-accent">.</span>
                </h2>
                <p className="max-w-2xl text-sm text-text/60 leading-relaxed mt-3 font-sans">
                  {tab.blurb}
                </p>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-bg p-5 md:p-8 shadow-sm">
                <Demo />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
