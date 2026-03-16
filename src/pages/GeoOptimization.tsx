import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AiVisibilityDashboard } from "@/components/geo/AiVisibilityDashboard";
import { ContentAudit } from "@/components/geo/ContentAudit";
import { AiPlatformMonitor } from "@/components/geo/AiPlatformMonitor";
import { ContentCampaignGenerator } from "@/components/geo/ContentCampaignGenerator";
import { CompetitorIntelligence } from "@/components/geo/CompetitorIntelligence";
import {
  BarChart3,
  FileCode,
  Eye,
  Megaphone,
  Swords,
} from "lucide-react";

const GeoOptimization = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Generative Engine Optimization</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Maximize hotel discoverability across ChatGPT, Gemini, Perplexity, Google AI Overviews, Bing Copilot & Meta AI
        </p>
      </div>

      <Tabs defaultValue="visibility" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="visibility" className="text-xs gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" /> AI Visibility
          </TabsTrigger>
          <TabsTrigger value="content-audit" className="text-xs gap-1.5">
            <FileCode className="h-3.5 w-3.5" /> Content Audit
          </TabsTrigger>
          <TabsTrigger value="platform-monitor" className="text-xs gap-1.5">
            <Eye className="h-3.5 w-3.5" /> Platform Monitor
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs gap-1.5">
            <Megaphone className="h-3.5 w-3.5" /> Content & Campaigns
          </TabsTrigger>
          <TabsTrigger value="competitors" className="text-xs gap-1.5">
            <Swords className="h-3.5 w-3.5" /> Competitor Intel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visibility">
          <AiVisibilityDashboard />
        </TabsContent>
        <TabsContent value="content-audit">
          <ContentAudit />
        </TabsContent>
        <TabsContent value="platform-monitor">
          <AiPlatformMonitor />
        </TabsContent>
        <TabsContent value="campaigns">
          <ContentCampaignGenerator />
        </TabsContent>
        <TabsContent value="competitors">
          <CompetitorIntelligence />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeoOptimization;
