'use client';

import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft, CheckCircle2, ExternalLink, X,
  Activity, Code2, Rocket, Layers, Building2, Globe, FileText, Palette,
} from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import OpenSource from '@/components/OpenSource';
import NpmPackages from '@/components/NpmPackages';

// A curated set of distinct, high-end gradient + icon themes.
// Cycled by card index so every project gets its own attractive, non-repeating look
// (no real screenshots exist yet, so this generated visual doubles as the card's placeholder art).
const CARD_THEMES = [
  { gradient: 'from-blue-500/10 via-sky-500/5 to-cyan-500/10 border-blue-500/20 text-blue-500', icon: Activity },
  { gradient: 'from-purple-500/10 via-fuchsia-500/5 to-pink-500/10 border-purple-500/20 text-purple-500', icon: Code2 },
  { gradient: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/20 text-emerald-500', icon: Rocket },
  { gradient: 'from-amber-500/10 via-orange-500/5 to-yellow-500/10 border-amber-500/20 text-amber-500', icon: Layers },
  { gradient: 'from-indigo-500/10 via-violet-500/5 to-purple-500/10 border-indigo-500/20 text-indigo-500', icon: Building2 },
  { gradient: 'from-rose-500/10 via-red-500/5 to-orange-500/10 border-rose-500/20 text-rose-500', icon: Globe },
  { gradient: 'from-cyan-500/10 via-sky-500/5 to-blue-500/10 border-cyan-500/20 text-cyan-500', icon: FileText },
  { gradient: 'from-fuchsia-500/10 via-pink-500/5 to-rose-500/10 border-fuchsia-500/20 text-fuchsia-500', icon: Palette },
];

const getCardTheme = (idx: number) => CARD_THEMES[idx % CARD_THEMES.length];

export default function ProjectsPage() {
  const { projects } = portfolioData;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const selectedProject = selectedIdx !== null ? projects[selectedIdx] : null;

  return (
    <main className="min-h-screen bg-zinc-50/50 pt-28 pb-20 px-6 lg:px-24 relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors mb-12 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Page Title */}
        <div className="mb-16">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-primary/5 px-3 py-1 rounded-full border border-primary/5">
            Case Studies
          </span>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mt-4">
            Selected <br />
            <span className="text-accent">Projects.</span>
          </h1>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => {
            const theme = getCardTheme(idx);
            const ThemeIcon = theme.icon;

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedIdx(idx)}
                className="group bg-white border border-primary/5 hover:border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Generated Placeholder Artwork (no live screenshots yet) */}
                  <div className="aspect-[16/10] relative bg-zinc-100 overflow-hidden border-b border-zinc-100">
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} flex flex-col justify-center items-center p-6 text-center select-none group-hover:scale-105 transition-transform duration-500`}>
                      <ThemeIcon className="w-10 h-10 mb-2 opacity-80" />
                      <span className="font-mono text-[9px] uppercase tracking-widest opacity-60 mb-1">{project.category}</span>
                      <h4 className="text-xl font-bold tracking-tight text-zinc-800">{project.title}</h4>
                      <span className="mt-3 text-[10px] font-mono border border-current px-2.5 py-0.5 rounded-full">{project.impact}</span>
                    </div>
                  </div>

                  {/* Text Contents */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                          {project.category}
                        </span>
                        <h3 className="text-xl font-semibold text-primary group-hover:text-highlight transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      <span className="px-2.5 py-0.5 bg-primary/5 border border-primary/5 text-[9px] font-mono text-zinc-600 rounded-full font-medium">
                        {project.impact}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[9px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 border border-zinc-100 rounded">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[9px] font-mono text-zinc-400 bg-zinc-50 px-2 py-0.5 border border-zinc-100 rounded">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Published npm packages */}
        <NpmPackages />

        {/* Open-source repositories */}
        <OpenSource />

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 w-full max-w-4xl max-h-[85vh] flex flex-col relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedIdx(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="overflow-y-auto custom-scrollbar flex-1">
                  {/* Header Artwork */}
                  <div className="aspect-[21/9] relative w-full bg-zinc-100 border-b border-zinc-100">
                    {(() => {
                      const theme = getCardTheme(selectedIdx ?? 0);
                      const ThemeIcon = theme.icon;
                      return (
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} flex flex-col justify-center items-center p-6 text-center select-none`}>
                          <ThemeIcon className="w-12 h-12 mb-2 opacity-80" />
                          <span className="font-mono text-xs uppercase tracking-widest opacity-60">{selectedProject.category}</span>
                          <h2 className="text-3xl font-bold tracking-tight text-zinc-800 mt-1">{selectedProject.title}</h2>
                          <span className="mt-3 text-[10px] font-mono border border-current px-2.5 py-0.5 rounded-full">{selectedProject.impact}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="p-6 md:p-10 space-y-8">
                    {/* Intro info */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Project Overview</span>
                        <h3 className="text-2xl font-bold mt-1 text-primary">{selectedProject.title}</h3>
                      </div>
                      
                      {selectedProject.link && (
                        <a 
                          href={selectedProject.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-bg rounded-full text-xs font-semibold hover:shadow-lg transition-all"
                        >
                          {selectedProject.linkType === 'repository' ? 'View Repository' : 'Visit Live Site'}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Long details */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 border-t border-zinc-100">
                      <div className="md:col-span-8 space-y-6">
                        <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                          {selectedProject.longDescription}
                        </p>

                        <div>
                          <h4 className="text-sm font-mono uppercase tracking-widest text-zinc-400 mb-4">Key Features</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedProject.features.map((feature: string) => (
                              <li key={feature} className="text-xs md:text-sm text-zinc-600 flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-highlight shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="md:col-span-4 space-y-6">
                        <div>
                          <h4 className="text-sm font-mono uppercase tracking-widest text-zinc-400 mb-3">Impact Metrics</h4>
                          <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                            <span className="text-xs text-zinc-400 block font-mono">Delivered Outcome</span>
                            <span className="text-2xl font-bold text-primary block mt-1">{selectedProject.impact}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-mono uppercase tracking-widest text-zinc-400 mb-3">Technologies Used</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.tags.map((tag: string) => (
                              <span key={tag} className="text-[10px] font-mono text-zinc-600 bg-zinc-50 px-3 py-1 border border-zinc-150 rounded-lg">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
