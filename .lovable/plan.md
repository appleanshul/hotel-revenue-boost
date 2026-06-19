# Revenue Engine ↔ SynSok Core PMS — Backend Integration Plan

## TL;DR

We **share one backend** between PMS and Revenue Engine instead of literally merging the projects. Both Lovable projects point at the **same Supabase instance** (the one PMS already owns). PMS keeps owning the source-of-truth tables (`hotels`, `rooms`, `reservations`, `guests`, …). Revenue Engine gets **read access** to all of them and adds its **own small schema** for AI-generated artifacts (price suggestions, GEO audits, campaigns, briefings). A new PMS role — `revenue_manager` — controls who can log into RE; superadmin in PMS provisions it per hotel.

This gives you "one product, one tenant, one login per hotel" without locking the two codebases together. You can keep developing RE here independently.

---

## Why not literally merge the two Lovable projects?

Lovable projects can't be physically combined. The clean equivalent is:

- **One Supabase project** (the PMS one) → single source of truth, single auth, single tenant table.
- **Two frontends** (PMS app + RE app) reading/writing it via the same `hotel_id` + RLS policies.

A GM gets one credential that works on both URLs; superadmin in PMS decides whether that user also sees RE.

---

## What I found in SynSok Core PMS

PMS already has a real backend (Lovable Cloud / Supabase) with:

- **Tenant model:** `hotels` (id, name…) + `profiles.hotel_id` + `user_roles(user_id, role, hotel_id)`.
- **Roles enum `app_role`:** `superadmin, hotel_admin, front_desk, housekeeping, kitchen_pos, finance, manager`.
- **Module gating:** `hotel_modules(hotel_id, module)` with enum `module_type` already containing `'ai_command'` — perfect hook for Revenue Engine.
- **Auth helpers:** `public.has_role(uid, role)` and `public.get_user_hotel_id(uid)` security-definer functions; RLS everywhere keyed off `hotel_id`.
- **Tables RE can read directly (no duplication):**
`hotels, profiles, room_types, rooms, rate_plans, tax_templates, reservations, folio_items, room_charges, payments, guests, companies, corporate_contracts, city_ledger_accounts, pos_orders / pos_order_items, outlets, integration_configs, gx_connections` (channel manager).
- **Edge functions already there:** `channel-manager-webhook, platform-sync, platform-inbound, insights-ai, event-dispatch, gx-*` — RE can subscribe to events instead of polling.
- **What's missing for RE** (we add these in PMS schema, owned by RE):
daily_rates / inventory grid, local_events, comp_set, channel performance snapshots, AI artifacts (suggestions, campaigns, GEO audits, briefings).

---

## Architecture

```text
              ┌─────────────────────┐        ┌─────────────────────┐
              │  PMS Frontend       │        │  Revenue Engine FE  │
              │  (existing project) │        │  (this project)     │
              └──────────┬──────────┘        └──────────┬──────────┘
                         │   shared @supabase/supabase-js client      
                         │   same URL + anon key                       
                         ▼                                            ▼
                ┌──────────────────────────────────────────────────────┐
                │   SHARED SUPABASE  (owned by PMS project)           │
                │                                                      │
                │   PMS-owned tables   │   RE-owned tables (new)       │
                │   hotels, rooms,     │   re_daily_rates              │
                │   reservations,      │   re_local_events             │
                │   guests, rate_plans,│   re_comp_set                 │
                │   gx_*, pos_*, …     │   re_channel_snapshots        │
                │                      │   re_price_suggestions        │
                │                      │   re_campaigns                │
                │                      │   re_geo_audits / re_geo_issues│
                │                      │   re_briefings, re_upsell_logs│
                │                                                      │
                │   RLS keyed off hotel_id via has_role + module gate  │
                │   Edge fns: re-pricing, re-briefing, re-geo-scan,    │
                │             re-events-fetch, re-campaign-generate    │
                └──────────────────────────────────────────────────────┘
```

---

## Tenant & access model (matches your requirement)

1. RE login is **gated by PMS superadmin**, per hotel and per user. Two new gates:
  - **Module gate:** superadmin enables `revenue_engine` in `hotel_modules` for that hotel. *(Add new enum value to `module_type`.)*
  - **Role gate:** superadmin assigns the new role `revenue_manager` to a specific user in `user_roles` for that hotel. *(Add new enum value to `app_role`.)*
