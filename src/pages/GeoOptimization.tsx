import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AiReportCard } from "@/components/geo/AiReportCard";
import { FixIssues } from "@/components/geo/FixIssues";
import { CompetitorIntelligence } from "@/components/geo/CompetitorIntelligence";
import { ClipboardCheck, Wrench, Trophy } from "lucide-react";
import { useState } from "react";

const GeoOptimization = () => {
  const [activeTab, setActiveTab] = useState("report-card");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Discovery Autopilot</h1>
        <p className="text-muted-foreground text-sm mt-1">
          See how AI platforms like ChatGPT, Gemini & Google recommend your hotel — and fix issues with one click
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="report-card" className="text-xs gap-1.5">
            <ClipboardCheck className="h-3.5 w-3.5" /> AI Report Card
          </TabsTrigger>
          <TabsTrigger value="fix-issues" className="text-xs gap-1.5">
            <Wrench className="h-3.5 w-3.5" /> Fix Issues
          </TabsTrigger>
          <TabsTrigger value="competitors" className="text-xs gap-1.5">
            <Trophy className="h-3.5 w-3.5" /> Competitors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="report-card">
          <AiReportCard onFixIssue={() => setActiveTab("fix-issues")} />
        </TabsContent>
        <TabsContent value="fix-issues">
          <FixIssues />
        </TabsContent>
        <TabsContent value="competitors">
          <CompetitorIntelligence />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeoOptimization;
