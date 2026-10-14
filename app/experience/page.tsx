'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Briefcase, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

export default function ExperiencePage() {
  const { experience } = portfolioData;

  return (
    <main className="min-h-screen bg-zinc-50/50 pt-28 pb-20 px-6 lg:px-24 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-4xl mx-auto">
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
            Employment History
          </span>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mt-4">
            Professional <br />
            <span className="text-accent">Timeline.</span>
          </h1>
        </div>

        {/* Visual Timeline */}
        <div className="relative border-l border-primary/10 ml-4 md:ml-6 pl-8 md:pl-12 space-y-16 py-4">
          {experience.map((exp, idx) => (
            <motion.div 
              key={exp.company + exp.period}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-white border border-primary/20 flex items-center justify-center shadow-sm group-hover:border-highlight transition-colors duration-300">
                <div className="w-2.5 h-2.5 rounded-full bg-primary group-hover:bg-highlight transition-colors duration-300 animate-pulse" />
              </div>

              {/* Experience Card */}
              <div className="bg-white border border-primary/5 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-primary/10 via-accent/20 to-highlight/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Card Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-zinc-100">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{exp.company}</h3>
                    <p className="text-sm font-medium text-zinc-600 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                      {exp.role}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center text-xs md:text-right font-mono">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-500 rounded-full">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <ul className="space-y-4">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-sm md:text-base text-zinc-600 leading-relaxed flex gap-3 align-text-top">
                      <span className="text-zinc-300 select-none mt-1">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
