import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUpsellLogs, useReservationsRange, formatINR } from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";

export default function GuestRevenue() {
  const { hotelId } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  const reservations = useReservationsRange(hotelId, from, today);
  const upsells = useUpsellLogs(hotelId);

  const upsellRevenue = (upsells.data ?? []).reduce((s: number, u: any) => s + Number(u.revenue_added ?? 0), 0);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Guest Insights</h1>
        <p className="text-sm text-muted-foreground">Segments, loyalty and ancillary revenue per guest</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Guests (last 90 days)</CardTitle>
          <CardDescription>From your PMS reservations</CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.isLoading ? <LoadingState /> : reservations.isEmpty ? (
            <EmptyState icon={Users} title="No guest data yet" description="Reservations from the last 90 days will populate guest segments here." />
          ) : (
            <p className="text-sm text-muted-foreground">{reservations(.data ?? []).length} reservations</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upsell performance</CardTitle>
        </CardHeader>
        <CardContent>
          {upsells.isLoading ? <LoadingState /> : upsells.isEmpty ? (
            <EmptyState title="No upsell offers logged" description="As your team offers upgrades and add-ons at check-in, results will appear here." />
          ) : (
            <p className="text-sm text-muted-foreground">{upsells(.data ?? []).length} offers · {formatINR(upsellRevenue)} added revenue</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
