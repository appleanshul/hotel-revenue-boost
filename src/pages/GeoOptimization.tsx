import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SearchCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGeoAudits, useGeoIssues } from "@/lib/re-data/hooks";
import { EmptyState } from "@/components/states/EmptyState";
import { LoadingState } from "@/components/states/LoadingState";
import { Badge } from "@/components/ui/badge";

export default function GeoOptimization() {
  const { hotelId } = useAuth();
  const audits = useGeoAudits(hotelId);
  const issues = useGeoIssues(hotelId);

  const latest = audits.data?.[0];
  const openIssues = (issues.data ?? []).filter((i: any) => !i.fixed);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">GEO — AI Discovery</h1>
        <p className="text-sm text-muted-foreground">How AI search engines see your hotel</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><SearchCheck className="h-4 w-4" /> Latest audit</CardTitle>
          <CardDescription>Most recent AI visibility scan</CardDescription>
        </CardHeader>
        <CardContent>
          {audits.isLoading ? <LoadingState rows={2} /> : !latest ? (
            <EmptyState
              icon={SearchCheck}
              title="No GEO audit yet"
              description="Run your first AI visibility scan to see how ChatGPT, Gemini and Perplexity reference your hotel."
              action={{ label: "Run audit", disabled: true }}
            />
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Overall score</p>
                <p className="text-2xl font-bold">{latest.overall_score ?? "—"}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">AI readability</p>
                <p className="text-2xl font-bold">{latest.ai_readability ?? "—"}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Word count</p>
                <p className="text-2xl font-bold">{latest.word_count ?? "—"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Issues to fix</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.isLoading ? <LoadingState /> : openIssues.length === 0 ? (
            <EmptyState title="No open issues" description={issues.isEmpty ? "Issues will appear after your first audit." : "Great — everything is resolved."} />
          ) : (
            <div className="space-y-2">
              {openIssues.slice(0, 10).map((i: any) => (
                <div key={i.id} className="flex items-center justify-between p-3 rounded-md border">
                  <p className="text-sm">{i.plain_title}</p>
                  <Badge variant={i.status === "red" ? "destructive" : i.status === "amber" ? "secondary" : "outline"}>
                    {i.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
