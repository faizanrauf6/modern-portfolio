'use client';

import {
  GitBranch,
  GitPullRequest,
  Webhook,
  Package,
  FileCode2,
  TestTube2,
  Hammer,
  CheckCircle2,
  GitMerge,
  PackageCheck,
  UploadCloud,
  FlaskConical,
  Rocket,
  ShieldCheck,
  Activity,
  BrainCog,
  KeyRound,
  Cookie,
  Gauge,
  RefreshCw,
  Zap,
} from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import PipelineDiagram from '@/components/blog/PipelineDiagram';
import { H2, P, UL, LI, Code, Pre, Callout, StatRow, CompareGrid } from '@/components/blog/Prose';

const MORE = [
  { href: '/blog/how-rag-works', title: 'How RAG Works', icon: BrainCog },
  { href: '/blog/how-jwt-works', title: 'How JWT Works', icon: KeyRound },
  { href: '/blog/how-sessions-work', title: 'How Sessions Work', icon: Cookie },
  { href: '/blog/how-redis-caching-works', title: 'How Redis Caching Works', icon: Zap },
];

const CI_STEPS = [
  {
    icon: GitPullRequest,
    title: 'Push / PR',
    tag: 'Trigger',
    detail: 'A developer pushes a commit or opens a pull request. This is the event that kicks everything else off — no human has to remember to run anything.',
  },
  {
    icon: Webhook,
    title: 'CI Triggers',
    tag: 'Automatic',
    detail: 'GitHub (or GitLab/CircleCI/etc.) fires a webhook the instant it sees the push, spinning up a clean, disposable virtual machine to run the pipeline.',
  },
  {
    icon: Package,
    title: 'Install Deps',
    tag: 'Automatic',
    detail: 'The runner checks out the code and installs exact dependency versions from the lockfile — the same versions every time, on a fresh machine.',
  },
  {
    icon: FileCode2,
    title: 'Lint & Type-check',
    tag: 'Automatic',
    detail: 'Static checks catch obvious mistakes fast and cheaply, before spending time running the full test suite — ESLint, TypeScript, formatting.',
  },
  {
    icon: TestTube2,
    title: 'Run Tests',
    tag: 'Automatic',
    detail: 'Unit and integration tests run against the real code, proving the change didn’t silently break something unrelated.',
  },
  {
    icon: Hammer,
    title: 'Build',
    tag: 'Automatic',
    detail: 'The app is compiled into its production form — confirming it actually builds, not just that it passes tests.',
  },
  {
    icon: CheckCircle2,
    title: 'Report Status',
    tag: 'Automatic',
    detail: 'A green check (or red X) is posted straight onto the pull request. Branch protection rules can block merging until every check is green.',
  },
];

const CD_STEPS = [
  {
    icon: GitMerge,
    title: 'Merge to Main',
    tag: 'Trigger',
    detail: 'Once the PR is approved and every CI check is green, it merges into the main branch — the signal that this code is ready to ship.',
  },
  {
    icon: PackageCheck,
    title: 'Build Artifact',
    tag: 'Automatic',
    detail: 'A production-optimized build (or container image) is produced from main — the exact thing that will run in production, built once.',
  },
  {
    icon: UploadCloud,
    title: 'Push to Registry',
    tag: 'Automatic',
    detail: 'The artifact is uploaded somewhere deployable — a container registry, or a platform like Vercel/Netlify picks it up directly.',
  },
  {
    icon: FlaskConical,
    title: 'Deploy to Staging',
    tag: 'Automatic',
    detail: 'The build goes live on a staging environment first — a production-like environment nobody’s customers are using yet.',
  },
  {
    icon: ShieldCheck,
    title: 'Smoke Tests',
    tag: 'Automatic',
    detail: 'A fast round of health checks hits staging — "does the homepage load, does login work" — before anything touches real users.',
  },
  {
    icon: Rocket,
    title: 'Deploy to Prod',
    tag: 'Automatic',
    detail: 'The same artifact (never rebuilt) rolls out to production — often gradually, to a slice of traffic first, then everyone.',
  },
  {
    icon: Activity,
    title: 'Monitor',
    tag: 'Ongoing',
    detail: 'Error rates and latency are watched immediately after deploy. Many pipelines auto-rollback to the previous version if things spike.',
  },
];

