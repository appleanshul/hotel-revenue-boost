import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Crown, Star, Medal } from "lucide-react";
import { topGuests, formatCurrency } from "@/demo/data/mock-data";

const segmentColors: Record<string, string> = {
  platinum: "bg-primary text-primary-foreground",
  gold: "bg-accent text-accent-foreground",
  silver: "bg-muted-foreground text-background",
  bronze: "bg-muted text-muted-foreground",
};

const segmentIcons: Record<string, typeof Crown> = {
  platinum: Crown,
  gold: Star,
  silver: Medal,
  bronze: Users,
};

const totalLTV = topGuests.reduce((s, g) => s + g.totalSpend, 0);
const avgLTV = Math.round(totalLTV / topGuests.length);
const repeatRate = Math.round(topGuests.filter((g) => g.totalStays > 1).length / topGuests.length * 100);

export default function GuestRevenue() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-3">
        <Users className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Guest Revenue Insights</h1>
          <p className="text-sm text-muted-foreground">Lifetime value tracking, high-value guest identification & re-engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Guest LTV</p><p className="text-xl font-bold">{formatCurrency(totalLTV)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg LTV per Guest</p><p className="text-xl font-bold">{formatCurrency(avgLTV)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Repeat Rate</p><p className="text-xl font-bold">{repeatRate}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Top Segment</p><p className="text-xl font-bold">Platinum</p><p className="text-[10px] text-muted-foreground">{topGuests.filter((g) => g.segment === "platinum").length} guests</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Top Revenue Guests</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Total Spend</TableHead>
                <TableHead className="text-right">Stays</TableHead>
                <TableHead className="text-right">Avg/Night</TableHead>
                <TableHead className="text-right">Last Stay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topGuests.map((g) => {
                const Icon = segmentIcons[g.segment] || Users;
                return (
                  <TableRow key={g.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${segmentColors[g.segment]}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {g.segment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm capitalize">{g.source.replace("-", " ")}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(g.totalSpend)}</TableCell>
                    <TableCell className="text-right">{g.totalStays}</TableCell>
                    <TableCell className="text-right">{formatCurrency(g.avgNightlySpend)}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(g.lastStay).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Re-engagement suggestions */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader><CardTitle className="text-base">🔄 AI Re-engagement Suggestions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { title: "Win-back Campaign", desc: "3 bronze guests haven't visited in 6+ months. Send personalized offer with 15% discount.", target: "Bronze guests" },
              { title: "Loyalty Upgrade Nudge", desc: "2 silver guests are close to gold status. Send progress update + booking incentive.", target: "Silver → Gold" },
              { title: "Anniversary Reminder", desc: "Sunita Verma's anniversary on Mar 15. Send a personalized celebration package offer.", target: "VIP guests" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-background border space-y-2">
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
                <Badge variant="outline" className="text-[10px]">{s.target}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
