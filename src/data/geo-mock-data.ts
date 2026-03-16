// GEO Module — Mock Data for AI Visibility & Digital Marketing

export interface AiPlatform {
  id: string;
  name: string;
  icon: string;
  score: number;
  trend: number; // % change
  mentions: number;
  citationRate: number;
  sentiment: number; // 0-100
  brandAccuracy: number; // 0-100
  lastChecked: string;
  mockResponse: string;
  citedPages: string[];
  issues: { type: "error" | "warning" | "info"; message: string }[];
}

export interface ContentPage {
  url: string;
  title: string;
  overallScore: number;
  titleScore: number;
  metaScore: number;
  headingScore: number;
  keywordDensity: number;
  altTextCoverage: number;
  schemaMarkup: string[];
  missingSchema: string[];
  aiReadability: number;
  wordCount: number;
  lastCrawled: string;
}

export interface ContentSuggestion {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  impact: string;
  status: "pending" | "in_progress" | "done";
}

export interface Competitor {
  name: string;
  geoScore: number;
  platforms: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  topQueries: string[];
}

export interface GeoIssue {
  id: string;
  plainTitle: string;
  plainDescription: string;
  plainFix: string;
  impact: 1 | 2 | 3;
  status: "red" | "yellow" | "green";
  autoFixable: boolean;
  category: "accuracy" | "visibility" | "content" | "reviews";
  platform?: string;
  fixed: boolean;
}

export interface CampaignTemplate {
  id: string;
  type: "blog" | "faq" | "social" | "email" | "press" | "review";
  title: string;
  description: string;
  aiOptimized: boolean;
  estimatedImpact: string;
  content: string;
  status: "draft" | "active" | "completed";
  performance?: { views: number; clicks: number; conversions: number };
}

export interface TravelQuery {
  query: string;
  volume: number;
  yourRank: number | null;
  topResult: string;
  intent: "informational" | "transactional" | "navigational";
  competition: "low" | "medium" | "high";
  opportunity: number; // 0-100
}

export const hotelConfig = {
  name: "The Grand Horizon",
  url: "https://www.thegrandhorizon.com",
  city: "Mumbai",
  category: "5-star luxury hotel",
  address: "Marine Drive, Mumbai, Maharashtra 400020",
  phone: "+91 22 6632 5000",
  amenities: [
    "Rooftop infinity pool",
    "Michelin-star restaurant",
    "Full-service spa",
    "Business center",
    "Ocean-view suites",
    "24/7 concierge",
  ],
};

