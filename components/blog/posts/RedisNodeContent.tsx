'use client';

import {
  Terminal,
  PlugZap,
  Wand2,
  Search,
  Database,
  Timer,
  Trash2,
  ShieldAlert,
  Zap,
  BrainCog,
  KeyRound,
  Cookie,
  GitBranch,
  Boxes,
  Gauge,
} from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import PipelineDiagram from '@/components/blog/PipelineDiagram';
import { H2, P, UL, LI, Code, Pre, Callout, StatRow, CompareGrid } from '@/components/blog/Prose';

const MORE = [
  { href: '/blog/how-redis-caching-works', title: 'How Redis Caching Works', icon: Zap },
  { href: '/blog/how-sessions-work', title: 'How Sessions Work', icon: Cookie },
  { href: '/blog/how-jwt-works', title: 'How JWT Works', icon: KeyRound },
  { href: '/blog/how-rag-works', title: 'How RAG Works', icon: BrainCog },
];

const BUILD_STEPS = [
  {
    icon: PlugZap,
    title: 'Connect',
    tag: 'Setup',
    detail: 'One Redis client, created once when the server boots, reused by every request. Not a connection pool — a single multiplexed connection is normal and correct for Redis.',
  },
  {
    icon: Wand2,
    title: 'Wrap the Query',
    tag: 'Helper',
    detail: 'Write one small function that does "check cache, fall back, write cache" — every route that wants caching calls this instead of duplicating the logic.',
  },
  {
    icon: Search,
    title: 'Route Calls It',
    tag: 'Read path',
    detail: 'The route handler itself barely changes — it just calls the helper with a cache key and the function to run on a miss.',
  },
  {
    icon: Database,
    title: 'Miss Hits the DB',
    tag: 'Read path',
    detail: 'Only when the cache genuinely has nothing does the real database query run — same as the plain, uncached version of the route.',
  },
  {
    icon: Timer,
    title: 'Write With a TTL',
    tag: 'Read path',
    detail: 'Before the response goes out, the fresh result is written into Redis with an expiry — so the next request for the same key gets the fast path.',
  },
  {
    icon: Trash2,
    title: 'Invalidate on Writes',
    tag: 'Write path',
    detail: 'POST/PUT/DELETE routes that change this data explicitly delete the matching cache key, so stale data can\'t outlive the TTL unnoticed.',
  },
  {
    icon: ShieldAlert,
    title: 'Fail Open',
    tag: 'Resilience',
    detail: 'If Redis itself errors or times out, the code catches it and falls straight through to the database — a cache outage should never become an API outage.',
  },
];

