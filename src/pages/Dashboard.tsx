import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, BedDouble, IndianRupee, BarChart3, ArrowUpRight,
  Brain, Target, Lightbulb, CalendarDays,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useRoomInventory, useTodayReservations, useTodayBriefing,
  useLocalEvents, computeKpis, formatINR,
} from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingKpiGrid } from "@/components/states/LoadingState";
import { ErrorState } from "@/components/states/ErrorState";

const TODAY = new Date().toISOString().slice(0, 10);

export default function Dashboard() {
  const { hotelId, hotelName } = useAuth();
  const rooms = useRoomInventory(hotelId);
  const reservations = useTodayReservations(hotelId, TODAY);
  const briefing = useTodayBriefing(hotelId, TODAY);
  const events = useLocalEvents(hotelId);

  const kpiLoading = rooms.isLoading || reservations.isLoading;
  const kpiError = rooms.error ?? reservations.error;
  const kpis = computeKpis(reservations.data, rooms.data, TODAY);

  const kpiCards = kpis
    ? [
        { label: "Occupancy", value: `${kpis.occupancy}%`, icon: BedDouble, sub: `${kpis.occupiedRooms}/${kpis.totalRooms} rooms` },
        { label: "ADR", value: formatINR(kpis.adr), icon: IndianRupee, sub: "Avg Daily Rate" },
        { label: "RevPAR", value: formatINR(kpis.revpar), icon: BarChart3, sub: "Revenue per available room" },
        { label: "Arrivals", value: String(kpis.arrivals), icon: ArrowUpRight, sub: "Check-ins today" },
        { label: "Departures", value: String(kpis.departures), icon: Target, sub: "Check-outs today" },
        { label: "Room Revenue", value: formatINR(kpis.roomRevenue), icon: TrendingUp, sub: "Today" },
      ]
    : [];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Revenue Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Live revenue intelligence{hotelName ? ` for ${hotelName}` : ""}
        </p>
      </div>

      {/* AI Briefing */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              {briefing.isLoading && <p className="text-sm text-muted-foreground">Loading today's briefing…</p>}
              {briefing.error && <p className="text-sm text-destructive">Couldn't load briefing.</p>}
              {!briefing.isLoading && briefing.isEmpty && (
                <div>
                  <p className="text-sm font-semibold text-foreground">No briefing generated yet for today</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your daily revenue pulse will appear here once the AI briefing service runs.
                  </p>
                </div>
              )}
              {briefing.data && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    {(briefing.data as any).summary ?? "Today's briefing"}
                  </p>
                  {Array.isArray((briefing.data as any).highlights) &&
                    (briefing.data as any).highlights.map((h: string, i: number) => (
                      <p key={i} className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-accent shrink-0" /> {h}
                      </p>
                    ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      {kpiError ? (
        <ErrorState message={kpiError.message} onRetry={() => { rooms.refetch(); reservations.refetch(); }} />
      ) : kpiLoading ? (
        <LoadingKpiGrid />
      ) : !kpis || kpis.totalRooms === 0 ? (
        <EmptyState
          icon={BedDouble}
          title="No room inventory yet"
          description="Add room types in your PMS to start seeing live occupancy, ADR and RevPAR here."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiCards.map((kpi) => (
            <Card key={kpi.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <kpi.icon className="h-4 w-4 text-muted-foreground mb-2" />
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
                <p className="text-[10px] text-muted-foreground/70">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Events */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Upcoming Local Events
            </CardTitle>
            <CardDescription>City events impacting demand</CardDescription>
          </div>
          <Badge variant="outline">{events.data?.length ?? 0}</Badge>
        </CardHeader>
        <CardContent>
          {events.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : events.isEmpty ? (
            <EmptyState
              icon={CalendarDays}
              title="No events tracked yet"
              description="Add local events (conferences, festivals, sports) to forecast demand surges and surface pricing uplifts."
              action={{ label: "Add event", disabled: true }}
            />
          ) : (
            <div className="space-y-2">
              {events.data!.slice(0, 5).map((e: any) => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{e.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.start_date}{e.end_date && e.end_date !== e.start_date ? ` → ${e.end_date}` : ""}
                      {e.venue ? ` · ${e.venue}` : ""}
                    </p>
                  </div>
                  {e.suggested_uplift_pct && (
                    <Badge variant="secondary">+{e.suggested_uplift_pct}%</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
