import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Globe,
  TrendingUp,
  Link,
} from "lucide-react";
import { aiPlatforms, travelQueries, hotelConfig } from "@/data/geo-mock-data";

export function AiPlatformMonitor() {
  return (
    <div className="space-y-6">
      {/* Per-Platform Detail Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {aiPlatforms.map((platform) => (
          <Card key={platform.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-lg">{platform.icon}</span>
                  {platform.name}
                </CardTitle>
                <Badge variant={platform.score >= 75 ? "default" : platform.score >= 60 ? "secondary" : "destructive"}>
                  {platform.score}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-muted/50 p-2">
                  <span className="text-muted-foreground">Mentions</span>
                  <p className="font-bold text-sm">{platform.mentions}/wk</p>
                </div>
                <div className="rounded bg-muted/50 p-2">
                  <span className="text-muted-foreground">Citations</span>
                  <p className="font-bold text-sm">{platform.citationRate}%</p>
                </div>
                <div className="rounded bg-muted/50 p-2">
                  <span className="text-muted-foreground">Sentiment</span>
                  <p className="font-bold text-sm">{platform.sentiment}%</p>
                </div>
                <div className="rounded bg-muted/50 p-2">
                  <span className="text-muted-foreground">Accuracy</span>
                  <p className="font-bold text-sm">{platform.brandAccuracy}%</p>
                </div>
              </div>

              {/* Cited Pages */}
              {platform.citedPages.length > 0 && (
                <div>
                  <p className="text-[11px] text-muted-foreground font-medium mb-1 flex items-center gap-1">
                    <Link className="h-3 w-3" /> Cited Pages
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {platform.citedPages.map((page) => (
                      <Badge key={page} variant="outline" className="text-[10px] py-0">
                        {page}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues / Alerts */}
              {platform.issues.length > 0 && (
                <div className="space-y-1.5">
                  {platform.issues.map((issue, i) => {
                    const Icon = issue.type === "error" ? XCircle : issue.type === "warning" ? AlertTriangle : CheckCircle;
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-1.5 text-[11px] rounded p-1.5 ${
                          issue.type === "error"
                            ? "bg-destructive/10 text-destructive"
                            : issue.type === "warning"
                            ? "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"
                            : "bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]"
                        }`}
                      >
                        <Icon className="h-3 w-3 mt-0.5 shrink-0" />
                        {issue.message}
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-[10px] text-muted-foreground">
                Last checked: {new Date(platform.lastChecked).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Travel Query Tracker */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" /> Travel Query Tracker
          </CardTitle>
          <CardDescription>
            Queries where "{hotelConfig.name}" should appear in AI responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query</TableHead>
                <TableHead className="text-center">Volume</TableHead>
                <TableHead className="text-center">Your Rank</TableHead>
                <TableHead>Top Result</TableHead>
                <TableHead className="text-center">Intent</TableHead>
                <TableHead className="text-center">Competition</TableHead>
                <TableHead className="text-center">Opportunity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {travelQueries.map((q) => (
                <TableRow key={q.query}>
                  <TableCell className="font-medium text-sm">"{q.query}"</TableCell>
                  <TableCell className="text-center text-sm">{q.volume.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    {q.yourRank ? (
                      <Badge variant={q.yourRank <= 2 ? "default" : q.yourRank <= 4 ? "secondary" : "destructive"}>
                        #{q.yourRank}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Not found</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{q.topResult}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-[10px]">{q.intent}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`text-xs font-medium ${
                      q.competition === "low" ? "text-[hsl(var(--success))]" : q.competition === "medium" ? "text-[hsl(var(--warning))]" : "text-destructive"
                    }`}>
                      {q.competition}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-2">
                      <Progress value={q.opportunity} className="h-1.5 w-12" />
                      <span className="text-xs font-medium">{q.opportunity}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
