import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileCode,
  Image,
  FileText,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { contentPages, contentSuggestions, hotelConfig } from "@/data/geo-mock-data";

const priorityColors: Record<string, string> = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: AlertTriangle,
  in_progress: Sparkles,
  done: CheckCircle,
};

export function ContentAudit() {
  const avgScore = Math.round(contentPages.reduce((s, p) => s + p.overallScore, 0) / contentPages.length);
  const avgReadability = Math.round(contentPages.reduce((s, p) => s + p.aiReadability, 0) / contentPages.length);
  const avgAltText = Math.round(contentPages.reduce((s, p) => s + p.altTextCoverage, 0) / contentPages.length);
  const totalMissingSchema = contentPages.reduce((s, p) => s + p.missingSchema.length, 0);

  return (
    <div className="space-y-6">
      {/* Overview KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Content Score</p>
            <p className="text-3xl font-bold mt-1">{avgScore}<span className="text-base font-normal text-muted-foreground">/100</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">AI Readability</p>
            <p className="text-3xl font-bold mt-1">{avgReadability}<span className="text-base font-normal text-muted-foreground">/100</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Alt-Text Coverage</p>
            <p className="text-3xl font-bold mt-1">{avgAltText}<span className="text-base font-normal text-muted-foreground">%</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium">Missing Schema</p>
            <p className="text-3xl font-bold text-destructive mt-1">{totalMissingSchema}</p>
          </CardContent>
        </Card>
      </div>

      {/* Page-by-Page Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Page Content Analysis</CardTitle>
          <CardDescription>Website: {hotelConfig.url}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">AI Readability</TableHead>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Meta</TableHead>
                <TableHead className="text-center">Alt Text</TableHead>
                <TableHead>Schema</TableHead>
                <TableHead>Missing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentPages.map((page) => (
                <TableRow key={page.url}>
                  <TableCell className="font-medium text-sm">
                    <div className="flex items-center gap-1">
                      <span>{page.title}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{page.url}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={page.overallScore >= 75 ? "default" : page.overallScore >= 60 ? "secondary" : "destructive"}>
                      {page.overallScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={page.aiReadability >= 75 ? "text-[hsl(var(--success))]" : page.aiReadability >= 60 ? "text-[hsl(var(--warning))]" : "text-destructive"}>
                      {page.aiReadability}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm">{page.titleScore}</TableCell>
                  <TableCell className="text-center text-sm">{page.metaScore}</TableCell>
                  <TableCell className="text-center">
                    <span className={page.altTextCoverage >= 70 ? "text-[hsl(var(--success))]" : "text-destructive"}>
                      {page.altTextCoverage}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {page.schemaMarkup.map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] py-0">{s}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {page.missingSchema.map((s) => (
                        <Badge key={s} variant="destructive" className="text-[10px] py-0">{s}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" /> Optimization Action Items</CardTitle>
          <CardDescription>{contentSuggestions.filter(s => s.status !== "done").length} pending actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {contentSuggestions.map((item) => {
            const StatusIcon = statusIcons[item.status];
            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 rounded-lg border p-3 ${item.status === "done" ? "opacity-60" : ""}`}
              >
                <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${
                  item.status === "done" ? "text-[hsl(var(--success))]" : item.status === "in_progress" ? "text-[hsl(var(--info))]" : "text-muted-foreground"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{item.title}</span>
                    <Badge variant={priorityColors[item.priority] as any} className="text-[10px] py-0">
                      {item.priority}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] py-0">{item.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  <p className="text-xs font-medium text-[hsl(var(--success))] mt-1">Expected: {item.impact}</p>
                </div>
                {item.status === "pending" && (
                  <Button size="sm" variant="outline" className="shrink-0 text-xs">
                    Start
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
