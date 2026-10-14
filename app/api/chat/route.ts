import OpenAI from 'openai';
import portfolioData from '@/data/portfolio.json';

export const runtime = 'nodejs';
export const maxDuration = 30;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const FIRST_NAME = portfolioData.profile.displayName;

const SYSTEM_PROMPT = `You are "portfolio-term", the built-in terminal assistant on ${portfolioData.profile.name}'s portfolio website.

Rules:
- Answer questions about ${FIRST_NAME} — his experience, skills, projects, education, availability, and how to reach him — using ONLY the JSON profile below.
- Speak about him in the third person ("${FIRST_NAME} has…", "He worked on…").
- Keep it terminal-friendly: plain text, short lines, no markdown headings, no bold. A few "- " bullets are fine.
- Be concise. 2–5 sentences for most answers.
- If a question is unrelated to ${FIRST_NAME}'s work, briefly say so and steer back.
- Never invent facts, numbers, employers, or dates that are not in the profile.
- The AWS Cloud Practitioner exam is in progress, not an earned certification.
- WebShield AI figures are offline temporal evaluation results, not production accuracy.
- If availability or another detail is missing, say it is not specified and suggest contacting him.
- Testimonials marked "draft" are suggested wording awaiting the named person's approval. Never present them as received recommendations or that person's actual words.

PROFILE JSON:
${JSON.stringify(portfolioData)}`;

const textResponse = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  });

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return textResponse(
      'AI is offline. Set OPENAI_API_KEY (and optionally OPENAI_MODEL) in the environment to enable live answers.\n',
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = (Array.isArray(body?.messages) ? body.messages : [])
      .filter(
        (m: unknown): m is ChatMessage =>
          !!m &&
          typeof m === 'object' &&
          ((m as ChatMessage).role === 'user' ||
            (m as ChatMessage).role === 'assistant') &&
          typeof (m as ChatMessage).content === 'string' &&
          (m as ChatMessage).content.trim().length > 0,
      )
      .slice(-10);
  } catch {
    return textResponse('[error] malformed request body.\n', 400);
  }

  if (messages.length === 0) {
    return textResponse('[error] no question provided.\n', 400);
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  let completion;
  try {
    completion = await client.chat.completions.create({
      model,
      stream: true,
      temperature: 0.3,
      max_tokens: 500,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    });
  } catch {
    return textResponse(
      '[error] could not reach the model. Check the API key and model name.\n',
      502,
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch {
        controller.enqueue(encoder.encode('\n[error] the response stream ended early.'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      // Defeat proxy buffering so chunks reach the client as they are produced.
      'x-accel-buffering': 'no',
    },
  });
}
