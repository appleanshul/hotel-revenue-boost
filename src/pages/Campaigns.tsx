import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCampaigns, formatINR } from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";
import { Badge } from "@/components/ui/badge";

export default function Campaigns() {
  const { hotelId } = useAuth();
  const campaigns = useCampaigns(hotelId);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
        <p className="text-sm text-muted-foreground">Promotions, offers and email outreach</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-4 w-4" /> All campaigns</CardTitle>
          <CardDescription>Draft, active and completed</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.isLoading ? <LoadingState /> : campaigns.isEmpty ? (
            <EmptyState
              icon={Megaphone}
              title="No campaigns yet"
              description="Launch your first campaign — flash sale, last-minute deal, or repeat-guest offer."
              action={{ label: "Create campaign", disabled: true }}
            />
          ) : (
            <div className="space-y-2">
              {(campaigns.data ?? []).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.type} · {c.start_date} → {c.end_date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{c.status}</Badge>
                    <span className="text-sm font-semibold">{formatINR(Number(c.revenue_generated ?? 0))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
