'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Wand2, ArrowRight } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import { fonts } from '@/components/ThemeProvider';

type TokenKey = 'primary' | 'accent' | 'highlight' | 'background' | 'text';

const TOKENS: { key: TokenKey; label: string; cssVar: string }[] = [
  { key: 'primary', label: 'Primary', cssVar: '--primary' },
  { key: 'accent', label: 'Accent', cssVar: '--accent' },
  { key: 'highlight', label: 'Highlight', cssVar: '--highlight' },
  { key: 'background', label: 'Background', cssVar: '--background' },
  { key: 'text', label: 'Text', cssVar: '--text' },
];

const DEFAULTS = portfolioData.theme as Record<TokenKey, string>;

export default function ThemeBuilder() {
  const [colors, setColors] = useState<Record<TokenKey, string>>({
    primary: DEFAULTS.primary,
    accent: DEFAULTS.accent,
    highlight: DEFAULTS.highlight,
    background: DEFAULTS.background,
    text: DEFAULTS.text,
  });
  const [fontName, setFontName] = useState(fonts[0].name);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const activeFont = fonts.find((f) => f.name === fontName) ?? fonts[0];

  // Local CSS-variable overrides — scoped to the preview only.
  const previewStyle = useMemo(
    () =>
      ({
        '--primary': colors.primary,
        '--accent': colors.accent,
        '--highlight': colors.highlight,
        '--background': colors.background,
        '--text': colors.text,
        '--font-main': `var(${activeFont.variable})`,
      }) as React.CSSProperties,
    [colors, activeFont],
  );

  const setToken = (key: TokenKey, value: string) => {
    setColors((c) => ({ ...c, [key]: value }));
    setApplied(false);
  };

  const reset = () => {
    setColors({ ...DEFAULTS });
    setFontName(fonts[0].name);
    setApplied(false);
  };

  const exportJson = JSON.stringify(
    {
      primary: colors.primary,
      accent: colors.accent,
      highlight: colors.highlight,
      background: colors.background,
      text: colors.text,
    },
    null,
    2,
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  // Push the tokens onto the real page (same mechanism as the theme switcher).
  const applyToSite = () => {
    const root = document.documentElement;
    TOKENS.forEach((t) => root.style.setProperty(t.cssVar, colors[t.key]));
    root.style.setProperty('--font-main', `var(${activeFont.variable})`);
    setApplied(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              {TOKENS.map((t) => (
                <div
                  key={t.key}
                  className="flex items-center gap-3 rounded-xl border border-primary/10 p-3"
                >
                  <label
                    className="relative w-9 h-9 rounded-lg overflow-hidden border border-primary/15 shrink-0 cursor-pointer"
                    style={{ backgroundColor: colors[t.key] }}
                  >
                    <input
                      type="color"
                      value={colors[t.key]}
                      onChange={(e) => setToken(t.key, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      aria-label={`${t.label} color`}
                    />
                  </label>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary">{t.label}</p>
                    <p className="text-[10px] font-mono text-text/40 truncate">
                      {t.cssVar}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={colors[t.key]}
                    onChange={(e) => setToken(t.key, e.target.value)}
                    spellCheck={false}
                    className="w-24 bg-transparent text-right text-xs font-mono text-text/70 focus:outline-none focus:text-primary uppercase"
                  />
                </div>
              ))}
            </div>

            {/* Font */}
            <div className="rounded-xl border border-primary/10 p-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-text/50 mb-3">
                Font · --font-main
              </p>
              <div className="flex flex-wrap gap-2">
                {fonts.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => {
                      setFontName(f.name);
                      setApplied(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                      fontName === f.name
                        ? 'bg-primary text-bg border-primary'
                        : 'border-primary/15 text-text/60 hover:text-primary hover:border-primary/30'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={applyToSite}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-bg text-xs font-medium hover:opacity-90 transition-opacity"
              >
                {applied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5" />
                )}
                {applied ? 'Applied to site' : 'Apply to whole site'}
              </button>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary/15 text-text/70 text-xs font-medium hover:text-primary hover:border-primary/30 transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? 'Copied JSON' : 'Copy JSON'}
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary/15 text-text/70 text-xs font-medium hover:text-primary hover:border-primary/30 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
            <p className="text-[10px] font-mono text-text/40">
              Tip: picking a swatch in the bottom theme switcher resets a
              site-wide apply.
            </p>
          </div>

          {/* Live preview — CSS vars scoped to this box */}
          <div className="lg:col-span-7">
            <div
              style={previewStyle}
              className="rounded-2xl border border-primary/15 bg-bg text-text overflow-hidden shadow-sm h-full"
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-primary/10 bg-primary/[0.03]">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/20 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/20 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/20 block" />
                </span>
                <span className="mx-auto text-[10px] font-mono text-text/40">
                  live preview
                </span>
              </div>

              <div className="p-6 md:p-8 font-sans">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
                  {portfolioData.profile.title}
                </span>
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary mt-2 leading-tight">
                  {portfolioData.profile.displayName}{' '}
                  <span className="text-accent">
                    {portfolioData.profile.lastName}
                  </span>
                </h3>
                <p className="text-sm text-text/60 mt-3 max-w-sm leading-relaxed">
                  {portfolioData.profile.tagline}.
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-bg text-xs font-medium">
                    Get in touch
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="px-4 py-2 rounded-full border border-primary/20 text-primary text-xs font-medium">
                    Download Resume
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-primary/10">
                  {portfolioData.profile.impactStats.slice(0, 3).map((stat) => (
                    <div key={stat.label}>
                      <p className="text-xl font-semibold text-primary">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-widest text-text/50 font-mono mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <span className="w-3 h-3 rounded-full bg-primary block" />
                  <span className="w-3 h-3 rounded-full bg-accent block" />
                  <span className="w-3 h-3 rounded-full bg-highlight block" />
                  <span className="text-[10px] font-mono text-text/40 ml-1">
                    primary · accent · highlight
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
