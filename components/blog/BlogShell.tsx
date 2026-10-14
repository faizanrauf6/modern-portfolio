'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';

export type BlogNavEntry = {
  href: string;
  title: string;
  icon: LucideIcon;
};

export default function BlogShell({
  category,
  icon: Icon,
  title,
  subtitle,
  readTime,
  accent = 'text-highlight',
  author,
  more,
  children,
}: {
  category: string;
  icon: LucideIcon;
  title: ReactNode;
  subtitle: string;
  readTime: string;
  accent?: string;
  /** Omit for articles inherited from the original portfolio template. */
  author?: string;
  more: BlogNavEntry[];
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg pt-28 pb-24 px-6 lg:px-24 relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors mb-10 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          All Writing
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest ${accent} bg-primary/5 px-3 py-1 rounded-full border border-primary/5`}>
              <Icon className="w-3 h-3" />
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-text/40">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.02] mb-5 text-primary">
            {title}
          </h1>

          <p className="text-base md:text-lg text-text/60 leading-relaxed max-w-xl">{subtitle}</p>
          <p className="text-xs text-text/50 mt-4">
            {author ? <>By {author}.</> : <>
              From the original portfolio template by{' '}
              <a href="https://github.com/MuddusarZulfiqar" target="_blank" rel="noreferrer" className="underline">Muddusar Zulfiqar</a>.
            </>}
          </p>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-14 md:mt-16"
        >
          {children}
        </motion.article>

        {/* More from the series */}
        <div className="mt-20 pt-10 border-t border-primary/10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text/40 block mb-5">
            Keep reading
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {more.map((entry) => {
              const EntryIcon = entry.icon;
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-primary/10 px-4 py-3.5 hover:border-highlight/40 hover:bg-primary/[0.02] transition-all"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <EntryIcon className="w-4 h-4 text-text/40 shrink-0" />
                    <span className="text-sm text-text/80 truncate">{entry.title}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text/30 group-hover:text-highlight group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