2. RE frontend login screen calls `supabase.auth.signInWithPassword`. After login it checks: user has `revenue_manager` (or `superadmin` / `hotel_admin`) **AND** the hotel has the `revenue_engine` module enabled. Otherwise: "Ask your PMS administrator to enable Revenue Engine for your account."
3. Every RE-owned table has RLS:
  `USING (hotel_id = public.get_user_hotel_id(auth.uid()) AND EXISTS (SELECT 1 FROM hotel_modules WHERE hotel_id = ... AND module = 'revenue_engine'))`.
4. Superadmin self-serves all of this from the existing PMS admin screens; no separate provisioning UI in RE.

---

## Data flow per RE screen (what's live vs AI-generated)


| RE Screen                | Live PMS source                                    | AI / RE-owned source                         |
| ------------------------ | -------------------------------------------------- | -------------------------------------------- |
| Dashboard KPIs           | `reservations`, `rooms`, `folio_items`, `payments` | derived occupancy / ADR / RevPAR view        |
| Revenue Calendar         | `reservations` + `re_daily_rates`                  | `re_local_events`, AI demand score           |
| Rate Manager             | `rate_plans`, `re_daily_rates`                     | `re_price_suggestions` (Lovable AI / Gemini) |
| AI Command Center        | aggregates above                                   | `re_briefings`, `re_upsell_logs`             |
| Guest Revenue            | `guests`, `reservations`, `folio_items`            | AI segmentation, LTV scoring                 |
| Direct Booking Optimizer | `gx_connections`, `re_channel_snapshots`           | AI suggestions                               |
| Channel Manager          | `gx_*` (already in PMS)                            | RE-side analytics only                       |
| Campaigns                | `guests` for targeting                             | `re_campaigns` + AI copy                     |
| GEO Autopilot            | `hotels` (name, address, website)                  | `re_geo_audits`, `re_geo_issues` (Firecrawl) |
| Upcoming Events panel    | —                                                  | `re_local_events` + AI uplift                |


**Read-only from PMS** for everything except `re_daily_rates` writes. RE's "Apply rate" stores into `re_daily_rates`; a tiny PMS-side consumer can later read these as the rate source for `rate_plans` so the loop closes safely without RE mutating PMS booking tables.

---

## Scope of this build (foundation + AI engine — the clean middle path)

Delivered now:

1. **Backend wiring** — connect this project's frontend to PMS's Supabase (URL + anon key, generated `types.ts`), add `src/integrations/supabase/client.ts`.
2. **Schema additions (one migration in PMS DB):**
  - Extend enums: `app_role += 'revenue_manager'`, `module_type += 'revenue_engine'`.
  - Create `re_daily_rates, re_local_events, re_comp_set, re_channel_snapshots, re_price_suggestions, re_campaigns, re_geo_audits, re_geo_issues, re_briefings, re_upsell_logs` — each with `hotel_id`, FKs, RLS, GRANTs.
3. **Auth + access gate** — login page, `useAuth` hook, route guard that enforces role + module.
4. **Wire live data** into: Dashboard, Revenue Calendar, Rate Manager (BAR/Seasonal/Corporate read from PMS; AI Suggestions tab reads `re_price_suggestions`), Guest Revenue, Channel Manager.
5. **Edge functions on Lovable AI Gateway (Gemini 3 Flash):**
  - `re-pricing` — computes price suggestions from live occupancy + events → writes `re_price_suggestions`.
  - `re-briefing` — daily GM briefing → `re_briefings`.
  - `re-events-fetch` — pulls city events (manual + future API) → `re_local_events`.
6. **Seed script** — for a demo hotel, populate `re_local_events`, `re_comp_set` so screens aren't empty on day one.

Deferred (next iteration, called out so we don't gold-plate now): GEO Autopilot Firecrawl edge fn, Campaigns AI copy generation, Direct Booking optimizer scoring, write-back path from `re_daily_rates` into PMS `rate_plans`. 

---

## What I need from you to start build

1. **Confirm sharing PMS's Supabase** with this project. I'll need you to paste, from the PMS project's `.env`, the `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key — safe to share) into this project. Alternative: I enable Lovable Cloud here separately and we sync schema both ways — strongly **not** recommended; you lose single-source-of-truth.  - My response : I will give when you ask
2. **Confirm the new role name** `revenue_manager` and module value `revenue_engine` (or pick different names). My response - Yes
3. **Confirm scope** above is what you want shipped in v1 (foundation + AI pricing + briefings + events + live KPIs; GEO/Campaigns deferred). Say "ship more" and I'll fold them in.- Take your call based on complexity what you can deliver seamlessly.
4. Use GPT 5.1 for  reasoning for AI model

Once those three are answered I'll switch to build mode and execute the migration + wiring in one pass.