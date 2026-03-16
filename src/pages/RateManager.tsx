import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Brain, Check } from "lucide-react";
import { roomInventory, seasonalRates, corporateRates, mealPackages, formatCurrency } from "@/data/mock-data";
import { generatePricingSuggestions } from "@/lib/revenue-ai-engine";

const pricingSuggestions = generatePricingSuggestions();

export default function RateManager() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Rate Manager</h1>
        <p className="text-sm text-muted-foreground">Manage BAR rates, seasonal pricing, corporate tiers & meal packages</p>
      </div>

      <Tabs defaultValue="bar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bar">BAR Rates</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="corporate">Corporate</TabsTrigger>
          <TabsTrigger value="meals">Meal Plans</TabsTrigger>
          <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <Card>
            <CardHeader><CardTitle className="text-base">Best Available Rates (BAR)</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Type</TableHead>
                    <TableHead className="text-right">Base Rate</TableHead>
                    <TableHead className="text-right">Current (Seasonal)</TableHead>
                    <TableHead className="text-right">Max Occ.</TableHead>
                    <TableHead className="text-right">Inventory</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomInventory.map((ri) => {
                    const currentSeasonal = Math.round(ri.baseRate * 1.1);
                    return (
                      <TableRow key={ri.type}>
                        <TableCell className="font-medium">{ri.label}</TableCell>
                        <TableCell className="text-right">{formatCurrency(ri.baseRate)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(currentSeasonal)}</TableCell>
                        <TableCell className="text-right">{ri.maxOccupancy}</TableCell>
                        <TableCell className="text-right">{ri.count} rooms</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal">
          <Card>
            <CardHeader><CardTitle className="text-base">Seasonal Rate Modifiers</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Season</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Modifier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seasonalRates.map((sr) => (
                    <TableRow key={sr.id}>
                      <TableCell className="font-medium">{sr.name}</TableCell>
                      <TableCell>
                        <Badge variant={sr.season === "peak" ? "default" : sr.season === "high" ? "secondary" : "outline"}>
                          {sr.season}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(sr.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} –{" "}
                        {new Date(sr.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={sr.modifier > 1 ? "text-primary font-semibold" : "text-destructive font-semibold"}>
                          {sr.modifier > 1 ? "+" : ""}{Math.round((sr.modifier - 1) * 100)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporate">
          <Card>
            <CardHeader><CardTitle className="text-base">Corporate Rate Tiers</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Usage</TableHead>
                    <TableHead className="text-right">Valid Until</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {corporateRates.map((cr) => (
                    <TableRow key={cr.id}>
                      <TableCell className="font-medium">{cr.companyName}</TableCell>
                      <TableCell>
                        <Badge variant={cr.tier === "platinum" ? "default" : cr.tier === "gold" ? "secondary" : "outline"}>
                          {cr.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{cr.discount}%</TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm">{cr.usedNights}/{cr.roomNights}</span>
                        <div className="w-full h-1.5 bg-muted rounded-full mt-1">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(cr.usedNights / cr.roomNights) * 100}%` }} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {new Date(cr.validUntil).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meals">
          <Card>
            <CardHeader><CardTitle className="text-base">Meal Packages</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mealPackages.map((mp) => (
                  <Card key={mp.id} className="border">
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold text-sm">{mp.label}</h3>
                      <p className="text-xs text-muted-foreground">{mp.description}</p>
                      <p className="text-lg font-bold text-foreground">
                        {mp.pricePerPerson === 0 ? "Included" : `${formatCurrency(mp.pricePerPerson)}/person`}
                      </p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>{mp.includesBreakfast ? "✅ Breakfast" : "❌ Breakfast"}</p>
                        <p>{mp.includesLunch ? "✅ Lunch" : "❌ Lunch"}</p>
                        <p>{mp.includesDinner ? "✅ Dinner" : "❌ Dinner"}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">AI Rate Suggestions</CardTitle>
              </div>
              <CardDescription>Based on occupancy, demand patterns, and upcoming events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pricingSuggestions.map((ps) => (
                  <div key={ps.roomType} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{ps.label}</p>
                      <p className="text-xs text-muted-foreground">{ps.reason}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground line-through">{formatCurrency(ps.currentRate)}</p>
                        <p className="font-bold text-foreground">{formatCurrency(ps.suggestedRate)}</p>
                      </div>
                      <Badge variant={ps.changePercent > 0 ? "default" : "destructive"} className="text-xs">
                        {ps.changePercent > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {ps.changePercent > 0 ? "+" : ""}{ps.changePercent}%
                      </Badge>
                      <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">Confidence</p>
                        <p className="text-sm font-semibold text-primary">{ps.confidence}%</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Check className="h-3 w-3 mr-1" /> Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
