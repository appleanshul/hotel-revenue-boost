import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Trophy,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { competitors, aiPlatforms, travelQueries, hotelConfig } from "@/data/geo-mock-data";
import { useToast } from "@/hooks/use-toast";

const yourScore = Math.round(aiPlatforms.reduce((s, p) => s + p.score, 0) / aiPlatforms.length);

const leaderboard = [
  { name: hotelConfig.name, score: yourScore, isYou: true },
  ...competitors.map((c) => ({ name: c.name, score: c.geoScore, isYou: false })),
].sort((a, b) => b.score - a.score);

const chartData = leaderboard.map((h) => ({
  name: h.name.length > 15 ? h.name.slice(0, 15) + "…" : h.name,
  score: h.score,
  fill: h.isYou ? "hsl(var(--primary))" : "hsl(var(--muted-foreground)/0.4)",
}));

const chartConfig = { score: { label: "AI Visibility", color: "hsl(var(--primary))" } };

// "They have, you don't" gaps
const gaps = competitors
  .filter((c) => c.geoScore > yourScore)
  .flatMap((c) =>
    c.strengths.map((s) => ({ competitor: c.name, advantage: s }))
  );

// Quick wins — high opportunity queries
const quickWins = travelQueries
  .filter((q) => q.opportunity >= 70)
  .sort((a, b) => b.opportunity - a.opportunity)
  .slice(0, 5);

export function CompetitorIntelligence() {
  const { toast } = useToast();
  const yourRank = leaderboard.findIndex((h) => h.isYou) + 1;

  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" /> AI Visibility Leaderboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            You're ranked <span className="font-bold text-foreground">#{yourRank}</span> out of {leaderboard.length} hotels in your area
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[220px]">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* They have, you don't */}
      {gaps.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">What competitors do better</CardTitle>
            <p className="text-sm text-muted-foreground">Things higher-ranked hotels have that you're missing</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {gaps.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div>
                  <p className="text-sm font-medium">{g.advantage}</p>
                  <p className="text-xs text-muted-foreground">{g.competitor}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick wins */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[hsl(var(--warning))]" /> Quick Wins
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Searches where you can easily rank higher than competitors
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickWins.map((q) => (
            <div key={q.query} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="min-w-0 mr-3">
                <p className="text-sm font-medium">"{q.query}"</p>
                <p className="text-xs text-muted-foreground">
                  {q.volume.toLocaleString()} searches/month
                  {q.yourRank ? ` • You're #${q.yourRank}` : " • You're not showing"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">Opportunity:</span>
                  <Progress value={q.opportunity} className="h-1.5 w-16" />
                  <span className="text-xs font-bold text-[hsl(var(--success))]">{q.opportunity}%</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 gap-1"
                onClick={() =>
                  toast({
                    title: "Content generated! 📝",
                    description: `Blog post draft created targeting "${q.query}"`,
                  })
                }
              >
                <Sparkles className="h-3 w-3" /> Write Content
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
