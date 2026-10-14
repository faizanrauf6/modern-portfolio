'use client';

import { Server, ShieldCheck, Network, BrainCog, ClipboardCheck, Workflow, Plug } from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import PipelineDiagram from '@/components/blog/PipelineDiagram';
import { H2, H3, P, UL, LI, Code, Pre, Callout } from '@/components/blog/Prose';

const STEPS = [
  { icon: ShieldCheck, title: 'Validate', tag: 'Public API', detail: 'NestJS authenticates the caller, authorizes the operation, and validates a versioned request. It enforces limits before forwarding any inference work.' },
  { icon: Network, title: 'Call Python', tag: 'Private contract', detail: 'A dedicated provider sends a bounded HTTP request to a configured internal service. It includes a correlation ID and applies an explicit deadline.' },
  { icon: BrainCog, title: 'Predict', tag: 'Warm artifact', detail: 'Python uses a trusted model and fitted preprocessing loaded at startup. It validates the feature contract and computes a score without retraining.' },
  { icon: ClipboardCheck, title: 'Check result', tag: 'Runtime validation', detail: 'NestJS verifies the response shape, finite score, and expected model version. A TypeScript interface alone cannot validate bytes received over the network.' },
  { icon: Server, title: 'Respond', tag: 'Honest outcome', detail: 'The API returns a score plus model version, or a clear unavailable result. A timeout must never be translated into a confident benign prediction.' },
];

