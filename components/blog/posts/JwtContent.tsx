'use client';

import {
  KeyRound,
  User,
  Server,
  Clock,
  Hash,
  BrainCog,
  Cookie,
  GitBranch,
  MonitorSmartphone,
  Database,
  Gauge,
  ShieldCheck,
  FileSignature,
  Save,
  BadgeCheck,
  Zap,
} from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import SequenceDiagram, { type SeqStep } from '@/components/blog/SequenceDiagram';
import { H2, P, UL, LI, Code, Callout, StatRow, CompareGrid } from '@/components/blog/Prose';

const MORE = [
  { href: '/blog/how-rag-works', title: 'How RAG Works', icon: BrainCog },
  { href: '/blog/how-sessions-work', title: 'How Sessions Work', icon: Cookie },
  { href: '/blog/how-cicd-works', title: 'How CI/CD Works', icon: GitBranch },
  { href: '/blog/how-redis-caching-works', title: 'How Redis Caching Works', icon: Zap },
];

const ACTORS = [
  { label: 'Client', icon: User },
  { label: 'Server', icon: Server },
];

const STEPS: SeqStep[] = [
  {
    kind: 'arrow',
    from: 0,
    to: 1,
    tone: 'request',
    label: 'POST /login  { email, password }',
    detail: 'The user submits credentials once, over HTTPS. This is the only time a password is ever sent.',
  },
  {
    kind: 'self',
    actor: 1,
    icon: ShieldCheck,
    label: 'Verify credentials against the database',
    detail: 'The server looks up the user and checks the password hash. This is the last database read in the whole flow.',
  },
  {
    kind: 'self',
    actor: 1,
    icon: FileSignature,
    label: 'Sign a JWT: header.payload.signature',
    detail: 'The server builds a payload ({ userId, role, exp }), then signs it with a secret key. The signature is what makes it tamper-proof.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 0,
    tone: 'response',
    label: '200 OK  { token: "eyJhbGciOi..." }',
    detail: 'The signed token is handed back to the client. The server does not save it anywhere — it has no memory of issuing it.',
  },
  {
    kind: 'self',
    actor: 0,
    icon: Save,
    label: 'Store the token',
    detail: 'The client holds onto the token — in memory, localStorage, or an httpOnly cookie — to attach to future requests.',
  },
  {
    kind: 'arrow',
    from: 0,
    to: 1,
    tone: 'request',
    label: 'GET /api/orders   Authorization: Bearer eyJhbG...',
    detail: 'Every later request carries the token in a header. No cookies or server session required for this to work.',
  },
  {
    kind: 'self',
    actor: 1,
    icon: BadgeCheck,
    label: 'Verify signature + check expiry — zero DB lookups',
    detail: 'The server recomputes the signature with its secret key and checks the exp field. If it matches and isn\'t expired, the token is trusted instantly.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 0,
    tone: 'response',
    label: '200 OK  { orders: [...] }',
    detail: 'Access granted — purely from math, not a lookup. This is the whole point of JWTs: the server stays stateless.',
  },
];

