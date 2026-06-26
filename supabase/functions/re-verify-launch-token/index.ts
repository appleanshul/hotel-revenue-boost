// Verifies a short-lived HMAC launch token issued by the Synsok Core PMS and
// returns a Supabase session for the user, allowing seamless SSO into the
// Revenue Engine without a password prompt.
//
// Token format (compact, URL-safe):
//   <payload_b64url>.<sig_b64url>
//
// payload JSON:
//   { user_id: uuid, hotel_id: uuid, role: string, iat: number, exp: number }
//
// sig:
//   HMAC-SHA256(payload_b64url, RE_LAUNCH_HMAC_SECRET)
//
// PMS must:
//   - sign with the same RE_LAUNCH_HMAC_SECRET
//   - keep exp within 60 seconds of iat
//   - issue tokens only after authenticating the user

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64urlFromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyHmac(payloadB64: string, sigB64: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const expected = b64urlFromBytes(new Uint8Array(sigBytes));
  return timingSafeEqual(expected, sigB64);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "method_not_allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const secret = Deno.env.get("RE_LAUNCH_HMAC_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!secret || !supabaseUrl || !serviceRoleKey || !anonKey) {
      console.error("missing env", { hasSecret: !!secret, hasUrl: !!supabaseUrl });
      return new Response(JSON.stringify({ error: "server_misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const token: string | undefined = body?.launch_token;
    if (typeof token !== "string" || !token.includes(".")) {
      return new Response(JSON.stringify({ error: "invalid_token_format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [payloadB64, sigB64] = token.split(".");
    const valid = await verifyHmac(payloadB64, sigB64, secret);
    if (!valid) {
      return new Response(JSON.stringify({ error: "invalid_signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let payload: { user_id?: string; hotel_id?: string; role?: string; iat?: number; exp?: number };
    try {
      payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64)));
    } catch {
      return new Response(JSON.stringify({ error: "invalid_payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return new Response(JSON.stringify({ error: "token_expired" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (payload.iat && payload.exp - payload.iat > 120) {
      return new Response(JSON.stringify({ error: "token_lifetime_too_long" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!payload.user_id) {
      return new Response(JSON.stringify({ error: "missing_user_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userRes, error: userErr } = await admin.auth.admin.getUserById(payload.user_id);
    if (userErr || !userRes?.user?.email) {
      console.error("user lookup failed", userErr);
      return new Response(JSON.stringify({ error: "user_not_found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const email = userRes.user.email;

    const { data: linkRes, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr || !linkRes?.properties?.hashed_token) {
      console.error("generateLink failed", linkErr);
      return new Response(JSON.stringify({ error: "link_generation_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anon = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: otpRes, error: otpErr } = await anon.auth.verifyOtp({
      token_hash: linkRes.properties.hashed_token,
      type: "magiclink",
    });
    if (otpErr || !otpRes?.session) {
      console.error("verifyOtp failed", otpErr);
      return new Response(JSON.stringify({ error: "otp_exchange_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        access_token: otpRes.session.access_token,
        refresh_token: otpRes.session.refresh_token,
        hotel_id: payload.hotel_id ?? null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("unhandled error", e);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
