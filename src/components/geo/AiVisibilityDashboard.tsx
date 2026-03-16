import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Quote,
  Heart,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { aiPlatforms, geoScoreHistory, geoKpis, hotelConfig } from "@/data/geo-mock-data";

const radarData = aiPlatforms.map((p) => ({
  platform: p.name,
  score: p.score,
  fullMark: 100,
}));

const radarConfig = {
  score: { label: "GEO Score", color: "hsl(var(--primary))" },
};

const trendConfig = {
  score: { label: "Overall", color: "hsl(var(--primary))" },
  chatgpt: { label: "ChatGPT", color: "hsl(var(--accent))" },
  perplexity: { label: "Perplexity", color: "hsl(var(--info))" },
};

function KpiCard({
  title,
  value,
  trend,
  icon: Icon,
  suffix = "",
}: {
  title: string;
  value: number | string;
  trend: number;
  icon: React.ElementType;
  suffix?: string;
}) {
  const isPositive = trend >= 0;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <Icon className="h-3.5 w-3.5" />
            {title}
          </div>
          <div
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              isPositive ? "text-[hsl(var(--success))]" : "text-destructive"
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {trend}%
          </div>
        </div>
        <div className="mt-2 text-2xl font-bold">
          {value}
          {suffix}
        </div>
      </CardContent>
    </Card>
  );
}

export function AiVisibilityDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard title="GEO Score" value={geoKpis.overallScore} trend={geoKpis.scoreTrend} icon={ShieldCheck} suffix="/100" />
        <KpiCard title="AI Mentions/wk" value={geoKpis.totalMentions} trend={geoKpis.mentionsTrend} icon={Eye} />
        <KpiCard title="Citation Rate" value={`${geoKpis.avgCitationRate}%`} trend={geoKpis.citationTrend} icon={Quote} />
        <KpiCard title="Sentiment" value={`${geoKpis.avgSentiment}%`} trend={geoKpis.sentimentTrend} icon={Heart} />
        <KpiCard title="Brand Accuracy" value={`${geoKpis.avgBrandAccuracy}%`} trend={geoKpis.accuracyTrend} icon={ShieldCheck} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">AI Platform Visibility Breakdown</CardTitle>
            <CardDescription>Score across 6 AI platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={radarConfig} className="h-[300px]">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="platform" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="GEO Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Score Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">GEO Score Trend</CardTitle>
            <CardDescription>6-month improvement trajectory</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-[300px]">
              <LineChart data={geoScoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[20, 100]} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="chatgpt" stroke="hsl(var(--accent))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="perplexity" stroke="hsl(var(--info))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* How AI Sees Your Hotel */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">How AI Sees "{hotelConfig.name}"</CardTitle>
          <CardDescription>Preview of AI-generated responses across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {aiPlatforms.map((platform) => (
              <div
                key={platform.id}
                className="rounded-lg border bg-muted/30 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{platform.icon}</span>
                    <span className="font-semibold text-sm">{platform.name}</span>
                  </div>
                  <Badge
                    variant={platform.score >= 75 ? "default" : platform.score >= 60 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {platform.score}/100
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                  {platform.mockResponse}
                </p>
                {platform.issues.length > 0 && (
                  <div className="space-y-1">
                    {platform.issues.slice(0, 2).map((issue, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-1.5 text-[11px] ${
                          issue.type === "error"
                            ? "text-destructive"
                            : issue.type === "warning"
                            ? "text-[hsl(var(--warning))]"
                            : "text-[hsl(var(--info))]"
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                        {issue.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Score Bars */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Platform-by-Platform Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiPlatforms.map((p) => (
            <div key={p.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{p.icon}</span>
                  <span className="font-medium">{p.name}</span>
                </span>
                <span className="text-muted-foreground">
                  {p.score}/100{" "}
                  <span className={p.trend >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"}>
                    ({p.trend >= 0 ? "+" : ""}{p.trend}%)
                  </span>
                </span>
              </div>
              <Progress value={p.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
