'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = {
  name: string;
  primary: string;
  accent: string;
  highlight: string;
  background: string;
  text: string;
};

export type Font = {
  name: string;
  variable: string;
  className: string;
};


export const themes: Theme[] = [
  {
    name: 'Allen',
    primary: '#25615c',
    accent: '#7eada7',
    highlight: '#3c625d',
    background: '#eaeeec',
    text: '#163735',
  },
  {
    name: 'Marry',
    primary: '#e5484d',
    accent: '#ec8184',
    highlight: '#c35e61',
    background: '#FFF9FC',
    text: '#5F1142',
  },
  
  {
    name: 'Hifx',
    primary: '#561d77',
    accent: '#a57fbb',
    highlight: '#7f5895',
    background: '#FBFAFF',
    text: '#32145D',
  },
  {
  name: 'Hamzi',
  primary: '#1d7730',
  accent: '#7db888',
  highlight: '#9bc2a2',
  background: '#FFFDFC',
  text: '#0a3113',
},
{
  name: 'Hmd',
  primary: '#e57600',
  accent: '#fac273',
  highlight: '#dd9a3d',
  background: '#FFFDFC',
  text: '#3B1D0A',
},



];

export const fonts: Font[] = [
  { name: 'Modern', variable: '--font-inter', className: 'font-sans' },
  { name: 'Elegant', variable: '--font-playfair', className: 'font-serif' },
  { name: 'Tech', variable: '--font-space', className: 'font-tech' },
];

type ThemeContextType = {
  currentTheme: Theme;
  currentFont: Font;
  setTheme: (name: string) => void;
  setFont: (name: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, initialTheme }: { children: React.ReactNode, initialTheme: Theme }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(initialTheme);
  const [currentFont, setCurrentFont] = useState<Font>(fonts[0]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const setTheme = (name: string) => {
    const theme = themes.find(t => t.name === name);
    if (theme) setCurrentTheme(theme);
  };

  const setFont = (name: string) => {
    const font = fonts.find(f => f.name === name);
    if (font) setCurrentFont(font);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', currentTheme.primary);
    root.style.setProperty('--accent', currentTheme.accent);
    root.style.setProperty('--highlight', currentTheme.highlight);
    root.style.setProperty('--background', currentTheme.background);
    root.style.setProperty('--text', currentTheme.text);
  }, [currentTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-main', `var(${currentFont.variable})`);
  }, [currentFont]);

  return (
    <ThemeContext.Provider value={{ currentTheme, currentFont, setTheme, setFont }}>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-highlight z-[10000] origin-left"
        style={{ scaleX }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
