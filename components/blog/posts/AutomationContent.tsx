'use client';

import { Workflow, Webhook, Database, BrainCog, ShieldCheck, Send, Plug, GitBranch, Server } from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import PipelineDiagram from '@/components/blog/PipelineDiagram';
import { H2, H3, P, UL, LI, Code, Pre, Callout } from '@/components/blog/Prose';

const STEPS = [
  { icon: Webhook, title: 'Receive', tag: 'Verify the event', detail: 'Authenticate the incoming webhook, validate its shape, and derive a stable event key. Persist the event before acknowledging it so a process crash cannot erase accepted work.' },
  { icon: Database, title: 'Persist', tag: 'Durable state', detail: 'Record a unique business operation and enqueue it durably. An outbox can bridge the database and queue so a crash between the two writes does not strand the operation.' },
  { icon: BrainCog, title: 'Draft', tag: 'Bounded model step', detail: 'Ask the model for one structured decision or draft. Save the model version and accepted output so delivery retries do not silently regenerate a different action.' },
  { icon: ShieldCheck, title: 'Validate', tag: 'Deterministic gate', detail: 'Check structure, recipients, factual fields, and business rules in code. Require human review when the proposed action exceeds preauthorized scope.' },
  { icon: Send, title: 'Deliver', tag: 'Idempotent effect', detail: 'Send using a stable operation key when the provider supports it. Persist the provider receipt. An uncertain delivery needs reconciliation, not a blind repeat.' },
];

