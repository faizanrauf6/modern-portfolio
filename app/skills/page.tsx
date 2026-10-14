'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, Code2, Database, Network, Terminal, Sparkles, Zap, Cpu } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

export default function SkillsBentoPage() {
  const { skills } = portfolioData;

  // Helper to get skills by category
  const getSkills = (categoryStr: string) => {
    const found = skills.find((s) => s.category.includes(categoryStr));
    return found ? found.items : [];
  };

  const frontendSkills = getSkills('Frontend & Frameworks');
  const databaseSkills = getSkills('Databases');
  const architectureSkills = getSkills('Solution Architecture');
  const backendSkills = getSkills('Backend & APIs');
  const aiMlSkills = getSkills('AI/ML & Data');
  const toolsSkills = getSkills('Tooling & DevOps');

  return (
    <main className="min-h-screen bg-zinc-50/50 pt-28 pb-20 px-6 lg:px-24 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(52,211,153,0.05),transparent)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors mb-12 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Page Title */}
        <div className="mb-12 md:mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-white px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm mb-4"
          >
            <Sparkles className="w-3 h-3 text-highlight" />
            Technical Arsenal
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight"
          >
            Tools & <span className="text-zinc-400 italic font-serif">Technologies.</span>
          </motion.h1>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[minmax(280px,auto)] gap-6">
          
          {/* 1. Frontend & Frameworks (Spans 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-110 transform origin-top-right">
              <Code2 className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary text-bg rounded-xl shadow-sm">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">Frontend & Frameworks</h3>
              </div>
              
              <p className="text-sm text-zinc-500 mb-8 max-w-md leading-relaxed">
                Building web interfaces with Next.js, React, TypeScript, and modern UI libraries.
              </p>

              <div className="mt-auto flex flex-wrap gap-2.5">
                {frontendSkills.map((skill) => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-zinc-50 border border-zinc-200 text-sm font-medium text-zinc-700 rounded-xl hover:bg-white hover:border-highlight/30 hover:text-primary transition-colors cursor-default shadow-sm"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 2. Databases (Spans 1 col) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1 bg-zinc-950 rounded-3xl p-8 border border-zinc-800 shadow-xl relative overflow-hidden group text-white flex flex-col"
          >
            {/* Glowing background blob */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-highlight/20 rounded-full blur-3xl group-hover:bg-highlight/30 transition-colors duration-500" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-zinc-800 rounded-xl border border-zinc-700">
                  <Database className="w-5 h-5 text-highlight" />
                </div>
                <h3 className="text-xl font-bold">Databases</h3>
              </div>

              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                Working with relational, document, and in-memory data stores.
              </p>

              <div className="mt-auto flex flex-wrap gap-2">
                {databaseSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 3. Backend & APIs (Spans 1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 shadow-sm relative overflow-hidden group flex flex-col"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.4)_1px,transparent_1px)] bg-[size:16px_16px]" />

            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-indigo-100">
                  <Network className="w-4 h-4 text-indigo-500" />
                </div>
                <h3 className="text-lg font-bold text-indigo-950">Backend & APIs</h3>
              </div>

              <div className="flex-1 flex flex-col justify-center gap-3">
                {backendSkills.map((skill, idx) => (
                  <motion.div
                    key={skill}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span className="text-sm font-medium text-indigo-900/80">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 4. AI/ML & Data (Spans 1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="col-span-1 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100 shadow-sm relative overflow-hidden group flex flex-col"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.4)_1px,transparent_1px)] bg-[size:16px_16px]" />

            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-emerald-100">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950">AI/ML & Data</h3>
              </div>

              <div className="flex-1 flex flex-col justify-center gap-3">
                {aiMlSkills.map((skill, idx) => (
                  <motion.div
                    key={skill}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.55 + (idx * 0.1) }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-sm font-medium text-emerald-900/80">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="col-span-1 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-zinc-100 rounded-xl">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-primary">Solution Architecture</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {architectureSkills.map((skill) => <span key={skill} className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-600">{skill}</span>)}
            </div>
          </motion.div>

          {/* 5. Tools & Testing (Spans full row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-3 bg-white rounded-3xl border border-zinc-200/60 shadow-sm relative overflow-hidden group flex flex-col md:flex-row"
          >
            <div className="p-8 md:w-1/2 bg-zinc-950 text-white flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-800 rounded-xl">
                  <Terminal className="w-5 h-5 text-zinc-200" />
                </div>
                <h3 className="text-xl font-bold text-white">Cloud &amp; DevOps</h3>
              </div>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                AWS infrastructure, containerized environments, observability, and automated delivery pipelines for dependable releases.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {toolsSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Terminal Visual */}
            <div className="md:w-1/2 bg-white p-6 md:p-8 relative flex items-center justify-center">
              <div className="w-full max-w-sm bg-zinc-50 rounded-xl border border-zinc-200 shadow-lg overflow-hidden font-mono text-[10px] md:text-xs">
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-100 border-b border-zinc-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-zinc-600 text-[10px]">Example CI output</span>
                </div>
                <div className="p-4 text-zinc-700 space-y-2">
                  <div className="flex gap-2">
                    <span className="text-emerald-700">➜</span>
                    <span className="text-blue-600">{portfolioData.profile.displayName.toLowerCase()}</span>
                    <span>npm test</span>
                  </div>
                  <div className="text-zinc-600 pl-4">PASS src/components/Hero.test.tsx</div>
                  <div className="text-zinc-600 pl-4">PASS src/hooks/useTheme.test.ts</div>
                  <div className="flex gap-2 pl-4 pt-2">
                    <span className="text-emerald-700 font-bold">Test Suites:</span>
                    <span>Example: all suites passed</span>
                  </div>
                  <div className="flex gap-2 pl-4 animate-pulse">
                    <span className="text-emerald-700 font-bold">Tests:</span>
                    <span>Example: all tests passed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </main>
  );
}
