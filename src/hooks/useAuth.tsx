import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AccessStatus = "loading" | "unauthenticated" | "no-access" | "ok";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  hotelId: string | null;
  hotelName: string | null;
  role: string | null;
  status: AccessStatus;
  reason: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ALLOWED_ROLES = ["revenue_manager", "hotel_admin", "superadmin", "manager"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [hotelName, setHotelName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<AccessStatus>("loading");
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    // 1. Subscribe to auth changes synchronously
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (!newSession) {
        setHotelId(null);
        setHotelName(null);
        setRole(null);
        setStatus("unauthenticated");
        setReason(null);
      } else {
        // Defer DB call to avoid deadlock inside listener
        setTimeout(() => checkAccess(newSession.user.id), 0);
      }
    });

    // 2. Get existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing) {
        checkAccess(existing.user.id);
      } else {
        setStatus("unauthenticated");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAccess(userId: string) {
    setStatus("loading");

    // Fetch the user's hotel + role from PMS tables
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("hotel_id").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role, hotel_id").eq("user_id", userId),
    ]);

    const userHotelId = (profile as any)?.hotel_id ?? (roles as any[])?.[0]?.hotel_id ?? null;
    const userRoles = ((roles as any[]) ?? []).map((r) => r.role as string);
    const matchedRole = userRoles.find((r) => ALLOWED_ROLES.includes(r)) ?? null;

    if (!matchedRole) {
      setStatus("no-access");
      setReason(
        "Your account doesn't have Revenue Engine access. Ask your PMS administrator to assign you the 'revenue_manager' role."
      );
      setRole(userRoles[0] ?? null);
      return;
    }

    // Superadmin can bypass hotel check
    if (matchedRole !== "superadmin" && !userHotelId) {
      setStatus("no-access");
      setReason("Your account isn't linked to any hotel. Ask your PMS administrator.");
      setRole(matchedRole);
      return;
    }

    // Check module gate: hotel must have 'revenue_engine' module enabled
    if (matchedRole !== "superadmin" && userHotelId) {
      const { data: mods } = await supabase
        .from("hotel_modules")
        .select("module, is_enabled")
        .eq("hotel_id", userHotelId);
      const enabled = ((mods as any[]) ?? []).some(
        (m) => m.module === "revenue_engine" && m.is_enabled !== false
      );
      if (!enabled) {
        setStatus("no-access");
        setReason(
          "Revenue Engine isn't enabled for your hotel. Ask your PMS administrator to enable the 'Revenue Engine' module."
        );
        setRole(matchedRole);
        setHotelId(userHotelId);
        return;
      }
    }

    // Fetch hotel name for display
    let name: string | null = null;
    if (userHotelId) {
      const { data: hotel } = await supabase
        .from("hotels")
        .select("name")
        .eq("id", userHotelId)
        .maybeSingle();
      name = (hotel as any)?.name ?? null;
    }

    setHotelId(userHotelId);
    setHotelName(name);
    setRole(matchedRole);
    setReason(null);
    setStatus("ok");
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{ session, user, hotelId, hotelName, role, status, reason, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
