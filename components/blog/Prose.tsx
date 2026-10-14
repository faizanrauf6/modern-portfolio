'use client';

import { useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Lightbulb, AlertTriangle, Sparkles, Copy, Check } from 'lucide-react';
import { Highlight } from 'prism-react-renderer';
import { monokaiPro, inferLanguage } from './codeTheme';

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="text-2xl md:text-3xl font-semibold tracking-tight text-primary mt-14 md:mt-20 mb-5 scroll-mt-28">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-lg md:text-xl font-semibold text-primary mt-8 mb-3">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-base md:text-[17px] text-text/75 leading-relaxed md:leading-[1.8] mb-5">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="space-y-2.5 mb-6 ml-1">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="text-base md:text-[17px] text-text/75 leading-relaxed flex gap-3">
      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-highlight shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-primary/[0.06] text-primary font-mono text-[0.85em] border border-primary/10">
      {children}
    </code>
  );
}

export function Pre({
  children,
  filename,
  language,
}: {
  children: string;
  filename?: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  const code = children.replace(/\n$/, '');
  const lang = language ?? inferLanguage(filename);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail silently.
    }
  };

  return (
    <div
      className="not-prose rounded-2xl overflow-hidden border border-black/40 my-7 shadow-sm"
      style={{ backgroundColor: monokaiPro.plain.backgroundColor }}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] block" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] block" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] block" />
        {filename && (
          <span className="ml-2.5 text-zinc-400 text-[10px] font-mono truncate">{filename}</span>
        )}
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      <Highlight theme={monokaiPro} code={code} language={lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-4 md:p-5 overflow-x-auto text-[11px] md:text-[13px] leading-relaxed font-mono`}
            style={style}
          >
            {tokens.map((line, i) => {
              const { className: lineClassName, ...lineProps } = getLineProps({ line });
              return (
                <div key={i} className={`${lineClassName} table-row`} {...lineProps}>
                  <span className="table-cell pr-4 text-right select-none opacity-30 w-[1%]">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, key) => {
                      const { className: tokenClassName, ...tokenProps } = getTokenProps({ token });
                      return <span key={key} className={tokenClassName} {...tokenProps} />;
                    })}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

const CALLOUT_STYLES = {
  idea: { icon: Lightbulb, label: 'Key idea', cls: 'border-highlight/25 bg-highlight/[0.06]', iconCls: 'text-highlight' },
  warning: { icon: AlertTriangle, label: 'Common mistake', cls: 'border-amber-500/25 bg-amber-500/[0.06]', iconCls: 'text-amber-600' },
  tip: { icon: Sparkles, label: 'In practice', cls: 'border-blue-500/25 bg-blue-500/[0.06]', iconCls: 'text-blue-600' },
} as const;

export function Callout({
  type = 'idea',
  title,
  children,
}: {
  type?: keyof typeof CALLOUT_STYLES;
  title?: string;
  children: ReactNode;
}) {
  const style = CALLOUT_STYLES[type];
  const Icon = style.icon;
  return (
    <div className={`not-prose rounded-2xl border px-5 py-4 md:px-6 md:py-5 my-7 ${style.cls}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${style.iconCls}`} />
        <span className={`text-[10px] font-mono uppercase tracking-widest font-semibold ${style.iconCls}`}>
          {title ?? style.label}
        </span>
      </div>
      <div className="text-sm md:text-base text-text/75 leading-relaxed">{children}</div>
    </div>
  );
}

export function StatRow({ stats }: { stats: { icon: LucideIcon; label: string; value: string }[] }) {
  return (
    <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 my-8">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="rounded-xl border border-primary/10 bg-zinc-50/60 p-4">
            <Icon className="w-4 h-4 text-highlight mb-2" />
            <p className="text-sm md:text-base font-semibold text-primary leading-snug">{s.value}</p>
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-wider text-text/40 mt-1">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export function CompareGrid({
  left,
  right,
}: {
  left: { title: string; icon: LucideIcon; points: string[] };
  right: { title: string; icon: LucideIcon; points: string[] };
}) {
  const LeftIcon = left.icon;
  const RightIcon = right.icon;
  return (
    <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      {[{ ...left, Icon: LeftIcon }, { ...right, Icon: RightIcon }].map((col) => (
        <div key={col.title} className="rounded-2xl border border-primary/10 p-5 md:p-6 bg-bg">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-lg bg-primary/5 text-primary">
              <col.Icon className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-primary">{col.title}</h4>
          </div>
          <ul className="space-y-2">
            {col.points.map((p) => (
              <li key={p} className="text-sm text-text/70 leading-relaxed flex gap-2.5">
                <span className="mt-2 w-1 h-1 rounded-full bg-text/30 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
