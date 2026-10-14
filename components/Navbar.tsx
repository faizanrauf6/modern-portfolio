'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
  { href: '/project', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/playground', label: 'Playground' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = portfolioData.profile.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  // Close on Escape; auto-close when the layout grows past the mobile breakpoint.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const mq = window.matchMedia('(min-width: 768px)');
    const onWide = () => setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onWide);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onWide);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 lg:px-24 flex justify-between items-center pointer-events-none">
      <Link
        href="/"
        className="font-mono text-[10px] md:text-xs tracking-widest uppercase pointer-events-auto bg-bg/85 backdrop-blur-md px-3 py-1.5 border border-primary/10 rounded shadow-sm hover:border-primary/20 transition-all text-primary font-medium"
      >
        {initials} / 2026
      </Link>

      {/* Desktop: inline pill row */}
      <div className="hidden md:flex gap-2 pointer-events-auto bg-bg/85 backdrop-blur-md p-1 border border-primary/10 rounded-full shadow-sm">
        {LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-mono transition-colors ${
                isActive
                  ? 'text-bg font-semibold'
                  : 'text-text/50 hover:text-primary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile: menu button */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={menuOpen}
        className="md:hidden relative z-10 pointer-events-auto bg-bg/85 backdrop-blur-md p-2 border border-primary/10 rounded-lg shadow-sm text-primary hover:border-primary/20 transition-all"
      >
        {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile: dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-x-0 bottom-0 top-14 z-0 bg-primary/10 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="md:hidden absolute right-6 top-16 w-44 z-20 pointer-events-auto bg-bg border border-primary/10 rounded-xl shadow-xl p-1.5 flex flex-col gap-0.5"
            >
              {LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-[11px] uppercase tracking-widest font-mono transition-colors ${
                      isActive
                        ? 'bg-primary text-bg font-semibold'
                        : 'text-text/60 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