export default function RedisNodeContent() {
  return (
    <BlogShell
      category="Backend"
      icon={Terminal}
      title={
        <>
          How to use Redis in a <span className="text-accent">Node.js API.</span>
        </>
      }
      subtitle="The cache-aside pattern from the last post, actually wired into an Express route — connection, helper, invalidation, and the failure handling most tutorials skip."
      readTime="9 min read"
      more={MORE}
    >
      <P>
        The previous post covered what caching is and why Redis is fast. This one is the part that
        actually matters when you&rsquo;re building something: where does the Redis client live,
        what does the route handler actually call, and what happens to your API the moment Redis
        itself has a bad day. Every snippet below is copy-pasteable and uses <Code>ioredis</Code> —
        the most widely used Redis client in the Node.js ecosystem — with Express for the API
        layer.
      </P>

      <Callout type="idea" title="The one-sentence version">
        One Redis client created at boot, one small helper function that checks-then-falls-back,
        and explicit cache deletes on every write — that&rsquo;s almost the entire pattern.
      </Callout>

      <H2 id="building-blocks">The building blocks, in order</H2>
      <P>
        Before the code, here&rsquo;s the shape of what you&rsquo;re actually building — click
        through each piece.
      </P>

      <PipelineDiagram steps={BUILD_STEPS} autoPlayMs={2700} />

      <H2 id="install">1. Install and connect</H2>
      <Pre filename="terminal">{`npm install ioredis`}</Pre>
      <P>
        Create the client once, in its own module, and import it everywhere you need it — never
        create a new <Code>Redis</Code> instance per request.
      </P>
      <Pre filename="lib/redis.js">{`import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => {
  // Log it, but don't crash the process — the fail-open logic below
  // is what actually protects your routes from a Redis outage.
  console.error('Redis connection error:', err.message);
});`}</Pre>

      <Callout type="tip" title="In practice">
        For local development, the fastest way to get a real Redis running is Docker:{' '}
        <Code>docker run -d --name redis -p 6379:6379 redis:7-alpine</Code>. No separate install,
        no config files — just a container you can throw away.
      </Callout>

      <H2 id="helper">2. The cache-aside helper</H2>
      <P>
        This one function is the entire pattern from the last post, in code: check Redis, and only
        do the expensive work if it isn&rsquo;t there.
      </P>
      <Pre filename="lib/cache.js">{`import { redis } from './redis.js';

export async function getOrSetCache(key, ttlSeconds, fetchFn) {
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  const fresh = await fetchFn();
  await redis.set(key, JSON.stringify(fresh), 'EX', ttlSeconds);
  return fresh;
}`}</Pre>

      <Callout type="warning" title="Common mistake">
        Forgetting <Code>JSON.stringify</Code> / <Code>JSON.parse</Code>. Redis stores strings —
        pass it an object directly and you&rsquo;ll either get a runtime error or the literal text{' '}
        <Code>[object Object]</Code> cached back at you.
      </Callout>

      <H2 id="route">3. Using it in a route</H2>
      <P>
        The route itself barely changes shape — the caching is entirely hidden inside the helper.
      </P>
      <Pre filename="routes/products.js">{`import express from 'express';
import { getOrSetCache } from '../lib/cache.js';
import { db } from '../lib/db.js';

const router = express.Router();

router.get('/products/:id', async (req, res) => {
  try {
    const product = await getOrSetCache(
      \`product:\${req.params.id}\`,
      300, // 5 minutes
      () => db.products.findUnique({ where: { id: req.params.id } })
    );

    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;`}</Pre>

      <H2 id="invalidate">4. Invalidating on writes</H2>
      <P>
        A TTL alone means an edit can take up to 5 minutes to show up for other users. The fix is
        the same one from the last post: delete the key the moment the underlying data changes.
      </P>
      <Pre filename="routes/products.js">{`router.put('/products/:id', async (req, res) => {
  const updated = await db.products.update({
    where: { id: req.params.id },
    data: req.body,
  });

  await redis.del(\`product:\${req.params.id}\`);

  res.json(updated);
});`}</Pre>

      <H2 id="fail-open">5. Not letting Redis take your API down</H2>
      <P>
        This is the part most tutorials skip. A cache is an optimization — if it&rsquo;s
        unavailable, the correct behavior is to quietly fall back to the database, not to return a
        500 to every user.
      </P>
      <Pre filename="lib/cache.js">{`export async function getOrSetCache(key, ttlSeconds, fetchFn) {
  let cached = null;

  try {
    cached = await redis.get(key);
  } catch (err) {
    console.error('Redis unavailable, skipping cache read:', err.message);
  }

  if (cached) return JSON.parse(cached);

  const fresh = await fetchFn();

  // Don't await the write — a slow or failing cache write should
  // never delay or break the actual response.
  redis
    .set(key, JSON.stringify(fresh), 'EX', ttlSeconds)
    .catch((err) => console.error('Redis write failed:', err.message));

  return fresh;
}`}</Pre>

      <H2 id="middleware">6. A reusable caching middleware</H2>
      <P>
        Once you&rsquo;re caching more than one or two routes, this pattern is worth lifting into
        middleware so you stop repeating it.
      </P>
      <Pre filename="lib/cacheMiddleware.js">{`export function cacheRoute(ttlSeconds) {
  return async (req, res, next) => {
    const key = \`route:\${req.originalUrl}\`;

    try {
      const cached = await redis.get(key);
      if (cached) return res.json(JSON.parse(cached));
    } catch (err) {
      console.error('Cache read failed:', err.message);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redis.set(key, JSON.stringify(body), 'EX', ttlSeconds).catch(() => {});
      return originalJson(body);
    };

    next();
  };
}

// usage — the route doesn't know it's being cached at all:
router.get('/products', cacheRoute(60), async (req, res) => {
  const products = await db.products.findMany();
  res.json(products);
});`}</Pre>

      <H2 id="jitter">7. Adding TTL jitter</H2>
      <P>
        From the cache-stampede warning in the last post — if a thousand keys all get set with the
        exact same TTL during a traffic spike, they all expire in the same instant later. A few
        seconds of randomness spreads that out.
      </P>
      <Pre filename="lib/cache.js">{`function withJitter(baseSeconds, maxJitterSeconds = 30) {
  return baseSeconds + Math.floor(Math.random() * maxJitterSeconds);
}

await redis.set(key, JSON.stringify(fresh), 'EX', withJitter(300));`}</Pre>

      <H2 id="rate-limiting">Bonus: rate limiting with the same client</H2>
      <P>
        You already have a Redis connection open — <Code>INCR</Code> plus <Code>EXPIRE</Code> is
        enough to build a working rate limiter with no extra infrastructure.
      </P>
      <Pre filename="lib/rateLimit.js">{`export async function isRateLimited(userId, limit = 100, windowSeconds = 60) {
  const key = \`ratelimit:\${userId}\`;
  const count = await redis.incr(key);

  if (count === 1) {
    // Only the request that just created the key sets its expiry.
    await redis.expire(key, windowSeconds);
  }

  return count > limit;
}

app.use(async (req, res, next) => {
  if (await isRateLimited(req.user.id)) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
});`}</Pre>

      <StatRow
        stats={[
          { icon: Boxes, label: 'Client library used', value: 'ioredis' },
          { icon: Gauge, label: 'Typical cache TTL', value: '60s – 5min' },
          { icon: ShieldAlert, label: 'On Redis failure', value: 'Fall back to DB' },
        ]}
      />

      <H2 id="which-client">ioredis vs. the official node-redis client</H2>
      <CompareGrid
        left={{
          title: 'ioredis',
          icon: Zap,
          points: [
            'Promises by default, no extra setup',
            'Built-in Cluster and Sentinel support',
            'Used heavily in production (BullMQ, Socket.IO adapter)',
            'What this post uses',
          ],
        }}
        right={{
          title: 'node-redis (official)',
          icon: Terminal,
          points: [
            'Maintained directly by Redis',
            'Promises by default since v4',
            'Slightly more explicit connect() step',
            'A fine choice too — pick one and be consistent',
          ],
        }}
      />

      <Callout type="warning" title="Common mistake">
        Treating Redis like a SQL connection pool and creating a new client per request. Redis
        connections are cheap to keep open and expensive to keep re-establishing — one shared
        client, created once, is the correct pattern.
      </Callout>

      <Callout type="tip" title="In practice">
        Start with just the <Code>getOrSetCache</Code> helper on your slowest, most-read endpoint.
        Measure the before/after latency, confirm invalidation actually fires on writes, and only
        then reach for the middleware version once you&rsquo;re repeating the pattern across routes.
      </Callout>
    </BlogShell>
  );
}
