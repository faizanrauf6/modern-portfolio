import OpenAI from 'openai';
import { buildPortfolioPrompt } from '@/lib/portfolio-chat';

export const runtime = 'nodejs';
export const maxDuration = 30;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const MAX_QUESTION_CHARS = 600;
const MAX_HISTORY_CHARS = 800;

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
      .slice(-4);
  } catch {
    return textResponse('[error] malformed request body.\n', 400);
  }

  if (messages.length === 0) {
    return textResponse('[error] no question provided.\n', 400);
  }

  const question = messages.at(-1);
  if (question?.role !== 'user') {
    return textResponse('[error] the last message must be a question.\n', 400);
  }
  if (question.content.length > MAX_QUESTION_CHARS) {
    return textResponse(`[error] keep your question within ${MAX_QUESTION_CHARS} characters.\n`, 400);
  }
  messages = messages.map(({ role, content }) => ({
    role, content: content.trim().slice(0, MAX_HISTORY_CHARS),
  }));

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-6-luna';
  const prompt = buildPortfolioPrompt(messages.filter((m) => m.role === 'user').map((m) => m.content).join('\n'));

  let completion;
  try {
    completion = await client.chat.completions.create({
      model,
      stream: true,
      max_completion_tokens: 200,
      ...(model === 'gpt-6-luna' ? { reasoning_effort: 'none' as const } : {}),
      messages: [{ role: 'system', content: prompt }, ...messages],
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
