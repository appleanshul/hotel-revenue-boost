# Plan — Live data for Hyatt Pune + /demo tenant for Grand Horizon

## Outcome

- The 10 live pages (`/`, `/rates`, `/ai-center`, `/reports`, `/channels`, `/direct-booking`, `/calendar`, `/guests`, `/campaigns`, `/geo`) read **only** from the shared Supabase backend, scoped to Hyatt Regency Pune via `useAuth().hotelId`.
- Where the backend has nothing yet, the page shows a clean empty state with a CTA (e.g. "Add competitor", "Import from PMS", "Run first GEO audit") instead of fabricated numbers.
- The existing Grand Horizon mock experience is preserved verbatim under `/demo/*` so you can showcase the full system.
- Sidebar gets a "Demo Mode" entry; header shows a `Live · Hyatt Regency Pune` badge vs an amber `Demo · The Grand Horizon` badge so it's never ambiguous which tenant is on screen.

## Architecture

### 1. Data layer (new `src/lib/re-data/`)
One small hook per domain, all using TanStack Query + `supabase` client, all keyed by `hotelId`:

- `useRevenueKpis(hotelId, date)` — pulls today's `reservations` (status, room_rate, room_count) + `room_types` from PMS to compute occupancy / ADR / RevPAR / arrivals / departures / out-of-order. No mock fallback.
- `useDailyRevenueSeries(hotelId, days)` — aggregates reservations grouped by date for the trend chart.
- `useRoomInventory(hotelId)` — `room_types` + counts.
- `useDailyRates(hotelId, range)` — `re_daily_rates`.
- `usePriceSuggestions(hotelId)` — `re_price_suggestions`.
- `useLocalEvents(hotelId)` — `re_local_events`.
- `useCompSet(hotelId)` — `re_comp_set`.
- `useChannelSnapshots(hotelId, range)` — `re_channel_snapshots`.
- `useCampaigns(hotelId)` — `re_campaigns`.
- `useGeoAudits(hotelId)` / `useGeoIssues(hotelId)` — `re_geo_audits`, `re_geo_issues`.
- `useBriefing(hotelId, date)` — `re_briefings` for today; if missing, show "Briefing not generated yet" with a "Generate" button (no-op stub for now).
- `useUpsellLogs(hotelId)` / `useGuestSegments(hotelId)` — `re_upsell_logs` + PMS reservations.

Each hook returns `{ data, isLoading, isEmpty, error }` and pages branch on those three states.

### 2. Shared UI primitives (new)
- `src/components/states/EmptyState.tsx` — icon + headline + body + optional CTA. Used everywhere a table/chart is empty.
- `src/components/states/LoadingState.tsx` — skeleton grid.
- `src/components/states/ErrorState.tsx` — error + retry.
- `src/components/TenantBadge.tsx` — `Live · {hotelName}` (teal) or `Demo · The Grand Horizon` (amber). Rendered in `Layout` header, replacing the current `Building2 + hotelName` block.

### 3. Page rewrites (live)
Every page in `src/pages/*` (except `Auth`, `NotFound`, `Index`) is rewritten to:
- Drop the `import ... from "@/data/mock-data"` / `geo-mock-data` / `revenue-ai-engine` imports.
- Pull data via the hooks above using `useAuth().hotelId`.
- Render `<LoadingState>` / `<EmptyState>` / real content based on hook state.
- Keep existing layout, charts, and visual identity — only the data source changes.
- Copy "for The Grand Horizon" subtitles are replaced with the live hotel name.

### 4. Demo tenant (`/demo/*`)
- Move current page components into `src/pages/demo/` as `DemoDashboard.tsx`, `DemoRateManager.tsx`, etc. — each is essentially the current mock-driven page, untouched, just renamed and wrapped in a `<DemoTenantProvider value={{ hotelName: "The Grand Horizon", isDemo: true }}>`.
- Add `DemoLayout` (same shell as `Layout` but with the amber `Demo` badge and a "← Back to live" link).
- New routes in `App.tsx`:
  ```text
  /demo               -> DemoDashboard
  /demo/rates         -> DemoRateManager
  /demo/ai-center     -> DemoAiCommandCenter
  ... (all 10)
  ```
- Demo routes are still behind `ProtectedRoute` (must be signed in), but skip the hotel-module gate — they don't touch the DB.
- Sidebar gets a third group "Showcase" with a single `Demo Mode` link to `/demo`. Inside `/demo/*` the sidebar swaps to demo links.

### 5. Mock data quarantine
- `src/data/mock-data.ts`, `src/data/geo-mock-data.ts`, `src/lib/revenue-ai-engine.ts`, `src/lib/geo-analysis.ts` → moved to `src/demo/data/` and `src/demo/lib/`. Only files under `src/pages/demo/**` and `src/components/demo/**` may import from there. An ESLint `no-restricted-imports` rule enforces this so live pages can't accidentally pull mock data again.
- `src/components/UpcomingEventsPanel.tsx`, `src/components/geo/*` are forked: live versions read from hooks; the originals move to `src/components/demo/`.

### 6. Validation pass
After wiring, the agent will, in one batch:
1. Run a typecheck (build).
2. Sign in as Anshul in the preview, walk `/`, `/rates`, `/calendar`, `/geo`, confirm empty states render (Hyatt Pune has no `re_*` rows yet) and the header reads `Live · Hyatt Regency Pune`.
3. Open `/demo`, confirm the Grand Horizon dashboard renders identically to today's screenshot.
4. Confirm no network request from a live page targets anything outside the user's `hotel_id`.
5. Re-run the security scan; resolve any new findings.

## What is explicitly NOT in this pass

- No AI generation of briefings / price suggestions / GEO audits — those tables stay empty and the UI shows "Not generated yet" with a disabled "Generate" CTA. We can wire the Lovable AI Gateway edge functions in a follow-up.
- No CSV import or PMS sync UI — empty CTAs link to PMS for now.
- No new tables or migrations — schema from `revenue_engine_init.sql` is sufficient.
- No visual redesign — same theme, components, spacing.

## Technical notes (for the next agent in build mode)

- `reservations` columns we'll rely on: `hotel_id`, `check_in_date`, `check_out_date`, `status`, `total_amount`, `room_type_id`, `channel`. If any of those are named differently in PMS, the hook will fail loudly with an error toast — the security scan / typecheck won't catch schema mismatches, so build mode must `select count(*)` against PMS first and adjust column names before writing the hooks.
- `total_amount` may not exist; `re_channel_snapshots.revenue` is what feeds the chart for any day where PMS revenue isn't accessible. Hooks should prefer `re_channel_snapshots` when present and fall back to reservation aggregation otherwise.
- All hooks use `.eq("hotel_id", hotelId)` — RLS already enforces this, but the explicit filter keeps the queries indexable.
- `useAuth` already exposes `hotelId`, `hotelName`, `status`. No changes needed there.
- Demo routes must not be reachable without auth (we don't want a public preview), so they stay inside `<ProtectedRoute>`. A future "showcase mode" that allows unauthenticated demo viewing is a separate decision.
