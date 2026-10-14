'use client';

import { motion } from 'motion/react';
import { GraduationCap, Award, Languages as LanguagesIcon } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

export default function Credentials() {
  const { education, certifications, languages, awards } = portfolioData;

  return (
    <section
      id="credentials"
      className="px-6 py-10 md:py-12 lg:px-24 bg-bg border-b border-primary/10"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-text/50 block mb-2">
            Background
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary">
            Education &amp; <span className="text-accent">credentials.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-primary/10 p-6 md:p-8 bg-bg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary text-bg">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-text/60">
                Education
              </h3>
            </div>
            <p className="text-lg font-semibold text-primary">
              {education.degree}
            </p>
            <p className="text-sm text-text/60 mt-1">{education.institution}</p>
            <p className="text-xs font-mono text-text/40 mt-3">
              {education.period}
            </p>
            <p className="text-sm text-text/60 mt-3">GPA: {education.gpa}</p>
            <p className="text-sm text-text/60 mt-3">Final-year project: {education.project}</p>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-primary/10 p-6 md:p-8 bg-bg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary text-bg">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-text/60">
                Certifications &amp; development
              </h3>
            </div>
            <ul className="space-y-3">
              {certifications.map((cert) => (
                <li
                  key={cert}
                  className="text-sm text-text/70 flex items-start gap-2.5"
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-highlight shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-primary/10 p-6 md:p-8 bg-bg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-primary text-bg">
                <LanguagesIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-text/60">
                Languages
              </h3>
            </div>
            <ul className="space-y-4">
              {languages.map((lang) => (
                <li
                  key={lang.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-primary">
                    {lang.name}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-text/50 px-2.5 py-1 rounded-full border border-primary/15">
                    {lang.level}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        <div className="mt-6 grid gap-6">
          {awards.map((award) => (
            <div key={award.title} className="rounded-2xl border border-primary/10 p-6 bg-bg flex items-start gap-4">
              <Award className="w-5 h-5 text-highlight shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-primary">{award.title}</p>
                <p className="text-sm text-text/60 mt-1">{award.event} · {award.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
