import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChannelSnapshots, useCompSet, formatINR } from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";

export default function ChannelManager() {
  const { hotelId } = useAuth();
  const snapshots = useChannelSnapshots(hotelId);
  const compSet = useCompSet(hotelId);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Channel Manager</h1>
        <p className="text-sm text-muted-foreground">Distribution channels and competitive set</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" /> Channels</CardTitle>
          <CardDescription>OTAs, direct and corporate</CardDescription>
        </CardHeader>
        <CardContent>
          {snapshots.isLoading ? <LoadingState /> : snapshots.isEmpty ? (
            <EmptyState
              icon={Globe}
              title="No channel data yet"
              description="Connect OTAs and your booking engine to start recording bookings, revenue and commissions."
              action={{ label: "Connect channel", disabled: true }}
            />
          ) : (
            <div className="space-y-2">
              {snapshots(.data ?? []).slice(0, 10).map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <p className="text-sm font-medium">{s.channel}</p>
                    <p className="text-xs text-muted-foreground">{s.snapshot_date}</p>
                  </div>
                  <div className="text-sm font-semibold">{formatINR(Number(s.revenue))}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Competitive set</CardTitle>
          <CardDescription>Hotels you benchmark against</CardDescription>
        </CardHeader>
        <CardContent>
          {compSet.isLoading ? <LoadingState /> : compSet.isEmpty ? (
            <EmptyState
              title="No comp set defined"
              description="Add up to 5 nearby hotels to track their published rates, occupancy and review scores."
              action={{ label: "Add competitor", disabled: true }}
            />
          ) : (
            <div className="space-y-2">
              {compSet(.data ?? []).map((c: any) => (
                <div key={c.id} className="p-3 rounded-md border">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.stars ? `${c.stars}★` : ""}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
