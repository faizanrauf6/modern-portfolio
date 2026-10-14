'use client';

import { Cloud, Activity, Bell, ShieldCheck, RefreshCw, CheckCircle2, Layers, Workflow, GitBranch } from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import PipelineDiagram from '@/components/blog/PipelineDiagram';
import { H2, H3, P, UL, LI, Code, Pre, Callout } from '@/components/blog/Prose';

const STEPS = [
  { icon: Activity, title: 'Observe', tag: 'User and system signals', detail: 'Collect outcomes, latency, queue age, structured logs, and traces. A running process does not prove that an operation completed.' },
  { icon: Bell, title: 'Detect', tag: 'Actionable alerts', detail: 'Alert on meaningful symptoms with the affected service, time window, and runbook. Avoid paging on every noisy metric.' },
  { icon: ShieldCheck, title: 'Contain', tag: 'Limit the impact', detail: 'Bound concurrency, timeouts, and retries. Keep a slow dependency from exhausting unrelated parts of the system.' },
  { icon: RefreshCw, title: 'Recover', tag: 'Known procedures', detail: 'Restart, replace, roll back, or restore according to the failure. Keep durable state outside disposable application processes.' },
  { icon: CheckCircle2, title: 'Verify', tag: 'Prove the outcome', detail: 'Check a representative user journey and reconcile accepted work. Record the evidence and improve the design.' },
];

export default function AwsResilienceContent() {
  return (
    <BlogShell category="Solution Architect" icon={Cloud}
      title={<>Building observable, <span className="text-accent">resilient AWS systems.</span></>}
      subtitle="Connect telemetry, bounded failure handling, deployment controls, and recovery drills so cloud applications can recover in ways you can verify."
      readTime="6 min read" author="Muhammad Faizan Rauf"
      more={[
        { href: '/blog/from-requirements-to-solution-architecture', title: 'Architecture Decisions', icon: Layers },
        { href: '/blog/designing-reliable-event-driven-integrations', title: 'Event-Driven Integrations', icon: Workflow },
        { href: '/blog/how-cicd-works', title: 'How CI/CD Works', icon: GitBranch },
      ]}>
      <P>An EC2 instance can be running while users cannot submit an order. A container can restart while its worker repeats an external action. Useful reliability work connects infrastructure behavior to the business operation the application must complete.</P>
      <P>Consider a hypothetical Next.js frontend, NestJS API, Python processing service, database, and workers on AWS. This is a design starting point. Redundancy, recovery objectives, and operating cost depend on the workload and the organization running it.</P>

      <H2 id="recovery-loop">Treat recovery as an observable loop</H2>
      <P>The <a href="https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html" className="underline">AWS Well-Architected Reliability Pillar</a> considers foundations, workload architecture, change management, and failure recovery together. A process restart is one mechanism within that larger design.</P>
      <PipelineDiagram steps={STEPS} />

      <H2 id="signals">Observe the operation from end to end</H2>
      <P>Choose signals that answer concrete questions. Can users reach the API? Is accepted work completing? Is a partner slowing down? Is an error concentrated in a new release? CPU usage alone cannot answer these questions.</P>
      <UL>
        <LI><strong>Request metrics:</strong> rate, latency percentiles, and failures by bounded route and operation labels.</LI>
        <LI><strong>Workflow metrics:</strong> queue age, accepted-to-completed time, failures, and pending reconciliation.</LI>
        <LI><strong>Structured logs:</strong> service, environment, release, request ID, operation ID, and an explicit outcome.</LI>
        <LI><strong>Traces:</strong> connect API requests to downstream calls and propagate context through background work.</LI>
      </UL>
      <P><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html" className="underline">Amazon CloudWatch</a> provides metrics, alarms, dashboards, and log tools for applications and infrastructure. Configure collection deliberately; not every application-level signal appears simply because the workload runs on AWS.</P>
      <Pre filename="worker-log.json" language="json">{`{
  "service": "fulfillment-worker",
  "environment": "production",
  "release": "sha-a94c2f",
  "requestId": "req-92f1",
  "operationId": "order-483-revision-2",
  "stage": "partner-submit",
  "outcome": "reconcile-required",
  "durationMs": 3000
}`}</Pre>
      <P>Redact credentials and personal information before collection. Keep high-cardinality request IDs in logs or traces instead of creating a metric series per request. Use retention and sampling policies to keep telemetry useful and affordable.</P>

      <H2 id="health">Give health checks a clear purpose</H2>
      <H3>Liveness and readiness answer different questions</H3>
      <P>Liveness asks whether the process can continue. Readiness asks whether an instance should receive traffic. If a global dependency outage fails liveness on every replica, restarts may add noise without fixing the dependency. Design each check around the recovery action it triggers.</P>
      <P>A synthetic check should exercise a representative user path with controlled test data. Ensure it cannot create paid external effects. A response from <Code>/health</Code> does not prove the complete order or inference workflow works.</P>
      <Callout title="A local restart cannot recover a missing machine">A restart policy can help when a process exits. It does not provide host replacement, database recovery, or availability across zones. Process, host, dependency, and regional failures need separate scenarios.</Callout>

      <H2 id="containment">Bound the resources a failure can consume</H2>
      <P>Set downstream deadlines, cap worker concurrency, and apply per-partner limits. Unlimited waiting in a shared pool can let one slow integration exhaust database connections and block unrelated requests.</P>
      <P>AWS’s discussion of <a href="https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/" className="underline">timeouts, retries, and jitter</a> explains how retries can increase load during outages. Retry safe operations with a bounded budget. Reconcile an ambiguous external write instead of assuming failure.</P>
      <P>Adding workers does not increase a partner’s quota or create unlimited database connections. Identify the constrained dependency before treating more replicas as the solution.</P>

      <H2 id="delivery">Make deployments reversible</H2>
      <P>Build a versioned artifact, run relevant checks, and deploy it consistently. Attach the release ID to telemetry. Use a limited rollout when supported, compare user-facing indicators, and define when to stop or roll back.</P>
      <UL>
        <LI><strong>Configuration:</strong> validate required values before accepting traffic; keep secrets outside images.</LI>
        <LI><strong>Schema changes:</strong> expand and contract so old and new versions can coexist during rollout.</LI>
        <LI><strong>Rollback:</strong> verify the previous application still works with the current schema. Reverting an image does not undo every data change.</LI>
        <LI><strong>Permissions:</strong> scope application and deployment identities to their responsibilities.</LI>
      </UL>

      <H2 id="recovery">Agree recovery objectives, then test them</H2>
      <P>Recovery time objective is the targeted restoration time. Recovery point objective is the targeted data loss, commonly expressed as time. These business choices affect backup frequency, redundancy, procedures, and cost. A successful backup job does not prove either target.</P>
      <Pre filename="recovery-exercise.txt" language="text">{`Scenario: primary database unavailable
Before: agree restoration-time and data-loss objectives
Exercise: restore a backup into an isolated environment
Verify: schema, access, records, and representative application workflows
Reconcile: accepted work and uncertain partner submissions
Record: elapsed time, gaps, owner, and follow-up actions`}</Pre>
      <P>A useful exercise ends with application evidence: the representative operation works, recovered records make sense, and interrupted work has an owner. Test procedures in controlled conditions before depending on them during an incident.</P>
      <P>Assess the design through three questions: what is failing, how is the impact bounded, and how will successful recovery be verified?</P>
    </BlogShell>
  );
}
