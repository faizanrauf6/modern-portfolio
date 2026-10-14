'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, Play } from 'lucide-react';

type Spring = { stiffness: number; damping: number; mass: number };

const PRESETS: { name: string; value: Spring }[] = [
  { name: 'Gentle', value: { stiffness: 120, damping: 18, mass: 1 } },
  { name: 'Snappy', value: { stiffness: 300, damping: 24, mass: 1 } },
  { name: 'Bouncy', value: { stiffness: 400, damping: 10, mass: 1 } },
  { name: 'Stiff', value: { stiffness: 500, damping: 40, mass: 1.4 } },
];

const SLIDERS: { key: keyof Spring; min: number; max: number; step: number }[] = [
  { key: 'stiffness', min: 20, max: 500, step: 10 },
  { key: 'damping', min: 2, max: 60, step: 1 },
  { key: 'mass', min: 0.2, max: 3, step: 0.1 },
];

export default function AnimationLab() {
  const [spring, setSpring] = useState<Spring>(PRESETS[1].value);
  const [toggled, setToggled] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof Spring, value: number) =>
    setSpring((s) => ({ ...s, [key]: value }));

  const activePreset = PRESETS.find(
    (p) =>
      p.value.stiffness === spring.stiffness &&
      p.value.damping === spring.damping &&
      p.value.mass === spring.mass,
  )?.name;

  const code = `transition={{
  type: "spring",
  stiffness: ${spring.stiffness},
  damping: ${spring.damping},
  mass: ${Number(spring.mass.toFixed(1))},
}}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setSpring(p.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                activePreset === p.name
                  ? 'bg-primary text-bg border-primary'
                  : 'border-primary/15 text-text/60 hover:text-primary hover:border-primary/30'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="space-y-4 rounded-xl border border-primary/10 p-4">
          {SLIDERS.map(({ key, min, max, step }) => (
            <label key={key} className="block">
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs font-medium text-primary capitalize">
                  {key}
                </span>
                <span className="text-xs font-mono text-text/50 tabular-nums">
                  {key === 'mass' ? spring[key].toFixed(1) : spring[key]}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={spring[key]}
                onChange={(e) => set(key, Number(e.target.value))}
                className="w-full accent-[color:var(--primary)] cursor-pointer"
              />
            </label>
          ))}
        </div>

        <div className="rounded-xl border border-primary/10 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-primary/10 bg-primary/[0.03]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-text/50">
              Framer Motion
            </span>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono text-text/60 hover:text-primary transition-colors"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 text-[11px] leading-relaxed font-mono text-text/70 overflow-x-auto custom-scrollbar">
            {code}
          </pre>
        </div>
      </div>

      {/* Stage */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-primary/15 bg-bg overflow-hidden shadow-sm h-full flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-primary/10 bg-primary/[0.03]">
            <span className="text-[10px] font-mono text-text/40">stage</span>
            <button
              onClick={() => setToggled((t) => !t)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-bg px-3 py-1 text-[11px] font-medium hover:opacity-90 transition-opacity"
            >
              <Play className="w-3 h-3" />
              Play
            </button>
          </div>

          <div className="flex-1 p-8 flex flex-col justify-center gap-10">
            <div
              className={`relative h-14 rounded-full bg-primary/[0.05] border border-primary/10 flex items-center px-2 ${
                toggled ? 'justify-end' : 'justify-start'
              }`}
            >
              <motion.div
                layout
                className="w-10 h-10 rounded-xl bg-primary shadow-lg"
                animate={{ rotate: toggled ? 180 : 0 }}
                transition={{ type: 'spring', ...spring }}
              />
            </div>

            <div className="flex items-end gap-2 h-24">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-md bg-highlight/70"
                  animate={{ height: toggled ? `${30 + i * 16}%` : '20%' }}
                  transition={{ type: 'spring', ...spring, delay: i * 0.04 }}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <motion.div
                className="px-5 py-2.5 rounded-full bg-accent/15 border border-accent/30 text-primary text-xs font-medium"
                animate={{ scale: toggled ? 1.15 : 1 }}
                transition={{ type: 'spring', ...spring }}
              >
                {toggled ? 'Animated' : 'Idle'}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
