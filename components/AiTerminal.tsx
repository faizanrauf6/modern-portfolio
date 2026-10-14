'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SquareTerminal,
  X,
  CornerDownLeft,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

type Role = 'user' | 'assistant' | 'system';
type Entry = { id: number; role: Role; text: string };
type ChatMessage = { role: 'user' | 'assistant'; content: string };

const { profile, skills, projects } = portfolioData;
const FIRST = profile.displayName;
const TERMINAL_HOST = profile.name.trim().split(/\s+/).map((part) => part[0]).join('').toLowerCase();

const SUGGESTIONS = [
  `What is ${FIRST}'s approach as a solution architect?`,
  'What distributed systems and cloud platforms has he designed?',
  'Tell me about his enterprise RAG and multi-agent experience.',
  `What is ${FIRST}'s experience with React and Next.js?`,
  'Summarize his most impressive project.',
  'Does he have backend and AI experience?',
  'What did he build at PureLogics?',
  'Tell me about his AWS and Docker experience.',
  'What are his strongest technical skills?',
  'How do I get in touch with him?',
];

const BANNER = [
  `${profile.name} — ${profile.title}`,
  `${profile.yearsOfExp} years · ${profile.location}`,
  '',
  'AI terminal. Ask about his experience, skills or projects,',
  'or run a command:',
  '',
  '  help   whoami   skills   stack   projects   contact   resume',
].join('\n');

const HELP = [
  'commands',
  '  help        this list',
  '  clear       wipe the screen        (ctrl+l)',
  '  whoami      name, role, location',
  '  skills      full skill breakdown',
  '  stack       core tech stack',
  '  projects    selected project list',
  '  contact     email + socials',
  '  resume      open the PDF résumé',
  '',
  'anything else is answered by the AI.',
].join('\n');

/** Instant, offline commands. Returns text, the CLEAR sentinel, or null (→ AI). */
function runLocalCommand(raw: string): string | 'CLEAR' | null {
  switch (raw.trim().toLowerCase()) {
    case 'help':
    case '?':
      return HELP;
    case 'clear':
    case 'cls':
      return 'CLEAR';
    case 'whoami':
      return `${profile.name} — ${profile.title}\n${profile.location}`;
    case 'skills':
      return skills
        .map((s) => `${s.category}\n  ${s.items.join(', ')}`)
        .join('\n\n');
    case 'stack':
      return profile.stack.join('  ·  ');
    case 'projects':
      return projects.map((p) => `- ${p.title}  (${p.category})`).join('\n');
    case 'contact':
      return [
        `email     ${profile.email}`,
        `github    ${profile.github}`,
        `linkedin  ${profile.linkedin}`,
        ...(profile.website ? [`website   ${profile.website}`] : []),
      ].join('\n');
    case 'resume':
    case 'cv':
      return `opening ${profile.resumeUrl} …`;
    case 'socials':
      return `github    ${profile.github}\nlinkedin  ${profile.linkedin}`;
    default:
      return null;
  }
}

