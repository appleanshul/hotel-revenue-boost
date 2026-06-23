/**
 * Shared Lovable AI Gateway helper — GPT-only.
 *
 * PROJECT RULE: every AI call in this project MUST go through this helper and
 * MUST use one of the GPT models in GPT_MODELS. Do NOT call Gemini, Claude,
 * or any non-GPT provider. See mem://policies/ai-models.
 *
 * Usage inside an edge function:
 *   import { createLovableAiGatewayProvider, GPT_MODELS } from "../_shared/ai-gateway.ts";
 *   import { streamText } from "npm:ai";
 *
 *   const gateway = createLovableAiGatewayProvider(Deno.env.get("LOVABLE_API_KEY")!);
 *   const model = gateway(GPT_MODELS.default);
 *   const result = streamText({ model, messages });
 */
import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible";

export const GPT_MODELS = {
  /** Default for general use: briefings, suggestions, chat. */
  default: "openai/gpt-5-mini",
  /** Use for heavy reasoning: pricing logic, GEO audits, complex analysis. */
  heavy: "openai/gpt-5",
  /** Use only for trivial classification or short summaries. */
  light: "openai/gpt-5-nano",
} as const;

export type GptModelId = (typeof GPT_MODELS)[keyof typeof GPT_MODELS];

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createLovableAiGatewayProvider(lovableApiKey: string, initialRunId?: string) {
  if (!lovableApiKey) {
    throw new Error("LOVABLE_API_KEY is required to call the Lovable AI Gateway");
  }

  let runId = initialRunId?.trim() || undefined;
  let resolveRunId: (value: string | undefined) => void = () => {};
  let runIdResolved = false;
  const runIdReady = new Promise<string | undefined>((resolve) => {
    resolveRunId = resolve;
  });

  const publishRunId = (value?: string) => {
    const next = value?.trim() || undefined;
    if (!runId && next) runId = next;
    if (!runIdResolved) {
      runIdResolved = true;
      resolveRunId(runId);
    }
  };
  if (runId) publishRunId(runId);

  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }
      try {
        const response = await fetch(input, { ...init, headers });
        publishRunId(response.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? undefined);
        return response;
      } catch (error) {
        publishRunId(undefined);
        throw error;
      }
    },
  });

  // Wrap so callers can only pass approved GPT model ids.
  const gptOnly = ((modelId: GptModelId) => {
    const allowed = Object.values(GPT_MODELS) as string[];
    if (!allowed.includes(modelId)) {
      throw new Error(
        `Model "${modelId}" is not allowed. Use one of: ${allowed.join(", ")}. See mem://policies/ai-models.`,
      );
    }
    return provider(modelId);
  }) as ((modelId: GptModelId) => ReturnType<typeof provider>) & {
    getRunId: () => string | undefined;
    waitForRunId: () => Promise<string | undefined>;
  };

  gptOnly.getRunId = () => runId;
  gptOnly.waitForRunId = () => (runId ? Promise.resolve(runId) : runIdReady);

  return gptOnly;
}

export function getLovableAiGatewayRunId(request: Request) {
  return request.headers.get(LOVABLE_AIG_RUN_ID_HEADER)?.trim() || undefined;
}