export const aiPlatforms: AiPlatform[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "🤖",
    score: 72,
    trend: 5.2,
    mentions: 48,
    citationRate: 34,
    sentiment: 82,
    brandAccuracy: 78,
    lastChecked: "2026-03-15T14:30:00Z",
    mockResponse: `The Grand Horizon is a well-regarded 5-star luxury hotel on Marine Drive, Mumbai. Known for its rooftop infinity pool with panoramic ocean views, Michelin-star dining at "Horizon's Edge" restaurant, and full-service Ananta Spa. Room rates typically start around ₹18,000/night for deluxe rooms. Guests frequently praise the attentive concierge service and central location near the Gateway of India.`,
    citedPages: ["/", "/rooms", "/dining", "/spa"],
    issues: [
      { type: "warning", message: "Room rates shown are outdated (showing ₹18,000 vs current ₹22,000)" },
      { type: "info", message: "Missing mention of new rooftop bar opened in 2025" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: "✨",
    score: 68,
    trend: 3.8,
    mentions: 35,
    citationRate: 28,
    sentiment: 79,
    brandAccuracy: 85,
    lastChecked: "2026-03-15T12:00:00Z",
    mockResponse: `The Grand Horizon Mumbai is a luxury 5-star property located on Marine Drive. The hotel features 280 rooms and suites, multiple dining options including the acclaimed Horizon's Edge restaurant, an Ananta Spa, and a rooftop infinity pool. It's positioned as one of the top luxury stays in South Mumbai, competing with the Taj Mahal Palace and Oberoi Mumbai.`,
    citedPages: ["/", "/about", "/rooms"],
    issues: [
      { type: "error", message: "Room count incorrect (showing 280 vs actual 245)" },
      { type: "warning", message: "Not appearing for 'best hotels near Gateway of India' queries" },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    icon: "🔍",
    score: 81,
    trend: 8.1,
    mentions: 62,
    citationRate: 52,
    sentiment: 88,
    brandAccuracy: 91,
    lastChecked: "2026-03-15T16:45:00Z",
    mockResponse: `The Grand Horizon is a premier 5-star luxury hotel situated on Mumbai's iconic Marine Drive [1]. The property offers 245 elegantly appointed rooms and suites with Arabian Sea views [2]. Key highlights include the Michelin-starred Horizon's Edge restaurant, Ananta Spa with traditional Ayurvedic treatments, and a stunning rooftop infinity pool [3]. Average nightly rates range from ₹22,000-₹65,000 depending on room category and season [4].`,
    citedPages: ["/", "/rooms", "/dining", "/spa", "/offers"],
    issues: [
      { type: "info", message: "Strong citation rate — your website is a primary source" },
    ],
  },
  {
    id: "google-ai",
    name: "Google AI Overviews",
    icon: "🌐",
    score: 75,
    trend: 2.1,
    mentions: 89,
    citationRate: 41,
    sentiment: 84,
    brandAccuracy: 88,
    lastChecked: "2026-03-15T10:00:00Z",
    mockResponse: `The Grand Horizon is a 5-star luxury hotel on Marine Drive, Mumbai, offering ocean-view rooms starting at ₹22,000/night. The hotel features the Michelin-starred Horizon's Edge restaurant, Ananta Spa, rooftop pool, and is located 2.5 km from the Gateway of India. Rated 4.6/5 on Google Reviews with 3,200+ reviews.`,
    citedPages: ["/", "/reviews"],
    issues: [
      { type: "warning", message: "Google Business Profile needs updated photos (last updated 6 months ago)" },
    ],
  },
  {
    id: "bing-copilot",
    name: "Bing Copilot",
    icon: "💎",
    score: 58,
    trend: -1.3,
    mentions: 22,
    citationRate: 18,
    sentiment: 75,
    brandAccuracy: 70,
    lastChecked: "2026-03-14T22:00:00Z",
    mockResponse: `The Grand Horizon Mumbai is a luxury hotel on Marine Drive offering premium accommodations. The hotel has a rooftop pool and multiple restaurants. Rooms are available from around ₹20,000 per night.`,
    citedPages: ["/"],
    issues: [
      { type: "error", message: "Very low visibility — minimal content being cited" },
      { type: "warning", message: "Generic description suggests poor structured data pickup" },
      { type: "warning", message: "Amenities list incomplete" },
    ],
  },
  {
    id: "meta-ai",
    name: "Meta AI",
    icon: "🔷",
    score: 45,
    trend: 12.5,
    mentions: 15,
    citationRate: 8,
    sentiment: 71,
    brandAccuracy: 62,
    lastChecked: "2026-03-14T18:00:00Z",
    mockResponse: `The Grand Horizon is a hotel in Mumbai, India. It's located on Marine Drive and offers luxury rooms and dining. The hotel has a pool and spa facilities.`,
    citedPages: [],
    issues: [
      { type: "error", message: "Extremely low visibility on Meta AI" },
      { type: "error", message: "No pages being cited as sources" },
      { type: "warning", message: "Brand accuracy below acceptable threshold" },
    ],
  },
];

export const contentPages: ContentPage[] = [
  {
    url: "/",
    title: "Home — The Grand Horizon Mumbai",
    overallScore: 78,
    titleScore: 85,
    metaScore: 72,
    headingScore: 80,
    keywordDensity: 2.4,
    altTextCoverage: 65,
    schemaMarkup: ["Hotel", "LocalBusiness", "WebSite"],
    missingSchema: ["FAQPage", "AggregateRating"],
    aiReadability: 82,
    wordCount: 1850,
    lastCrawled: "2026-03-14",
  },
  {
    url: "/rooms",
    title: "Rooms & Suites — The Grand Horizon",
    overallScore: 71,
    titleScore: 78,
    metaScore: 65,
    headingScore: 74,
    keywordDensity: 3.1,
    altTextCoverage: 42,
    schemaMarkup: ["HotelRoom", "Offer"],
    missingSchema: ["Product", "AggregateRating", "ImageObject"],
    aiReadability: 68,
    wordCount: 2200,
    lastCrawled: "2026-03-14",
  },
  {
    url: "/dining",
    title: "Dining — Horizon's Edge Restaurant",
    overallScore: 83,
    titleScore: 90,
    metaScore: 82,
    headingScore: 88,
    keywordDensity: 2.8,
    altTextCoverage: 78,
    schemaMarkup: ["Restaurant", "Menu", "Review"],
    missingSchema: ["FAQPage"],
    aiReadability: 86,
    wordCount: 1400,
    lastCrawled: "2026-03-14",
  },
  {
    url: "/spa",
    title: "Ananta Spa — Luxury Spa in Mumbai",
    overallScore: 66,
    titleScore: 72,
    metaScore: 58,
    headingScore: 70,
    keywordDensity: 1.9,
    altTextCoverage: 35,
    schemaMarkup: ["HealthAndBeautyBusiness"],
    missingSchema: ["Service", "Offer", "FAQPage", "Review"],
    aiReadability: 62,
    wordCount: 980,
    lastCrawled: "2026-03-14",
  },
  {
    url: "/offers",
    title: "Special Offers — The Grand Horizon",
    overallScore: 55,
    titleScore: 60,
    metaScore: 48,
    headingScore: 55,
    keywordDensity: 1.2,
    altTextCoverage: 30,
    schemaMarkup: ["Offer"],
    missingSchema: ["Event", "AggregateOffer", "FAQPage"],
    aiReadability: 52,
    wordCount: 650,
    lastCrawled: "2026-03-14",
  },
  {
    url: "/about",
    title: "About Us — The Grand Horizon Mumbai",
    overallScore: 74,
    titleScore: 80,
    metaScore: 75,
    headingScore: 78,
    keywordDensity: 2.2,
    altTextCoverage: 55,
    schemaMarkup: ["Organization", "LocalBusiness"],
    missingSchema: ["FAQPage", "ContactPoint"],
    aiReadability: 78,
    wordCount: 1600,
    lastCrawled: "2026-03-14",
  },
];

export const contentSuggestions: ContentSuggestion[] = [
  {
    id: "cs-1",
    priority: "critical",
    category: "Schema Markup",
    title: "Add FAQPage schema to all pages",
    description: "AI platforms heavily cite FAQ content. Add structured FAQ schema to homepage, rooms, spa, and offers pages.",
    impact: "+15-20% AI citation rate",
    status: "pending",
  },
  {
    id: "cs-2",
    priority: "critical",
    category: "Schema Markup",
    title: "Add AggregateRating schema",
    description: "Include review aggregate data in structured markup. AI platforms use this to validate and recommend properties.",
    impact: "+12% brand accuracy score",
    status: "pending",
  },
  {
    id: "cs-3",
    priority: "high",
    category: "Content Quality",
    title: "Improve image alt-text coverage",
    description: "Only 42% of room page images have descriptive alt text. AI crawlers use alt text to understand visual content.",
    impact: "+8% AI readability score",
    status: "in_progress",
  },
  {
    id: "cs-4",
    priority: "high",
    category: "Content Quality",
    title: "Expand offers page content",
    description: "Offers page has only 650 words — too thin for AI citation. Add detailed package descriptions, T&Cs, and seasonal context.",
    impact: "+10% content score for offers page",
    status: "pending",
  },
  {
    id: "cs-5",
    priority: "high",
    category: "AI Readability",
    title: "Add structured data for spa services",
    description: "Spa page missing Service and Offer schema. Add individual treatment listings with pricing in structured format.",
    impact: "+18% spa page AI visibility",
    status: "pending",
  },
  {
    id: "cs-6",
    priority: "medium",
    category: "Meta Tags",
    title: "Optimize meta descriptions for AI",
    description: "Include key entity data (location, star rating, price range) in meta descriptions for better AI extraction.",
    impact: "+5% overall GEO score",
    status: "pending",
  },
  {
    id: "cs-7",
    priority: "medium",
    category: "Content Strategy",
    title: "Create location-specific landing pages",
    description: "Build pages targeting 'hotels near Gateway of India', 'Marine Drive luxury hotels' for AI query matching.",
    impact: "+25% local query visibility",
    status: "pending",
  },
  {
    id: "cs-8",
    priority: "low",
    category: "Technical SEO",
    title: "Implement canonical tags across all pages",
    description: "Prevent duplicate content issues that confuse AI crawlers when indexing your site.",
    impact: "+3% crawl efficiency",
    status: "done",
  },
];

export const competitors: Competitor[] = [
  {
    name: "Taj Mahal Palace",
    geoScore: 92,
    platforms: { chatgpt: 95, gemini: 90, perplexity: 94, "google-ai": 91, "bing-copilot": 85, "meta-ai": 78 },
    strengths: ["Iconic brand recognition", "Extensive FAQ content", "Rich schema markup", "Massive review volume"],
    weaknesses: ["Slow page load times", "Outdated blog content"],
    topQueries: ["best luxury hotel mumbai", "iconic hotels india", "5 star hotels near gateway of india"],
  },
  {
    name: "Oberoi Mumbai",
    geoScore: 87,
    platforms: { chatgpt: 88, gemini: 86, perplexity: 89, "google-ai": 88, "bing-copilot": 80, "meta-ai": 72 },
    strengths: ["Excellent content quality", "Strong local SEO", "Active blog with travel guides"],
    weaknesses: ["Limited social media content", "Missing event schema"],
    topQueries: ["luxury hotels marine drive", "oberoi mumbai reviews", "premium hotels south mumbai"],
  },
  {
    name: "Trident Nariman Point",
    geoScore: 74,
    platforms: { chatgpt: 76, gemini: 72, perplexity: 78, "google-ai": 75, "bing-copilot": 68, "meta-ai": 55 },
    strengths: ["Good value positioning", "Strong business travel content"],
    weaknesses: ["Weak schema markup", "Low review solicitation", "Poor image optimization"],
    topQueries: ["business hotels mumbai", "hotels nariman point", "corporate stay mumbai"],
  },
  {
    name: "ITC Grand Central",
    geoScore: 69,
    platforms: { chatgpt: 70, gemini: 68, perplexity: 72, "google-ai": 71, "bing-copilot": 62, "meta-ai": 48 },
    strengths: ["Strong F&B content", "Good sustainability narrative"],
    weaknesses: ["Poor mobile optimization", "Missing FAQ schema", "Thin location pages"],
    topQueries: ["itc hotels mumbai", "luxury dining mumbai hotels", "sustainable hotels india"],
  },
];

export const travelQueries: TravelQuery[] = [
  { query: "best luxury hotels in mumbai", volume: 12400, yourRank: 4, topResult: "Taj Mahal Palace", intent: "informational", competition: "high", opportunity: 65 },
  { query: "5 star hotels marine drive mumbai", volume: 5800, yourRank: 2, topResult: "Oberoi Mumbai", intent: "transactional", competition: "medium", opportunity: 82 },
  { query: "hotels with rooftop pool mumbai", volume: 3200, yourRank: 1, topResult: "The Grand Horizon", intent: "transactional", competition: "low", opportunity: 95 },
  { query: "luxury hotel near gateway of india", volume: 8900, yourRank: null, topResult: "Taj Mahal Palace", intent: "transactional", competition: "high", opportunity: 45 },
  { query: "best spa hotels mumbai", volume: 4100, yourRank: 3, topResult: "Oberoi Mumbai", intent: "informational", competition: "medium", opportunity: 72 },
  { query: "michelin star restaurant hotel mumbai", volume: 2700, yourRank: 1, topResult: "The Grand Horizon", intent: "informational", competition: "low", opportunity: 90 },
  { query: "romantic hotels mumbai honeymoon", volume: 6500, yourRank: null, topResult: "Taj Mahal Palace", intent: "transactional", competition: "high", opportunity: 38 },
  { query: "business hotels south mumbai", volume: 4800, yourRank: 5, topResult: "Trident Nariman Point", intent: "transactional", competition: "medium", opportunity: 55 },
  { query: "ocean view hotel mumbai", volume: 3900, yourRank: 2, topResult: "Oberoi Mumbai", intent: "transactional", competition: "medium", opportunity: 78 },
  { query: "heritage luxury hotel mumbai", volume: 2100, yourRank: null, topResult: "Taj Mahal Palace", intent: "informational", competition: "high", opportunity: 30 },
];

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: "ct-1",
    type: "blog",
    title: "Top 10 Things to Do Near Marine Drive",
    description: "Location-focused blog post optimized for AI citation when users ask about Mumbai attractions and nearby hotels.",
    aiOptimized: true,
    estimatedImpact: "+15% local query visibility",
    content: "A comprehensive guide covering Marine Drive attractions, with natural integration of The Grand Horizon as the premier stay option...",
    status: "draft",
  },
  {
    id: "ct-2",
    type: "faq",
    title: "Comprehensive Hotel FAQ Page",
    description: "Structured FAQ covering 30+ common guest questions — AI platforms heavily cite FAQ content.",
    aiOptimized: true,
    estimatedImpact: "+20% AI citation rate",
    content: "Q: What is the check-in time at The Grand Horizon?\nA: Check-in is at 2:00 PM, with early check-in available upon request...",
    status: "active",
    performance: { views: 3400, clicks: 890, conversions: 45 },
  },
  {
    id: "ct-3",
    type: "social",
    title: "Instagram Reels — Behind the Scenes",
    description: "Weekly behind-the-scenes content showing kitchen, spa prep, and room turnover. Builds brand authenticity for AI scraping.",
    aiOptimized: false,
    estimatedImpact: "+8% brand mentions",
    content: "Week 1: Chef's morning prep at Horizon's Edge\nWeek 2: Spa therapist preparing Ayurvedic treatments...",
    status: "active",
    performance: { views: 12500, clicks: 2100, conversions: 120 },
  },
  {
    id: "ct-4",
    type: "email",
    title: "Post-Stay Review Request Sequence",
    description: "3-email sequence requesting reviews on Google, TripAdvisor. More reviews = higher AI visibility.",
    aiOptimized: true,
    estimatedImpact: "+30 reviews/month, +5% AI sentiment",
    content: "Email 1 (Day 1 post-checkout): Thank you + quick feedback link\nEmail 2 (Day 3): Specific review request with direct links\nEmail 3 (Day 7): Final gentle reminder...",
    status: "active",
    performance: { views: 4200, clicks: 1680, conversions: 340 },
  },
  {
    id: "ct-5",
    type: "press",
    title: "New Rooftop Bar Launch Press Release",
    description: "Press release for AI indexing — new venue announcements get high AI pickup rate.",
    aiOptimized: true,
    estimatedImpact: "+12% news citation rate",
    content: "FOR IMMEDIATE RELEASE: The Grand Horizon Mumbai Unveils 'Skyline' — Mumbai's Highest Rooftop Bar...",
    status: "draft",
  },
  {
    id: "ct-6",
    type: "review",
    title: "Review Solicitation QR Campaign",
    description: "In-room QR codes linking to review platforms. Physical touchpoint for digital reviews.",
    aiOptimized: false,
    estimatedImpact: "+50 reviews/month",
    content: "QR code placed on: Room key cards, In-room tablets, Restaurant bill folders, Spa reception...",
    status: "completed",
    performance: { views: 8900, clicks: 3200, conversions: 890 },
  },
];