export default function AutomationContent() {
  return (
    <BlogShell category="Automation" icon={Workflow}
      title={<>AI automation that <span className="text-accent">survives retries.</span></>}
      subtitle="Turn a model-assisted support workflow into a system that can recover from duplicate events, interrupted workers, and uncertain deliveries."
      readTime="7 min read" author="Muhammad Faizan Rauf"
      more={[
        { href: '/blog/how-mcp-tool-calling-works', title: 'MCP Tool Calling', icon: Plug },
        { href: '/blog/how-cicd-works', title: 'How CI/CD Works', icon: GitBranch },
        { href: '/blog/serving-python-ml-models-with-nestjs', title: 'Serving ML Models', icon: Server },
      ]}>
      <P>A support message arrives. An LLM classifies it, drafts a reply, and an API sends the reply. The demo takes three boxes on a whiteboard. The production problem appears when the webhook arrives twice, the model takes too long, or the worker loses its connection just after the email provider accepts the send.</P>
      <P>Reliability comes from making these situations explicit. The model can help interpret a message, while ordinary application code controls state transitions and external effects. The following design is a practical starting point for a reply-drafting workflow; it is not a claim of exactly-once delivery.</P>
      <Callout title="Design around the business operation">“Send the approved reply for ticket 483, revision 2” is an operation you can identify and recover. “Run this prompt again” is only another computation.</Callout>

      <H2 id="workflow">The full path from event to effect</H2>
      <P>Use the diagram to follow the durable record through the workflow. The important question at each step is: what would a replacement worker know after this process stops?</P>
      <PipelineDiagram steps={STEPS} />
      <H3>1. Accept the event once</H3>
      <P>Verify the webhook using the sender’s documented authentication method. Save its event ID under a unique database constraint. A repeated event should find the existing record, not create a second reply. Keep the event ID separate from the operation ID: two distinct events can still refer to the same business action.</P>
      <P>If you write an event to a database and separately add a queue job, there is a crash window between the writes. An outbox design stores the pending job record in the same database transaction as the event. A dispatcher later publishes it; publishing twice must still be safe. This moves the recovery problem into a small, inspectable component.</P>
      <H3>2. Save progress as explicit states</H3>
      <Pre filename="workflow-states.txt" language="text">{`received -> drafting -> needs_review -> approved -> sending -> sent
                 |                         |          |
                 v                         v          v
            draft_failed              retry_wait   reconcile

Terminal outcomes: sent | rejected | failed
Operation key: ticket-483-reply-revision-2`}</Pre>
      <P>Store timestamps, attempt counts, a lease or concurrency guard, the approved draft, and the provider receipt. State transitions should be conditional: one worker can claim an approved operation, and a stale worker cannot overwrite a newer result. A lease alone does not stop an external send after the lease expires; the delivery operation also needs protection.</P>

      <H2 id="model-step">Keep the model step small</H2>
      <P>Ask for a bounded output such as a category and a draft, then validate it. Limit input length and remove secrets before sending content to a model. Treat the incoming support message as untrusted data; it cannot authorize refunds, change recipients, or expand the workflow’s permissions.</P>
      <P>Validate categories against an enum. Derive the recipient from the trusted ticket record, not from a model-generated address. If a refund amount appears in a draft, compare it with the authoritative order data. A response can satisfy a JSON schema while still contradicting the business facts.</P>
      <P>Save the accepted draft and its prompt/model version before delivery. Otherwise, retrying a send might also regenerate the draft, creating two different messages for what was supposed to be the same action. Rejecting a draft and requesting a new revision should create an explicit new revision.</P>
      <Callout type="tip" title="Put review at the consequential boundary">A workflow may automatically classify tickets and prepare replies. Sending, refunding, or changing account state should follow the user’s granted scope. If review is required, show the exact action and save what was approved.</Callout>

      <H2 id="retry-policy">Retry by failure type</H2>
      <P>BullMQ supports bounded attempts and backoff strategies, including exponential backoff and jitter. Its <a href="https://docs.bullmq.io/guide/retrying-failing-jobs" className="underline">retry documentation</a> describes the queue settings. This illustrative job waits longer between attempts; the processor must still classify errors and avoid retrying a permanent failure.</P>
      <Pre filename="enqueue.ts" language="typescript">{`await queue.add('draft-reply', { operationId }, {
  jobId: operationId, // Use an ID without colons for BullMQ.
  attempts: 4,
  backoff: { type: 'exponential', delay: 1000, jitter: 0.5 },
});`}</Pre>
      <UL>
        <LI><strong>Transient failure:</strong> a temporary dependency outage may recover. Retry within a time and attempt budget, and respect the provider’s rate-limit instructions.</LI>
        <LI><strong>Permanent failure:</strong> missing permission, an invalid recipient, or an unsupported category needs a correction or terminal result. More attempts will not repair it.</LI>
        <LI><strong>Ambiguous effect:</strong> a timeout during sending leaves the outcome unknown. Query the provider using an operation key or receipt when possible; otherwise hold it for reconciliation.</LI>
      </UL>
      <P>Put the retry policy in a single responsible layer. If the HTTP client, queue worker, and outer workflow all retry independently, the actual number of external requests can multiply. Track a deadline for the business operation as well as a timeout for each attempt.</P>

      <H2 id="idempotency">A job ID is not enough</H2>
      <P><a href="https://docs.bullmq.io/patterns/idempotent-jobs" className="underline">BullMQ’s idempotent-job guidance</a> recommends designing jobs so repeating them does not change the intended final outcome. Queue deduplication alone cannot protect an external email send, particularly after jobs are removed or delivery succeeds before the worker records completion.</P>
      <P>Use a stable operation key at the provider if it offers durable idempotency with suitable retention. Store that key with the exact approved payload. Reusing a key for different content is a design error. When the provider lacks idempotency or lookup support, document the duplicate risk and make uncertain deliveries a recoverable review state.</P>

      <H2 id="recovery-tests">Test recovery, not just the happy path</H2>
      <P>Replay the same event, stop the worker after drafting, and simulate a timeout immediately after the provider accepts a send. Each scenario should leave a record that explains what happened and a safe next action. Also test malformed model output and denied authorization: neither should reach delivery.</P>
      <P>Monitor queue age, retry counts, validation failures, review backlog, and time spent in reconciliation. These reveal whether the automation is actually finishing work. A dashboard that only counts successful model responses misses the part the user cares about: whether the approved task completed correctly.</P>
    </BlogShell>
  );
}
