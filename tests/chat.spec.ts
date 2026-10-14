import { test, expect } from '@playwright/test';
import { POST } from '../app/api/chat/route';
import { buildPortfolioPrompt } from '../lib/portfolio-chat';

test.describe.configure({ mode: 'serial' });

const request = (messages: unknown[]) => new Request('http://localhost/api/chat', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ messages }),
});

test('includes approved recommendation wording only when asked about recommendations or reviewers', () => {
  const normal = buildPortfolioPrompt('Tell me about his backend experience.');
  const reviews = buildPortfolioPrompt('What do colleagues recommend him for?');
  expect(normal).not.toContain('RECOMMENDATIONS:');
  expect(reviews).toContain('Stephen Chin');
  expect(reviews).toContain('Khizar Rehman');
  expect(buildPortfolioPrompt('What did Stephen say?')).toBe(reviews);
});

test('streams an answer with bounded history, a compact profile, and inexpensive defaults', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  const originalModel = process.env.OPENAI_MODEL;
  process.env.OPENAI_API_KEY = 'test-placeholder';
  delete process.env.OPENAI_MODEL;
  let payload: Record<string, unknown> = {};
  globalThis.fetch = async (_url, init) => {
    payload = JSON.parse(String(init?.body));
    return new Response('data: {"choices":[{"delta":{"content":"Test answer"}}]}\n\ndata: [DONE]\n\n', {
      headers: { 'content-type': 'text/event-stream' },
    });
  };
  try {
    const messages = Array.from({ length: 10 }, (_, i) => ({
      role: i % 2 ? 'assistant' : 'user', content: 'x'.repeat(1000),
    }));
    messages.push({ role: 'user', content: 'What did he build at HelloCustom?' });
    const response = await POST(request(messages));
    expect(await response.text()).toBe('Test answer');
    expect(payload.model).toBe('gpt-6-luna');
    expect(payload.max_completion_tokens).toBe(200);
    expect(payload.reasoning_effort).toBe('none');
    const sent = payload.messages as { role: string; content: string }[];
    expect(sent).toHaveLength(5); // System prompt plus four chat messages.
    expect(sent.slice(1).every((m) => m.content.length <= 800)).toBe(true);
    expect(sent.at(-1)?.content).toBe('What did he build at HelloCustom?');
    expect(sent[0].content).toContain('Muhammad Faizan Rauf');
    expect(sent[0].content).toContain('HelloCustom');
    expect(sent[0].content).toContain('Epic');
    expect(sent[0].content).toContain('exam in progress');
    expect(sent[0].content).toContain('offline temporal evaluation');
    expect(sent[0].content).not.toContain('longDescription');
    expect(sent[0].content).not.toContain('testimonials');
    expect(sent[0].content).not.toContain('checkedAt');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.OPENAI_MODEL;
    else process.env.OPENAI_MODEL = originalModel;
  }
});

test('rejects oversized questions before making a paid request', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-placeholder';
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response('', { status: 500 }); };
  try {
    const response = await POST(request([{ role: 'user', content: 'x'.repeat(601) }]));
    expect(response.status).toBe(400);
    expect(await response.text()).toContain('600');
    expect(calls).toBe(0);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  }
});
