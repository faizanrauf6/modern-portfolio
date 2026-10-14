'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, X, ExternalLink } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

export default function ResumeModal() {
  const { profile } = portfolioData;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 px-7 py-3.5 border border-primary/15 rounded-full hover:bg-primary/[0.03] hover:border-primary/30 hover:text-primary transition-all duration-300 text-sm md:text-base font-medium text-text/60 shadow-sm"
      >
        View Résumé
        <FileText className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-primary/25 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-bg shadow-2xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-primary/10 px-4 py-3 bg-primary/[0.03]">
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text/60">
                  <FileText className="w-3.5 h-3.5" />
                  {profile.name} — Résumé
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={profile.resumeUrl}
                    download
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary text-bg px-3 py-1.5 text-[11px] font-medium hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open résumé in a new tab"
                    className="p-2 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.05] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="p-2 rounded-full text-text/50 hover:text-primary hover:bg-primary/[0.05] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <iframe
                src={`${profile.resumeUrl}#view=FitH`}
                title={`${profile.name} résumé`}
                className="w-full flex-1 min-h-[60vh] bg-bg"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