export default function NestMlContent() {
  return (
    <BlogShell category="Backend" icon={Server}
      title={<>Python models, <span className="text-accent">NestJS APIs.</span></>}
      subtitle="A practical service boundary for TypeScript product logic and Python inference, with versioned inputs, warm models, timeouts, and observable failures."
      readTime="8 min read" author="Muhammad Faizan Rauf"
      more={[
        { href: '/blog/evaluating-phishing-detection-models', title: 'Evaluating Detectors', icon: ShieldCheck },
        { href: '/blog/building-reliable-ai-automation', title: 'Reliable Automation', icon: Workflow },
        { href: '/blog/how-mcp-tool-calling-works', title: 'MCP Tool Calling', icon: Plug },
      ]}>
      <P>Your product already uses NestJS for users, permissions, and APIs. Your model training code uses Python. Serving the model does not require choosing one language for everything: expose inference through a small internal service and keep product decisions in the public API.</P>
      <P>This design introduces a network boundary, so it is useful when independent deployment, Python dependencies, or separate scaling justify that cost. For a tiny application, a simpler single-runtime deployment may be easier to operate. The goal is a clear contract, not an impressive number of services.</P>
      <Callout title="Two services, two responsibilities">NestJS owns the caller’s identity, authorization, and product response. Python owns the fitted preprocessing and prediction artifact. Both sides validate what crosses the boundary.</Callout>

      <H2 id="request-path">Follow one prediction</H2>
      <P>The example scores numeric URL features. It does not fetch a submitted URL, and it does not claim that these three features form an effective phishing detector. Keeping the example small makes the service contract easier to inspect.</P>
      <PipelineDiagram steps={STEPS} />
      <H3>1. Version the input contract</H3>
      <Pre filename="prediction-contract.json" language="json">{`{
  "request": {
    "schemaVersion": "url-features-v1",
    "urlLength": 132,
    "digitCount": 8,
    "hasIpHost": false
  },
  "response": {
    "modelVersion": "url-risk-2026-10-01",
    "score": 0.73
  }
}`}</Pre>
      <P>Define feature order, units, valid ranges, missing-value behavior, and the positive class. “Length” could mean bytes or characters; make the choice explicit in the feature specification. A model trained with one interpretation must not silently receive another. Give the fitted preprocessing and model a shared versioned artifact.</P>
      <P>NestJS can validate public request DTOs using its <a href="https://docs.nestjs.com/techniques/validation" className="underline">ValidationPipe</a>. Configure the policy for unexpected properties deliberately. Validation is separate from authentication, authorization, request-size limits, and rate limits; the application still needs those controls.</P>

      <H2 id="python-service">Load once, predict many times</H2>
      <P>FastAPI’s <a href="https://fastapi.tiangolo.com/advanced/events/" className="underline">lifespan mechanism</a> lets you load shared resources before serving requests and release them during shutdown. Its <a href="https://fastapi.tiangolo.com/tutorial/body/" className="underline">request-body support</a> uses Pydantic models for validation. The sketch below assumes Pydantic v2 and a trusted, previously fitted binary classifier whose positive label is <Code>1</Code>.</P>
      <Pre filename="inference.py" language="python">{`from contextlib import asynccontextmanager
from typing import Literal
import joblib
from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict, Field

MODEL_VERSION = "url-risk-2026-10-01"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Artifact and dependency versions are pinned by the deployment.
    app.state.pipeline = joblib.load("/models/url-risk.joblib")
    yield
    del app.state.pipeline

app = FastAPI(lifespan=lifespan)

class Features(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    schemaVersion: Literal["url-features-v1"]
    urlLength: int = Field(ge=1, le=8192)
    digitCount: int = Field(ge=0, le=8192)
    hasIpHost: bool

class Prediction(BaseModel):
    modelVersion: str
    score: float = Field(ge=0, le=1, allow_inf_nan=False)

@app.post("/v1/predict", response_model=Prediction)
def predict(features: Features):
    row = [[features.urlLength, features.digitCount,
            int(features.hasIpHost)]]
    pipeline = app.state.pipeline
    positive = list(pipeline.classes_).index(1)
    score = float(pipeline.predict_proba(row)[0, positive])
    return Prediction(modelVersion=MODEL_VERSION, score=score)`}</Pre>
      <P>Deploy this only behind an authenticated internal boundary; service-to-service identity and network policy are omitted from the sketch. Validate cross-field rules too, such as a digit count no larger than URL length. The feature limits are illustrative contract choices, not universal URL rules.</P>
      <Callout type="warning" title="A model artifact can execute code">Pickle-based formats, including joblib, can execute arbitrary code when loaded. Only load trusted artifacts from your controlled build process. Scikit-learn’s <a href="https://scikit-learn.org/stable/model_persistence.html" className="underline">persistence documentation</a> also describes version-compatibility limits; deploy the artifact with its pinned runtime environment.</Callout>
      <P>Startup failure should keep the instance out of readiness. Run a small compatibility prediction before declaring it ready, including the expected feature schema and output class. Each server worker normally loads its own copy, so account for model memory when choosing the process count.</P>

      <H2 id="nestjs-client">Make the network call bounded</H2>
      <P>Put the client behind an injectable provider so controllers do not duplicate networking logic. NestJS documents its configurable <a href="https://docs.nestjs.com/techniques/http-module" className="underline">HTTP client</a>; the illustrative provider below uses Node’s built-in fetch. The configured URL must come from trusted deployment configuration, never a user-supplied target.</P>
      <Pre filename="inference.service.ts" language="typescript">{`import { Injectable, ServiceUnavailableException } from '@nestjs/common';

type Features = {
  schemaVersion: 'url-features-v1';
  urlLength: number;
  digitCount: number;
  hasIpHost: boolean;
};

function validPrediction(value: unknown): value is {
  modelVersion: string; score: number;
} {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return item.modelVersion === 'url-risk-2026-10-01'
    && typeof item.score === 'number'
    && Number.isFinite(item.score)
    && item.score >= 0 && item.score <= 1;
}

@Injectable()
export class InferenceService {
  async predict(features: Features, requestId: string) {
    try {
      // Validate required config during application startup.
      const response = await fetch(process.env.INFERENCE_PREDICT_URL!, {
        method: 'POST',
        redirect: 'error',
        headers: {
          'content-type': 'application/json',
          'x-request-id': requestId,
          // Supply service identity through your deployment's auth mechanism.
        },
        body: JSON.stringify(features),
        signal: AbortSignal.timeout(1500),
      });
      if (!response.ok) throw new Error('Inference returned an error');
      const result: unknown = await response.json();
      if (!validPrediction(result)) throw new Error('Invalid inference result');
      return result;
    } catch {
      // Emit a redacted, correlated failure event in the real provider.
      throw new ServiceUnavailableException('Prediction is unavailable');
    }
  }
}`}</Pre>
      <P>This provider deliberately returns an unavailable error for dependency failures. In a complete implementation, classify upstream validation failures separately, cap response size, and log a redacted failure category. The TypeScript request type helps developers, but the public route and Python endpoint still need runtime validation.</P>

      <H2 id="operating">Keep failure and capacity visible</H2>
      <UL>
        <LI><strong>Budget time:</strong> the internal timeout must fit inside the public request’s deadline. A client abort does not guarantee that Python has stopped computing; use concurrency limits and bounded queues.</LI>
        <LI><strong>Retry sparingly:</strong> prediction should be free of business side effects, but repeated inference still consumes capacity. Retry only appropriate transient failures and keep a shared time budget.</LI>
        <LI><strong>Separate score from policy:</strong> a score is model output. The product’s warning or blocking threshold should be evaluated, versioned, and monitored as its own policy.</LI>
        <LI><strong>Observe versions:</strong> attach a request ID and model version to logs and metrics. Track latency, unavailable responses, invalid results, and missing-feature rates without logging sensitive raw URLs.</LI>
      </UL>
      <P>For expensive batch inference, a queue and an asynchronous job status may fit better than a long HTTP request. For small synchronous predictions, begin with the bounded service call, load test realistic concurrency, and scale from observed bottlenecks.</P>
      <P>Verify a known prediction, an invalid input, a wrong model version, a slow response, and a model-load failure. The success criterion is both a correct prediction path and an honest failure path: users should be able to tell the difference between “low risk” and “the detector could not run.”</P>
    </BlogShell>
  );
}
