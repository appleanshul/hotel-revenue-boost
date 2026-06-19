// Shared Supabase client — points at the SynSok Core PMS Supabase instance.
// Both PMS and Revenue Engine use the same backend; PMS owns source-of-truth tables,
// RE adds its own re_* tables and reads PMS data via RLS keyed off hotel_id.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  // eslint-disable-next-line no-console
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env");
}

// Untyped for now — generate types from PMS DB via `supabase gen types typescript`
// once the re_* migration is applied there.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
