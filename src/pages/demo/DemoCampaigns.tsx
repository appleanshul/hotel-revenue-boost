import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Megaphone, Plus, Brain } from "lucide-react";
import { campaigns, formatCurrency } from "@/demo/data/mock-data";

const statusColors: Record<string, string> = {
  active: "bg-success text-success-foreground",
  scheduled: "bg-info text-info-foreground",
  ended: "bg-muted text-muted-foreground",
  draft: "bg-secondary text-secondary-foreground",
};

const totalRevenue = campaigns.reduce((s, c) => s + c.revenueGenerated, 0);
const totalBookings = campaigns.reduce((s, c) => s + c.bookingsGenerated, 0);
const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

export default function Campaigns() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Megaphone className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Promotional Campaigns</h1>
            <p className="text-sm text-muted-foreground">Create, track & optimize promotional offers</p>
          </div>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Campaign</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Active Campaigns</p><p className="text-xl font-bold">{activeCampaigns}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Bookings</p><p className="text-xl font-bold">{totalBookings}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Revenue Generated</p><p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg ROI</p><p className="text-xl font-bold text-primary">3.2x</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Campaigns</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] capitalize">{c.type.replace("-", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] ${statusColors[c.status]}`}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(c.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} –{" "}
                    {new Date(c.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{c.discount}%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.targetSegment}</TableCell>
                  <TableCell className="text-right">{c.bookingsGenerated}</TableCell>
                  <TableCell className="text-right font-semibold">{c.revenueGenerated > 0 ? formatCurrency(c.revenueGenerated) : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Campaign Suggestions */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">AI Campaign Suggestions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { title: "Holi Weekend Package", desc: "Bundle room + spa + dinner for Holi festival. Target families & couples.", impact: "Est. 40 bookings, ₹5.6L revenue" },
              { title: "Midweek Business Special", desc: "Mon-Thu corporate rate with free breakfast. Target business travelers.", impact: "Est. +12% weekday occupancy" },
              { title: "Repeat Guest Appreciation", desc: "10% off + room upgrade for guests with 3+ stays. Boost loyalty & direct bookings.", impact: "Est. 25 repeat bookings" },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-background border space-y-2">
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
                <p className="text-xs font-medium text-primary">{s.impact}</p>
                <Button size="sm" variant="outline" className="w-full text-xs mt-1">Create Campaign</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
