'use client';

import {
  BrainCog,
  FileText,
  Scissors,
  Binary,
  Database,
  Search,
  FileSearch,
  Layers,
  Sparkles,
  MessageCircle,
  KeyRound,
  Cookie,
  GitBranch,
  Target,
  Gauge,
  ListTree,
  Zap,
} from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import PipelineDiagram from '@/components/blog/PipelineDiagram';
import { H2, P, UL, LI, Code, Callout, StatRow, CompareGrid } from '@/components/blog/Prose';

const MORE = [
  { href: '/blog/how-jwt-works', title: 'How JWT Works', icon: KeyRound },
  { href: '/blog/how-sessions-work', title: 'How Sessions Work', icon: Cookie },
  { href: '/blog/how-cicd-works', title: 'How CI/CD Works', icon: GitBranch },
  { href: '/blog/how-redis-caching-works', title: 'How Redis Caching Works', icon: Zap },
];

const INDEXING_STEPS = [
  {
    icon: FileText,
    title: 'Load Docs',
    tag: 'One-time',
    detail:
      'You point the system at your source material — PDFs, help-center articles, internal wikis, a codebase. This happens once (and again whenever content changes), not on every question.',
  },
  {
    icon: Scissors,
    title: 'Chunk Text',
    tag: 'One-time',
    detail:
      'Each document is split into small overlapping pieces — usually 200–500 tokens. Chunking matters: too big and irrelevant text dilutes the answer; too small and you lose context.',
  },
  {
    icon: Binary,
    title: 'Embed Chunks',
    tag: 'One-time',
    detail:
      'An embedding model turns each chunk into a vector — a list of numbers that captures its meaning. Chunks about similar ideas end up as vectors that sit close together in that space.',
  },
  {
    icon: Database,
    title: 'Store in Vector DB',
    tag: 'One-time',
    detail:
      'Every chunk and its vector get saved in a vector database (Pinecone, pgvector, Chroma, Weaviate…) alongside the original text, ready to be searched in milliseconds.',
  },
];

const QUERY_STEPS = [
  {
    icon: MessageCircle,
    title: 'User Asks',
    tag: 'Per request',
    detail:
      'A real question arrives from a user — "What’s our refund policy for annual plans?" — with no guarantee the model was ever trained on this information.',
  },
  {
    icon: Binary,
    title: 'Embed Query',
    tag: 'Per request',
    detail:
      'The question is converted into a vector using the exact same embedding model used during indexing — so it lands in the same meaning-space as the stored chunks.',
  },
  {
    icon: Search,
    title: 'Similarity Search',
    tag: 'Per request',
    detail:
      'The vector database compares the question’s vector against every stored chunk vector and ranks them by closeness (cosine similarity), in milliseconds, across millions of chunks.',
  },
  {
    icon: FileSearch,
    title: 'Retrieve Top-K',
    tag: 'Per request',
    detail:
      'The 3–8 closest chunks are pulled out as plain text — the specific paragraphs most likely to actually contain the answer, out of the entire knowledge base.',
  },
  {
    icon: Layers,
    title: 'Augment Prompt',
    tag: 'Per request',
    detail:
      'Those chunks get stitched into a new prompt: instructions, then the retrieved context, then the original question.',
  },
  {
    icon: Sparkles,
    title: 'Generate Answer',
    tag: 'Per request',
    detail:
      'The LLM reads the augmented prompt and writes an answer grounded in the retrieved text — instead of guessing from what it memorized during training.',
  },
];

