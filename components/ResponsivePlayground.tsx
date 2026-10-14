'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import portfolioData from '@/data/portfolio.json';
import type { LucideIcon } from 'lucide-react';
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Maximize2,
  GripVertical,
  Menu,
  Columns3,
  RotateCcw,
} from 'lucide-react';

type Preset = {
  id: string;
  label: string;
  width: number | null; // null => fluid (fills the track)
  icon: LucideIcon;
};

const PRESETS: Preset[] = [
  { id: 'mobile', label: 'Mobile', width: 375, icon: Smartphone },
  { id: 'tablet', label: 'Tablet', width: 768, icon: Tablet },
  { id: 'laptop', label: 'Laptop', width: 1024, icon: Laptop },
  { id: 'desktop', label: 'Desktop', width: 1280, icon: Monitor },
  { id: 'fluid', label: 'Fluid', width: null, icon: Maximize2 },
];

// Ruler ticks — the container-query breakpoints the demo actually reacts to.
const MARKS = [
  { w: 375, label: 'xs' },
  { w: 480, label: 'sm' },
  { w: 768, label: 'md' },
  { w: 1024, label: 'lg' },
  { w: 1280, label: 'xl' },
];

const MIN_W = 300;
const STEP = 24;

function breakpointOf(w: number) {
  if (w < 480) return { tag: '@xs', note: 'single column · compact nav' };
  if (w < 768) return { tag: '@sm', note: 'two-up cards · stacked hero' };
  if (w < 1024) return { tag: '@md', note: 'denser grid · larger type' };
  if (w < 1280) return { tag: '@lg', note: 'full nav · split hero' };
  return { tag: '@xl', note: 'max layout · widest gutters' };
}

