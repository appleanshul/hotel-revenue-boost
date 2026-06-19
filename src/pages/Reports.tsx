import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChannelSnapshots, useReservationsRange } from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";

export default function Reports() {
  const { hotelId } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const snapshots = useChannelSnapshots(hotelId);
  const reservations = useReservationsRange(hotelId, from, today);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">30-day performance, channels and segments</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Reservations (last 30 days)</CardTitle>
          <CardDescription>From your PMS</CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.isLoading ? (
            <LoadingState />
          ) : reservations.isEmpty ? (
            <EmptyState title="No reservations in the last 30 days" description="As reservations are created in your PMS they'll feed performance reports here." />
          ) : (
            <p className="text-sm text-muted-foreground">{(reservations.data ?? []).length} reservations tracked</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Channel performance</CardTitle>
          <CardDescription>Snapshots by channel</CardDescription>
        </CardHeader>
        <CardContent>
          {snapshots.isLoading ? <LoadingState /> : snapshots.isEmpty ? (
            <EmptyState title="No channel snapshots yet" description="Once channels start recording bookings, daily snapshots will land here." />
          ) : (
            <p className="text-sm text-muted-foreground">{(snapshots.data ?? []).length} snapshots</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
