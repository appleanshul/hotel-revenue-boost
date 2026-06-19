/**
 * Revenue Engine data hooks — all queries scoped to a single hotelId via Supabase RLS.
 * Pages should branch on { data, isLoading, isEmpty, error }.
 *
 * Schema assumptions (PMS-side, may need adjustment if PMS renames columns):
 *   reservations: hotel_id, check_in_date, check_out_date, status, total_amount, room_type_id, channel
 *   room_types:   hotel_id, id, name, total_rooms (or count), base_rate
 *   hotels:       id, name, website
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const enabled = (hotelId: string | null | undefined): hotelId is string =>
  typeof hotelId === "string" && hotelId.length > 0;

function wrap(q: ReturnType<typeof useQuery<any>>) {
  const data: any = q.data;
  const isEmpty =
    !q.isLoading &&
    !q.error &&
    (data === undefined ||
      data === null ||
      (Array.isArray(data) && data.length === 0));
  return {
    data: data as any,
    isLoading: q.isLoading,
    error: (q.error as Error | null) ?? null,
    isEmpty,
    refetch: q.refetch,
  };
}

// ---------- PMS-derived KPIs ----------
export function useRoomInventory(hotelId: string | null) {
  return wrap(
    useQuery({
      queryKey: ["room_types", hotelId],
      enabled: enabled(hotelId),
      queryFn: async () => {
        const { data, error } = await supabase
          .from("room_types")
          .select("*")
          .eq("hotel_id", hotelId!);
        if (error) throw error;
        return data ?? [];
      },
    }),
  );
}

export function useTodayReservations(hotelId: string | null, date = new Date().toISOString().slice(0, 10)) {
  return wrap(
    useQuery({
      queryKey: ["reservations_today", hotelId, date],
      enabled: enabled(hotelId),
      queryFn: async () => {
        const { data, error } = await supabase
          .from("reservations")
          .select("*")
          .eq("hotel_id", hotelId!)
          .lte("check_in_date", date)
          .gte("check_out_date", date);
        if (error) throw error;
        return data ?? [];
      },
    }),
  );
}

export function useReservationsRange(hotelId: string | null, fromDate: string, toDate: string) {
  return wrap(
    useQuery({
      queryKey: ["reservations_range", hotelId, fromDate, toDate],
      enabled: enabled(hotelId),
      queryFn: async () => {
        const { data, error } = await supabase
          .from("reservations")
          .select("*")
          .eq("hotel_id", hotelId!)
          .gte("check_in_date", fromDate)
          .lte("check_in_date", toDate);
        if (error) throw error;
        return data ?? [];
      },
    }),
  );
}

// ---------- RE-owned tables ----------
function reTable<T = any>(table: string) {
  return (hotelId: string | null) =>
    wrap(
      useQuery({
        queryKey: [table, hotelId],
        enabled: enabled(hotelId),
        queryFn: async () => {
          const { data, error } = await (supabase as any)
            .from(table)
            .select("*")
            .eq("hotel_id", hotelId!)
            .order("created_at", { ascending: false });
          if (error) throw error;
          return (data ?? []) as T[];
        },
      }),
    );
}

export const useDailyRates = reTable("re_daily_rates");
export const usePriceSuggestions = reTable("re_price_suggestions");
export const useLocalEvents = reTable("re_local_events");
export const useCompSet = reTable("re_comp_set");
export const useChannelSnapshots = reTable("re_channel_snapshots");
export const useCampaigns = reTable("re_campaigns");
export const useGeoAudits = reTable("re_geo_audits");
export const useGeoIssues = reTable("re_geo_issues");
export const useUpsellLogs = reTable("re_upsell_logs");

export function useTodayBriefing(hotelId: string | null, date = new Date().toISOString().slice(0, 10)) {
  return wrap(
    useQuery({
      queryKey: ["re_briefings", hotelId, date],
      enabled: enabled(hotelId),
      queryFn: async () => {
        const { data, error } = await (supabase as any)
          .from("re_briefings")
          .select("*")
          .eq("hotel_id", hotelId!)
          .eq("briefing_date", date)
          .maybeSingle();
        if (error) throw error;
        return data;
      },
    }),
  );
}

// ---------- Derived KPI computation ----------
export interface RevenueKpis {
  occupancy: number;
  totalRooms: number;
  occupiedRooms: number;
  arrivals: number;
  departures: number;
  adr: number;
  revpar: number;
  roomRevenue: number;
}

export function computeKpis(
  reservations: any[] | undefined,
  rooms: any[] | undefined,
  date: string,
): RevenueKpis | null {
  if (!reservations || !rooms) return null;
  const totalRooms = rooms.reduce(
    (sum, r) => sum + (r.total_rooms ?? r.count ?? r.room_count ?? 0),
    0,
  );
  const active = reservations.filter(
    (r) => r.status !== "cancelled" && r.status !== "no-show",
  );
  const occupiedRooms = active.length;
  const arrivals = reservations.filter((r) => r.check_in_date === date).length;
  const departures = reservations.filter((r) => r.check_out_date === date).length;
  const roomRevenue = active.reduce(
    (sum, r) => sum + Number(r.total_amount ?? r.room_rate ?? 0),
    0,
  );
  const occupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const adr = occupiedRooms > 0 ? Math.round(roomRevenue / occupiedRooms) : 0;
  const revpar = totalRooms > 0 ? Math.round(roomRevenue / totalRooms) : 0;
  return { occupancy, totalRooms, occupiedRooms, arrivals, departures, adr, revpar, roomRevenue };
}

export function formatINR(n: number | null | undefined): string {
  if (n == null || isNaN(n as number)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
