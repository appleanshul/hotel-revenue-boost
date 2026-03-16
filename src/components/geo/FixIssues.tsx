import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Star,
  Wrench,
  Sparkles,
} from "lucide-react";
import { geoIssues, type GeoIssue } from "@/data/geo-mock-data";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const statusIcon = {
  red: XCircle,
  yellow: AlertTriangle,
  green: CheckCircle2,
};

const statusColor = {
  red: "text-destructive",
  yellow: "text-[hsl(var(--warning))]",
  green: "text-[hsl(var(--success))]",
};

const categoryLabel: Record<string, string> = {
  accuracy: "Wrong Information",
  visibility: "Not Showing Up",
  content: "Content Gaps",
  reviews: "Reviews",
};

function ImpactStars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i <= count ? "fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" : "text-muted"}`}
        />
      ))}
    </div>
  );
}

export function FixIssues() {
  const { toast } = useToast();
  const [issues, setIssues] = useState<GeoIssue[]>(geoIssues);
  const [autopilot, setAutopilot] = useState(false);

  const fixedCount = issues.filter((i) => i.fixed).length;
  const totalCount = issues.length;
  const progress = Math.round((fixedCount / totalCount) * 100);

  const unfixed = issues.filter((i) => !i.fixed).sort((a, b) => b.impact - a.impact);
  const fixed = issues.filter((i) => i.fixed);

  const handleFix = (id: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, fixed: true, status: "green" as const } : i
      )
    );
    toast({
      title: "Fix applied! ✨",
      description: "The change will take effect once AI platforms re-crawl your site.",
    });
  };

  const handleAutopilot = (on: boolean) => {
    setAutopilot(on);
    if (on) {
      const autoFixable = issues.filter((i) => i.autoFixable && !i.fixed);
      setIssues((prev) =>
        prev.map((i) =>
          i.autoFixable && !i.fixed ? { ...i, fixed: true, status: "green" as const } : i
        )
      );
      toast({
        title: `Auto-pilot fixed ${autoFixable.length} issues! 🚀`,
        description: "All safe fixes have been applied automatically.",
      });
    }
  };

  // Grade based on fixed %
  const gradeFromProgress = progress >= 85 ? "A" : progress >= 70 ? "B" : progress >= 50 ? "C" : "D";

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">
                {fixedCount} of {totalCount} issues fixed
              </h3>
              <p className="text-sm text-muted-foreground">
                {progress >= 85
                  ? "Excellent! Your hotel is well-optimized for AI."
                  : progress >= 50
                    ? `Fix ${Math.ceil(totalCount * 0.85) - fixedCount} more to reach grade A!`
                    : "Let's fix the urgent issues first to boost your visibility."}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-4xl font-black ${
                gradeFromProgress === "A" ? "text-[hsl(var(--success))]" :
                gradeFromProgress === "B" ? "text-[hsl(var(--chart-3))]" :
                "text-[hsl(var(--warning))]"
              }`}>
                {gradeFromProgress}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-3" />

          {/* Autopilot toggle */}
          <div className="flex items-center justify-between mt-5 p-3 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Auto-Pilot Mode</p>
                <p className="text-[11px] text-muted-foreground">Automatically apply all safe fixes</p>
              </div>
            </div>
            <Switch checked={autopilot} onCheckedChange={handleAutopilot} />
          </div>
        </CardContent>
      </Card>

      {/* Unfixed issues */}
      {unfixed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Wrench className="h-4 w-4" /> Issues to Fix ({unfixed.length})
          </h3>
          {unfixed.map((issue) => {
            const Icon = statusIcon[issue.status];
            return (
              <Card key={issue.id} className="border">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${statusColor[issue.status]}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-semibold text-sm">{issue.plainTitle}</p>
                          <Badge variant="outline" className="text-[10px] py-0">
                            {categoryLabel[issue.category]}
                          </Badge>
                          {issue.platform && (
                            <Badge variant="secondary" className="text-[10px] py-0">
                              {issue.platform}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{issue.plainDescription}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground">Impact:</span>
                            <ImpactStars count={issue.impact} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={issue.autoFixable ? "default" : "outline"}
                      className="shrink-0 gap-1"
                      onClick={() => handleFix(issue.id)}
                    >
                      {issue.autoFixable ? (
                        <>
                          <Zap className="h-3 w-3" /> Fix Now
                        </>
                      ) : (
                        "Guide Me"
                      )}
                    </Button>
                  </div>
                  {/* What we'll do */}
                  <div className="mt-3 ml-8 p-2 rounded bg-muted/50 text-xs text-muted-foreground">
                    💡 {issue.plainFix}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Fixed issues */}
      {fixed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-[hsl(var(--success))]">
            <CheckCircle2 className="h-4 w-4" /> Done ({fixed.length})
          </h3>
          {fixed.map((issue) => (
            <Card key={issue.id} className="border border-[hsl(var(--success))]/20 bg-[hsl(var(--success))]/5">
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] shrink-0" />
                  <p className="text-sm text-muted-foreground line-through">{issue.plainTitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
