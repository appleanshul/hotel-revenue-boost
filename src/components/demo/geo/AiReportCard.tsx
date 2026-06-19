import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  ChevronRight,
} from "lucide-react";
import { aiPlatforms, geoKpis, geoScoreHistory, geoIssues, hotelConfig } from "@/data/geo-mock-data";
import { useState } from "react";

function getGrade(score: number): { grade: string; color: string } {
  if (score >= 85) return { grade: "A", color: "text-[hsl(var(--success))]" };
  if (score >= 70) return { grade: "B", color: "text-[hsl(var(--chart-3))]" };
  if (score >= 55) return { grade: "C", color: "text-[hsl(var(--warning))]" };
  if (score >= 40) return { grade: "D", color: "text-[hsl(var(--accent))]" };
  return { grade: "F", color: "text-destructive" };
}

function getPlatformStatus(platform: typeof aiPlatforms[0]) {
  if (platform.score >= 75) return { icon: CheckCircle2, label: "Recommends your hotel", cls: "text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/20" };
  if (platform.score >= 55) return { icon: AlertTriangle, label: "Shows some issues", cls: "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/20" };
  return { icon: XCircle, label: "Doesn't know your hotel", cls: "text-destructive bg-destructive/10 border-destructive/20" };
}

const visibleCount = aiPlatforms.filter((p) => p.score >= 55).length;
const { grade, color } = getGrade(geoKpis.overallScore);

const chartConfig = {
  score: { label: "Visibility", color: "hsl(var(--primary))" },
};

export function AiReportCard({ onFixIssue }: { onFixIssue?: () => void }) {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Top summary */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Grade circle */}
        <Card className="md:row-span-1">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className={`text-7xl font-black ${color}`}>{grade}</div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Your hotel is visible on <span className="font-bold text-foreground">{visibleCount} of {aiPlatforms.length}</span> AI platforms
            </p>
            <div className="flex items-center gap-1 mt-3">
              {geoKpis.scoreTrend > 0 ? (
                <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className="text-sm font-medium">
                {geoKpis.scoreTrend > 0 ? "+" : ""}{geoKpis.scoreTrend}% this month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <Card>
          <CardContent className="py-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">How often AI recommends you</p>
              <p className="text-2xl font-bold">{geoKpis.avgCitationRate}%</p>
              <p className="text-xs text-[hsl(var(--success))]">↑ {geoKpis.citationTrend}% vs last month</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Times mentioned this week</p>
              <p className="text-2xl font-bold">{geoKpis.totalMentions}</p>
              <p className="text-xs text-[hsl(var(--success))]">↑ {geoKpis.mentionsTrend}% vs last month</p>
            </div>
          </CardContent>
        </Card>

        {/* Issues summary */}
        <Card>
          <CardContent className="py-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Issues to fix</p>
              <p className="text-2xl font-bold">
                {geoIssues.filter((i) => !i.fixed).length}
                <span className="text-sm font-normal text-muted-foreground"> / {geoIssues.length}</span>
              </p>
              <div className="flex gap-2 mt-1">
                <Badge variant="destructive" className="text-[10px]">
                  {geoIssues.filter((i) => i.status === "red").length} urgent
                </Badge>
                <Badge className="text-[10px] bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]">
                  {geoIssues.filter((i) => i.status === "yellow").length} to improve
                </Badge>
              </div>
            </div>
            {onFixIssue && (
              <Button size="sm" onClick={onFixIssue} className="w-full gap-1">
                Fix Issues <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trend chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your visibility over time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[180px]">
            <LineChart data={geoScoreHistory}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Platform cards */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Eye className="h-4 w-4" /> What each AI platform says about {hotelConfig.name}
        </h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {aiPlatforms.map((platform) => {
            const st = getPlatformStatus(platform);
            const Icon = st.icon;
            const issues = geoIssues.filter((i) => i.platform === platform.name && !i.fixed);
            const expanded = expandedPlatform === platform.id;

            return (
              <Card
                key={platform.id}
                className={`border cursor-pointer transition-all hover:shadow-md ${st.cls}`}
                onClick={() => setExpandedPlatform(expanded ? null : platform.id)}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{platform.icon}</span>
                      <span className="font-semibold text-sm text-foreground">{platform.name}</span>
                    </div>
                    <Icon className="h-5 w-5 shrink-0" />
                  </div>
                  <p className="text-xs font-medium mb-2">{st.label}</p>

                  {issues.length > 0 && (
                    <div className="space-y-1 mb-2">
                      {issues.map((issue) => (
                        <p key={issue.id} className="text-[11px] text-foreground/70">⚠ {issue.plainTitle}</p>
                      ))}
                    </div>
                  )}

                  {expanded && (
                    <div className="mt-3 pt-3 border-t border-current/10">
                      <p className="text-[11px] font-medium text-foreground mb-1">What guests see:</p>
                      <p className="text-[11px] text-foreground/80 italic leading-relaxed">
                        "{platform.mockResponse.slice(0, 200)}..."
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
