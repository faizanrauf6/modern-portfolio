'use client';

import { Layers, MessageSquare, Gauge, Network, FileCheck2, FlaskConical, Workflow, Cloud } from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import PipelineDiagram from '@/components/blog/PipelineDiagram';
import { H2, H3, P, UL, LI, Code, Pre, Callout } from '@/components/blog/Prose';

const STEPS = [
  { icon: MessageSquare, title: 'Discover', tag: 'Business outcome', detail: 'Identify users, the valuable operation, and constraints. Ask what happens when the operation fails before choosing services.' },
  { icon: Gauge, title: 'Quantify', tag: 'Quality attributes', detail: 'Turn “fast” and “reliable” into latency, availability, recovery, and cost targets that stakeholders can evaluate.' },
  { icon: Network, title: 'Boundaries', tag: 'Ownership', detail: 'Assign responsibility for data and business rules. Show which calls are synchronous and which work can finish asynchronously.' },
  { icon: FileCheck2, title: 'Decide', tag: 'Trade-offs', detail: 'Compare credible alternatives and record the chosen approach, its consequences, and the options you rejected.' },
  { icon: FlaskConical, title: 'Validate', tag: 'Evidence', detail: 'Test the riskiest assumption with a small probe. Confirm or revise the design before committing to a large build.' },
];

export default function SolutionArchitectureContent() {
  return (
    <BlogShell category="Solution Architecture" icon={Layers}
      title={<>From requirements to <span className="text-accent">solution architecture.</span></>}
      subtitle="Translate a business goal into service boundaries, measurable constraints, and decisions a delivery team can explain and test."
      readTime="6 min read" author="Muhammad Faizan Rauf"
      more={[
        { href: '/blog/designing-reliable-event-driven-integrations', title: 'Event-Driven Integrations', icon: Workflow },
        { href: '/blog/building-observable-resilient-aws-systems', title: 'Resilient AWS Systems', icon: Cloud },
        { href: '/blog/serving-python-ml-models-with-nestjs', title: 'Serving ML Models', icon: Network },
      ]}>
      <P>“Build an integration platform” leaves most architectural decisions open. Who owns an order? How long may fulfillment take? What happens when a partner API is unavailable? A diagram drawn before answering these questions can look convincing while solving the wrong problem.</P>
      <P>Consider a hypothetical personalization platform that accepts marketplace orders, generates production assets, and submits them to fulfillment partners. The examples here are design exercises, rather than descriptions of a particular client system.</P>

      <H2 id="design-process">A repeatable path to a design</H2>
      <P>Follow the diagram from the business operation to the evidence supporting the architecture. Each step produces something another person can inspect: a requirement, a target, a boundary, a decision, or a test result.</P>
      <PipelineDiagram steps={STEPS} />

      <H2 id="requirements">Start with outcomes and constraints</H2>
      <P>The valuable operation is “accept a valid order and eventually hand the approved asset to the correct fulfillment account.” Identify which parts must succeed together and which can happen later. An accepted order needs a durable record; slow rendering does not have to hold the customer’s HTTP connection open.</P>
      <UL>
        <LI><strong>Actors:</strong> merchants, operators, marketplace APIs, and fulfillment services need different access.</LI>
        <LI><strong>Ownership:</strong> decide which component is authoritative for orders, approval state, and partner receipts.</LI>
        <LI><strong>Constraints:</strong> capture integration quotas, existing systems, operating budget, team size, and retention obligations.</LI>
        <LI><strong>Failure cost:</strong> a delayed status update and duplicate paid fulfillment need different recovery policies.</LI>
      </UL>
      <P>Separate a requirement from an implementation proposal. “A merchant can track accepted orders” is a requirement. “Use five microservices” is an option that needs justification.</P>

      <H2 id="quality-attributes">Make quality attributes measurable</H2>
      <P>For illustration, a team might agree on these initial targets. The numbers are assumptions to validate with stakeholders and measurements, rather than universal recommendations.</P>
      <Pre filename="quality-scenarios.txt" language="text">{`Order acceptance: p95 under 500 ms at the agreed peak load
Normal fulfillment: 95% submitted within 2 minutes
Partner outage: preserve accepted work for later recovery
Tenant isolation: merchants cannot read each other's orders
Recovery: agree restoration time and acceptable data loss separately
Cost: track infrastructure and partner cost per completed order`}</Pre>
      <P>A latency percentile needs a measurement window and a precise operation boundary. The fulfillment target must define how partner downtime is counted. Otherwise two dashboards can report different results while both appear to satisfy the same requirement.</P>
      <Callout title="Size the work, not just the server">If 50 jobs arrive each second and each spends an average of 0.4 seconds processing, steady-state work in progress is roughly 20 jobs. That illustrative average is not a safe worker count: bursts, latency tails, quotas, and outage recovery need separate headroom.</Callout>

      <H2 id="boundaries">Draw boundaries that explain responsibility</H2>
      <P>The <a href="https://c4model.com/diagrams" className="underline">C4 model</a> offers several views of a system. A context view helps explain users and external systems; a container view shows applications and data stores. Here “container” is an architectural abstraction and does not necessarily mean Docker.</P>
      <P>Start the example with a merchant UI, an API owning order state, a durable queue, workers, and a database. Label connections with purpose and direction. Show that the API acknowledges durable acceptance while workers submit to partners asynchronously.</P>
      <H3>Choose the smallest credible deployment model</H3>
      <P>A modular application with a separately scaled worker may be enough initially. Independently deployed services become useful when parts have different scaling, ownership, or release needs. Splitting every module adds network failures and operational work.</P>
      <UL>
        <LI><strong>Keep together:</strong> coupled rules needing one transaction and owned by the same team.</LI>
        <LI><strong>Separate when justified:</strong> expensive processing, constrained adapters, or components with different runtimes.</LI>
        <LI><strong>Define contracts:</strong> document schemas, errors, compatibility, and who can change them.</LI>
      </UL>

      <H2 id="decision-record">Record why the decision fits</H2>
      <P>AWS’s <a href="https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/introduction.html" className="underline">architectural decision record guidance</a> emphasizes preserving the context and reasoning behind important choices. A short record helps future engineers understand the alternatives and consequences.</P>
      <Pre filename="adr-001-order-processing.md" language="markdown">{`# ADR 001: Process fulfillment asynchronously
Status: Accepted for the initial release
Context: Partner APIs can exceed the order-acceptance latency target.
Decision: Persist orders and pending events together; use workers.
Alternatives: Synchronous partner calls; a service for every module.
Consequences: Acceptance is separate from completion. Operators need
queue visibility, retries, and reconciliation for uncertain submissions.
Revisit when: Workload, ownership, partner behavior, or cost changes.`}</Pre>

      <H2 id="validation">Validate the riskiest assumption</H2>
      <P>Before building every screen, probe the partner integration. Measure latency and quota behavior. Check whether it supports a durable idempotency key or submission lookup. Without either, retrying an ambiguous timeout may duplicate fulfillment.</P>
      <P>Run a small end-to-end test: accept an order, stop a worker, restart it, and verify recoverability. Test authorization using two merchants. Review the evidence against the agreed targets; a happy-path demo cannot prove the whole architecture.</P>
      <P>The useful deliverable connects <Code>business operation → measurable target → technical decision → validation</Code>. That connection gives the team a reason to trust the design and a clear trigger for revisiting it.</P>
    </BlogShell>
  );
}