export const geoScoreHistory = [
  { month: "Oct", score: 52, chatgpt: 55, gemini: 50, perplexity: 60, googleAi: 58, bingCopilot: 42, metaAi: 28 },
  { month: "Nov", score: 56, chatgpt: 60, gemini: 54, perplexity: 65, googleAi: 62, bingCopilot: 45, metaAi: 30 },
  { month: "Dec", score: 60, chatgpt: 64, gemini: 58, perplexity: 70, googleAi: 66, bingCopilot: 48, metaAi: 33 },
  { month: "Jan", score: 63, chatgpt: 67, gemini: 62, perplexity: 74, googleAi: 70, bingCopilot: 52, metaAi: 36 },
  { month: "Feb", score: 67, chatgpt: 70, gemini: 65, perplexity: 78, googleAi: 73, bingCopilot: 55, metaAi: 40 },
  { month: "Mar", score: 71, chatgpt: 72, gemini: 68, perplexity: 81, googleAi: 75, bingCopilot: 58, metaAi: 45 },
];

// Aggregate KPIs
export const geoKpis = {
  overallScore: 71,
  scoreTrend: 5.9,
  totalMentions: 271,
  mentionsTrend: 14.2,
  avgCitationRate: 30.2,
  citationTrend: 8.5,
  avgSentiment: 79.8,
  sentimentTrend: 3.1,
  avgBrandAccuracy: 79.0,
  accuracyTrend: 4.7,
  pagesIndexed: 6,
  totalIssues: aiPlatforms.reduce((sum, p) => sum + p.issues.length, 0),
  criticalIssues: aiPlatforms.reduce((sum, p) => sum + p.issues.filter(i => i.type === "error").length, 0),
};