export default function AiTerminal() {
  const [open, setOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [booted, setBooted] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sugIdx, setSugIdx] = useState(-1);
  const [history, setHistory] = useState<string[]>([]);

  const idRef = useRef(0);
  const entriesRef = useRef<Entry[]>([]);
  const pendingRef = useRef<Map<number, string>>(new Map());
  const histRef = useRef(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextId = () => ++idRef.current;
  const push = (role: Role, text: string) =>
    setEntries((e) => [...e, { id: nextId(), role, text }]);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  // Keep the log pinned to the bottom.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, open, maximized]);

  // Esc closes the terminal.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Typewriter: drain queued stream text into the visible entry a few chars per
  // frame, so a burst of network chunks still reads as live typing. The buffer
  // bookkeeping happens BEFORE setState — the updater itself stays pure so a
  // StrictMode double-invoke can't consume characters twice.
  useEffect(() => {
    const timer = setInterval(() => {
      const pend = pendingRef.current;
      if (pend.size === 0) return;

      const reveal = new Map<number, string>();
      for (const [id, queued] of pend) {
        const take =
          queued.length > 300 ? 8 : queued.length > 90 ? 4 : 2;
        reveal.set(id, queued.slice(0, take));
        const rest = queued.slice(take);
        if (rest) pend.set(id, rest);
        else pend.delete(id);
      }

      setEntries((prev) =>
        prev.map((entry) => {
          const add = reveal.get(entry.id);
          return add ? { ...entry, text: entry.text + add } : entry;
        }),
      );
    }, 16);
    return () => clearInterval(timer);
  }, []);

  const q = input.trim().toLowerCase();
  const matches = q
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(q))
    : SUGGESTIONS;
  const showSuggestions =
    open && !busy && matches.length > 0 && (focused || q.length > 0);
  const draining = busy || pendingRef.current.size > 0;

  const openTerminal = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 60);
    if (booted) return;
    setBooted(true);
    const id = nextId();
    setEntries([{ id, role: 'system', text: '' }]);
    pendingRef.current.set(id, BANNER);
  };

  const send = useCallback(
    async (question: string) => {
      const msgs: ChatMessage[] = [
        ...entriesRef.current
          .filter((e) => e.role === 'user' || e.role === 'assistant')
          .slice(-3)
          .map((e) => ({
            role: e.role as 'user' | 'assistant',
            content: e.text.slice(0, 800),
          })),
        { role: 'user', content: question },
      ];

      const assistantId = nextId();
      setEntries((e) => [...e, { id: assistantId, role: 'assistant', text: '' }]);
      setBusy(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: msgs }),
        });
        if (!res.body) throw new Error('no stream');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const prev = pendingRef.current.get(assistantId) || '';
          pendingRef.current.set(assistantId, prev + chunk);
        }
      } catch {
        pendingRef.current.set(
          assistantId,
          '\n[error] request failed — try again.',
        );
      } finally {
        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 20);
      }
    },
    [],
  );

  const submit = (raw: string) => {
    const value = raw.trim();
    if (!value || busy) return;

    setHistory((h) => (h[h.length - 1] === value ? h : [...h, value]));
    histRef.current = -1;
    setInput('');
    setSugIdx(-1);

    const local = runLocalCommand(value);
    push('user', value);

    if (local === null) {
      void send(value);
      return;
    }
    if (local === 'CLEAR') {
      setEntries([]);
      return;
    }
    if (/^(resume|cv)$/i.test(value)) {
      window.open(profile.resumeUrl, '_blank', 'noopener');
    }
    push('system', local);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setEntries([]);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      submit(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (matches.length) {
        const next = e.shiftKey
          ? (sugIdx - 1 + matches.length) % matches.length
          : (sugIdx + 1) % matches.length;
        setSugIdx(next);
        setInput(matches[next]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      histRef.current =
        histRef.current < 0
          ? history.length - 1
          : Math.max(0, histRef.current - 1);
      setInput(history[histRef.current]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histRef.current < 0) return;
      const ni = histRef.current + 1;
      if (ni >= history.length) {
        histRef.current = -1;
        setInput('');
      } else {
        histRef.current = ni;
        setInput(history[ni]);
      }
    } else if (e.key === 'Escape' && input) {
      e.preventDefault();
      e.stopPropagation();
      setInput('');
      setSugIdx(-1);
    }
  };

  const lastId = entries[entries.length - 1]?.id;

  return (
    <>
      {!open && (
        <button
          onClick={openTerminal}
          aria-label="Open the AI terminal"
          className="group fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-bg px-3.5 py-2.5 shadow-lg shadow-primary/25 ring-1 ring-bg/10 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-highlight opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-highlight" />
          </span>
          <SquareTerminal className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-widest">
            Ask AI
          </span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={`fixed z-[100] flex flex-col rounded-xl border border-bg/15 bg-primary text-bg font-mono shadow-2xl overflow-hidden ${
              maximized
                ? 'inset-3 sm:inset-6 md:inset-10'
                : 'bottom-6 right-4 sm:right-6 md:right-12 w-[calc(100vw-2rem)] max-w-lg h-[70vh] max-h-[600px]'
            }`}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-bg/15 bg-bg/[0.04] shrink-0">
              <span className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-bg/25 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-bg/25 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-bg/25 block" />
              </span>
              <span className="mx-auto text-[11px] text-bg/55 truncate">
                {FIRST.toLowerCase()}@portfolio&nbsp;:&nbsp;~{busy ? ' ·  running' : ''}
              </span>
              <button
                onClick={() => setMaximized((m) => !m)}
                aria-label={maximized ? 'Restore' : 'Maximize'}
                className="text-bg/50 hover:text-bg transition-colors"
              >
                {maximized ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close terminal"
                className="text-bg/50 hover:text-bg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Log */}
            <div
              ref={scrollRef}
              onClick={() => inputRef.current?.focus()}
              className="flex-1 overflow-y-auto px-4 py-3.5 text-[13px] leading-6 space-y-2.5 custom-scrollbar cursor-text"
            >
              {entries.map((entry) => {
                if (entry.role === 'user') {
                  return (
                    <div key={entry.id} className="break-words">
                      <span className="text-highlight select-none">
                        visitor@{TERMINAL_HOST}&nbsp;~&nbsp;${' '}
                      </span>
                      <span className="text-bg">{entry.text}</span>
                    </div>
                  );
                }
                const isLast = entry.id === lastId;
                return (
                  <pre
                    key={entry.id}
                    className={`whitespace-pre-wrap break-words font-mono ${
                      entry.role === 'system'
                        ? 'text-bg/55'
                        : 'text-bg/90'
                    }`}
                  >
                    {entry.text}
                    {isLast && draining && (
                      <span className="term-caret inline-block w-[7px] h-[15px] translate-y-[3px] ml-0.5 bg-bg/80" />
                    )}
                  </pre>
                );
              })}
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div className="border-t border-bg/10 px-3 py-2 space-y-0.5 max-h-40 overflow-y-auto custom-scrollbar shrink-0">
                <p className="text-[9px] uppercase tracking-widest text-bg/30 mb-1">
                  {q ? 'matches' : 'try one · tab to complete'}
                </p>
                {matches.slice(0, 6).map((s, i) => (
                  <button
                    key={s}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => submit(s)}
                    onMouseEnter={() => setSugIdx(i)}
                    className={`block w-full text-left text-[11px] px-2 py-1 rounded transition-colors ${
                      i === sugIdx
                        ? 'bg-bg/15 text-bg'
                        : 'text-bg/55 hover:text-bg/85'
                    }`}
                  >
                    <span className="text-highlight/70">›</span> {s}
                  </button>
                ))}
              </div>
            )}

            {/* Prompt */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-bg/15 shrink-0">
              <span className="text-highlight shrink-0 select-none">
                visitor@{TERMINAL_HOST}&nbsp;~&nbsp;$
              </span>
              <input
                ref={inputRef}
                maxLength={600}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setSugIdx(-1);
                  histRef.current = -1;
                }}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 120)}
                disabled={busy}
                spellCheck={false}
                autoComplete="off"
                placeholder={busy ? 'running…' : `ask ${FIRST}, or type "help"`}
                className="flex-1 min-w-0 bg-transparent text-bg caret-bg placeholder:text-bg/30 outline-none text-[13px] disabled:opacity-50"
              />
              <CornerDownLeft className="w-3.5 h-3.5 text-bg/30 shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
