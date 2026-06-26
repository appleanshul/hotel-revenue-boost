# Revenue Engine ↔ PMS Integration Plan

Three deliverables requested by the PMS team to make this RE Lovable project a true companion app to the Synsok Core PMS. All work happens in this project; PMS-side migrations (triggers, RPC, HMAC secret) are assumed already in place per their Part A.

---

## C1. Price Suggestion Approval UI

**Where:** `src/pages/RateManager.tsx` (existing "AI price suggestions" card)

- Replace the read-only list with a proper table (shadcn `Table`): Date · Room type · Current rate · Suggested rate · Δ · Rationale · Actions.
- Filter to `status = 'pending'` in `usePriceSuggestions`.
- Inline **Approve** / **Reject** buttons per row:
  - Approve → `supabase.rpc('re_apply_price_suggestion', { suggestion_id, decision: 'approve' })`
  - Reject → same RPC with `decision: 'reject'`
- Optimistic update via `useMutation` + `queryClient.invalidateQueries(['re_price_suggestions', hotelId])` and `['re_daily_rates', hotelId]`.
- Toast success/error; disable buttons while pending.
- Empty / loading / error states stay as-is.

## C2. Live data wiring (replace mock occupancy/ADR)

**Where:** `src/pages/Dashboard.tsx`, `src/pages/RevenueCalendar.tsx`, `src/pages/Reports.tsx`

- Today's KPIs already use `computeKpis(reservations, rooms)` — keep that, but add a published-rate overlay from `re_daily_rates` so ADR shown matches what guests see on channels.
- Add `useDailyRatesRange(hotelId, from, to)` hook in `src/lib/re-data/hooks.ts` (mirrors `useReservationsRange`).
- `RevenueCalendar`: each day cell shows occupancy (from reservations) + published rate (from `re_daily_rates`) instead of any constant/mock.
- `Reports`: 30-day ADR/RevPAR series sourced from `re_daily_rates` join with reservation counts; remove any remaining hardcoded sample arrays.
- No new tables; reads only.

## C3. SSO entry from PMS (launch token)

**Goal:** PMS deep-links into RE with `?launch_token=<jwt>`; RE verifies and signs the user in without a password prompt.

**Files:**

- New edge function `supabase/functions/re-verify-launch-token/index.ts`
  - Reads `RE_LAUNCH_HMAC_SECRET` (shared with PMS).
  - Verifies HMAC-SHA256 signature + `exp` claim (≤ 60 s).
  - Payload: `{ user_id, hotel_id, role, iat, exp }`.
  - Uses `SUPABASE_SERVICE_ROLE_KEY` to call `supabase.auth.admin.generateLink({ type: 'magiclink', email })` for the user, returns the `action_link` `hashed_token`.
  - CORS enabled; returns `{ access_token, refresh_token }` via `verifyOtp` exchange done server-side, OR returns the magiclink for the client to follow.
- New hook `src/hooks/useLaunchToken.ts` runs once on mount in `App.tsx`:
  - If `?launch_token=` present → POST to `re-verify-launch-token` → `supabase.auth.setSession({ access_token, refresh_token })` → strip param from URL → continue normal `useAuth` flow.
  - On failure, redirect to `/auth` with a clear toast.
- Secret added via `add_secret('RE_LAUNCH_HMAC_SECRET', …)` — user must supply the same value configured in PMS.

**Edge function deploy:** `verify_jwt = false` (token isn't a Supabase JWT). All validation in code.

---

## Technical details

- All AI/LLM concerns out of scope here (already covered by GPT-only policy).
- No schema changes in this project. `re_price_suggestions`, `re_daily_rates`, and `re_apply_price_suggestion` RPC are owned by PMS migrations.
- Generated Supabase types remain untyped (`as any` casts where needed) until PMS publishes a fresh `types.ts`.
- React Query cache keys already namespaced by `hotelId` — RLS continues to enforce isolation.

## Open questions

1. **HMAC secret value** — do you have the exact `RE_LAUNCH_HMAC_SECRET` string the PMS team configured, or should I generate one and send it back to them? I dont have it. YOu can check with PMS projet or geenrate and send it to them
2. **Launch token payload shape** — confirming `{ user_id, hotel_id, role, exp }` matches what PMS will sign. If they're sending `email` instead of `user_id`, the edge function changes slightly. - Yes. The user id for Revenue Engine will be setup in PMS
3. **Approve RPC signature** — confirming `re_apply_price_suggestion(suggestion_id uuid, decision text)` is the exact PMS signature (vs. separate `approve`/`reject` RPCs). Not sure. take your call

Once you confirm #1–3 I'll implement C1, C2, C3 in that order.