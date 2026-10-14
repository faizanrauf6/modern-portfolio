import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-[10px] uppercase tracking-widest text-text/40 mb-4">
        Error 404
      </span>
      <h1 className="text-6xl md:text-8xl font-semibold tracking-tight text-primary leading-none">
        Not found<span className="text-accent">.</span>
      </h1>
      <p className="text-sm text-text/60 mt-5 max-w-sm leading-relaxed">
        That page doesn&apos;t exist or has moved. Everything else is one click
        away.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full bg-primary text-bg text-xs font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to home
      </Link>
    </main>
  );
}
