'use client';

import {
  Zap,
  Server,
  User,
  Database,
  MemoryStick,
  Timer,
  RefreshCw,
  Trash2,
  Gauge,
  Terminal,
  KeyRound,
  Cookie,
  GitBranch,
} from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import SequenceDiagram, { type SeqStep } from '@/components/blog/SequenceDiagram';
import { H2, P, UL, LI, Code, Callout, StatRow, CompareGrid } from '@/components/blog/Prose';

const MORE = [
  { href: '/blog/how-to-use-redis-in-nodejs', title: 'Use Redis in a Node.js API', icon: Terminal },
  { href: '/blog/how-sessions-work', title: 'How Sessions Work', icon: Cookie },
  { href: '/blog/how-jwt-works', title: 'How JWT Works', icon: KeyRound },
  { href: '/blog/how-cicd-works', title: 'How CI/CD Works', icon: GitBranch },
];

const MISS_ACTORS = [
  { label: 'Client', icon: User },
  { label: 'Server', icon: Server },
  { label: 'Redis', icon: MemoryStick },
  { label: 'Database', icon: Database },
];

const MISS_STEPS: SeqStep[] = [
  {
    kind: 'arrow',
    from: 0,
    to: 1,
    tone: 'request',
    label: 'GET /product/42',
    detail: 'A request comes in for data the server has never been asked for before — or hasn\'t been asked for in a while.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 2,
    tone: 'request',
    label: 'GET product:42',
    detail: 'Before touching the database, the server checks Redis first — a key-value lookup that normally takes well under a millisecond.',
  },
  {
    kind: 'arrow',
    from: 2,
    to: 1,
    tone: 'response',
    label: '(nil) — cache miss',
    detail: 'Nothing is stored under that key yet. This is a cache miss: Redis didn\'t fail, it genuinely doesn\'t have the answer.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 3,
    tone: 'request',
    label: 'SELECT * FROM products WHERE id = 42',
    detail: 'Only on a miss does the server fall back to the real, slower source of truth — the database.',
  },
  {
    kind: 'arrow',
    from: 3,
    to: 1,
    tone: 'response',
    label: '1 row  (≈18ms)',
    detail: 'The database does the real work and returns the row — tens of milliseconds, not fractions of one.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 2,
    tone: 'request',
    label: "SET product:42 '{...}' EX 300",
    detail: 'The server writes the result into Redis with an expiry (300 seconds here) before replying, so the next request doesn\'t pay this cost again.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 0,
    tone: 'response',
    label: '200 OK',
    detail: 'The client gets its answer — slightly slower this one time, because it just paid to warm the cache for everyone after it.',
  },
];

const HIT_ACTORS = [
  { label: 'Client', icon: User },
  { label: 'Server', icon: Server },
  { label: 'Redis', icon: MemoryStick },
];

const HIT_STEPS: SeqStep[] = [
  {
    kind: 'arrow',
    from: 0,
    to: 1,
    tone: 'request',
    label: 'GET /product/42',
    detail: 'The exact same request — this time Redis already has the answer from the last request that warmed it.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 2,
    tone: 'request',
    label: 'GET product:42',
    detail: 'Same lookup as before. The server has no idea yet whether this will be a hit or a miss — it just always checks first.',
  },
  {
    kind: 'arrow',
    from: 2,
    to: 1,
    tone: 'response',
    label: "'{...}'  (≈0.3ms)",
    detail: 'A cache hit — Redis returns the stored value straight from memory, roughly 50–100x faster than the database round trip.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 0,
    tone: 'response',
    label: '200 OK',
    detail: 'The database never gets touched at all. This is the entire point of caching: skip the expensive path whenever possible.',
  },
];

