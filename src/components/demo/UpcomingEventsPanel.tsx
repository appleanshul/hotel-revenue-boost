import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, RefreshCw, TrendingUp, Flame, Sparkles } from "lucide-react";
import { localEvents, TODAY, roomInventory } from "@/data/mock-data";

const IMPACT_UPLIFT: Record<"low" | "medium" | "high", number> = {
  low: 5,
  medium: 12,
  high: 22,
};

const IMPACT_STYLES: Record<"low" | "medium" | "high", { badge: string; icon: typeof Flame; label: string }> = {
  high: { badge: "bg-destructive/10 text-destructive border-destructive/30", icon: Flame, label: "High demand" },
  medium: { badge: "bg-accent/20 text-accent-foreground border-accent/40", icon: TrendingUp, label: "Medium demand" },
  low: { badge: "bg-muted text-muted-foreground border-border", icon: Sparkles, label: "Low demand" },
};

const AUTO_REFRESH_MS = 30 * 60 * 1000; // 30 minutes

function formatRelative(d: Date): string {
  const now = new Date();
  const diff = Math.round((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function UpcomingEventsPanel() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [, force] = useState(0);

  // Get next 5 upcoming events from TODAY
  const upcoming = [...localEvents]
    .filter((e) => new Date(e.date).getTime() >= new Date(TODAY).getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const baseAdr = Math.round(
    roomInventory.reduce((s, r) => s + r.baseRate * r.count, 0) / roomInventory.reduce((s, r) => s + r.count, 0)
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 600);
  };

  // Auto-refresh every 30 min
  useEffect(() => {
    const id = setInterval(handleRefresh, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Re-render every minute so "x min ago" stays fresh
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Upcoming Events & Pricing Impact</CardTitle>
              <CardDescription className="text-xs">
                City events driving demand — suggested rate uplifts
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              Updated {formatRelative(lastUpdated)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8 gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No upcoming events in your city right now.
          </p>
        ) : (
          <div className="grid gap-2">
            {upcoming.map((evt) => {
              const style = IMPACT_STYLES[evt.demandImpact];
              const Icon = style.icon;
              const uplift = IMPACT_UPLIFT[evt.demandImpact];
              const suggestedAdr = Math.round(baseAdr * (1 + uplift / 100));
              const date = new Date(evt.date);
              const daysAway = Math.ceil(
                (date.getTime() - new Date(TODAY).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={evt.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                >
                  {/* Date block */}
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-md bg-muted shrink-0">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
                      {date.toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-base font-bold text-foreground leading-none">
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Event info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground truncate">{evt.name}</p>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${style.badge}`}>
                        <Icon className="h-3 w-3 mr-0.5" />
                        {style.label}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {daysAway === 0 ? "Today" : daysAway === 1 ? "Tomorrow" : `In ${daysAway} days`}
                      {" · "}Suggested ADR ₹{suggestedAdr.toLocaleString()}
                    </p>
                  </div>

                  {/* Uplift */}
                  <div className="text-right shrink-0">
                    <Badge className="bg-success/15 text-success-foreground border-success/30 text-xs">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      +{uplift}%
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">rate uplift</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
