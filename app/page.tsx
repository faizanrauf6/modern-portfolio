'use client';

import Hero from '@/components/Hero';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Briefcase, Cpu, FolderGit2, FlaskConical, BookOpen, ArrowRight } from 'lucide-react';
import AiTerminal from '@/components/AiTerminal';
import Contact from '@/components/Contact';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Credentials from '@/components/Credentials';

export default function PortfolioPage() {
  const portals = [
    {
      href: '/experience',
      title: 'Work History',
      desc: '6+ years designing distributed systems, intelligent automation, and cloud-connected platforms.',
      icon: Briefcase,
      color: 'text-blue-500 bg-blue-500/5 border-blue-500/10',
      badge: 'PureLogics · Mahir Company · NielsenIQ'
    },
    {
      href: '/skills',
      title: 'Technical Stack',
      desc: 'Solution architecture, enterprise RAG, multi-agent systems, AWS infrastructure, and full-stack engineering.',
      icon: Cpu,
      color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10',
      badge: 'Next.js · NestJS · Python'
    },
    {
      href: '/project',
      title: 'Major Project',
      desc: 'Multi-tenant integrations, blockchain wallets, healthcare data architecture, AI communication, and cloud-connected IoT.',
      icon: FolderGit2,
      color: 'text-purple-500 bg-purple-500/5 border-purple-500/10',
      badge: 'MSQuare · HelloCustom · SpeakShift'
    },
    {
      href: '/playground',
      title: 'Playground',
      desc: 'Hands-on demos: responsive layout, a themeable token system, accessibility, and live Core Web Vitals.',
      icon: FlaskConical,
      color: 'text-highlight bg-highlight/5 border-highlight/10',
      badge: 'Live demos'
    },
    {
      href: '/blog',
      title: 'How Things Work',
      desc: 'Practical guides to solution architecture, event-driven integrations, AWS reliability, RAG, and AI workflows.',
      icon: BookOpen,
      color: 'text-rose-500 bg-rose-500/5 border-rose-500/10',
      badge: 'Architecture · AI · AWS'
    }
  ];

  return (
    <main className="relative">
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Visual Portals Grid */}
      <section className="px-6 py-10 md:py-12 lg:px-24 bg-zinc-50/50 relative border-b border-zinc-100">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px]" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">Navigation Portal</span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Explore the <span className="text-accent">Portfolio.</span></h2>
            </div>
            <p className="max-w-md text-sm text-zinc-500 leading-relaxed">
              Navigate to dedicated sections to review comprehensive records of technical competencies, commercial products, and detailed experience timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {portals.map((portal, idx) => (
              <motion.div
                key={portal.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group"
              >
                <Link 
                  href={portal.href}
                  className="block p-6 md:p-8 bg-white border border-primary/5 hover:border-primary/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative h-full flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-xl border ${portal.color}`}>
                        <portal.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-mono text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full uppercase tracking-wider font-medium">
                        {portal.badge.split(' · ')[0]}
                      </span>
                    </div>

                    <h3 className="text-xl font-medium mb-3 text-primary group-hover:text-highlight transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                      {portal.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all duration-300">
                    Explore Section
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <Testimonials />

      {/* Education, Certifications & Languages */}
      <Credentials />

      {/* Contact Section */}
      <div id="contact">
        <Contact />
      </div>

      {/* Floating AI terminal */}
      <AiTerminal />
    </main>
  );
}
