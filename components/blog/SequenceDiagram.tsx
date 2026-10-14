'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, ChevronLeft, Settings2, Play, Pause } from 'lucide-react';

export type SeqActor = { label: string; icon: LucideIcon };

export type SeqStep =
  | { kind: 'arrow'; from: number; to: number; label: string; detail: string; tone?: 'request' | 'response' }
  | { kind: 'self'; actor: number; label: string; detail: string; icon?: LucideIcon };

export default function SequenceDiagram({
  actors,
  steps,
  autoPlayMs = 2400,
}: {
  actors: SeqActor[];
  steps: SeqStep[];
  autoPlayMs?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = steps.length;

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % n);
    }, autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, n, autoPlayMs]);

  const goTo = (i: number) => {
    setCurrent(((i % n) + n) % n);
    setIsPlaying(false);
  };

  const activeStep = steps[current];
  const cols = actors.length;

  return (
    <div className="not-prose rounded-2xl md:rounded-3xl border border-primary/10 bg-zinc-50/60 p-5 md:p-8">
      {/* Actor headers */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {actors.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.label} className="flex flex-col items-center gap-1.5 md:gap-2">
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-primary text-bg flex items-center justify-center shadow-sm">
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-[9px] md:text-[11px] font-mono uppercase tracking-wider text-text/60 text-center">
                {a.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Lifelines + rows */}
      <div className="relative mt-2">
        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {actors.map((a, i) => (
            <div key={i} className="flex justify-center">
              <div className="w-px h-full bg-primary/15 [background-image:linear-gradient(to_bottom,var(--primary)_50%,transparent_0%)] [background-size:1px_8px] opacity-30" />
            </div>
          ))}
        </div>

        <div className="relative">
          {steps.map((s, i) => {
            const status = i < current ? 'past' : i === current ? 'now' : 'future';
            return (
              <div key={i} className="relative py-3 md:py-4">
                {s.kind === 'self' ? (
                  <SelfRow
                    actorIndex={s.actor}
                    cols={cols}
                    label={s.label}
                    icon={s.icon}
                    status={status}
                    onClick={() => goTo(i)}
                  />
                ) : (
                  <ArrowRow
                    from={s.from}
                    to={s.to}
                    cols={cols}
                    label={s.label}
                    tone={s.tone}
                    status={status}
                    onClick={() => goTo(i)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel + playback controls */}
      <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-primary/10">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-highlight">
            Step {current + 1} of {n}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(current - 1)}
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
              onClick={() => goTo(current + 1)}
              aria-label="Next step"
              className="p-1.5 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.06] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <motion.p
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm md:text-base text-text/70 leading-relaxed max-w-2xl"
        >
          {activeStep.detail}
        </motion.p>
      </div>
    </div>
  );
}

function colStyle(idx: number, cols: number) {
  return { gridColumn: `${idx + 1} / ${idx + 2}` } as const;
}

function ArrowRow({
  from,
  to,
  cols,
  label,
  tone,
  status,
  onClick,
}: {
  from: number;
  to: number;
  cols: number;
  label: string;
  tone?: 'request' | 'response';
  status: 'past' | 'now' | 'future';
  onClick: () => void;
}) {
  const left = Math.min(from, to);
  const right = Math.max(from, to);
  const pointsRight = to > from;
  const color = status === 'now' ? (tone === 'response' ? 'var(--highlight)' : 'var(--primary)') : status === 'past' ? '#a1a1aa' : '#d4d4d8';

  return (
    <button onClick={onClick} className="block w-full cursor-pointer text-left">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        <div style={{ gridColumn: `${left + 1} / ${right + 2}` }} className="relative px-6">
          {tone && (
            <motion.div
              animate={{ opacity: status === 'future' ? 0.25 : 1 }}
              className="flex justify-center mb-1"
            >
              <span
                className="text-[8px] md:text-[9px] font-mono uppercase tracking-widest px-1.5 rounded"
                style={{
                  color: status === 'now' ? color : '#a1a1aa',
                  background: status === 'now' ? `color-mix(in srgb, ${color} 12%, transparent)` : 'transparent',
                }}
              >
                {tone === 'response' ? '← response' : 'request →'}
              </span>
            </motion.div>
          )}
          <motion.p
            animate={{ opacity: status === 'future' ? 0.3 : 1, fontWeight: status === 'now' ? 600 : 500 }}
            className="text-[10px] md:text-xs text-center mb-1 font-mono"
            style={{ color: status === 'now' ? color : undefined }}
          >
            <span className={status === 'future' ? 'text-text/30' : 'text-text/70'}>{label}</span>
          </motion.p>
          <div className="relative h-4 flex items-center">
            <motion.div
              className="h-0.5 w-full rounded-full origin-left"
              style={{ background: color, transformOrigin: pointsRight ? 'left' : 'right' }}
              animate={{ scaleX: status === 'future' ? 0.15 : 1, opacity: status === 'future' ? 0.25 : 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              animate={{ opacity: status === 'future' ? 0.25 : 1, x: 0 }}
              className={`absolute ${pointsRight ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2`}
            >
              {pointsRight ? (
                <ChevronRight className="w-3.5 h-3.5" style={{ color }} />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" style={{ color }} />
              )}
            </motion.div>
            {status === 'now' && (
              <motion.div
                className="absolute top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2"
                style={{ background: color }}
                animate={{ left: pointsRight ? ['0%', '96%'] : ['96%', '0%'] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function SelfRow({
  actorIndex,
  cols,
  label,
  icon: Icon = Settings2,
  status,
  onClick,
}: {
  actorIndex: number;
  cols: number;
  label: string;
  icon?: LucideIcon;
  status: 'past' | 'now' | 'future';
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="block w-full cursor-pointer text-left">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        <div style={colStyle(actorIndex, cols)} className="flex justify-center px-2">
          <motion.div
            animate={{
              opacity: status === 'future' ? 0.3 : 1,
              backgroundColor: status === 'now' ? 'var(--highlight)' : status === 'past' ? '#e4e4e7' : '#f4f4f5',
              color: status === 'now' ? 'var(--background)' : '#52525b',
            }}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] md:text-[10px] font-mono border border-primary/10"
          >
            <Icon className="w-3 h-3 shrink-0" />
            <span className="whitespace-nowrap">{label}</span>
          </motion.div>
        </div>
      </div>
    </button>
  );
}
