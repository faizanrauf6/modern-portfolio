'use client';

import { useId, useState } from 'react';
import { motion } from 'motion/react';
import { Quote, ExternalLink } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

type Testimonial = (typeof portfolioData.testimonials)[number];

function RecommendationCard({ testimonial: t, index }: { testimonial: Testimonial; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();
  const isDraft = t.status === 'draft';
  const firstParagraph = t.quote.split('\n\n')[0];
  const hasMore = firstParagraph.length < t.quote.length;
  const text = expanded ? t.quote : firstParagraph;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      className="mb-6 break-inside-avoid rounded-2xl border border-primary/10 p-6 bg-bg"
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <Quote className="w-5 h-5 text-accent shrink-0" />
        {(isDraft || t.status === 'linkedin') && (
          <span className={`text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full ${isDraft ? 'bg-amber-500/10 text-amber-700' : 'bg-highlight/10 text-primary'}`}>
            {isDraft ? 'Suggested wording' : 'LinkedIn recommendation'}
          </span>
        )}
      </div>
      {isDraft ? (
        <p id={bodyId} className="text-sm text-text/70 leading-relaxed font-sans whitespace-pre-line">{text}</p>
      ) : (
        <blockquote id={bodyId} className="text-sm text-text/70 leading-relaxed font-sans whitespace-pre-line">{text}</blockquote>
      )}
      {hasMore && (
        <button type="button" aria-expanded={expanded} aria-controls={bodyId} onClick={() => setExpanded((value) => !value)} className="mt-4 text-xs font-medium text-primary underline underline-offset-4 cursor-pointer">
          {expanded ? 'Show less' : 'Read full recommendation'}
        </button>
      )}
      <figcaption className="mt-5 pt-4 border-t border-primary/10">
        <p className="text-sm font-semibold text-primary">{t.name}</p>
        <p className="text-xs text-text/60 mt-0.5">{t.title}</p>
        <p className="text-xs text-text/50 mt-1">{t.project}</p>
        <p className="text-[10px] font-mono uppercase tracking-widest text-text/40 mt-2">
          {t.relation}{t.date ? ` · ${t.date}` : ''}
        </p>
        {isDraft ? (
          <p className="text-xs text-text/50 mt-3">Proposed testimonial for {t.name} to review.</p>
        ) : t.status === 'linkedin' && t.url ? (
          <a href={t.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary mt-3 hover:underline">
            LinkedIn profile <ExternalLink className="w-3 h-3" />
          </a>
        ) : null}
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  const { testimonials } = portfolioData;
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="px-6 py-8 lg:px-24 bg-bg border-b border-primary/10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-text/50 block mb-2">Recommendations</span>
            <h2 id="testimonials-title" className="text-3xl md:text-4xl font-semibold tracking-tight text-primary">What colleagues <span className="text-accent">say.</span></h2>
          </div>
          <p className="max-w-md text-sm text-text/60 leading-relaxed font-sans">
            Recommendations from teammates, project leads, and clients across full-stack engineering, AI, and product delivery.
          </p>
        </motion.div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {testimonials.map((testimonial, index) => <RecommendationCard key={testimonial.name} testimonial={testimonial} index={index} />)}
        </div>
      </div>
    </section>
  );
}
