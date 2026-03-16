import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, ArrowUpCircle, Zap, Target } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { todayKPIs, formatCurrency, compSetHotels } from "@/data/mock-data";
import {
  generatePricingSuggestions,
  generateUnsoldAlerts,
  generateUpsellOpportunities,
} from "@/lib/revenue-ai-engine";

const pricing = generatePricingSuggestions();
const unsold = generateUnsoldAlerts();
const upsells = generateUpsellOpportunities();

const unsoldChartConfig = {
  unsoldCount: { label: "Unsold Rooms", color: "hsl(var(--chart-2))" },
};

export default function AiCommandCenter() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Revenue Command Center</h1>
          <p className="text-sm text-muted-foreground">Dynamic pricing, demand forecasting & smart recommendations</p>
        </div>
      </div>

      {/* Dynamic Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-accent" /> Dynamic Pricing Recommendations</CardTitle>
          <CardDescription>AI-optimized rates based on demand, events, and competition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {pricing.map((p) => (
              <div key={p.roomType} className="p-4 rounded-xl border space-y-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm">{p.label}</h3>
                  <Badge variant={p.changePercent > 0 ? "default" : "destructive"} className="text-[10px]">
                    {p.changePercent > 0 ? "+" : ""}{p.changePercent}%
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{formatCurrency(p.suggestedRate)}</span>
                  <span className="text-xs text-muted-foreground line-through">{formatCurrency(p.currentRate)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{p.reason}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${p.confidence}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{p.confidence}%</span>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Apply</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unsold Inventory + Upsells */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Unsold Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Unsold Inventory (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer config={unsoldChartConfig} className="h-[180px] w-full">
              <BarChart data={unsold} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="label" className="text-[10px]" />
                <YAxis className="text-[10px]" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="unsoldCount" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="space-y-2">
              {unsold.slice(0, 3).map((u) => (
                <div key={u.date} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                  <span className="font-medium">{u.label}</span>
                  <span className="text-muted-foreground">{u.unsoldCount} rooms</span>
                  <span className="text-xs text-primary">{u.suggestedAction}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upsell Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-success" /> Upsell Opportunities
            </CardTitle>
            <CardDescription>
              Total potential: {formatCurrency(upsells.reduce((s, u) => s + u.potentialRevenue, 0))}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upsells.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm">{u.title}</p>
                    <p className="text-xs text-muted-foreground">{u.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-foreground">{formatCurrency(u.potentialRevenue)}</p>
                    <p className="text-[10px] text-muted-foreground">{u.guestCount} guests</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CompSet Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-info" /> Competitor Rate Intelligence
          </CardTitle>
          <CardDescription>How you compare to your competitive set</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                <TableHead className="text-right">Standard</TableHead>
                <TableHead className="text-right">Deluxe</TableHead>
                <TableHead className="text-right">Suite</TableHead>
                <TableHead className="text-right">Occ %</TableHead>
                <TableHead className="text-right">RevPAR</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compSetHotels.map((h) => (
                <TableRow key={h.id} className={h.id === "cs1" ? "bg-primary/5 font-semibold" : ""}>
                  <TableCell>{h.name}</TableCell>
                  <TableCell className="text-right">{formatCurrency(h.standardRate)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(h.deluxeRate)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(h.suiteRate)}</TableCell>
                  <TableCell className="text-right">{h.occupancy}%</TableCell>
                  <TableCell className="text-right">{formatCurrency(h.revpar)}</TableCell>
                  <TableCell className="text-right">{h.rating} ⭐</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
