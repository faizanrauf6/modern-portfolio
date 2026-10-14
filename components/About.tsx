'use client';

import { motion } from 'motion/react';
import portfolioData from '@/data/portfolio.json';

export default function About() {
  const { profile } = portfolioData;

  const facts = profile.stats;

  return (
    <section
      id="about"
      className="px-6 py-8 lg:px-24 bg-bg border-b border-primary/10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-12 lg:gap-x-16 gap-y-8">
        {/* Left: label + statement */}
        <div className="lg:col-span-5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-text/50 block mb-4">
            About
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug text-primary"
          >
            {profile.tagline}
            <span className="text-accent">.</span>
          </motion.h2>

          <div className="mt-8 flex flex-wrap gap-2">
            {profile.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full border border-primary/15 text-[11px] font-mono text-text/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Right: summary + facts */}
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-text/70 leading-relaxed font-sans"
          >
            {profile.summary}
          </motion.p>

        </div>

        <div className="lg:col-span-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pt-6 border-t border-primary/10">
            {facts.map((f, idx) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <p className="text-2xl md:text-3xl font-semibold tracking-tight text-primary">
                  {f.value}
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-text/50 mt-1 font-mono">
                  {f.label}
                </p>
                <p className="text-xs text-text/50 mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