export default function RagContent() {
  return (
    <BlogShell
      category="AI / LLM"
      icon={BrainCog}
      title={
        <>
          How RAG actually <span className="text-accent">works.</span>
        </>
      }
      subtitle="Retrieval-Augmented Generation, explained from an empty text box to a grounded, cited answer — one animated step at a time."
      readTime="8 min read"
      more={MORE}
    >
      <P>
        Ask a plain LLM &ldquo;what&rsquo;s our refund policy?&rdquo; and it will confidently make
        something up — it was never trained on your company&rsquo;s docs, and its training data has
        a cutoff date anyway.{' '}
        <strong className="text-primary">Retrieval-Augmented Generation (RAG)</strong> fixes this
        without retraining the model at all: instead, you hand it the relevant paragraphs{' '}
        <em>right before</em> it answers — like giving someone an open book during an exam instead
        of making them memorize the textbook.
      </P>

      <Callout type="idea" title="The one-sentence version">
        RAG = search your own documents for the most relevant bits, then paste those bits into the
        prompt so the model answers using them instead of its memory.
      </Callout>

      <H2 id="two-phases">Two phases that are easy to confuse</H2>
      <P>
        The single biggest source of confusion for beginners is treating RAG as one pipeline.
        It&rsquo;s actually <strong className="text-primary">two separate pipelines</strong> that
        run at very different times:
      </P>

      <CompareGrid
        left={{
          title: 'Indexing — done once',
          icon: ListTree,
          points: [
            'Runs when you add or update documents',
            'Reads, chunks, and embeds your content',
            'Writes vectors into a database',
            'The user is never waiting on this',
          ],
        }}
        right={{
          title: 'Querying — done every time',
          icon: Target,
          points: [
            'Runs on every single user question',
            'Embeds the question, not the documents',
            'Searches the already-built vector index',
            'Has to be fast — the user is waiting',
          ],
        }}
      />

      <H2 id="indexing">Phase 1 — Turning documents into something searchable</H2>
      <P>
        Before RAG can answer anything, your knowledge base has to be prepared. This is the slow,
        offline part — click through the steps below.
      </P>

      <PipelineDiagram steps={INDEXING_STEPS} autoPlayMs={2800} />

      <H2 id="querying">Phase 2 — What happens the instant someone asks a question</H2>
      <P>
        This is the part that runs in real time, in the few hundred milliseconds before the user
        sees a response start streaming in.
      </P>

      <PipelineDiagram steps={QUERY_STEPS} autoPlayMs={2600} />

      <H2 id="embeddings">Wait — what is an &ldquo;embedding,&rdquo; really?</H2>
      <P>
        Think of an embedding as coordinates on a map, except the map has hundreds of dimensions
        instead of two. The embedding model reads a piece of text and places it somewhere on that
        map based on its <em>meaning</em>. &ldquo;How do I cancel my subscription?&rdquo; and
        &ldquo;steps to end my membership&rdquo; end up as nearby points, even though they
        don&rsquo;t share a single word — because the model learned that they mean similar things.
      </P>
      <P>
        Similarity search is then just asking: <Code>which stored points are closest to this new
        point?</Code> That&rsquo;s the entire trick behind retrieval — no keyword matching required.
      </P>

      <StatRow
        stats={[
          { icon: Gauge, label: 'Typical chunk size', value: '200–500 tokens' },
          { icon: Target, label: 'Chunks retrieved', value: 'Top 3–8 matches' },
          { icon: Search, label: 'Search latency', value: '~20–150ms' },
        ]}
      />

      <H2 id="mistakes">Where beginners get tripped up</H2>
      <UL>
        <LI>
          <strong className="text-primary">Chunking too coarsely.</strong> A 5,000-token chunk
          might contain the right answer buried next to four unrelated topics — the model gets
          distracted.
        </LI>
        <LI>
          <strong className="text-primary">No overlap between chunks.</strong> If a sentence gets
          cut exactly in half across two chunks, neither chunk fully makes sense on its own.
        </LI>
        <LI>
          <strong className="text-primary">Retrieving but not grounding.</strong> Fetching the
          right chunks doesn&rsquo;t help if the prompt doesn&rsquo;t clearly instruct the model to{' '}
          <em>use only</em> that context — otherwise it still drifts back to guessing.
        </LI>
        <LI>
          <strong className="text-primary">Stale embeddings.</strong> If a document changes but you
          never re-run indexing, the vector database is confidently searching outdated content.
        </LI>
      </UL>

      <Callout type="warning" title="Common mistake">
        Teams often judge RAG quality by watching the final answer. When it&rsquo;s wrong, the bug
        is almost always upstream — bad chunking or bad retrieval — not the generation step. Debug
        in order: what got retrieved, before asking why the answer is wrong.
      </Callout>

      <H2 id="real-world">Where you&rsquo;ve already seen this</H2>
      <P>
        Customer-support bots that answer from your help docs, internal tools that search company
        wikis, and coding assistants that pull in relevant files before suggesting a fix are all RAG
        under the hood. Claude Code&rsquo;s use of the <Code>Model Context Protocol (MCP)</Code> to
        pull in project-specific context before responding is the same core idea — retrieve
        what&rsquo;s relevant, then generate.
      </P>

      <Callout type="tip" title="In practice">
        You don&rsquo;t need a dedicated vector database to start. A few hundred documents will
        happily fit in memory with a simple cosine-similarity search — reach for
        Pinecone/pgvector/Weaviate once you&rsquo;re indexing millions of chunks or need persistence
        across deploys.
      </Callout>
    </BlogShell>
  );
}
