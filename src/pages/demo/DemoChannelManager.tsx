import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Brain, Globe, AlertTriangle, CheckCircle } from "lucide-react";
import { channelPerformance, formatCurrency } from "@/demo/data/mock-data";
import { generateChannelSuggestions } from "@/demo/lib/revenue-ai-engine";

const suggestions = generateChannelSuggestions();
const totalBookings = channelPerformance.reduce((s, c) => s + c.bookings, 0);
const totalRevenue = channelPerformance.reduce((s, c) => s + c.revenue, 0);
const totalCommission = channelPerformance.reduce((s, c) => s + Math.round(c.revenue * c.commission / 100), 0);

export default function ChannelManager() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-3">
        <Globe className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Channel Manager</h1>
          <p className="text-sm text-muted-foreground">OTA distribution, rate parity & channel performance</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Bookings</p><p className="text-xl font-bold">{totalBookings}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Revenue</p><p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Commission Paid</p><p className="text-xl font-bold text-destructive">{formatCurrency(totalCommission)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Net Revenue</p><p className="text-xl font-bold text-primary">{formatCurrency(totalRevenue - totalCommission)}</p></CardContent></Card>
      </div>

      {/* Channel Performance Table */}
      <Card>
        <CardHeader><CardTitle className="text-base">Channel Performance</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Net Revenue</TableHead>
                <TableHead className="text-right">Avg Rate</TableHead>
                <TableHead className="text-right">Cancel %</TableHead>
                <TableHead>Parity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelPerformance.map((ch) => {
                const commissionAmt = Math.round(ch.revenue * ch.commission / 100);
                const isParity = ch.commission === 0 || Math.abs(ch.avgRate - 7250) < 1000;
                return (
                  <TableRow key={ch.channel}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: ch.color }} />
                        <span className="font-medium">{ch.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{ch.bookings}</TableCell>
                    <TableCell className="text-right">{formatCurrency(ch.revenue)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {ch.commission > 0 ? `${ch.commission}% (${formatCurrency(commissionAmt)})` : "—"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(ch.revenue - commissionAmt)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(ch.avgRate)}</TableCell>
                    <TableCell className="text-right">
                      <span className={ch.cancelRate > 12 ? "text-destructive font-semibold" : ""}>{ch.cancelRate}%</span>
                    </TableCell>
                    <TableCell>
                      {isParity ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Channel Mix Suggestions */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">AI Channel Mix Optimization</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {suggestions.map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-background border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{s.channel}</Badge>
                </div>
                <p className="font-semibold text-sm">{s.action}</p>
                <p className="text-xs text-muted-foreground">{s.reason}</p>
                <p className="text-xs font-medium text-primary">{s.expectedImpact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
