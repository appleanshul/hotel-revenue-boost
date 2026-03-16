import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Search,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { competitors, aiPlatforms, travelQueries, hotelConfig } from "@/data/geo-mock-data";

const yourScore = Math.round(aiPlatforms.reduce((s, p) => s + p.score, 0) / aiPlatforms.length);

const comparisonData = [
  { name: hotelConfig.name.split(" ").slice(-2).join(" "), score: yourScore, fill: "hsl(var(--primary))" },
  ...competitors.map((c) => ({
    name: c.name,
    score: c.geoScore,
    fill: "hsl(var(--muted-foreground))",
  })),
].sort((a, b) => b.score - a.score);

const chartConfig = {
  score: { label: "GEO Score", color: "hsl(var(--primary))" },
};

const platformNames: Record<string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
  "google-ai": "Google AI",
  "bing-copilot": "Bing Copilot",
  "meta-ai": "Meta AI",
};

export function CompetitorIntelligence() {
  // Gap analysis: queries where competitors rank but we don't
  const gapQueries = travelQueries.filter((q) => q.yourRank === null);
  const opportunityQueries = travelQueries.filter((q) => q.opportunity >= 70).sort((a, b) => b.opportunity - a.opportunity);

  return (
    <div className="space-y-6">
      {/* Overall Ranking */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4" /> CompSet AI Visibility Ranking
          </CardTitle>
          <CardDescription>How you stack up against competitors in AI discoverability</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <BarChart data={comparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Platform-by-Platform Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Platform-by-Platform Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                {Object.values(platformNames).map((name) => (
                  <TableHead key={name} className="text-center text-xs">{name}</TableHead>
                ))}
                <TableHead className="text-center">Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Your hotel */}
              <TableRow className="bg-primary/5 font-medium">
                <TableCell className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  {hotelConfig.name}
                </TableCell>
                {aiPlatforms.map((p) => (
                  <TableCell key={p.id} className="text-center">
                    <Badge variant={p.score >= 75 ? "default" : p.score >= 60 ? "secondary" : "destructive"} className="text-[10px]">
                      {p.score}
                    </Badge>
                  </TableCell>
                ))}
                <TableCell className="text-center font-bold">{yourScore}</TableCell>
              </TableRow>
              {/* Competitors */}
              {competitors.map((comp) => {
                const avg = comp.geoScore;
                return (
                  <TableRow key={comp.name}>
                    <TableCell className="text-sm">{comp.name}</TableCell>
                    {Object.keys(platformNames).map((pid) => {
                      const score = comp.platforms[pid] || 0;
                      return (
                        <TableCell key={pid} className="text-center text-sm">
                          {score}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-medium">{avg}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Competitor Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        {competitors.map((comp) => (
          <Card key={comp.name}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{comp.name}</CardTitle>
                <Badge variant={comp.geoScore >= 80 ? "default" : comp.geoScore >= 70 ? "secondary" : "destructive"}>
                  Score: {comp.geoScore}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-[11px] font-medium text-[hsl(var(--success))] mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Strengths
                </p>
                <ul className="space-y-0.5">
                  {comp.strengths.map((s) => (
                    <li key={s} className="text-xs text-muted-foreground">• {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-medium text-destructive mb-1 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> Weaknesses
                </p>
                <ul className="space-y-0.5">
                  {comp.weaknesses.map((w) => (
                    <li key={w} className="text-xs text-muted-foreground">• {w}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Search className="h-3 w-3" /> Top Queries
                </p>
                <div className="flex flex-wrap gap-1">
                  {comp.topQueries.map((q) => (
                    <Badge key={q} variant="outline" className="text-[10px] py-0">{q}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gap Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Gap Analysis
            </CardTitle>
            <CardDescription>Queries where you're missing but competitors rank</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {gapQueries.map((q) => (
              <div key={q.query} className="flex items-center justify-between rounded border p-2.5">
                <div>
                  <p className="text-sm font-medium">"{q.query}"</p>
                  <p className="text-xs text-muted-foreground">
                    Vol: {q.volume.toLocaleString()} • Top: {q.topResult}
                  </p>
                </div>
                <Badge variant="destructive" className="text-[10px]">Not found</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-[hsl(var(--success))]" /> Top Opportunities
            </CardTitle>
            <CardDescription>High-intent queries with strong opportunity scores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {opportunityQueries.map((q) => (
              <div key={q.query} className="flex items-center justify-between rounded border p-2.5">
                <div>
                  <p className="text-sm font-medium">"{q.query}"</p>
                  <p className="text-xs text-muted-foreground">
                    Vol: {q.volume.toLocaleString()} • Rank: {q.yourRank ? `#${q.yourRank}` : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={q.opportunity} className="h-1.5 w-12" />
                  <span className="text-xs font-bold text-[hsl(var(--success))]">{q.opportunity}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
