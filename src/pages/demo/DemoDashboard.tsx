import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, TrendingDown, BedDouble, IndianRupee, BarChart3,
  ArrowUpRight, Brain, Users, CalendarDays, Lightbulb, AlertTriangle,
  Target,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Bar, BarChart, ResponsiveContainer } from "recharts";
import { todayKPIs, dailyRevenue, formatCurrency, revenueBySegment } from "@/demo/data/mock-data";
import { generateDailyBriefing } from "@/demo/lib/revenue-ai-engine";
import { UpcomingEventsPanel } from "@/components/demo/UpcomingEventsPanel";
import { Link } from "react-router-dom";

const briefing = generateDailyBriefing();

const kpis = [
  { label: "Occupancy", value: `${todayKPIs.occupancy}%`, icon: BedDouble, trend: "+3%", up: true, sub: `${todayKPIs.occupiedRooms}/${todayKPIs.occupiedRooms + todayKPIs.availableRooms + todayKPIs.outOfOrder} rooms` },
  { label: "ADR", value: formatCurrency(todayKPIs.adr), icon: IndianRupee, trend: "+₹450", up: true, sub: "Avg Daily Rate" },
  { label: "RevPAR", value: formatCurrency(todayKPIs.revpar), icon: BarChart3, trend: "+8%", up: true, sub: "Revenue per available room" },
  { label: "TRevPAR", value: formatCurrency(todayKPIs.trevpar), icon: Target, trend: "+5%", up: true, sub: "Total Rev per available room" },
  { label: "GOPPAR", value: formatCurrency(todayKPIs.goppar), icon: TrendingUp, trend: "+12%", up: true, sub: "Gross Operating Profit/room" },
  { label: "Direct %", value: `${todayKPIs.directBookingPercent}%`, icon: ArrowUpRight, trend: "-2%", up: false, sub: "Direct booking share" },
];

const quickActions = [
  { label: "Rate Manager", icon: IndianRupee, to: "/rates", color: "bg-primary/10 text-primary" },
  { label: "AI Center", icon: Brain, to: "/ai-center", color: "bg-accent/20 text-accent-foreground" },
  { label: "Channels", icon: CalendarDays, to: "/channels", color: "bg-info/10 text-info-foreground" },
  { label: "Guests", icon: Users, to: "/guests", color: "bg-success/10 text-success-foreground" },
];

const chartConfig = {
  roomRevenue: { label: "Room Revenue", color: "hsl(var(--chart-1))" },
  fnbRevenue: { label: "F&B Revenue", color: "hsl(var(--chart-2))" },
  otherRevenue: { label: "Other", color: "hsl(var(--chart-3))" },
};

const occConfig = {
  occupancyPercent: { label: "Occupancy %", color: "hsl(var(--chart-1))" },
};

export default function Dashboard() {
  const last14 = dailyRevenue.slice(-14);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Revenue Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time revenue intelligence for The Grand Horizon</p>
      </div>

      {/* AI Briefing */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{briefing.greeting}</p>
              <div className="grid gap-1">
                {briefing.highlights.map((h, i) => (
                  <p key={i} className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-accent shrink-0" /> {h}
                  </p>
                ))}
              </div>
              {briefing.alerts.length > 0 && (
                <div className="grid gap-1 mt-2">
                  {briefing.alerts.map((a, i) => (
                    <p key={i} className="text-sm text-foreground/80">{a}</p>
                  ))}
                </div>
              )}
              {briefing.opportunities.length > 0 && (
                <div className="mt-2 pt-2 border-t border-primary/10">
                  <p className="text-xs font-medium text-primary mb-1">💡 Opportunities</p>
                  {briefing.opportunities.map((o, i) => (
                    <p key={i} className="text-xs text-muted-foreground">• {o}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
                <Badge variant={kpi.up ? "default" : "destructive"} className="text-[10px] px-1.5 py-0 h-5">
                  {kpi.up ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                  {kpi.trend}
                </Badge>
              </div>
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              <p className="text-[10px] text-muted-foreground/70">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Events & Pricing Impact */}
      <UpcomingEventsPanel />

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue Trend (14 days)</CardTitle>
            <CardDescription>Room, F&B, and other revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <AreaChart data={last14} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} className="text-[10px]" />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} className="text-[10px]" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="roomRevenue" stackId="1" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" fillOpacity={0.3} />
                <Area type="monotone" dataKey="fnbRevenue" stackId="1" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" fillOpacity={0.3} />
                <Area type="monotone" dataKey="otherRevenue" stackId="1" fill="hsl(var(--chart-3))" stroke="hsl(var(--chart-3))" fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Occupancy Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Occupancy %</CardTitle>
            <CardDescription>14-day trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={occConfig} className="h-[260px] w-full">
              <BarChart data={last14} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric" })} className="text-[10px]" />
                <YAxis domain={[0, 100]} className="text-[10px]" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="occupancyPercent" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Segments + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue by segment */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Segment (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueBySegment.map((seg) => (
                <div key={seg.segment} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium text-foreground">{seg.segment}</div>
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${seg.percentage}%`, backgroundColor: seg.color }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm font-medium text-foreground">{formatCurrency(seg.revenue)}</div>
                  <div className="w-10 text-right text-xs text-muted-foreground">{seg.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((qa) => (
                <Link
                  key={qa.label}
                  to={qa.to}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:shadow-md transition-all hover:scale-[1.02]"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${qa.color}`}>
                    <qa.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{qa.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
