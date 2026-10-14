'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, List, Table2 } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

const VIEWS = [
  { id: 'grid', label: 'Grid', icon: LayoutGrid },
  { id: 'list', label: 'List', icon: List },
  { id: 'table', label: 'Table', icon: Table2 },
] as const;

type View = (typeof VIEWS)[number]['id'];

const ITEMS = portfolioData.projects.slice(0, 6).map((p) => ({
  title: p.title,
  category: p.category,
  impact: p.impact,
}));

const spring = { type: 'spring', stiffness: 320, damping: 32 } as const;

export default function LayoutMorph() {
  const [view, setView] = useState<View>('grid');

  const container =
    view === 'grid'
      ? 'grid grid-cols-2 md:grid-cols-3 gap-3'
      : 'flex flex-col gap-2';

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        {VIEWS.map((v) => {
          const Icon = v.icon;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                view === v.id
                  ? 'bg-primary text-bg border-primary'
                  : 'border-primary/15 text-text/60 hover:text-primary hover:border-primary/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {v.label}
            </button>
          );
        })}
        <span className="ml-auto text-[10px] font-mono text-text/40">
          one dataset · three layouts
        </span>
      </div>

      <div className="rounded-2xl border border-primary/15 bg-bg p-4 md:p-5">
        {/* Table header (only in table view) */}
        <AnimatePresence>
          {view === 'table' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-[2fr_1.4fr_1fr] gap-3 px-3 pb-2 mb-1 border-b border-primary/10 text-[10px] font-mono uppercase tracking-widest text-text/40"
            >
              <span>Project</span>
              <span>Category</span>
              <span>Impact</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className={container}>
          {ITEMS.map((item) => (
            <motion.div
              key={item.title}
              layout
              transition={spring}
              className={
                view === 'grid'
                  ? 'rounded-xl border border-primary/10 bg-primary/[0.02] p-4 flex flex-col gap-2'
                  : view === 'list'
                    ? 'rounded-lg border border-primary/10 bg-primary/[0.02] px-4 py-3 flex items-center gap-3'
                    : 'grid grid-cols-[2fr_1.4fr_1fr] gap-3 px-3 py-2.5 rounded-md odd:bg-primary/[0.02] items-center'
              }
            >
              {view === 'grid' && (
                <>
                  <div className="w-8 h-8 rounded-lg bg-highlight/15" />
                  <p className="text-sm font-semibold text-primary leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[11px] font-mono text-text/50">
                    {item.category}
                  </p>
                  <span className="mt-1 self-start text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-text/60">
                    {item.impact}
                  </span>
                </>
              )}

              {view === 'list' && (
                <>
                  <div className="w-6 h-6 rounded-md bg-highlight/15 shrink-0" />
                  <p className="text-sm font-medium text-primary truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] font-mono text-text/40 truncate hidden sm:block">
                    {item.category}
                  </p>
                  <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-text/60 shrink-0">
                    {item.impact}
                  </span>
                </>
              )}

              {view === 'table' && (
                <>
                  <span className="text-sm font-medium text-primary truncate">
                    {item.title}
                  </span>
                  <span className="text-xs text-text/60 truncate">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-text/50 truncate">
                    {item.impact}
                  </span>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
