

# Generative Engine Optimization (GEO) Module

A comprehensive module to maximize hotel discoverability across AI platforms (ChatGPT, Gemini, Perplexity, Google AI Overviews, Bing Copilot, Meta AI). Built with mock data + Firecrawl integration wired up for live analysis.

## Module Structure — 5 Sub-Pages via Tabs

**Route**: `/geo` (new sidebar item under "Growth & Direct Sales")

### Tab 1: AI Visibility Score Dashboard
- **Overall GEO Score** (0-100) with breakdown by platform (ChatGPT, Gemini, Perplexity, Google AI Overviews, Bing Copilot, Meta AI)
- Score trend chart over time
- "How AI sees your hotel" — mock AI response preview showing what each platform returns when users ask about hotels in your area
- Competitive positioning: how your hotel ranks vs. competitors in AI responses
- KPI cards: AI Mentions/week, Citation Rate, Sentiment Score, Brand Accuracy

### Tab 2: Content Audit & Optimization
- Website content analysis (mock data, Firecrawl-ready):
  - Schema markup coverage (Hotel, LocalBusiness, FAQ, Review, Event)
  - Content quality scores per page (title, meta, headings, keyword density)
  - Missing structured data alerts
  - Image alt-text audit
- **AI Readability Score** — how well-structured your content is for LLM consumption
- Action items with priority: "Add FAQ schema", "Add review markup", "Improve meta descriptions"
- One-click content suggestions powered by mock AI engine

### Tab 3: AI Platform Monitor
- Per-platform tracking dashboard:
  - What each AI says about your hotel (mock responses)
  - Brand accuracy check (correct address, phone, amenities, pricing?)
  - Sentiment analysis per platform
  - Citation/source tracking — which of your pages are being cited
- Alert system: "Incorrect pricing shown on ChatGPT", "Missing from Perplexity results for 'luxury hotels in [city]'"
- Query tracker: list of travel queries where your hotel should appear

### Tab 4: Content & Campaign Generator
- AI-powered content generation suggestions:
  - Blog post topics optimized for AI citation
  - FAQ content that AI platforms love to cite
  - Social media content calendar
  - Press release templates for AI indexing
- Digital marketing automation:
  - Email campaign templates for guest re-engagement
  - Review solicitation campaigns (more reviews = better AI visibility)
  - Local SEO + AI optimization checklist
- Campaign performance tracking with mock metrics

### Tab 5: Competitor Intelligence
- CompSet AI visibility comparison
- Side-by-side: how AI platforms describe you vs. competitors
- Gap analysis: what competitors rank for that you don't
- Opportunity scoring: queries with high intent but low competition

## Technical Implementation

### New Files
| File | Purpose |
|------|---------|
| `src/pages/GeoOptimization.tsx` | Main page with 5 tabs |
| `src/components/geo/AiVisibilityDashboard.tsx` | Tab 1 — scores & trends |
| `src/components/geo/ContentAudit.tsx` | Tab 2 — website analysis |
| `src/components/geo/AiPlatformMonitor.tsx` | Tab 3 — per-platform tracking |
| `src/components/geo/ContentCampaignGenerator.tsx` | Tab 4 — content & marketing |
| `src/components/geo/CompetitorIntelligence.tsx` | Tab 5 — CompSet analysis |
| `src/data/geo-mock-data.ts` | Mock data for all GEO metrics |

### Modified Files
| File | Change |
|------|--------|
| `src/App.tsx` | Add `/geo` route |
| `src/components/AppSidebar.tsx` | Add GEO nav item with Search icon |

### Mock Data Layer (`geo-mock-data.ts`)
- AI platform scores per platform (6 platforms)
- Content audit results (schema coverage, page scores)
- Mock AI responses for travel queries
- Competitor comparison data
- Campaign templates and performance metrics
- Firecrawl integration stubs (functions that return mock data but accept real URLs)

### Firecrawl Integration (wired but using mock)
- `src/lib/geo-analysis.ts` — functions like `analyzeWebsite(url)`, `auditSchema(url)` that currently return mock data but have Firecrawl call structure ready
- When Firecrawl is connected later, just swap mock returns for real API calls

### Charts
- Radar chart for AI visibility scores across platforms
- Line chart for score trends
- Bar chart for competitor comparison
- Progress bars for content audit items

