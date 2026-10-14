'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Home,
  Briefcase,
  Cpu,
  FolderGit2,
  FlaskConical,
  BookOpen,
  User,
  Quote,
  GraduationCap,
  Mail,
  Download,
  Github,
  Linkedin,
  Palette,
  Type as TypeIcon,
  CornerDownLeft,
} from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import { themes, fonts, useTheme } from '@/components/ThemeProvider';

type Command = {
  id: string;
  label: string;
  group: string;
  icon: typeof Home;
  keywords?: string;
  run: () => void;
};

export default function CommandPalette() {
  const router = useRouter();
  const { currentTheme, currentFont, setTheme, setFont } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { profile } = portfolioData;

  const close = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (path: string) => {
      router.push(path);
      close();
    },
    [router, close],
  );

  const jump = useCallback(
    (hash: string) => {
      const el =
        typeof document !== 'undefined' ? document.getElementById(hash) : null;
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else router.push(`/#${hash}`);
      close();
    },
    [router, close],
  );

  const commands = useMemo<Command[]>(() => {
    const nextTheme =
      themes[
        (themes.findIndex((t) => t.name === currentTheme.name) + 1) %
          themes.length
      ];
    const nextFont =
      fonts[
        (fonts.findIndex((f) => f.name === currentFont.name) + 1) % fonts.length
      ];

    return [
      { id: 'home', label: 'Go to Home', group: 'Navigate', icon: Home, run: () => go('/') },
      { id: 'experience', label: 'Go to Experience', group: 'Navigate', icon: Briefcase, run: () => go('/experience') },
      { id: 'skills', label: 'Go to Skills', group: 'Navigate', icon: Cpu, run: () => go('/skills') },
      { id: 'projects', label: 'Go to Projects', group: 'Navigate', icon: FolderGit2, run: () => go('/project') },
      { id: 'blog', label: 'Go to Blog', group: 'Navigate', icon: BookOpen, keywords: 'writing rag jwt session cicd how it works', run: () => go('/blog') },
      { id: 'playground', label: 'Go to Playground', group: 'Navigate', icon: FlaskConical, keywords: 'responsive theme accessibility performance', run: () => go('/playground') },

      { id: 'about', label: 'Jump to About', group: 'Sections', icon: User, run: () => jump('about') },
      ...(portfolioData.testimonials.length ? [{ id: 'testimonials', label: 'Jump to Recommendations', group: 'Sections', icon: Quote, keywords: 'testimonials reviews', run: () => jump('testimonials') }] : []),
      { id: 'credentials', label: 'Jump to Education & Credentials', group: 'Sections', icon: GraduationCap, keywords: 'certifications languages', run: () => jump('credentials') },
      { id: 'contact', label: 'Jump to Contact', group: 'Sections', icon: Mail, run: () => jump('contact') },

      { id: 'email', label: `Copy email — ${profile.email}`, group: 'Actions', icon: Mail, keywords: 'mail address', run: () => { navigator.clipboard?.writeText(profile.email).catch(() => {}); close(); } },
      { id: 'resume', label: 'Download résumé (PDF)', group: 'Actions', icon: Download, keywords: 'cv', run: () => { const a = document.createElement('a'); a.href = profile.resumeUrl; a.download = ''; a.click(); close(); } },
      { id: 'github', label: 'Open GitHub', group: 'Actions', icon: Github, run: () => { window.open(profile.github, '_blank', 'noopener'); close(); } },
      { id: 'linkedin', label: 'Open LinkedIn', group: 'Actions', icon: Linkedin, run: () => { window.open(profile.linkedin, '_blank', 'noopener'); close(); } },

      { id: 'theme', label: `Theme: ${currentTheme.name} → ${nextTheme.name}`, group: 'Appearance', icon: Palette, keywords: 'color colours palette', run: () => setTheme(nextTheme.name) },
      { id: 'font', label: `Font: ${currentFont.name} → ${nextFont.name}`, group: 'Appearance', icon: TypeIcon, keywords: 'typeface typography', run: () => setFont(nextFont.name) },
    ];
  }, [go, jump, close, profile, currentTheme, currentFont, setTheme, setFont]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Global shortcut. The reset calls live in this event handler (not the effect
  // body), so they run only in response to the keypress.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuery('');
        setActive(0);
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus the input and lock body scroll while open (external-system sync only).
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  // Keep the active row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${active}"]`,
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <>
      <button
        onClick={() => {
          setQuery('');
          setActive(0);
          setOpen(true);
        }}
        aria-label="Open command palette"
        className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-bg/85 backdrop-blur-md px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-text/50 shadow-sm hover:text-primary hover:border-primary/30 transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Command</span>
        <kbd className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[12vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.15 }}
              onKeyDown={onListKey}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/15 bg-bg shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-primary/10 px-4">
                <Search className="w-4 h-4 text-text/40 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  placeholder="Type a command or search…"
                  className="w-full bg-transparent py-4 text-sm text-text placeholder:text-text/40 focus:outline-none font-sans"
                />
                <kbd className="hidden sm:block text-[10px] font-mono text-text/40 border border-primary/15 rounded px-1.5 py-0.5">
                  Esc
                </kbd>
              </div>

              <div
                ref={listRef}
                className="max-h-[52vh] overflow-y-auto custom-scrollbar p-2"
              >
                {filtered.length === 0 && (
                  <p className="px-3 py-6 text-center text-xs font-mono text-text/40">
                    No matching commands
                  </p>
                )}

                {filtered.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isActive = idx === active;
                  const showGroup =
                    idx === 0 || filtered[idx - 1].group !== cmd.group;
                  return (
                    <div key={cmd.id}>
                      {showGroup && (
                        <p className="px-3 pt-3 pb-1 text-[9px] font-mono uppercase tracking-widest text-text/40">
                          {cmd.group}
                        </p>
                      )}
                      <button
                        data-idx={idx}
                        onClick={() => cmd.run()}
                        onMouseMove={() => setActive(idx)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          isActive
                            ? 'bg-primary text-bg'
                            : 'text-text/80 hover:bg-primary/[0.04]'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-bg' : 'text-text/40'
                          }`}
                        />
                        <span className="flex-1 truncate">{cmd.label}</span>
                        {isActive && (
                          <CornerDownLeft className="w-3.5 h-3.5 text-bg/70" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
