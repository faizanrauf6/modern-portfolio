'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BrainCog,
  Cookie,
  GitBranch,
  Zap,
  Terminal,
  Clock,
  Search,
  X,
  Sparkles,
  BookOpen,
  LayoutGrid,
  Plug,
  Workflow,
  ShieldCheck,
  Server,
} from 'lucide-react';

type Post = {
  href: string;
  title: string;
  excerpt: string;
  icon: typeof BrainCog;
  category: string;
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  readMinutes: number;
  theme: string;
};

const POSTS: Post[] = [
  {
    href: '/blog/how-mcp-tool-calling-works',
    title: 'How MCP Tool Calling Works',
    excerpt: 'From discovering a tool to checking its result — follow an assistant through the protocol, the permission boundary, and the parts your application still owns.',
    icon: Plug,
    category: 'AI / LLM',
    tags: ['MCP', 'Tool Calling', 'Agents', 'Permissions'],
    level: 'Intermediate',
    readTime: '7 min read',
    readMinutes: 7,
    theme: 'from-violet-500/10 via-purple-500/5 to-indigo-500/10 border-violet-500/20 text-violet-600',
  },
  {
    href: '/blog/building-reliable-ai-automation',
    title: 'Building AI Automation That Survives Retries',
    excerpt: 'A useful model response is only one step. Durable state, validation, idempotency, and explicit recovery turn a fragile demo into a dependable workflow.',
    icon: Workflow,
    category: 'Automation',
    tags: ['AI Workflows', 'BullMQ', 'Idempotency', 'Retries'],
    level: 'Intermediate',
    readTime: '7 min read',
    readMinutes: 7,
    theme: 'from-amber-500/10 via-yellow-500/5 to-orange-500/10 border-amber-500/20 text-amber-600',
  },
  {
    href: '/blog/evaluating-phishing-detection-models',
    title: 'Evaluating a Phishing Detector Beyond Accuracy',
    excerpt: 'Why a promising score can hide a weak detector — work through precision, recall, campaign leakage, time-based splits, and a threshold you can actually defend.',
    icon: ShieldCheck,
    category: 'Machine Learning',
    tags: ['Phishing Detection', 'Evaluation', 'Precision / Recall', 'Data Leakage'],
    level: 'Intermediate',
    readTime: '8 min read',
    readMinutes: 8,
    theme: 'from-emerald-500/10 via-teal-500/5 to-green-500/10 border-emerald-500/20 text-emerald-600',
  },
  {
    href: '/blog/serving-python-ml-models-with-nestjs',
    title: 'Serving Python ML Models Behind a NestJS API',
    excerpt: 'Keep product logic in TypeScript and inference in Python. Trace a prediction through a versioned contract, a warm model, bounded HTTP calls, and honest failure handling.',
    icon: Server,
    category: 'Backend',
    tags: ['NestJS', 'Python', 'FastAPI', 'ML Inference'],
    level: 'Intermediate',
    readTime: '8 min read',
    readMinutes: 8,
    theme: 'from-sky-500/10 via-blue-500/5 to-cyan-500/10 border-sky-500/20 text-sky-600',
  },
  {
    href: '/blog/how-to-use-redis-in-nodejs',
    title: 'How to Use Redis in a Node.js API',
    excerpt:
      'The cache-aside pattern actually wired into an Express route — connection, helper, invalidation, and the failure handling most tutorials skip.',
    icon: Terminal,
    category: 'Backend',
    tags: ['Redis', 'Node.js', 'Express', 'ioredis'],
    level: 'Beginner',
    readTime: '9 min read',
    readMinutes: 9,
    theme: 'from-fuchsia-500/10 via-pink-500/5 to-purple-500/10 border-fuchsia-500/20 text-fuchsia-600',
  },
  {
    href: '/blog/how-redis-caching-works',
    title: 'How Redis Caching Works',
    excerpt:
      'Why the second request is always faster than the first — traced through an actual cache miss and an actual cache hit.',
    icon: Zap,
    category: 'Performance',
    tags: ['Redis', 'Caching', 'TTL', 'In-Memory'],
    level: 'Beginner',
    readTime: '8 min read',
    readMinutes: 8,
    theme: 'from-cyan-500/10 via-sky-500/5 to-blue-500/10 border-cyan-500/20 text-cyan-600',
  },
  {
    href: '/blog/how-rag-works',
    title: 'How RAG Actually Works',
    excerpt:
      'Why LLMs make things up, and how handing them the right paragraphs first fixes it — indexing and querying, animated step by step.',
    icon: BrainCog,
    category: 'AI / LLM',
    tags: ['RAG', 'Vector DB', 'Embeddings', 'LLM'],
    level: 'Beginner',
    readTime: '8 min read',
    readMinutes: 8,
    theme: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/20 text-emerald-600',
  },
  {
    href: '/blog/how-claude-skills-and-harnesses-work',
    title: 'How Claude Skills and Agent Harnesses Work',
    excerpt:
      'From discovering SKILL.md to checking a real tool result — see how reusable instructions connect to context, permissions, and the agent execution loop.',
    icon: BookOpen,
    category: 'AI / LLM',
    tags: ['Claude Skills', 'SKILL.md', 'Agent Harnesses', 'Permissions'],
    level: 'Intermediate',
    readTime: '10 min read',
    readMinutes: 10,
    theme: 'from-amber-500/10 via-orange-500/5 to-yellow-500/10 border-amber-500/20 text-amber-600',
  },
  {
    href: '/blog/how-sessions-work',
    title: 'How Sessions Work',
    excerpt:
      'The cookie is just a pointer — the real record lives on the server. Why that trade-off buys instant logout.',
    icon: Cookie,
    category: 'Auth',
    tags: ['Sessions', 'Cookies', 'Redis', 'Auth'],
    level: 'Beginner',
    readTime: '7 min read',
    readMinutes: 7,
    theme: 'from-rose-500/10 via-red-500/5 to-orange-500/10 border-rose-500/20 text-rose-600',
  },
  {
    href: '/blog/how-cicd-works',
    title: 'How CI/CD Works',
    excerpt:
      'From a git push to code running in production — every automated gate in between, and why teams trust it enough to ship daily.',
    icon: GitBranch,
    category: 'DevOps',
    tags: ['CI/CD', 'GitHub Actions', 'Automation', 'DevOps'],
    level: 'Beginner',
    readTime: '7 min read',
    readMinutes: 7,
    theme: 'from-indigo-500/10 via-violet-500/5 to-purple-500/10 border-indigo-500/20 text-indigo-600',
  },
];

