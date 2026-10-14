'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Github, Linkedin, ArrowRight, Code2, TrendingUp, Layers } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import ResumeModal from '@/components/ResumeModal';

export default function Hero() {
  const { profile } = portfolioData;
  const [activeTab, setActiveTab] = useState<'code' | 'metrics' | 'stack'>('code');

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 py-20 lg:px-24 overflow-hidden border-b border-zinc-100/50">
      {/* Dotted Grid Background */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_-20%,#000_70%,transparent_100%)]" />
      
      {/* Ambient Lighting Blobs */}
      <div className="absolute top-1/4 left-1/12 -z-10 w-72 h-72 rounded-full bg-accent/8 blur-[100px] animate-pulse" />
      <div className="absolute top-1/3 right-1/12 -z-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10">
        
        {/* Left Column (Primary Copy) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-highlight opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-highlight"></span>
            </span>
            <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-zinc-500">
              Full Stack · AI/ML · DevOps
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight leading-[0.95] md:leading-[0.9] mb-8 font-sans">
              {profile.displayName} <br />
              <span className="text-accent hover:text-primary transition-colors duration-300 relative inline-block group">
                {profile.lastName}
                <span className="absolute bottom-1 left-0 w-0 h-1 bg-highlight group-hover:w-full transition-all duration-300" />
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl"
          >
            <p className="text-lg lg:text-xl text-zinc-600 leading-relaxed mb-10 font-sans">
              {profile.title} with <span className="text-primary font-semibold border-b-2 border-highlight/40 pb-0.5">{profile.yearsOfExp} years</span> of experience across e-commerce, healthcare, blockchain, and real-time systems.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href={`mailto:${profile.email}`}
                className="group relative flex items-center gap-2 px-7 py-3.5 bg-primary text-bg rounded-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-sm md:text-base font-medium"
              >
                Get in touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              <ResumeModal />

              <div className="flex items-center gap-3">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="p-3.5 border border-zinc-200 rounded-full hover:bg-zinc-50 hover:border-zinc-300 hover:text-primary transition-all duration-300 flex items-center justify-center text-zinc-600 shadow-sm"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="p-3.5 border border-zinc-200 rounded-full hover:bg-zinc-50 hover:border-zinc-300 hover:text-primary transition-all duration-300 flex items-center justify-center text-zinc-600 shadow-sm"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Interactive Engineering Dashboard) */}
        <div className="lg:col-span-5 w-full flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full bg-white/80 backdrop-blur-md border border-primary/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-lg aspect-[4/3] md:aspect-[1.25]"
          >
            {/* Window Titlebar */}
            <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 bg-primary/[0.02] border-b border-primary/10 gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ff5f56] block" />
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ffbd2e] block" />
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#27c93f] block" />
              </div>
              
              <div className="flex bg-primary/5 border border-primary/10 rounded-lg p-0.5 text-[10px] md:text-xs font-mono overflow-x-auto no-scrollbar min-w-0">
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${activeTab === 'code' ? 'bg-white shadow-sm text-primary font-medium' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  <Code2 className="w-3 h-3 text-blue-500" />
                  profile.json
                </button>
                <button 
                  onClick={() => setActiveTab('metrics')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${activeTab === 'metrics' ? 'bg-white shadow-sm text-primary font-medium' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  evaluation.json
                </button>
                <button 
                  onClick={() => setActiveTab('stack')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${activeTab === 'stack' ? 'bg-white shadow-sm text-primary font-medium' : 'text-zinc-500 hover:text-zinc-800'}`}
                >
                  <Layers className="w-3 h-3 text-purple-500" />
                  stack.json
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto font-mono text-[11px] sm:text-xs leading-relaxed bg-zinc-950 text-zinc-300 custom-scrollbar relative select-none">
              <AnimatePresence mode="wait">
                {activeTab === 'code' && (
                  <motion.div key="code-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full overflow-auto custom-scrollbar">
                    <pre className="text-emerald-300 whitespace-pre-wrap break-words leading-relaxed">{JSON.stringify({
                      name: profile.name,
                      role: 'Senior Software Engineer',
                      company: 'PureLogics',
                      focus: ['Full Stack', 'AI/ML', 'DevOps'],
                      stack: profile.stack.slice(0, 6),
                      location: profile.location,
                    }, null, 2)}</pre>
                  </motion.div>
                )}
                {activeTab === 'metrics' && (
                  <motion.div key="metrics-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full overflow-auto custom-scrollbar space-y-3">
                    <p className="text-[10px] text-zinc-400">WebShield AI · offline temporal evaluation · 36,910 URLs</p>
                    {[
                      { label: 'F1 score', value: '72.87%' },
                      { label: 'Precision', value: '96.84%' },
                      { label: 'Recall', value: '58.41%' },
                    ].map((metric) => (
                      <div key={metric.label} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
                        <span className="text-zinc-400">{metric.label}</span>
                        <span className="text-lg font-semibold text-emerald-300">{metric.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'stack' && (
                  <motion.div key="stack-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full overflow-auto custom-scrollbar space-y-4">
                    {portfolioData.skills.map((group) => (
                      <div key={group.category}>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-2">{group.category}</span>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((tech) => (
                            <motion.span key={tech} whileHover={{ scale: 1.05, y: -2 }} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg text-[10px]">{tech}</motion.span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Stats Grid at the bottom */}
      <div className="max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-20 md:mt-28 pt-12 border-t border-primary/10 w-full"
        >
          {profile.impactStats.map((stat) => (
            <motion.div 
              key={stat.label}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="space-y-1 group"
            >
              <p className="text-3xl md:text-4xl font-semibold tracking-tight text-primary transition-colors group-hover:text-highlight">
                {stat.value}
              </p>
              <div>
                <p className="text-xs md:text-sm font-medium uppercase tracking-wider text-zinc-800">
                  {stat.label}
                </p>
                <p className="text-[10px] md:text-xs text-zinc-400">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}

