import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  HelpCircle,
  Share2,
  Mail,
  Newspaper,
  Star,
  Sparkles,
  CheckCircle,
  Clock,
  BarChart3,
  Eye,
  MousePointerClick,
  ArrowUpRight,
} from "lucide-react";
import { campaignTemplates } from "@/data/geo-mock-data";

const typeIcons: Record<string, React.ElementType> = {
  blog: FileText,
  faq: HelpCircle,
  social: Share2,
  email: Mail,
  press: Newspaper,
  review: Star,
};

const typeLabels: Record<string, string> = {
  blog: "Blog Post",
  faq: "FAQ Content",
  social: "Social Media",
  email: "Email Campaign",
  press: "Press Release",
  review: "Review Campaign",
};

const seoChecklist = [
  { task: "Claim & optimize Google Business Profile", done: true },
  { task: "Submit XML sitemap to all search engines", done: true },
  { task: "Add JSON-LD Hotel schema to all pages", done: false },
  { task: "Create FAQ pages with FAQPage schema", done: false },
  { task: "Add AggregateRating schema from reviews", done: false },
  { task: "Optimize all images with descriptive alt text", done: false },
  { task: "Create location-specific landing pages", done: false },
  { task: "Build comprehensive 'About' page with E-E-A-T signals", done: true },
  { task: "Set up review monitoring on TripAdvisor, Google, Booking.com", done: true },
  { task: "Create a press/media page for AI indexing", done: false },
  { task: "Implement hreflang tags for multi-language content", done: false },
  { task: "Build an accessibility-optimized booking widget", done: true },
];

export function ContentCampaignGenerator() {
  const [activeType, setActiveType] = useState("all");

  const filtered = activeType === "all" ? campaignTemplates : campaignTemplates.filter((c) => c.type === activeType);

  return (
    <div className="space-y-6">
      {/* Content Types Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeType === "all" ? "default" : "outline"}
          onClick={() => setActiveType("all")}
          className="text-xs"
        >
          All ({campaignTemplates.length})
        </Button>
        {Object.entries(typeLabels).map(([key, label]) => {
          const count = campaignTemplates.filter((c) => c.type === key).length;
          if (count === 0) return null;
          const Icon = typeIcons[key];
          return (
            <Button
              key={key}
              size="sm"
              variant={activeType === key ? "default" : "outline"}
              onClick={() => setActiveType(key)}
              className="text-xs"
            >
              <Icon className="h-3 w-3 mr-1" />
              {label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Campaign Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((campaign) => {
          const Icon = typeIcons[campaign.type];
          return (
            <Card key={campaign.id} className={campaign.status === "completed" ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm">{campaign.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {campaign.aiOptimized && (
                      <Badge variant="outline" className="text-[10px] py-0 border-[hsl(var(--accent))] text-[hsl(var(--accent))]">
                        <Sparkles className="h-2.5 w-2.5 mr-0.5" /> AI Optimized
                      </Badge>
                    )}
                    <Badge
                      variant={campaign.status === "active" ? "default" : campaign.status === "completed" ? "secondary" : "outline"}
                      className="text-[10px] py-0"
                    >
                      {campaign.status === "active" && <Clock className="h-2.5 w-2.5 mr-0.5" />}
                      {campaign.status === "completed" && <CheckCircle className="h-2.5 w-2.5 mr-0.5" />}
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-xs">{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded bg-muted/50 p-2.5 text-xs text-muted-foreground line-clamp-3">
                  {campaign.content}
                </div>

                <p className="text-xs font-medium text-[hsl(var(--success))]">
                  <ArrowUpRight className="h-3 w-3 inline mr-0.5" />
                  {campaign.estimatedImpact}
                </p>

                {campaign.performance && (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded bg-muted/50 p-2 text-center">
                      <Eye className="h-3 w-3 mx-auto text-muted-foreground" />
                      <p className="font-bold mt-0.5">{campaign.performance.views.toLocaleString()}</p>
                      <p className="text-muted-foreground text-[10px]">Views</p>
                    </div>
                    <div className="rounded bg-muted/50 p-2 text-center">
                      <MousePointerClick className="h-3 w-3 mx-auto text-muted-foreground" />
                      <p className="font-bold mt-0.5">{campaign.performance.clicks.toLocaleString()}</p>
                      <p className="text-muted-foreground text-[10px]">Clicks</p>
                    </div>
                    <div className="rounded bg-muted/50 p-2 text-center">
                      <BarChart3 className="h-3 w-3 mx-auto text-muted-foreground" />
                      <p className="font-bold mt-0.5">{campaign.performance.conversions}</p>
                      <p className="text-muted-foreground text-[10px]">Conversions</p>
                    </div>
                  </div>
                )}

                {campaign.status === "draft" && (
                  <Button size="sm" className="w-full text-xs">Launch Campaign</Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* SEO + AI Optimization Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Local SEO + AI Optimization Checklist</CardTitle>
          <CardDescription>
            {seoChecklist.filter((i) => i.done).length}/{seoChecklist.length} completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={(seoChecklist.filter((i) => i.done).length / seoChecklist.length) * 100}
            className="h-2 mb-4"
          />
          <div className="space-y-2">
            {seoChecklist.map((item, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm ${item.done ? "text-muted-foreground line-through" : ""}`}>
                <CheckCircle className={`h-4 w-4 shrink-0 ${item.done ? "text-[hsl(var(--success))]" : "text-muted-foreground/30"}`} />
                {item.task}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