export default function RedisContent() {
  return (
    <BlogShell
      category="Performance"
      icon={Zap}
      title={
        <>
          How Redis caching <span className="text-accent">actually works.</span>
        </>
      }
      subtitle="Why the second request is always faster than the first — traced through an actual cache miss and an actual cache hit."
      readTime="8 min read"
      more={MORE}
    >
      <P>
        Every database query costs something — disk I/O, CPU, time. If a thousand people load the
        same product page in the same minute, a plain app re-runs the exact same expensive query a
        thousand times, for an answer that didn&rsquo;t change at all between request #1 and request
        #1000. <strong className="text-primary">Caching</strong> is just refusing to do that: keep
        the answer sitting in memory, and hand out the copy instead of recomputing it.{' '}
        <strong className="text-primary">Redis</strong> is the tool most backends reach for to do
        this — an in-memory key-value store built to answer in well under a millisecond.
      </P>

      <Callout type="idea" title="The one-sentence version">
        A cache is a fast, temporary copy of a slow answer — check the copy first, and only pay the
        full price when the copy doesn&rsquo;t exist yet.
      </Callout>

      <H2 id="what-is-redis">What Redis actually is</H2>
      <P>
        Redis (<strong className="text-primary">RE</strong>mote <strong className="text-primary">DI</strong>ctionary{' '}
        <strong className="text-primary">S</strong>erver) is a key-value store
        that lives almost entirely in RAM, which is what makes it so fast — reading from memory is
        roughly 50–100x faster than reading from disk-backed storage like Postgres or MySQL. Unlike a
        plain dictionary though, Redis understands several data shapes natively: strings, hashes,
        lists, sets, and sorted sets — so it isn&rsquo;t just a cache, it&rsquo;s a small, extremely
        fast database that most teams happen to use as a cache.
      </P>

      <H2 id="hit-vs-miss">Every lookup is either a hit or a miss</H2>
      <CompareGrid
        left={{
          title: 'Cache miss',
          icon: RefreshCw,
          points: [
            'Redis has nothing stored under that key',
            'The server has to fall back to the real database',
            'Slower — this request pays the full cost',
            'Ends with the server writing the result into Redis',
          ],
        }}
        right={{
          title: 'Cache hit',
          icon: Zap,
          points: [
            'Redis already has the answer in memory',
            'The database is never touched',
            'Fast — often sub-millisecond',
            'This is the state you want almost every request in',
          ],
        }}
      />

      <H2 id="miss-flow">The first request — a cache miss</H2>
      <P>
        Nobody has asked for this data recently, so Redis comes up empty and the server has to go
        the slow way, then save its work on the way out.
      </P>

      <SequenceDiagram actors={MISS_ACTORS} steps={MISS_STEPS} autoPlayMs={2600} />

      <H2 id="hit-flow">Every request after — a cache hit</H2>
      <P>
        Same endpoint, same data — but now Redis already has it. Watch how much shorter this round
        trip is, and notice the database doesn&rsquo;t appear in it at all.
      </P>

      <SequenceDiagram actors={HIT_ACTORS} steps={HIT_STEPS} autoPlayMs={2400} />

      <StatRow
        stats={[
          { icon: Gauge, label: 'Typical Redis read', value: '0.1–1ms' },
          { icon: Database, label: 'Typical DB query', value: '10–50ms+' },
          { icon: Timer, label: 'Common TTL range', value: '30s – 1hr' },
        ]}
      />

      <H2 id="ttl">How long should the data live?</H2>
      <P>
        That <Code>EX 300</Code> in the miss diagram is a TTL — time to live, in seconds. It&rsquo;s
        what keeps a cache from quietly turning into a database full of lies: without an expiry, the
        first write stays frozen in Redis forever, even after the real data changes underneath it.
        Short TTLs keep data fresher but cache less effectively; long TTLs cache better but risk
        staleness. Most teams start around 30 seconds to a few minutes for data that changes
        occasionally, and go much longer for data that&rsquo;s basically static.
      </P>

      <Callout type="warning" title="Common mistake">
        Caching something with <em>no</em> expiry at all. It feels harmless in development with a
        handful of keys, and then quietly becomes an unbounded memory leak in production once
        there are millions of unique keys that never get cleaned up. Default to setting a TTL on
        everything, and treat &ldquo;cache forever&rdquo; as a deliberate, rare exception.
      </Callout>

      <H2 id="invalidation">Cache invalidation — the actually hard part</H2>
      <P>
        There&rsquo;s an old joke that there are only two hard problems in computer science: cache
        invalidation, naming things, and off-by-one errors. The TTL above is the lazy version —
        wait for the clock to run out. Two other strategies handle it more deliberately:
      </P>
      <UL>
        <LI>
          <strong className="text-primary">Write-through invalidation</strong> — the moment the
          underlying data changes (an <Code>UPDATE</Code> to that product), the server explicitly
          runs <Code>DEL product:42</Code> so the next read is forced to be a fresh miss.
        </LI>
        <LI>
          <strong className="text-primary">Event-driven invalidation</strong> — a change anywhere
          in the system publishes an event (via Redis <Code>PUBLISH</Code> or a message queue),
          and any service holding a cached copy clears it in response.
        </LI>
      </UL>

      <Callout type="warning" title="Common mistake">
        <strong>Cache stampede (thundering herd):</strong> a hugely popular key expires, and a
        thousand simultaneous requests all get a miss at once — all thousand hit the database
        simultaneously, which can be worse than having no cache at all. Common fixes: add random
        jitter to TTLs so keys don&rsquo;t all expire at the exact same moment, or have only the
        first request rebuild the value while the rest wait on it (&ldquo;single-flight&rdquo;).
      </Callout>

      <H2 id="eviction">What happens when Redis runs out of memory</H2>
      <P>
        Redis has a configurable <Code>maxmemory</Code> limit. Once it&rsquo;s full, it needs an eviction
        policy to decide what to throw away to make room for new writes:
      </P>
      <UL>
        <LI>
          <strong className="text-primary">allkeys-lru</strong> — evict whatever hasn&rsquo;t been
          read <em>l</em>east <em>r</em>ecently, across every key. The most common default for pure
          caching workloads.
        </LI>
        <LI>
          <strong className="text-primary">volatile-lru</strong> — same idea, but only among keys
          that have a TTL set, leaving permanent keys untouched.
        </LI>
        <LI>
          <strong className="text-primary">allkeys-lfu</strong> — evict whatever is read{' '}
          <em>l</em>east <em>f</em>requently overall, which handles &ldquo;popular most of the time,
          but one huge burst&rdquo; keys better than LRU does.
        </LI>
        <LI>
          <strong className="text-primary">noeviction</strong> — refuse new writes once full, and
          return errors instead. Appropriate when Redis is holding data you can&rsquo;t afford to
          silently lose, not just cache.
        </LI>
      </UL>

      <H2 id="beyond-caching">Redis is more than just a cache</H2>
      <P>
        The same in-memory speed makes Redis a natural fit well beyond &ldquo;remember this API
        response&rdquo;:
      </P>
      <UL>
        <LI>
          <strong className="text-primary">Session storage</strong> — exactly the shared session
          store from the sessions post: every app server reads the same Redis instance, so it
          doesn&rsquo;t matter which server handles the next request.
        </LI>
        <LI>
          <strong className="text-primary">Rate limiting</strong> — a counter per user per time
          window, incremented atomically on every request, checked against a limit before the
          request is allowed through.
        </LI>
        <LI>
          <strong className="text-primary">Leaderboards</strong> — Redis&rsquo;s sorted-set type keeps
          members ordered by score automatically, so &ldquo;top 10 players right now&rdquo; is a
          single <Code>ZRANGE</Code> call, not a sort over the whole table.
        </LI>
        <LI>
          <strong className="text-primary">Pub/sub &amp; queues</strong> — lightweight real-time
          messaging between services, or a simple job queue, without standing up a separate broker.
        </LI>
      </UL>

      <Callout type="tip" title="In practice">
        Most teams reach for Redis the moment a single endpoint needs to survive real traffic
        without hammering the database on every request — or the moment they need state shared
        across more than one server instance, which is exactly the problem the sessions post
        covers. The two show up together constantly in practice.
      </Callout>
    </BlogShell>
  );
}
