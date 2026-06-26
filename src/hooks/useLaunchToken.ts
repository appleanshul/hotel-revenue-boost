import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Detects ?launch_token=... on first render, exchanges it for a Supabase session
 * via the re-verify-launch-token edge function, then strips the param from the URL.
 *
 * PMS deep-links into RE like:
 *   https://<re-host>/?launch_token=<payload_b64>.<sig_b64>
 */
export function useLaunchToken() {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const url = new URL(window.location.href);
    const token = url.searchParams.get("launch_token");
    if (!token) return;

    // Strip immediately so refresh / share doesn't replay the token.
    url.searchParams.delete("launch_token");
    window.history.replaceState({}, "", url.toString());

    (async () => {
      const { data, error } = await supabase.functions.invoke("re-verify-launch-token", {
        body: { launch_token: token },
      });

      if (error || !data?.access_token || !data?.refresh_token) {
        console.error("launch token exchange failed", error, data);
        toast.error("That launch link is invalid or expired. Please sign in.");
        return;
      }

      const { error: sessErr } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      if (sessErr) {
        console.error("setSession failed", sessErr);
        toast.error("Couldn't start your session. Please sign in.");
        return;
      }

      toast.success("Signed in from PMS");
    })();
  }, []);
}
