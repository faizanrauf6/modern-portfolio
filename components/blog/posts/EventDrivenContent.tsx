'use client';

import { Workflow, Webhook, Database, Send, ShieldCheck, RefreshCw, Layers, Cloud } from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import PipelineDiagram from '@/components/blog/PipelineDiagram';
import { H2, H3, P, UL, LI, Code, Pre, Callout } from '@/components/blog/Prose';

const STEPS = [
  { icon: Webhook, title: 'Accept', tag: 'Verify the source', detail: 'Authenticate the webhook, resolve its tenant from a trusted integration, and validate the event before accepting work.' },
  { icon: Database, title: 'Commit', tag: 'One transaction', detail: 'Persist the order change and an outbox record together. A rolled-back change must not produce a committed event.' },
  { icon: Send, title: 'Publish', tag: 'Durable handoff', detail: 'Publish committed records to the broker. A dispatcher that crashes after publication may publish the same event again.' },
  { icon: ShieldCheck, title: 'Consume', tag: 'Idempotent processing', detail: 'Use a stable event identity and database constraints to protect local state transitions from duplicate delivery.' },
  { icon: RefreshCw, title: 'Reconcile', tag: 'External effects', detail: 'Use the partner’s documented idempotency or lookup support. Review uncertain outcomes before submitting a new operation.' },
];

export default function EventDrivenContent() {
  return (
    <BlogShell category="Solution Architecture" icon={Workflow}
      title={<>Reliable event-driven <span className="text-accent">integrations.</span></>}
      subtitle="Connect databases, message brokers, and partner APIs without losing accepted work or treating every retry as safe."
      readTime="7 min read" author="Muhammad Faizan Rauf"
      more={[
        { href: '/blog/from-requirements-to-solution-architecture', title: 'Architecture Decisions', icon: Layers },
        { href: '/blog/building-observable-resilient-aws-systems', title: 'Resilient AWS Systems', icon: Cloud },
        { href: '/blog/building-reliable-ai-automation', title: 'Reliable AI Automation', icon: Workflow },
      ]}>
      <P>Event-driven integration lets a product keep accepting work while downstream systems run at a different pace. It also creates handoffs where processes can fail. A broker cannot automatically make a database transaction and a partner request succeed as one operation.</P>
      <P>Consider a hypothetical platform connecting merchants to personalization and fulfillment partners. Every accepted order should stay recoverable, tenant boundaries should remain intact, and duplicate messages should not silently create duplicate paid operations.</P>

      <H2 id="event-path">Follow ownership of accepted work</H2>
      <P>A useful event contract identifies its producer, tenant, business entity, and schema version. Follow the diagram to see what persists at each boundary.</P>
      <PipelineDiagram steps={STEPS} />
      <Pre filename="order-event.json" language="json">{`{
  "eventId": "evt-48f2",
  "type": "order.accepted",
  "schemaVersion": 1,
  "tenantId": "merchant-17",
  "orderId": "order-483",
  "orderVersion": 3,
  "occurredAt": "2026-10-14T09:30:00Z",
  "correlationId": "request-a92e"
}`}</Pre>
      <P>Derive tenant ownership from the authenticated integration and authoritative records. A tenant ID in an incoming body is not sufficient authorization. Keep credentials and sensitive customer details out of messages when a consumer can fetch the minimum required fields through an authorized service.</P>

      <H2 id="outbox">Close the database-to-broker crash window</H2>
      <P>Updating an order and separately publishing an event creates a crash window. Reversing the actions can publish a change that later rolls back. AWS’s <a href="https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html" className="underline">transactional outbox guidance</a> describes storing business changes and pending events in one database transaction, then publishing committed events separately.</P>
      <Pre filename="accept-order.sql" language="sql">{`-- Schematic PostgreSQL transaction; values are bound parameters.
BEGIN;
INSERT INTO accepted_webhooks (tenant_id, provider_event_id)
VALUES ($1, $2); -- UNIQUE (tenant_id, provider_event_id)

UPDATE orders SET status = 'accepted', version = version + 1
WHERE tenant_id = $1 AND id = $3 AND status = 'pending';
-- Verify exactly one row changed; otherwise roll back.

INSERT INTO outbox (event_id, tenant_id, order_id, event_type)
VALUES ($4, $1, $3, 'order.accepted');
COMMIT;`}</Pre>
      <P>This is a transaction sketch, not a complete dispatcher or migration. Receiving code must handle a duplicate webhook constraint by finding the prior operation. An unrelated database error must not be mistaken for an already processed event.</P>
      <P>Publication can succeed before the dispatcher records success. As the same <a href="https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html" className="underline">outbox guidance notes</a>, duplicate messages remain possible. The outbox closes a lost-event gap; consumers still need to handle repeated delivery.</P>

      <H2 id="idempotency">Separate event identity from operation identity</H2>
      <P>An event ID identifies a delivery fact. A business operation key identifies an intended effect, such as <Code>merchant-17:order-483:fulfill:revision-2</Code>. Different events may refer to the same effect. Replaying an event and requesting a new approved revision need different identities.</P>
      <H3>Protect local state in one transaction</H3>
      <P>A consumer can insert an event ID into an inbox table and update local business state in the same transaction. A unique constraint handles concurrent duplicates. A rollback removes both changes, allowing recovery. Marking an event complete before updating state would instead lose work.</P>
      <H3>Protect a remote operation at its own boundary</H3>
      <P>A local inbox does not atomically cover a fulfillment request. AWS’s <a href="https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/" className="underline">idempotent API guidance</a> explains the value of caller-provided request identity. Verify the partner’s actual contract: key scope, retention, and behavior when a repeated key has changed parameters.</P>
      <Callout title="A timeout leaves the outcome uncertain">The partner may have accepted fulfillment even when the response is lost. Preserve the operation key and payload. Use lookup or idempotency support to reconcile the outcome; if neither exists, make the uncertainty visible for review.</Callout>

      <H2 id="ordering">Define ordering and replay deliberately</H2>
      <P>Keep an entity version when an older event must not overwrite newer state. A status projection may ignore stale versions; an action processor might need a missing earlier transition before continuing. One “latest event wins” rule is unsafe for every workflow.</P>
      <UL>
        <LI><strong>Schema evolution:</strong> version contracts and plan handling for unknown versions.</LI>
        <LI><strong>Replay scope:</strong> rebuilding a read model must not automatically resend paid fulfillment. Separate those consumers or make replay mode explicit.</LI>
        <LI><strong>Tenant fairness:</strong> cap concurrency and quotas per integration so one merchant cannot consume all capacity.</LI>
      </UL>

      <H2 id="failure-recovery">Give failures a bounded recovery path</H2>
      <P>Separate transient failures from invalid requests and missing permissions. AWS’s <a href="https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/" className="underline">timeout and retry guidance</a> discusses load amplification and backoff with jitter. Bound attempts and assign a clear retry owner instead of multiplying retries across layers.</P>
      <P>An <a href="https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html" className="underline">SQS dead-letter queue</a> can isolate messages that exceed a configured receive threshold. Give it an operational owner: inspect failures, correct the cause, check prior external effects, and redrive deliberately.</P>
      <P>Monitor oldest pending outbox age, queue age, and unreconciled operations. Test by stopping a dispatcher after publication and a worker after submission. Those interrupted operations should remain explainable and recoverable without inventing a fresh business action.</P>
    </BlogShell>
  );
}
