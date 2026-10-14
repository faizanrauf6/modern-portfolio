'use client';

import {
  Cookie,
  User,
  Server,
  Database,
  ShieldCheck,
  LogOut,
  BrainCog,
  KeyRound,
  GitBranch,
  Layers,
  Gauge,
  Zap,
} from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import SequenceDiagram, { type SeqStep } from '@/components/blog/SequenceDiagram';
import { H2, P, UL, LI, Code, Callout, StatRow, CompareGrid } from '@/components/blog/Prose';

const MORE = [
  { href: '/blog/how-rag-works', title: 'How RAG Works', icon: BrainCog },
  { href: '/blog/how-jwt-works', title: 'How JWT Works', icon: KeyRound },
  { href: '/blog/how-cicd-works', title: 'How CI/CD Works', icon: GitBranch },
  { href: '/blog/how-redis-caching-works', title: 'How Redis Caching Works', icon: Zap },
];

const ACTORS = [
  { label: 'Client', icon: User },
  { label: 'Server', icon: Server },
  { label: 'Session Store', icon: Database },
];

const STEPS: SeqStep[] = [
  {
    kind: 'arrow',
    from: 0,
    to: 1,
    tone: 'request',
    label: 'POST /login  { email, password }',
    detail: 'Same first step as any login — credentials go to the server once, over HTTPS.',
  },
  {
    kind: 'self',
    actor: 1,
    icon: ShieldCheck,
    label: 'Verify credentials against the database',
    detail: 'The server checks the password hash, same as always.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 2,
    tone: 'request',
    label: 'CREATE session  { id: "sess_abc123", userId: 42 }',
    detail: 'The server generates a random, unguessable session ID and writes a record — who it belongs to, when it expires — into shared storage (often Redis).',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 0,
    tone: 'response',
    label: 'Set-Cookie: sessionId=sess_abc123; HttpOnly; Secure',
    detail: 'The response carries only the session ID in a cookie — never the user\'s data. The ID is a pointer, not the payload.',
  },
  {
    kind: 'self',
    actor: 0,
    icon: Cookie,
    label: 'Browser stores the cookie automatically',
    detail: 'No JavaScript required — the browser remembers this cookie and will attach it to every future request to this domain on its own.',
  },
  {
    kind: 'arrow',
    from: 0,
    to: 1,
    tone: 'request',
    label: 'GET /api/orders   Cookie: sessionId=sess_abc123',
    detail: 'The browser attaches the cookie automatically. The client code didn\'t have to do anything.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 2,
    tone: 'request',
    label: 'LOOKUP sess_abc123',
    detail: 'Unlike a JWT, the server has to ask the session store "who is this?" on every single request.',
  },
  {
    kind: 'arrow',
    from: 2,
    to: 1,
    tone: 'response',
    label: '{ userId: 42, expiresAt: ... }',
    detail: 'The store returns the session record if it exists and hasn\'t expired — the server now knows who\'s asking.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 0,
    tone: 'response',
    label: '200 OK  { orders: [...] }',
    detail: 'Access granted — backed by a real lookup, not just math. That lookup is the trade-off for a superpower: instant revocation.',
  },
];

export default function SessionsContent() {
  return (
    <BlogShell
      category="Auth"
      icon={Cookie}
      title={
        <>
          How sessions <span className="text-accent">actually work.</span>
        </>
      }
      subtitle="Cookie-based login, traced through a real request — and why the server remembering you is a feature, not just a cost."
      readTime="7 min read"
      more={MORE}
    >
      <P>
        Where a JWT makes the client carry proof of identity, a{' '}
        <strong className="text-primary">session</strong> makes the server remember you. Login
        creates a record in server-side storage; the browser only ever holds a small random ID
        pointing at that record. Every request, the server asks &ldquo;who does this ID belong
        to?&rdquo;
      </P>

      <Callout type="idea" title="The one-sentence version">
        A session cookie is a pointer, not the data — the real &ldquo;who is this user&rdquo; lives
        in server storage, which is exactly what makes it revocable in an instant.
      </Callout>

      <H2 id="whats-a-session">What&rsquo;s actually in the cookie</H2>
      <P>
        Open your browser&rsquo;s dev tools on almost any logged-in site and you&rsquo;ll see
        something like <Code>connect.sid=s%3AaBcD1234...</Code>. That&rsquo;s it — a random string.
        It carries no name, no role, no permissions. All of that lives in a record on the server,
        keyed by this ID:
      </P>
      <UL>
        <LI>
          <strong className="text-primary">The cookie</strong> — just the session ID, marked{' '}
          <Code>HttpOnly</Code> (invisible to JS) and <Code>Secure</Code> (HTTPS only).
        </LI>
        <LI>
          <strong className="text-primary">The session store</strong> — a fast key-value store
          (Redis is the usual choice) or a database table mapping that ID to{' '}
          <Code>{'{ userId, role, createdAt, expiresAt }'}</Code>.
        </LI>
      </UL>

      <H2 id="flow">The full round trip, request by request</H2>
      <P>
        Login, then one authenticated request — notice the extra hop to the session store on
        <em> every</em> request. Click any arrow to jump straight to that moment.
      </P>

      <SequenceDiagram actors={ACTORS} steps={STEPS} autoPlayMs={2500} />

      <H2 id="revocation">The superpower: logging someone out for real</H2>
      <P>
        Because the server actually owns the record, logging out is a single delete:{' '}
        <Code>DELETE session sess_abc123</Code>. The next request with that cookie finds nothing in
        the store and is rejected immediately — even if the cookie itself is still sitting in the
        browser. Compare that to a JWT, which stays valid until it naturally expires, no matter what
        the server wants.
      </P>

      <Callout type="warning" title="Common mistake">
        Storing sessions in a single server&rsquo;s memory (the default in many tutorials) silently
        breaks the moment you run more than one server instance — user A logs in on server 1, their
        next request hits server 2, which has never heard of them. Use a shared store like Redis
        once you have more than one instance.
      </Callout>

      <H2 id="cookie-flags">The three cookie flags that actually matter</H2>
      <CompareGrid
        left={{
          title: 'What each flag blocks',
          icon: ShieldCheck,
          points: [
            'HttpOnly — JavaScript can\'t read the cookie, closing off XSS theft',
            'Secure — the cookie is only ever sent over HTTPS, never plain HTTP',
            'SameSite=Lax/Strict — blocks the cookie from being sent on cross-site requests, limiting CSRF',
          ],
        }}
        right={{
          title: 'What revocation unlocks',
          icon: LogOut,
          points: [
            '"Log out everywhere" — delete every session row for a user',
            'Force-expire a session after a password change',
            'Kill a session the moment suspicious activity is detected',
          ],
        }}
      />

      <StatRow
        stats={[
          { icon: Database, label: 'Common store', value: 'Redis / Memcached' },
          { icon: Gauge, label: 'Typical TTL', value: '7–30 days, sliding' },
          { icon: Layers, label: 'Lookup cost', value: '1 store read / request' },
        ]}
      />

      <H2 id="vs-jwt">Sessions vs. JWT, side by side</H2>
      <P>
        Neither is &ldquo;better&rdquo; — they trade the same two things in opposite directions: a
        session costs you a lookup on every request but buys instant, total revocation; a JWT skips
        the lookup for pure speed and horizontal scale, but a stolen token stays valid until it
        expires. Plenty of real systems use both — short JWT access tokens for API calls, backed by
        a session-like refresh token the server can revoke.
      </P>
    </BlogShell>
  );
}