export default function CicdContent() {
  return (
    <BlogShell
      category="DevOps"
      icon={GitBranch}
      title={
        <>
          How CI/CD <span className="text-accent">actually works.</span>
        </>
      }
      subtitle="From a single git push to code running in production, automatically — every gate explained, in order."
      readTime="7 min read"
      more={MORE}
    >
      <P>
        Before CI/CD, shipping code meant someone manually running tests, manually building, and
        manually copying files to a server — slow, and one tired afternoon away from a mistake.{' '}
        <strong className="text-primary">CI/CD</strong> replaces all of that with a pipeline: a
        fixed sequence of automated steps that runs the exact same way, every single time.
      </P>

      <Callout type="idea" title="The one-sentence version">
        CI proves a change is safe (tests, lint, build); CD takes an already-proven change and gets
        it running in front of real users, without a human copying files by hand.
      </Callout>

      <H2 id="ci-vs-cd">CI and CD are two different machines</H2>
      <P>
        They&rsquo;re almost always said together, but they trigger on different events and answer
        different questions.
      </P>

      <CompareGrid
        left={{
          title: 'Continuous Integration',
          icon: GitPullRequest,
          points: [
            'Triggers on every push or pull request',
            'Question it answers: "is this change safe?"',
            'Lint, type-check, tests, build — nothing touches production',
            'Blocks merging if anything fails',
          ],
        }}
        right={{
          title: 'Continuous Deployment',
          icon: Rocket,
          points: [
            'Triggers after a merge to the main branch',
            'Question it answers: "can real users have this now?"',
            'Builds the real artifact once, ships it to staging, then prod',
            '"Continuous Delivery" is the same thing with a manual approval gate',
          ],
        }}
      />

      <H2 id="ci-flow">Continuous Integration — what runs on every push</H2>
      <P>
        This is the pipeline a developer sees on every single pull request, usually finishing in a
        few minutes.
      </P>

      <PipelineDiagram steps={CI_STEPS} autoPlayMs={2500} />

      <H2 id="cd-flow">Continuous Deployment — what runs after merge</H2>
      <P>
        Once code lands on <Code>main</Code>, a second, separate pipeline takes over — this one is
        allowed to touch real infrastructure.
      </P>

      <PipelineDiagram steps={CD_STEPS} autoPlayMs={2700} />

      <H2 id="yaml">What the config actually looks like</H2>
      <P>
        Most CI/CD systems are configured with a YAML file checked into the repo itself — so the
        pipeline is version-controlled right alongside the code it tests. A trimmed-down GitHub
        Actions example for the CI half:
      </P>

      <Pre filename=".github/workflows/ci.yml">{`on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`}</Pre>

      <P>
        Four lines of actual work (<Code>npm ci</Code>, lint, test, build) is the entire CI
        pipeline from the earlier diagram — the rest is the platform wiring the trigger, the
        runner, and the pass/fail status back to the pull request automatically.
      </P>

      <Callout type="warning" title="Common mistake">
        Treating &ldquo;the pipeline is green&rdquo; as proof the app works in production. CI runs
        against a clean, isolated environment — it can&rsquo;t catch a missing production
        environment variable, a real third-party API being down, or a database migration that only
        breaks at real scale. Smoke tests after deploy exist specifically to catch that gap.
      </Callout>

      <H2 id="why-it-matters">Why teams bother with all of this</H2>
      <UL>
        <LI>
          <strong className="text-primary">Consistency.</strong> The exact same steps run on a
          fresh machine every time — no &ldquo;works on my laptop&rdquo; surprises.
        </LI>
        <LI>
          <strong className="text-primary">Speed.</strong> Catching a broken test in 3 minutes on a
          PR is cheap; catching it after it&rsquo;s live is expensive.
        </LI>
        <LI>
          <strong className="text-primary">Confidence to ship often.</strong> Teams that trust
          their pipeline deploy multiple times a day instead of once a quarter — smaller changes
          are easier to debug when something does go wrong.
        </LI>
        <LI>
          <strong className="text-primary">Fast, safe rollback.</strong> Because every deploy is
          just &ldquo;run the same pipeline with the previous commit,&rdquo; undoing a bad release
          is one click, not a fire drill.
        </LI>
      </UL>

      <StatRow
        stats={[
          { icon: Gauge, label: 'Typical CI run time', value: '2–8 minutes' },
          { icon: RefreshCw, label: 'Elite teams deploy', value: 'Multiple times / day' },
          { icon: ShieldCheck, label: 'Rollback trigger', value: 'Auto, on error spike' },
        ]}
      />

      <Callout type="tip" title="In practice">
        This very site ships that way — every push runs lint, tests, and a production build in
        CI (see <Code>.github/workflows/ci.yml</Code> in this repo) before anything reaches the
        live site.
      </Callout>
    </BlogShell>
  );
}