export default function JwtContent() {
  return (
    <BlogShell
      category="Auth"
      icon={KeyRound}
      title={
        <>
          How JWT <span className="text-accent">actually works.</span>
        </>
      }
      subtitle="JSON Web Tokens, traced through a real login and a real API call — and why the server never has to remember you."
      readTime="7 min read"
      more={MORE}
    >
      <P>
        Traditional logins made the server remember you — a session stored in memory or a database,
        looked up on every request. A <strong className="text-primary">JWT (JSON Web Token)</strong>{' '}
        flips that: instead of the server remembering, the client carries a small, signed proof of
        who it is on every single request. The server verifies the proof with math, not a lookup.
      </P>

      <Callout type="idea" title="The one-sentence version">
        A JWT is a tamper-proof claim — &ldquo;I am user 42, and the server agreed to this as of 10
        minutes ago&rdquo; — that the client presents instead of making the server remember it.
      </Callout>

      <H2 id="anatomy">What&rsquo;s actually inside a JWT</H2>
      <P>
        A JWT is just three base64url-encoded chunks joined by dots:{' '}
        <Code>header.payload.signature</Code>. Paste any JWT into jwt.io and you can read the first
        two parts instantly — they are <em>encoded, not encrypted</em>.
      </P>
      <UL>
        <LI>
          <strong className="text-primary">Header</strong> — which algorithm signed this token,
          e.g. <Code>{'{ "alg": "HS256", "typ": "JWT" }'}</Code>.
        </LI>
        <LI>
          <strong className="text-primary">Payload</strong> — the actual claims:{' '}
          <Code>{'{ "sub": "user_42", "role": "admin", "exp": 1735689600 }'}</Code>. Anyone who
          intercepts the token can read this.
        </LI>
        <LI>
          <strong className="text-primary">Signature</strong> —{' '}
          <Code>{'HMACSHA256(header + "." + payload, secretKey)'}</Code>. Change one character of
          the payload and the signature no longer matches — that&rsquo;s how tampering gets caught.
        </LI>
      </UL>

      <Callout type="warning" title="Common mistake">
        The payload is readable by anyone with the token — it is signed, not encrypted. Never put
        passwords, secrets, or anything sensitive in a JWT payload, even if &ldquo;only the server
        reads it.&rdquo; The client (and anyone on the network) can decode it in one line of code.
      </Callout>

      <H2 id="flow">The full round trip, request by request</H2>
      <P>
        Here&rsquo;s the entire lifecycle: one login, then one authenticated request. Click any
        arrow to jump to that moment, or let it play.
      </P>

      <SequenceDiagram actors={ACTORS} steps={STEPS} autoPlayMs={2600} />

      <H2 id="why-stateless">Why &ldquo;no database lookup&rdquo; is the whole point</H2>
      <P>
        After login, the server never queries anything to check who you are — it just re-verifies
        the signature using a secret key only it knows. That means any server behind a load
        balancer can validate the same token without sharing session state, which is exactly why
        JWTs are the default for APIs and microservices that need to scale horizontally.
      </P>

      <H2 id="storage">Where should the client keep the token?</H2>
      <CompareGrid
        left={{
          title: 'localStorage',
          icon: MonitorSmartphone,
          points: [
            'Easy to read and attach manually in JS',
            'Survives tab refreshes and browser restarts',
            'Readable by any script on the page — a classic XSS risk',
            'Never sent automatically, so no CSRF exposure',
          ],
        }}
        right={{
          title: 'httpOnly cookie',
          icon: Database,
          points: [
            'Invisible to JavaScript — immune to XSS theft',
            'Sent automatically by the browser on every request',
            'Needs CSRF protection since it\'s sent automatically',
            'Requires same-site / domain configuration to scope it',
          ],
        }}
      />

      <StatRow
        stats={[
          { icon: Clock, label: 'Typical access token life', value: '15 min – 1 hr' },
          { icon: Hash, label: 'Common algorithms', value: 'HS256 / RS256' },
          { icon: Gauge, label: 'Per-request overhead', value: '~100–400 bytes' },
        ]}
      />

      <Callout type="tip" title="In practice">
        Most production setups pair a short-lived JWT access token with a longer-lived refresh
        token stored in an httpOnly cookie — so a stolen access token expires fast, while the user
        doesn&rsquo;t have to re-login every 15 minutes.
      </Callout>

      <H2 id="vs-sessions">JWT vs. sessions, in one line</H2>
      <P>
        JWTs trade a database lookup for a math check — great for stateless, distributed APIs, but
        it means you can&rsquo;t instantly revoke a single token (it&rsquo;s valid until it expires,
        full stop). Sessions make the opposite trade. That comparison is exactly what the next post
        covers.
      </P>
    </BlogShell>
  );
}
