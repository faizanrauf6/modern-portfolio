'use client';

import { motion } from 'motion/react';
import {
  ArrowUpRight,
  GitBranch,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Boxes,
  Terminal,
  Network,
  ArrowDown,
} from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import { NpmSquareLogo, NpmWordLogo } from '@/components/icons/NpmLogo';

const NPM_RED = '#CB3837';

const ROLE_ICONS: Record<string, typeof Boxes> = {
  Engine: Boxes,
  'Express adapter': Network,
  'NestJS adapter': Network,
  CLI: Terminal,
};

export default function NpmPackages() {
  const npmPackages = portfolioData.npmPackages as {
    name: string; tagline: string; repo: string; problem: string; solution: string;
    packages: {
      name: string; role: string; version: string; npmUrl: string;
      description: string; features: string[];
    }[];
  };
  if (npmPackages.packages.length === 0) return null;
  const core = npmPackages.packages.find((p) => p.role === 'Engine');
  const dependents = npmPackages.packages.filter((p) => p.role !== 'Engine');

  return (
    <section id="npm-packages" className="mt-24 pt-16 border-t border-primary/10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shrink-0 shadow-sm">
            <NpmSquareLogo className="w-full h-full" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text/50 block mb-1.5">
              Published to npm
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary font-mono">
              {npmPackages.name}
              <span style={{ color: NPM_RED }}>.</span>
            </h2>
          </div>
        </div>
        <div className="md:text-right">
          <p className="max-w-md text-sm text-text/60 leading-relaxed font-sans">
            {npmPackages.tagline}
          </p>
          <a
            href={npmPackages.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-xs font-mono uppercase tracking-widest text-primary hover:gap-3 transition-all"
          >
            <GitBranch className="w-3.5 h-3.5" />
            View monorepo
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <p className="text-[10px] font-mono text-text/40 mt-2">
            {npmPackages.packages.length} published packages · MIT licensed
          </p>
        </div>
      </div>

      {/* Problem / Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-primary/10 bg-bg p-6 md:p-7"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-mono uppercase tracking-widest text-text/60">The problem</h3>
          </div>
          <p className="text-sm md:text-[15px] text-text/70 leading-relaxed">{npmPackages.problem}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="rounded-2xl border p-6 md:p-7"
          style={{ borderColor: `${NPM_RED}33`, backgroundColor: `${NPM_RED}08` }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${NPM_RED}1A`, color: NPM_RED }}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-mono uppercase tracking-widest text-text/60">The solution</h3>
          </div>
          <p className="text-sm md:text-[15px] text-text/70 leading-relaxed">{npmPackages.solution}</p>
        </motion.div>
      </div>

      {/* Core package — the hub everything else builds on */}
      {core && (
        <motion.a
          href={core.npmUrl}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="group block rounded-2xl border p-6 md:p-8 mb-3 transition-all hover:shadow-lg relative overflow-hidden"
          style={{ borderColor: `${NPM_RED}40`, background: `linear-gradient(135deg, ${NPM_RED}0D, transparent 60%)` }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{ backgroundColor: NPM_RED }}
              >
                <Boxes className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[9px] font-mono uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${NPM_RED}1A`, color: NPM_RED }}
                  >
                    Core engine
                  </span>
                  <span className="text-[10px] font-mono text-text/40">v{core.version}</span>
                </div>
                <h3 className="text-xl font-semibold text-primary font-mono mb-1.5">{core.name}</h3>
                <p className="text-sm text-text/60 leading-relaxed max-w-xl">{core.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <code className="hidden lg:block text-[11px] font-mono text-text/50 bg-primary/[0.04] border border-primary/10 rounded-lg px-3 py-2">
                npm install {core.name}
              </code>
              <span
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-white text-xs font-semibold group-hover:gap-2.5 transition-all shrink-0"
                style={{ backgroundColor: NPM_RED }}
              >
                View on npm
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-6 pt-6 border-t border-primary/10">
            {core.features.map((f) => (
              <li key={f} className="text-xs text-text/60 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: NPM_RED }} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </motion.a>
      )}

      {/* Connector */}
      <div className="flex items-center justify-center gap-2 py-3 text-text/25">
        <ArrowDown className="w-4 h-4" />
        <span className="text-[10px] font-mono uppercase tracking-widest">built on @restmcp/core</span>
        <ArrowDown className="w-4 h-4" />
      </div>

      {/* Dependent packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {dependents.map((pkg, idx) => {
          const RoleIcon = ROLE_ICONS[pkg.role] ?? Boxes;
          return (
            <motion.a
              key={pkg.name}
              href={pkg.npmUrl}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group flex flex-col rounded-2xl border border-primary/10 hover:border-[#CB3837]/40 p-6 bg-bg shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/[0.04] border border-primary/10">
                    <RoleIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-text/40 block">
                      {pkg.role}
                    </span>
                    <h3 className="text-sm font-semibold text-primary font-mono">{pkg.name}</h3>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-text/30 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              <p className="text-sm text-text/60 leading-relaxed mb-4">{pkg.description}</p>

              <ul className="space-y-1.5 mb-5">
                {pkg.features.slice(0, 3).map((f) => (
                  <li key={f} className="text-xs text-text/50 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: NPM_RED }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4 border-t border-primary/10 space-y-2.5">
                <code className="block text-[10px] font-mono text-text/50 bg-primary/[0.04] border border-primary/10 rounded-lg px-2.5 py-1.5 truncate">
                  npm i {pkg.name}
                </code>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-primary/10 text-[10px] font-mono text-text/50">
                    v{pkg.version}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold"
                    style={{ color: NPM_RED }}
                  >
                    <NpmWordLogo className="w-5 h-5 shrink-0" />
                    View package
                  </span>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
