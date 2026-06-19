import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MousePointerClick } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useChannelSnapshots, useCampaigns } from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";

export default function DirectBooking() {
  const { hotelId } = useAuth();
  const snapshots = useChannelSnapshots(hotelId);
  const campaigns = useCampaigns(hotelId);

  const direct = (snapshots.data ?? []).filter((s: any) => s.channel === "direct");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Direct Booking</h1>
        <p className="text-sm text-muted-foreground">Shift volume from OTAs to your own website</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><MousePointerClick className="h-4 w-4" /> Direct performance</CardTitle>
          <CardDescription>Last channel snapshots tagged 'direct'</CardDescription>
        </CardHeader>
        <CardContent>
          {snapshots.isLoading ? <LoadingState /> : direct.length === 0 ? (
            <EmptyState
              icon={MousePointerClick}
              title="No direct bookings recorded yet"
              description="Connect your website booking engine to start tracking direct conversions and commission saved."
              action={{ label: "Connect booking engine", disabled: true }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{direct.length} direct snapshots</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Active direct-booking campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.isLoading ? <LoadingState /> : campaigns.isEmpty ? (
            <EmptyState title="No campaigns running" description="Launch a 'Book Direct & Save' offer to drive guests to your website." action={{ label: "Create campaign", disabled: true }} />
          ) : (
            <p className="text-sm text-muted-foreground">{campaigns.data!.length} campaigns</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
