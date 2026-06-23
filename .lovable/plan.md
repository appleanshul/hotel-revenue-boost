## Goal

Make "all AI calls must use an OpenAI GPT model (GPT-4.1-mini class or stronger)" a permanent project rule, and prepare the codebase so the first real AI integration follows it.

## Current state

- No live LLM calls exist yet in this project. All "AI" surfaces (AI Command Center, GEO Autopilot, Rate Manager, briefings) currently render mock data from `src/demo/lib/revenue-ai-engine.ts` and `src/demo/data/geo-mock-data.ts`.
- Live pages (`AiCommandCenter`, `Dashboard`, `GeoOptimization`, etc.) read from Supabase tables (`re_briefings`, `re_price_suggestions`, `re_geo_audits`, …) populated by a backend service that hasn't been wired up here yet.
- So enforcing the rule today is mostly about **policy + memory**, not refactoring existing model calls.

## API key

No new key is needed. Lovable AI Gateway exposes OpenAI GPT models through the auto-provisioned `LOVABLE_API_KEY` (server-side only). We do not need to copy a key from the PMS project, and we must not put any AI key in the frontend. If/when we add an edge function that calls the gateway, Lovable Cloud provisions `LOVABLE_API_KEY` automatically.

## Model choice

Lovable AI Gateway does not list a literal `gpt-4.1-mini`. The closest "4.1‑mini or above" GPT models it does expose are:

- `openai/gpt-5-nano` — cheapest, fast (use for classification/short summaries)
- `openai/gpt-5-mini` — **default for this project** (general chat, briefings, suggestions)
- `openai/gpt-5` — for higher-stakes reasoning (pricing logic, GEO audits)

All three are GPT and stronger than 4.1‑mini, so they satisfy the rule.

## Changes

1. **Save the rule to project memory** (`mem://policies/ai-models`) and add a Core line to `mem://index.md`:
   > All AI features must call OpenAI GPT via Lovable AI Gateway. Default `openai/gpt-5-mini`; use `openai/gpt-5` for heavy reasoning, `openai/gpt-5-nano` for trivial tasks. Never Gemini/Claude/other providers. Never call AI from the browser.

2. **Add a tiny shared helper** `supabase/functions/_shared/ai-gateway.ts` (Deno) implementing the standard Lovable AI Gateway provider wrapper from the knowledge base, exporting:
   - `createLovableAiGatewayProvider(key)` — provider factory
   - `GPT_MODELS = { default: "openai/gpt-5-mini", heavy: "openai/gpt-5", light: "openai/gpt-5-nano" }`
   
   This gives every future edge function a single import that already enforces the rule. No edge functions are created in this pass — just the helper, so the next AI feature can't accidentally pick Gemini.

3. **Add a short note** to `docs/SETUP.md` under a new "AI model policy" section pointing future contributors at the rule and the helper.

4. **Leave demo mock files alone** — they're labeled mock data, not model calls. The mentions of "ChatGPT/Gemini" in `geo-mock-data.ts` are display labels for the GEO Autopilot UI (which monitors multiple AI search platforms) and are correct as-is.

## Out of scope

- Wiring an actual edge function (no AI feature has been requested yet).
- Enabling Lovable Cloud / provisioning `LOVABLE_API_KEY` — deferred until the first real AI call is built. I'll prompt for it then.
- Touching the GEO mock platform names.

## Technical notes

- Helper uses `@ai-sdk/openai-compatible` via `npm:` imports, `baseURL: https://ai.gateway.lovable.dev/v1`, header `Lovable-API-Key: ${LOVABLE_API_KEY}`, `X-Lovable-AIG-SDK: vercel-ai-sdk`.
- Helper file is server-only (under `supabase/functions/`), so it cannot be imported into the React bundle by accident.
