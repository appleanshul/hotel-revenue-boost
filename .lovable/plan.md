

# Simplified GEO Module — "AI Discovery Autopilot"

## The Problem with the Current Module

The current GEO module has 5 technical tabs with jargon like "Schema Markup", "Citation Rate", "FAQPage schema", "keyword density", "hreflang tags". A hotel GM doesn't know or care about these. They want: **"Is my hotel showing up on ChatGPT? If not, fix it."**

## The New Approach: 3 Simple Views

Instead of 5 technical tabs, we redesign into **3 GM-friendly views** with plain language and one-click fixes.

### View 1: "Your AI Report Card" (replaces Visibility + Platform Monitor)

A single-page health check that a GM can glance at in 30 seconds:

- **Big score circle**: "Your hotel is visible on 4 out of 6 AI platforms" with a simple A/B/C/D/F grade
- **Platform cards** with traffic-light colors (green/yellow/red) and plain-English status:
  - ✅ "ChatGPT recommends your hotel" 
  - ⚠️ "Gemini shows wrong room count"
  - ❌ "Meta AI doesn't know your hotel exists"
- **"What guests see"** — side-by-side showing what AI says vs. what's correct, with a "Fix This" button
- **Weekly trend**: simple up/down arrow with "Your visibility improved 6% this week"

No radar charts, no citation rates, no technical scores. Just: are you visible, what's wrong, fix it.

### View 2: "Fix Issues" (replaces Content Audit + Campaigns)

A **to-do list** sorted by impact, written in plain English:

- 🔴 **"AI shows wrong room prices"** — Fix: Update your rates page → [Auto-Fix] button
- 🟡 **"Guests can't find your spa on ChatGPT"** — Fix: We'll add spa details to your site → [Fix Now]  
- 🟡 **"No guest reviews visible to AI"** — Fix: Start review collection campaign → [Launch]
- 🟢 **"Your restaurant ranks #1"** — No action needed ✓

Each issue has:
- Plain language description (no "schema markup" or "alt text")
- Impact shown as stars (★★★ = high impact)
- One-click action that either auto-fixes (generates content/markup) or guides through a simple wizard
- Progress tracker: "12 of 18 issues fixed"

### View 3: "Competitors" (simplified)

- Simple **leaderboard** table: Your hotel vs. competitors with bar chart
- **"They have, you don't"** — plain gap list: "Taj has 3,200 reviews, you have 890"
- **Quick wins** — "Write a blog about Marine Drive attractions" with one-click AI-generate

## Key Design Principles

1. **No jargon** — "Schema markup" becomes "Hotel details AI can read". "Citation rate" becomes "How often AI recommends you"
2. **Traffic light system** — Red/Yellow/Green everywhere instead of scores
3. **One-click fixes** — Every issue has an action button. The platform does the technical work
4. **Progress gamification** — "You've fixed 12/18 issues. Fix 3 more to reach A grade!"
5. **Auto-pilot mode** — Toggle that automatically applies safe fixes (meta descriptions, schema, FAQ generation)

## Technical Changes

### Files to Modify
| File | Change |
|------|--------|
| `src/pages/GeoOptimization.tsx` | Redesign: 3 tabs with simple labels |
| `src/components/geo/AiReportCard.tsx` | New: replaces AiVisibilityDashboard + AiPlatformMonitor |
| `src/components/geo/FixIssues.tsx` | New: replaces ContentAudit + ContentCampaignGenerator |
| `src/components/geo/CompetitorIntelligence.tsx` | Simplify existing |
| `src/data/geo-mock-data.ts` | Add plain-language issue descriptions, auto-fix flags |
| `src/lib/geo-analysis.ts` | Add auto-fix stub functions |

### Files to Remove (replaced)
- `src/components/geo/AiVisibilityDashboard.tsx`
- `src/components/geo/ContentAudit.tsx`
- `src/components/geo/AiPlatformMonitor.tsx`
- `src/components/geo/ContentCampaignGenerator.tsx`

### New Data Model

Each issue gets a simplified structure:
```text
{
  plainTitle: "AI shows wrong room prices"
  plainFix: "We'll update your rates so AI shows correct prices"
  impact: 3  // 1-3 stars
  status: "red" | "yellow" | "green"
  autoFixable: true
  category: "accuracy" | "visibility" | "content" | "reviews"
}
```

### Auto-Fix System (mock, Firecrawl-ready)
- `autoFixSchemaMarkup()` — generates JSON-LD and shows preview
- `autoFixMetaDescriptions()` — AI-generates optimized meta tags
- `autoGenerateFAQ()` — creates FAQ content from hotel data
- `launchReviewCampaign()` — sets up review solicitation flow

All return mock results now but are structured for Firecrawl integration.

