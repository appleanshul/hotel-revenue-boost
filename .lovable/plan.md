

# Revenue Engine for Hotel GMs — Project Plan

## Project Scope

I have full access to your **SynSok Core PMS** project and can see all 25 pages, components, mock data, AI engine, and role system. This Revenue Engine will be a **standalone app with its own mock data**, designed for Hotel GMs to drive revenue through AI-powered insights and automation.

## What We'll Build

### Phase 1: Foundation + Core Revenue Modules

**1. App Shell & Navigation**
- Sidebar layout with Revenue Engine branding
- Role-aware navigation (GM, Revenue Manager, Front Desk)
- Dashboard as landing page

**2. Revenue Dashboard** (home page)
- KPI cards: RevPAR, ADR, Occupancy %, TRevPAR, GOPPAR
- Revenue trend charts (daily/weekly/monthly)
- AI-generated daily briefing for the GM ("Today's revenue pulse")
- Quick action cards linking to other modules

**3. Rate Manager** (migrated + enhanced from PMS)
- BAR rate table by room type with seasonal modifiers
- Corporate and negotiated rate tiers
- Meal package pricing (breakfast, half-board, full-board)
- AI rate suggestion panel — suggests optimal rates based on occupancy patterns, day-of-week, seasonality

**4. AI Revenue Command Center** (migrated + enhanced)
- Dynamic pricing recommendations with confidence scores
- Unsold inventory alerts for next 30/60/90 days
- Demand forecasting charts
- Upsell opportunity tracker
- Competitor rate intelligence (mock CompSet data)
- One-click "Apply Suggestion" actions

**5. Reports & Analytics** (migrated + enhanced)
- Occupancy trends, RevPAR, ARR over time (recharts)
- Revenue by segment (corporate, OTA, direct, walk-in)
- Guest demographics and source market breakdown
- Month-over-month comparison
- Print-friendly export view

**6. Channel Manager** (migrated + enhanced)
- OTA distribution overview (Booking.com, Expedia, MakeMyTrip, etc.)
- Rate parity monitoring
- Channel performance comparison (revenue, bookings, commission %)
- AI-powered channel mix optimization suggestions

### Phase 2: Revenue Growth & Direct Sales (new modules)

**7. Direct Booking Optimizer**
- Website booking widget performance metrics
- Conversion funnel visualization
- AI-suggested promotional offers to boost direct bookings
- Best Rate Guarantee checker against OTA prices

**8. Revenue Calendar**
- Calendar view showing daily revenue, occupancy, and rate data
- Event/holiday overlay (local events that drive demand)
- Color-coded demand intensity
- Click-to-adjust rates for specific dates

**9. Guest Revenue Insights**
- Guest lifetime value tracking
- High-value guest identification
- Loyalty program revenue impact
- Automated re-engagement suggestions (email/SMS nudges for repeat guests)

**10. Promotional Campaign Manager**
- Create time-bound offers (flash sales, last-minute deals, early-bird)
- Target segments (loyalty members, corporate, past guests)
- AI-generated campaign copy suggestions
- Campaign performance tracking

## Technical Approach

- **Data layer**: New `mock-data.ts` with hotel revenue data (rooms, rates, reservations, channels, guests, revenue history)
- **Types**: Shared TypeScript interfaces for all revenue entities
- **Context**: `DataContext.tsx` for app-wide state, `AuthContext.tsx` for role-based access
- **AI Engine**: `revenue-ai-engine.ts` with functions for pricing suggestions, demand forecasting, and campaign recommendations (mock logic initially, Lovable AI integration later)
- **Shared components**: Copy UI patterns from PMS (Layout, Sidebar, StepWizard, NavLink)
- **Charts**: recharts for all visualizations

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/Layout.tsx` | App shell with sidebar |
| `src/components/AppSidebar.tsx` | Revenue Engine navigation |
| `src/context/AuthContext.tsx` | Role-based access |
| `src/context/DataContext.tsx` | Revenue data provider |
| `src/data/mock-data.ts` | Hotel revenue mock data |
| `src/lib/roles.ts` | GM, Revenue Manager, Front Desk roles |
| `src/lib/revenue-ai-engine.ts` | AI analysis functions |
| `src/pages/Dashboard.tsx` | Revenue dashboard |
| `src/pages/RateManager.tsx` | Rate management |
| `src/pages/AiCommandCenter.tsx` | AI revenue center |
| `src/pages/Reports.tsx` | Analytics & reports |
| `src/pages/ChannelManager.tsx` | Channel distribution |
| `src/pages/DirectBooking.tsx` | Direct booking optimizer |
| `src/pages/RevenueCalendar.tsx` | Calendar rate view |
| `src/pages/GuestRevenue.tsx` | Guest value insights |
| `src/pages/Campaigns.tsx` | Promotional campaigns |

## Build Order

1. App shell (Layout, Sidebar, Auth, routing) + mock data
2. Revenue Dashboard
3. Rate Manager + AI Rate Suggestions
4. AI Revenue Command Center
5. Reports & Analytics
6. Channel Manager
7. Direct Booking Optimizer
8. Revenue Calendar
9. Guest Revenue Insights
10. Promotional Campaign Manager

Each step produces a working, navigable page. I'll migrate relevant logic and patterns from SynSok Core PMS where applicable and enhance them for the revenue-focused use case.

