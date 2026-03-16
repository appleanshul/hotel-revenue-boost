import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { dailyRevenue, localEvents, formatCurrency, todayKPIs, TODAY } from "@/data/mock-data";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function RevenueCalendar() {
  const year = 2026;
  const month = 2; // March (0-indexed)
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();

  // Build calendar data
  const calDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `2026-03-${String(day).padStart(2, "0")}`;
    const rev = dailyRevenue.find((d) => d.date === dateStr);
    const event = localEvents.find((e) => e.date === dateStr);
    const isToday = dateStr === TODAY;

    let intensity: "low" | "medium" | "high" | "peak" = "low";
    if (rev) {
      if (rev.occupancyPercent > 80) intensity = "peak";
      else if (rev.occupancyPercent > 65) intensity = "high";
      else if (rev.occupancyPercent > 50) intensity = "medium";
    }

    return { day, dateStr, rev, event, isToday, intensity };
  });

  const intensityColors = {
    low: "bg-muted/60",
    medium: "bg-chart-3/20",
    high: "bg-chart-2/20",
    peak: "bg-primary/15",
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-3">
        <CalendarDays className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Revenue Calendar</h1>
          <p className="text-sm text-muted-foreground">March 2026 — daily revenue, occupancy & event overlay</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        {(["low", "medium", "high", "peak"] as const).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded ${intensityColors[level]}`} />
            <span className="capitalize">{level}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4">
          <div className="h-3 w-3 rounded bg-accent/30" />
          <span>Event</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDow }, (_, i) => (
              <div key={`empty-${i}`} className="h-24" />
            ))}

            {calDays.map((cd) => (
              <div
                key={cd.day}
                className={`h-24 p-1.5 rounded-lg border text-xs transition-colors hover:shadow-sm cursor-pointer
                  ${cd.isToday ? "ring-2 ring-primary border-primary" : ""}
                  ${cd.event ? "border-accent/50" : ""}
                  ${intensityColors[cd.intensity]}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`font-semibold ${cd.isToday ? "text-primary" : "text-foreground"}`}>{cd.day}</span>
                  {cd.event && (
                    <Badge variant="outline" className="text-[8px] px-1 py-0 h-4 bg-accent/10 border-accent/30">
                      {cd.event.demandImpact === "high" ? "🔥" : "📅"}
                    </Badge>
                  )}
                </div>
                {cd.rev && (
                  <div className="mt-1 space-y-0.5">
                    <p className="text-[10px] text-foreground font-medium">{cd.rev.occupancyPercent}% occ</p>
                    <p className="text-[10px] text-muted-foreground">₹{(cd.rev.adr / 1000).toFixed(1)}K ADR</p>
                  </div>
                )}
                {cd.event && (
                  <p className="text-[8px] text-accent-foreground/70 mt-0.5 truncate">{cd.event.name}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