const TOTAL_MINUTES = POSTS.reduce((sum, p) => sum + p.readMinutes, 0);
const CATEGORIES = Array.from(new Set(POSTS.map((p) => p.category)));

export default function BlogIndexPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POSTS.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = `${p.title} ${p.excerpt} ${p.category} ${p.tags.join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  const isFiltering = query.trim().length > 0 || category !== 'All';
  const featured = !isFiltering ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <main className="min-h-screen bg-zinc-50/50 pt-28 pb-20 px-6 lg:px-24 relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors mb-12 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="mb-10 md:mb-12">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-primary/5 px-3 py-1 rounded-full border border-primary/5">
            Writing
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mt-4">
            How things <br />
            <span className="text-accent">actually work.</span>
          </h1>
          <p className="max-w-lg text-sm md:text-base text-zinc-500 mt-5 leading-relaxed">
            Systems explained the way I wish someone had explained them to me — animated,
            step-by-step, no prior knowledge assumed. Click into a diagram and watch the request
            move.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-6 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {POSTS.length} article{POSTS.length === 1 ? '' : 's'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5" />
              {CATEGORIES.length} topics
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              ~{TOTAL_MINUTES} min total
            </span>
          </div>
        </div>

        {/* Search + category filters */}
        <div className="sticky top-16 z-20 -mx-6 px-6 lg:-mx-24 lg:px-24 py-3 mb-10 bg-zinc-50/80 backdrop-blur-md border-y border-zinc-200/60">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, tags…"
                aria-label="Search articles"
                className="w-full pl-10 pr-9 py-2.5 rounded-full border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-400 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {['All', ...CATEGORIES].map((cat) => {
                const count = cat === 'All' ? POSTS.length : POSTS.filter((p) => p.category === cat).length;
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    aria-pressed={isActive}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-mono uppercase tracking-widest transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-primary text-bg font-semibold'
                        : 'bg-white border border-zinc-200 text-zinc-500 hover:text-primary hover:border-primary/30'
                    }`}
                  >
                    {cat}
                    <span className={isActive ? 'text-bg/60' : 'text-zinc-400'}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured post (only when not actively filtering) */}
        <AnimatePresence mode="wait">
          {featured && (
            <motion.div
              key="featured"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Link
                href={featured.href}
                className={`group relative block overflow-hidden rounded-3xl border bg-gradient-to-br ${featured.theme} hover:shadow-lg transition-all duration-300 p-8 md:p-12`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500 group-hover:scale-110 transform origin-top-right">
                  <featured.icon className="w-48 h-48 md:w-64 md:h-64" />
                </div>

                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-white/70">
                    <Sparkles className="w-3 h-3" />
                    Latest
                  </span>

                  <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary mt-5 mb-4 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-sm md:text-base text-zinc-600 leading-relaxed mb-6 max-w-xl">
                    {featured.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mb-7">
                    {featured.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/60 text-zinc-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-bg text-sm font-semibold group-hover:gap-3 transition-all">
                      Read the walkthrough
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result count when filtering */}
        {isFiltering && (
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-5">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            {query && (
              <>
                {' '}
                for &ldquo;<span className="text-zinc-600">{query}</span>&rdquo;
              </>
            )}
          </p>
        )}

        {/* Grid */}
        {rest.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {rest.map((post, idx) => {
                const Icon = post.icon;
                return (
                  <motion.div
                    key={post.href}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, delay: isFiltering ? 0 : idx * 0.06 }}
                  >
                    <Link
                      href={post.href}
                      className={`group block h-full p-7 md:p-8 rounded-3xl border bg-gradient-to-br ${post.theme} hover:shadow-md transition-all duration-300 relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500 group-hover:scale-110 transform origin-top-right">
                        <Icon className="w-36 h-36" />
                      </div>

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-semibold">
                            <Icon className="w-3.5 h-3.5" />
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>

                        <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight text-primary mb-3 leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-sm md:text-[15px] text-zinc-600 leading-relaxed flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-6">
                          {post.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/50 text-zinc-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-6 group-hover:gap-2.5 transition-all duration-300">
                          Read the walkthrough
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          !featured && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-24 rounded-3xl border border-dashed border-zinc-200"
            >
              <div className="p-4 rounded-2xl bg-zinc-100 mb-4">
                <Search className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-base font-medium text-zinc-700 mb-1">No articles found</p>
              <p className="text-sm text-zinc-500 mb-6 max-w-xs">
                Nothing matches {query ? `"${query}"` : 'that filter'} yet. Try a different term or
                topic.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-bg text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Clear filters
              </button>
            </motion.div>
          )
        )}
      </div>
    </main>
  );
}
