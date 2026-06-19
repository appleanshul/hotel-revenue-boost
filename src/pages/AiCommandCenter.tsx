import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTodayBriefing, usePriceSuggestions, useLocalEvents } from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";

export default function AiCommandCenter() {
  const { hotelId } = useAuth();
  const briefing = useTodayBriefing(hotelId);
  const suggestions = usePriceSuggestions(hotelId);
  const events = useLocalEvents(hotelId);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Command Center</h1>
        <p className="text-sm text-muted-foreground">Today's AI insights, decisions and recommendations</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4" /> Today's briefing</CardTitle>
          <CardDescription>AI-generated revenue summary</CardDescription>
        </CardHeader>
        <CardContent>
          {briefing.isLoading ? (
            <LoadingState rows={2} />
          ) : briefing.isEmpty ? (
            <EmptyState icon={Brain} title="Briefing not generated yet" description="The daily briefing service has not run for today. It will appear here automatically." action={{ label: "Generate now", disabled: true }} />
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-semibold">{(briefing.data as any).summary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" /> Pending recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.isLoading ? (
            <LoadingState />
          ) : suggestions.isEmpty ? (
            <EmptyState title="No pending recommendations" description="AI recommendations for pricing, upsells and channel mix will appear here." />
          ) : (
            <div className="text-sm text-muted-foreground">{(suggestions.data ?? []).length} pending</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Demand signals</CardTitle>
          <CardDescription>Local events feeding the engine</CardDescription>
        </CardHeader>
        <CardContent>
          {events.isLoading ? <LoadingState /> : events.isEmpty ? (
            <EmptyState title="No demand signals tracked" description="Add local events or connect a market intelligence feed to start surfacing demand spikes." />
          ) : (
            <div className="text-sm text-muted-foreground">{events.data!.length} events</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
