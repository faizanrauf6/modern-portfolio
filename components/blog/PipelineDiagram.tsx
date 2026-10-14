'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, Play, Pause, type LucideIcon } from 'lucide-react';

export type PipelineStep = {
  icon: LucideIcon;
  title: string;
  detail: string;
  tag?: string;
};

function NodeGlow() {
  // Inset ring — pulses inward, never past the node's own edge, so there's
  // nothing for a layout to clip.
  return (
    <motion.span
      className="absolute inset-0 rounded-2xl pointer-events-none"
      style={{ boxShadow: 'inset 0 0 0 3px var(--background)' }}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: [0.9, 0.15, 0.9] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function PipelineDiagram({
  steps,
  autoPlayMs = 2600,
}: {
  steps: PipelineStep[];
  autoPlayMs?: number;
}) {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = steps.length;

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % n);
    }, autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, n, autoPlayMs]);

  const goTo = (i: number) => {
    setActive(((i % n) + n) % n);
    setIsPlaying(false);
  };

  const step = steps[active];
  const Icon = step.icon;
  // Node centers sit at the midpoint of each equal-width grid column, so the
  // track has to be inset by half a column on each side to land on them —
  // independent of label length or step count.
  const trackInset = `${50 / n}%`;
  const progressPct = n > 1 ? (active / (n - 1)) * 100 : 0;

  return (
    <div className="not-prose rounded-2xl md:rounded-3xl border border-primary/10 bg-zinc-50/60 p-5 md:p-8">
      {/* Desktop / tablet: every node laid out at once. There's always enough
          width here, so this never needs to scroll or clip anything. */}
      <div className="relative hidden md:block">
        <div className="absolute top-7 h-0.5 z-0" style={{ left: trackInset, right: trackInset }}>
          <div className="absolute inset-0 bg-primary/10 rounded-full" />
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: 'var(--highlight)' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="absolute top-1/2 w-2 h-2 rounded-full -translate-y-1/2"
            style={{ background: 'var(--highlight)' }}
            animate={{ left: `${progressPct}%`, opacity: active < n - 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          {Array.from({ length: n - 1 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                color: i < active ? 'var(--highlight)' : 'var(--primary)',
                opacity: i < active ? 1 : 0.25,
              }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-50/60 rounded-full"
              style={{ left: `${((i + 0.5) / (n - 1)) * 100}%` }}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.div>
          ))}
        </div>

        <div className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const isActive = i === active;
            const isDone = i < active;
            return (
              <button
                key={s.title}
                onClick={() => goTo(i)}
                className="flex flex-col items-center gap-2 px-1 min-w-0 cursor-pointer group"
                aria-label={`Show step: ${s.title}`}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.12 : 1,
                    backgroundColor: isActive ? 'var(--highlight)' : isDone ? 'var(--primary)' : 'var(--background)',
                    borderColor: isActive || isDone ? 'transparent' : 'var(--primary)',
                  }}
                  transition={{ duration: 0.35 }}
                  className="relative w-14 h-14 rounded-2xl border flex items-center justify-center shadow-sm shrink-0"
                  style={{ borderWidth: isActive || isDone ? 0 : 1, opacity: isActive || isDone ? 1 : 0.35 }}
                >
                  {isActive && <NodeGlow />}
                  <StepIcon
                    className="w-6 h-6 relative z-10"
                    style={{ color: isActive || isDone ? 'var(--background)' : 'var(--primary)' }}
                  />
                  <motion.span
                    animate={{
                      backgroundColor: isActive || isDone ? 'var(--background)' : 'var(--primary)',
                      color: isActive || isDone ? 'var(--primary)' : 'var(--background)',
                      opacity: isActive || isDone ? 1 : 0.35,
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border border-primary/10 flex items-center justify-center text-[9px] font-mono font-semibold shadow-sm"
                  >
                    {i + 1}
                  </motion.span>
                </motion.div>
                <span
                  className={`text-[11px] font-mono uppercase tracking-wider text-center leading-tight transition-colors break-words ${
                    isActive ? 'text-primary font-semibold' : 'text-text/40'
                  }`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: no row of N nodes to fit or scroll — just the current step,
          a segmented progress bar, and the same play/pause/prev/next controls. */}
      <div className="md:hidden flex items-center gap-4">
        <motion.div
          key={active}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0"
          style={{ background: 'var(--highlight)' }}
        >
          <NodeGlow />
          <Icon className="w-6 h-6 relative z-10" style={{ color: 'var(--background)' }} />
          <span
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border border-primary/10 flex items-center justify-center text-[9px] font-mono font-semibold shadow-sm"
            style={{ background: 'var(--background)', color: 'var(--primary)' }}
          >
            {active + 1}
          </span>
        </motion.div>

        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold block truncate">
            {step.title}
          </span>
          <div className="flex gap-1 mt-2.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Show step: ${steps[i].title}`}
                className="h-1 flex-1 rounded-full overflow-hidden bg-primary/10 cursor-pointer"
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'var(--highlight)' }}
                  animate={{ width: i <= active ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail panel + playback controls */}
      <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-primary/10">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-highlight">
              Step {active + 1} of {n}
            </span>
            {step.tag && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-text/40 border border-primary/10 rounded-full px-2 py-0.5">
                {step.tag}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(active - 1)}
              aria-label="Previous step"
              className="p-1.5 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.06] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="p-1.5 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.06] transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => goTo(active + 1)}
              aria-label="Next step"
              className="p-1.5 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.06] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h4 className="hidden md:block text-lg md:text-xl font-semibold text-primary mb-1.5">{step.title}</h4>
          <p className="text-sm md:text-base text-text/70 leading-relaxed max-w-2xl">{step.detail}</p>
        </motion.div>
      </div>
    </div>
  );
}