export default function ResponsivePlayground() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(0);
  const [width, setWidth] = useState<number | null>(null); // null => fluid
  const [activePreset, setActivePreset] = useState('fluid');
  const [isDragging, setIsDragging] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  // Measure the available track width and keep it current on resize.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setTrackW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const frameW = width == null ? trackW : Math.min(width, trackW || width);
  const scaledToFit = width != null && trackW > 0 && width > trackW;
  const isDevice = activePreset !== 'fluid' && activePreset !== 'custom';
  const bp = breakpointOf(frameW || 0);
  const pct = trackW > 0 ? Math.min(100, ((frameW || 0) / trackW) * 100) : 100;

  const applyPreset = (p: Preset) => {
    setActivePreset(p.id);
    setWidth(p.width);
  };

  const setFromX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const left = el.getBoundingClientRect().left;
    setWidth(Math.max(MIN_W, Math.min(clientX - left, el.clientWidth)));
    setActivePreset('custom');
  }, []);

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      setFromX(e.clientX);
    },
    [setFromX],
  );

  const onDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setFromX(e.clientX);
    },
    [isDragging, setFromX],
  );

  const endDrag = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  }, []);

  const onKeyResize = useCallback(
    (e: React.KeyboardEvent) => {
      const base = frameW || 0;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const delta = e.key === 'ArrowLeft' ? -STEP : STEP;
        setWidth(Math.max(MIN_W, Math.min(base + delta, trackW || base + delta)));
        setActivePreset('custom');
      }
    },
    [frameW, trackW],
  );

  const reset = () => {
    setActivePreset('fluid');
    setWidth(null);
    setShowGrid(false);
  };

  const smooth = isDragging ? '' : 'transition-[width,left] duration-300 ease-out';

  return (
    <div className="relative">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {PRESETS.map((p) => {
            const Icon = p.icon;
            const active = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                  active
                    ? 'bg-primary text-bg border-primary'
                    : 'border-primary/15 text-text/60 hover:text-primary hover:border-primary/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {p.label}
              </button>
            );
          })}

          <span className="mx-1 h-4 w-px bg-primary/15" />

          <button
            onClick={() => setShowGrid((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
              showGrid
                ? 'bg-highlight/15 text-primary border-highlight/40'
                : 'border-primary/15 text-text/60 hover:text-primary hover:border-primary/30'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            Grid
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-primary/15 text-text/60 hover:text-primary hover:border-primary/30 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <div className="ml-auto flex items-center gap-2 font-mono text-xs">
            {scaledToFit && (
              <span className="text-highlight">scaled to fit</span>
            )}
            <span className="text-text/50">
              <span className="text-primary font-medium">
                {Math.round(frameW || 0)}
              </span>
              px
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={bp.tag}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="px-2 py-0.5 rounded-full bg-primary text-bg text-[10px] font-medium"
              >
                {bp.tag}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Ruler — click to set width; ticks mark the container-query breakpoints */}
        <div
          onPointerDown={(e) => setFromX(e.clientX)}
          className="relative h-7 mb-3 cursor-pointer select-none"
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-primary/15" />
          {MARKS.filter((m) => trackW === 0 || m.w <= trackW).map((m) => {
            const left = trackW > 0 ? (m.w / trackW) * 100 : 0;
            const passed = (frameW || 0) >= m.w;
            return (
              <div
                key={m.w}
                className="absolute top-0 flex flex-col items-center -translate-x-1/2"
                style={{ left: `${left}%` }}
              >
                <span
                  className={`h-2.5 w-px ${passed ? 'bg-highlight' : 'bg-primary/25'}`}
                />
                <span
                  className={`mt-0.5 text-[9px] font-mono ${
                    passed ? 'text-primary' : 'text-text/40'
                  }`}
                >
                  {m.label}
                </span>
              </div>
            );
          })}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15 ${smooth}`}
            style={{ left: `${pct}%` }}
          />
        </div>

        {/* Track + resizable frame */}
        <div ref={trackRef} className="relative w-full select-none">
          <div
            className={`rounded-2xl ${
              isDevice ? 'p-2 bg-primary/[0.04]' : 'p-0'
            } ${smooth}`}
            style={{ width: frameW || '100%' }}
          >
            <div className="relative bg-bg border border-primary/15 rounded-xl shadow-sm overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-primary/10 bg-primary/[0.03]">
                <span className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/20 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/20 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/20 block" />
                </span>
                <span className="mx-auto text-[10px] font-mono text-text/40 truncate">
                  preview · {bp.note}
                </span>
              </div>

              {/* Container-query context — children below respond to THIS width */}
              <div className="@container relative">
                {showGrid && (
                  <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-4 @min-[768px]:grid-cols-8 @min-[1024px]:grid-cols-12 gap-3 px-4 @min-[768px]:px-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-highlight/10 border-x border-highlight/20 [&:nth-child(n+5)]:hidden @min-[768px]:[&:nth-child(n+5)]:block @min-[768px]:[&:nth-child(n+9)]:hidden @min-[1024px]:[&:nth-child(n+9)]:block"
                      />
                    ))}
                  </div>
                )}
                <DemoSite />
              </div>
            </div>
          </div>

          {/* Drag handle */}
          <div
            role="slider"
            tabIndex={0}
            aria-label="Preview width"
            aria-valuemin={MIN_W}
            aria-valuemax={Math.round(trackW) || undefined}
            aria-valuenow={Math.round(frameW || 0)}
            onPointerDown={startDrag}
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyResize}
            style={{ left: frameW ? frameW - 1 : '100%' }}
            className={`absolute top-0 bottom-0 -ml-4 w-8 flex items-center justify-center cursor-ew-resize touch-none group outline-none ${smooth}`}
          >
            <span className="h-16 w-1.5 rounded-full bg-primary/20 group-hover:bg-primary/40 group-focus:bg-primary/50 transition-colors flex items-center justify-center">
              <GripVertical className="w-3 h-3 text-primary/70 shrink-0" />
            </span>
          </div>
        </div>
    </div>
  );
}

/**
 * The live demo. Every layout decision here is a container query
 * (`@min-[Npx]:`) so it tracks the frame width above, not the viewport.
 * Colors and fonts come only from theme tokens: primary / accent / highlight
 * / bg / text, and font-sans / font-mono.
 */
function DemoSite() {
  const cards = [
    'Fluid grids',
    'Container queries',
    'Fluid type scale',
    'Tap targets',
    'Safe gutters',
    'Zero overflow',
  ];
  const stats: [string, string][] = [
    ['1', 'Preview container'],
    [String(cards.length), 'Interface cards'],
    [String(PRESETS.length), 'Size presets'],
  ];

  return (
    <div className="font-sans text-text bg-bg p-4 @min-[768px]:p-6 max-h-[460px] overflow-y-auto custom-scrollbar">
      {/* Nav — links collapse to a menu button under 640px */}
      <div className="flex items-center justify-between pb-4 border-b border-primary/10">
        <span className="font-mono text-xs @min-[768px]:text-sm font-semibold text-primary tracking-widest uppercase">
          MFR / UI
        </span>
        <nav className="hidden @min-[640px]:flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-text/60">
          <span className="hover:text-primary transition-colors">Work</span>
          <span className="hover:text-primary transition-colors">About</span>
          <span className="hover:text-primary transition-colors">Contact</span>
        </nav>
        <button className="@min-[640px]:hidden p-1.5 rounded-md border border-primary/15 text-primary">
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Hero — stacks below 900px, splits side-by-side above */}
      <div className="flex flex-col @min-[900px]:flex-row @min-[900px]:items-center gap-4 @min-[900px]:gap-8 py-6">
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
            {portfolioData.profile.displayName} / Responsive by design
          </p>
          <h3 className="font-sans font-semibold tracking-tight leading-tight text-primary text-xl @min-[520px]:text-2xl @min-[900px]:text-3xl @min-[1200px]:text-4xl">
            One layout, every screen.
          </h3>
          <p className="text-xs @min-[768px]:text-sm text-text/60 mt-3 max-w-sm leading-relaxed">
            Nothing here listens to the browser width. Each breakpoint is scoped
            to this panel, so the same component works anywhere it&apos;s placed.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1.5 rounded-full bg-primary text-bg text-[11px] font-medium">
              View projects
            </span>
            <span className="px-3 py-1.5 rounded-full border border-primary/20 text-primary text-[11px] font-medium">
              About {portfolioData.profile.displayName}
            </span>
          </div>
        </div>
        <div className="w-full @min-[900px]:w-56 shrink-0 rounded-lg border border-primary/10 bg-primary/[0.03] aspect-[4/3] flex items-center justify-center">
          <span className="font-mono text-[10px] text-text/40">preview.tsx</span>
        </div>
      </div>

      {/* Card grid — 1 → 2 → 3 columns */}
      <div className="grid grid-cols-1 @min-[480px]:grid-cols-2 @min-[900px]:grid-cols-3 gap-3">
        {cards.map((t) => (
          <div key={t} className="rounded-lg border border-primary/10 p-3 bg-bg">
            <div className="w-6 h-6 rounded-md bg-highlight/20 mb-2" />
            <p className="text-xs font-medium text-primary">{t}</p>
            <p className="text-[10px] text-text/50 mt-0.5 font-mono">
              auto-adapts
            </p>
          </div>
        ))}
      </div>

      {/* Stat strip — column below 640px, row above */}
      <div className="flex flex-col @min-[640px]:flex-row gap-3 @min-[640px]:gap-6 mt-6 pt-4 border-t border-primary/10">
        {stats.map(([v, l]) => (
          <div key={l} className="flex-1">
            <p className="text-lg @min-[768px]:text-xl font-semibold text-primary">
              {v}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-text/50 font-mono">
              {l}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
