import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MousePointerClick, TrendingUp, Globe, ArrowRight, Gift, ShieldCheck } from "lucide-react";
import { todayKPIs, formatCurrency, channelPerformance } from "@/data/mock-data";

const directChannel = channelPerformance.find((c) => c.channel === "direct")!;
const otaChannels = channelPerformance.filter((c) => c.commission > 0);
const totalOTACommission = otaChannels.reduce((s, c) => s + Math.round(c.revenue * c.commission / 100), 0);

const funnelSteps = [
  { label: "Website Visitors", value: 12400, pct: 100 },
  { label: "Checked Availability", value: 3720, pct: 30 },
  { label: "Started Booking", value: 892, pct: 7.2 },
  { label: "Completed Booking", value: 145, pct: 1.2 },
];

const bestRateCheck = [
  { ota: "Booking.com", otaRate: 8000, yourRate: 7650, savings: 350, parity: true },
  { ota: "Expedia", otaRate: 7500, yourRate: 7650, savings: -150, parity: false },
  { ota: "MakeMyTrip", otaRate: 7000, yourRate: 7650, savings: -650, parity: false },
  { ota: "Agoda", otaRate: 7500, yourRate: 7650, savings: -150, parity: false },
];

export default function DirectBooking() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-3">
        <MousePointerClick className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Direct Booking Optimizer</h1>
          <p className="text-sm text-muted-foreground">Increase direct bookings, reduce OTA dependency, save on commissions</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Direct Booking %</p><p className="text-xl font-bold">{todayKPIs.directBookingPercent}%</p><p className="text-[10px] text-muted-foreground">Target: 40%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Direct Revenue</p><p className="text-xl font-bold">{formatCurrency(directChannel.revenue)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">OTA Commission Lost</p><p className="text-xl font-bold text-destructive">{formatCurrency(totalOTACommission)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Potential Savings</p><p className="text-xl font-bold text-primary">{formatCurrency(Math.round(totalOTACommission * 0.3))}</p><p className="text-[10px] text-muted-foreground">If 30% OTA shifts to direct</p></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader><CardTitle className="text-base">Booking Conversion Funnel</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {funnelSteps.map((step, idx) => (
              <div key={step.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{step.label}</span>
                  <span className="text-muted-foreground">{step.value.toLocaleString()} ({step.pct}%)</span>
                </div>
                <div className="h-6 bg-muted rounded-lg overflow-hidden">
                  <div className="h-full rounded-lg bg-primary transition-all" style={{ width: `${step.pct}%`, opacity: 1 - idx * 0.15 }} />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">💡 Conversion rate: 1.2% — Industry avg: 2.5%. Opportunity to double direct bookings.</p>
          </CardContent>
        </Card>

        {/* Best Rate Guarantee */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Best Rate Guarantee Check</CardTitle>
            <CardDescription>Your direct rate vs OTA prices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bestRateCheck.map((br) => (
              <div key={br.ota} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">{br.ota}</p>
                  <p className="text-xs text-muted-foreground">OTA: {formatCurrency(br.otaRate)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(br.yourRate)}</p>
                  <Badge variant={br.savings > 0 ? "default" : "destructive"} className="text-[10px]">
                    {br.savings > 0 ? `You save ${formatCurrency(br.savings)}` : `OTA cheaper by ${formatCurrency(Math.abs(br.savings))}`}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Suggested Promotions */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">🎯 AI-Suggested Direct Booking Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { icon: Gift, title: "Book Direct & Save 10%", desc: "Show real-time price comparison on website. Guaranteed lowest rate.", impact: "+15% direct conversion" },
              { icon: TrendingUp, title: "Loyalty Points Bonus", desc: "2x loyalty points for direct bookings this month.", impact: "+₹2.8L direct revenue" },
              { icon: Globe, title: "Free Upgrade for Direct", desc: "Auto-upgrade to next room category for direct bookers.", impact: "+22% repeat direct bookings" },
            ].map((promo, i) => (
              <div key={i} className="p-4 rounded-lg bg-background border space-y-2">
                <promo.icon className="h-5 w-5 text-accent" />
                <p className="font-semibold text-sm">{promo.title}</p>
                <p className="text-xs text-muted-foreground">{promo.desc}</p>
                <p className="text-xs font-medium text-primary">{promo.impact}</p>
                <Button size="sm" variant="outline" className="w-full text-xs mt-2">Launch Campaign <ArrowRight className="h-3 w-3 ml-1" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
