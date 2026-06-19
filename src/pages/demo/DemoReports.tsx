import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Bar, BarChart, Line, LineChart, Pie, PieChart, Cell } from "recharts";
import { dailyRevenue, channelPerformance, revenueBySegment, formatCurrency, todayKPIs } from "@/demo/data/mock-data";

const revConfig = {
  adr: { label: "ADR", color: "hsl(var(--chart-1))" },
  revpar: { label: "RevPAR", color: "hsl(var(--chart-2))" },
};
const occConfig = { occupancyPercent: { label: "Occupancy %", color: "hsl(var(--chart-1))" } };
const segConfig = revenueBySegment.reduce((acc, s) => ({ ...acc, [s.segment]: { label: s.segment, color: s.color } }), {} as Record<string, { label: string; color: string }>);

const channelConfig = channelPerformance.reduce((acc, c) => ({
  ...acc,
  [c.label]: { label: c.label, color: c.color },
}), {} as Record<string, { label: string; color: string }>);

export default function Reports() {
  const last30 = dailyRevenue;
  const totalRevenue = last30.reduce((s, d) => s + d.roomRevenue + d.fnbRevenue + d.otherRevenue, 0);
  const avgOcc = Math.round(last30.reduce((s, d) => s + d.occupancyPercent, 0) / last30.length);
  const avgAdr = Math.round(last30.reduce((s, d) => s + d.adr, 0) / last30.length);
  const avgRevpar = Math.round(last30.reduce((s, d) => s + d.revpar, 0) / last30.length);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">30-day performance overview with key revenue metrics</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue (30d)", value: formatCurrency(totalRevenue) },
          { label: "Avg Occupancy", value: `${avgOcc}%` },
          { label: "Avg ADR", value: formatCurrency(avgAdr) },
          { label: "Avg RevPAR", value: formatCurrency(avgRevpar) },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-xl font-bold text-foreground">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="segments">By Segment</TabsTrigger>
          <TabsTrigger value="channels">By Channel</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader><CardTitle className="text-base">ADR & RevPAR Trend (30 days)</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={revConfig} className="h-[320px] w-full">
                <LineChart data={last30} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} className="text-[10px]" />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} className="text-[10px]" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="adr" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="revpar" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occupancy">
          <Card>
            <CardHeader><CardTitle className="text-base">Occupancy % (30 days)</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={occConfig} className="h-[320px] w-full">
                <AreaChart data={last30} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} className="text-[10px]" />
                  <YAxis domain={[0, 100]} className="text-[10px]" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="occupancyPercent" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" fillOpacity={0.2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader><CardTitle className="text-base">Revenue by Segment</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBySegment.map((seg) => (
                  <div key={seg.segment} className="flex items-center gap-3">
                    <div className="w-28 text-sm font-medium">{seg.segment}</div>
                    <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                      <div className="h-full rounded-lg flex items-center pl-3 text-xs font-medium text-white" style={{ width: `${seg.percentage}%`, backgroundColor: seg.color }}>
                        {seg.percentage}%
                      </div>
                    </div>
                    <div className="w-24 text-right text-sm font-semibold">{formatCurrency(seg.revenue)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader><CardTitle className="text-base">Revenue by Channel</CardTitle></CardHeader>
            <CardContent>
              <ChartContainer config={channelConfig} className="h-[320px] w-full">
                <BarChart data={channelPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} className="text-[10px]" />
                  <YAxis type="category" dataKey="label" className="text-[10px]" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {channelPerformance.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
