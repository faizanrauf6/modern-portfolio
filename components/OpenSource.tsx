'use client';

import { motion } from 'motion/react';
import { Github, Star, GitFork, ArrowUpRight, ExternalLink } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import ContributionGraph from '@/components/ContributionGraph';

export default function OpenSource() {
  const { github } = portfolioData;
  return (
    <section id="open-source" className="mt-24 pt-16 border-t border-primary/10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text/50 block mb-2">Open Source</span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary">On <span className="text-accent">GitHub.</span></h2>
        </div>
        <div className="md:text-right">
          <p className="max-w-md text-sm text-text/60 leading-relaxed font-sans">{github.blurb}</p>
          <a href={github.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-xs font-mono uppercase tracking-widest text-primary hover:gap-3 transition-all">
            <Github className="w-3.5 h-3.5" /> @{github.username} <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <p className="text-[10px] font-mono text-text/40 mt-2" title={`Checked against GitHub on ${github.checkedAt.slice(0, 10)}`}>
            {github.publicRepos} public repos · since {github.memberSince}
          </p>
        </div>
      </div>
      <ContributionGraph />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {github.repos.map((repo, idx) => (
          <motion.article key={repo.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }} className="group flex flex-col justify-between rounded-2xl border border-primary/10 hover:border-primary/25 p-6 bg-bg shadow-sm hover:shadow-md transition-all">
            <a href={repo.url} aria-label={`Open ${repo.name} on GitHub`} target="_blank" rel="noreferrer" className="block flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/[0.04] border border-primary/10"><Github className="w-4 h-4 text-primary" /></div>
                <ArrowUpRight className="w-4 h-4 text-text/30 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-semibold text-primary font-mono break-words">{repo.name}</h3>
              <p className="text-sm text-text/60 leading-relaxed mt-2">{repo.description}</p>
            </a>
            <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-primary/10 text-[11px] font-mono text-text/50">
              {repo.language && <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-highlight" />{repo.language}</span>}
              {repo.stars > 0 && <span className="flex items-center gap-1" title="Stars"><Star className="w-3 h-3" />{repo.stars}</span>}
              {repo.forks > 0 && <span className="flex items-center gap-1" title="Forks"><GitFork className="w-3 h-3" />{repo.forks}</span>}
              {repo.demo && <a href={repo.demo} aria-label={`Live demo of ${repo.name}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 ml-auto text-primary hover:underline"><ExternalLink className="w-3 h-3" />demo</a>}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
