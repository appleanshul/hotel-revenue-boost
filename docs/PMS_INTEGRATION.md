# PMS ↔ Revenue Engine Integration Contract

This document is the source of truth for how the **Synsok Core PMS** project
hands users and data over to the **Revenue Engine (RE)** Lovable project. Both
apps share the same Supabase database; RE owns the `re_*` tables and reads PMS
tables via RLS scoped to `hotel_id`.

---

## 1. SSO launch token

PMS deep-links a signed-in user into RE without a password prompt by sending a
short-lived HMAC token in the query string.

### 1.1 Deep link

```
https://<re-host>/?launch_token=<token>
```

The RE frontend strips `launch_token` from the URL immediately after reading
it, so refresh/share cannot replay the token.

### 1.2 Token format

Compact, URL-safe, **two** base64url segments joined by `.`:

```
<payload_b64url>.<sig_b64url>
```

- `payload_b64url` — base64url (no padding) of the UTF-8 JSON payload below.
- `sig_b64url`     — base64url (no padding) of `HMAC_SHA256(payload_b64url, RE_LAUNCH_HMAC_SECRET)`.
  **Sign the base64url string, not the raw JSON bytes.**

### 1.3 Payload JSON

```json
{
  "user_id":  "uuid of the auth.users row",
  "hotel_id": "uuid of the hotel the user is acting on",
  "role":     "revenue_manager | hotel_admin | superadmin | manager",
  "iat":      1781880000,
  "exp":      1781880060
}
```

Rules enforced by RE:

| Rule                                    | RE response on failure       |
| --------------------------------------- | ---------------------------- |
| Signature matches                       | `401 invalid_signature`      |
| `exp` ≥ now                             | `401 token_expired`          |
| `exp - iat` ≤ 120 seconds               | `401 token_lifetime_too_long`|
| `user_id` exists in `auth.users`        | `404 user_not_found`         |
| `user_id` present                       | `400 missing_user_id`        |

Keep `exp - iat` at **60 seconds**. Re-issue on every click; do not cache.

### 1.4 Shared secret

- Env var name on **both** sides: `RE_LAUNCH_HMAC_SECRET`.
- Already provisioned in RE's Lovable Cloud secrets.
- PMS must store the **same** value in its own secrets and read it server-side
  only — never in browser code.
- Rotate together: change the value in both projects in the same window.

### 1.5 Verification flow

```
PMS server                       RE frontend                 RE edge function
-----------                      -----------                 -----------------
sign token  ─── deep link ───►   reads ?launch_token
                                 strips URL param
                                 POST /functions/v1/re-verify-launch-token
                                 { launch_token }      ───►  verify HMAC
                                                              check exp / iat
                                                              admin.getUserById
                                                              generateLink magiclink
                                                              verifyOtp -> session
                                 { access_token,         ◄── 200 OK
                                   refresh_token,
                                   hotel_id }
                                 supabase.auth.setSession(...)
                                 useAuth picks up session ─► user is in RE
```

Edge function source: `supabase/functions/re-verify-launch-token/index.ts`.
Deployed with `verify_jwt = false` because the inbound token is a custom HMAC
token, not a Supabase JWT — all validation happens in code.

### 1.6 Reference signer (Deno / Node)

```ts
function b64url(bytes: Uint8Array | string) {
  const b = typeof bytes === "string" ? new TextEncoder().encode(bytes) : bytes;
  let bin = "";
  for (const x of b) bin += String.fromCharCode(x);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signLaunchToken(payload: object, secret: string) {
  const payloadB64 = b64url(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  return `${payloadB64}.${b64url(new Uint8Array(sig))}`;
}

// Usage in PMS, server-side only:
const now = Math.floor(Date.now() / 1000);
const token = await signLaunchToken(
  { user_id, hotel_id, role: "revenue_manager", iat: now, exp: now + 60 },
  Deno.env.get("RE_LAUNCH_HMAC_SECRET")!,
);
return new Response(JSON.stringify({ launch_url: `https://<re-host>/?launch_token=${token}` }));
```

---

## 2. Price suggestion approval RPC

The RE UI (Rate Manager → AI price suggestions) calls a single RPC for both
approve and reject actions. PMS owns this function and the underlying writes
to `re_daily_rates`.

### 2.1 Expected signature

```sql
create or replace function public.re_apply_price_suggestion(
  suggestion_id uuid,
  decision      text          -- 'approve' | 'reject'
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.re_price_suggestions%rowtype;
begin
  select * into s from public.re_price_suggestions where id = suggestion_id for update;
  if not found then raise exception 'suggestion_not_found'; end if;
  if s.status <> 'pending' then raise exception 'suggestion_already_decided'; end if;

  -- Authorisation: caller must belong to the suggestion's hotel
  if not exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.hotel_id = s.hotel_id
      and ur.role in ('revenue_manager','hotel_admin','superadmin','manager')
  ) then
    raise exception 'forbidden';
  end if;

  if decision = 'approve' then
    insert into public.re_daily_rates (hotel_id, room_type_id, rate_date, rate, source)
    values (s.hotel_id, s.room_type_id, s.date, s.suggested_rate, 'ai_suggestion')
    on conflict (hotel_id, room_type_id, rate_date)
    do update set rate = excluded.rate, source = excluded.source, updated_at = now();
    update public.re_price_suggestions set status = 'approved', decided_at = now() where id = suggestion_id;
  elsif decision = 'reject' then
    update public.re_price_suggestions set status = 'rejected', decided_at = now() where id = suggestion_id;
  else
    raise exception 'invalid_decision';
  end if;
end $$;

grant execute on function public.re_apply_price_suggestion(uuid, text) to authenticated;
```

### 2.2 Columns RE reads on `re_price_suggestions`

- `id`, `hotel_id`, `room_type_id`
- `date` (or `rate_date` — RE checks both)
- `current_rate`, `suggested_rate`
- `rationale`, `status` (`pending | approved | rejected`)

### 2.3 Columns RE reads on `re_daily_rates`

- `hotel_id`, `room_type_id`, `rate_date`, `rate`
- Unique key: `(hotel_id, room_type_id, rate_date)`.

---

## 3. Data ownership summary

| Area                       | Owner | Notes                                                    |
| -------------------------- | ----- | -------------------------------------------------------- |
| `auth.users`, `profiles`   | PMS   | RE reads `profiles.hotel_id`                             |
| `user_roles`               | PMS   | RE gates access on `revenue_manager`/`hotel_admin`/etc. |
| `hotels`, `hotel_modules`  | PMS   | RE checks `module = 'revenue_engine'` is enabled         |
| `room_types`, `reservations` | PMS | RE reads only                                            |
| `re_*` tables              | RE    | PMS triggers may insert into `re_daily_rates`            |
| `re_apply_price_suggestion`| PMS   | Called from RE Rate Manager                              |
| `RE_LAUNCH_HMAC_SECRET`    | Both  | Identical value in both projects' secrets                |
