// Revenue AI Engine — dynamic pricing, forecasting, recommendations
import {
  type RoomType,
  roomInventory,
  todayKPIs,
  localEvents,
  channelPerformance,
  dailyRevenue,
  compSetHotels,
  topGuests,
  TODAY,
} from "@/data/mock-data";

// === DYNAMIC PRICING ===
export interface PricingSuggestion {
  roomType: RoomType;
  label: string;
  currentRate: number;
  suggestedRate: number;
  changePercent: number;
  confidence: number;
  reason: string;
}

export function generatePricingSuggestions(): PricingSuggestion[] {
  const occ = todayKPIs.occupancy;
  let baseAdjust = 0;
  if (occ > 80) baseAdjust = 0.15;
  else if (occ > 60) baseAdjust = 0.08;
  else if (occ < 40) baseAdjust = -0.12;

  const upcoming = localEvents.filter((e) => {
    const diff = (new Date(e.date).getTime() - new Date(TODAY).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  const impactMap: Record<string, number> = { low: 0.05, medium: 0.12, high: 0.22 };
  const eventAdjust = upcoming.length > 0
    ? Math.max(...upcoming.map((e) => impactMap[e.demandImpact] || 0))
    : 0;

  const totalAdjust = baseAdjust + eventAdjust;
  const premiumMultiplier: Record<RoomType, number> = { standard: 1, deluxe: 1.05, suite: 1.12, "premium-suite": 1.2 };

  return roomInventory.map((ri) => {
    const change = totalAdjust * (premiumMultiplier[ri.type] || 1);
    const suggestedRate = Math.round(ri.baseRate * (1 + change));
    const currentRate = Math.round(ri.baseRate * 1.1); // current seasonal
    const confidence = Math.min(95, 60 + Math.round(occ * 0.3) + (eventAdjust > 0 ? 10 : 0));
    const reason = eventAdjust > 0
      ? `${upcoming[0].name} driving demand (+${Math.round(eventAdjust * 100)}%)`
      : occ > 60
        ? `High occupancy at ${occ}%`
        : "Optimize for fill rate";

    return {
      roomType: ri.type,
      label: ri.label,
      currentRate,
      suggestedRate,
      changePercent: Math.round(((suggestedRate - currentRate) / currentRate) * 100),
      confidence,
      reason,
    };
  });
}

// === UNSOLD INVENTORY ALERTS ===
export interface UnsoldAlert {
  date: string;
  label: string;
  unsoldCount: number;
  byType: { type: RoomType; label: string; count: number }[];
  suggestedAction: string;
}

export function generateUnsoldAlerts(): UnsoldAlert[] {
  const alerts: UnsoldAlert[] = [];
  const base = new Date(TODAY);

  for (let i = 1; i <= 7; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const dow = d.getDay();
    const isWeekday = dow >= 1 && dow <= 4;

    // Simulate unsold rooms — more on weekdays
    const unsoldBase = isWeekday ? 25 + Math.floor(Math.random() * 15) : 10 + Math.floor(Math.random() * 10);
    const byType = roomInventory.map((ri) => ({
      type: ri.type,
      label: ri.label,
      count: Math.max(0, Math.round(unsoldBase * (ri.count / 100))),
    })).filter((t) => t.count > 0);

    const total = byType.reduce((s, t) => s + t.count, 0);
    if (total > 5) {
      alerts.push({
        date: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }),
        unsoldCount: total,
        byType,
        suggestedAction: total > 20
          ? "Launch flash sale or push to OTAs"
          : "Send targeted email to loyalty members",
      });
    }
  }
  return alerts;
}

// === UPSELL OPPORTUNITIES ===
export interface UpsellOpportunity {
  id: string;
  type: "upgrade" | "dining" | "early-checkin" | "late-checkout" | "spa" | "experience";
  title: string;
  description: string;
  guestCount: number;
  potentialRevenue: number;
  icon: string;
}

export function generateUpsellOpportunities(): UpsellOpportunity[] {
  return [
    {
      id: "u1", type: "upgrade", title: "Room Upgrade",
      description: `${todayKPIs.arrivalsToday} arriving guests eligible for paid suite upgrades`,
      guestCount: todayKPIs.arrivalsToday, potentialRevenue: todayKPIs.arrivalsToday * 3500, icon: "ArrowUpCircle",
    },
    {
      id: "u2", type: "dining", title: "Dining Package",
      description: `${Math.round(todayKPIs.inHouse * 0.6)} in-house guests without meal plans`,
      guestCount: Math.round(todayKPIs.inHouse * 0.6), potentialRevenue: Math.round(todayKPIs.inHouse * 0.6) * 1400, icon: "UtensilsCrossed",
    },
    {
      id: "u3", type: "late-checkout", title: "Late Checkout",
      description: `Offer 2pm checkout to ${todayKPIs.departuresToday} departing guests`,
      guestCount: todayKPIs.departuresToday, potentialRevenue: todayKPIs.departuresToday * 1000, icon: "Clock",
    },
    {
      id: "u4", type: "spa", title: "Spa & Wellness",
      description: "Weekend spa package for multi-night guests",
      guestCount: 18, potentialRevenue: 18 * 2500, icon: "Sparkles",
    },
    {
      id: "u5", type: "experience", title: "Curated Experience",
      description: "City tour / local food walk for international guests",
      guestCount: 8, potentialRevenue: 8 * 3000, icon: "MapPin",
    },
  ];
}

// === GM DAILY BRIEFING ===
export interface DailyBriefing {
  greeting: string;
  highlights: string[];
  alerts: string[];
  opportunities: string[];
}

export function generateDailyBriefing(): DailyBriefing {
  const occ = todayKPIs.occupancy;
  const yesterday = dailyRevenue[dailyRevenue.length - 1];
  const directPct = todayKPIs.directBookingPercent;

  const highlights: string[] = [
    `Occupancy at ${occ}% — ${occ > 70 ? "strong performance" : "room to grow"}`,
    `RevPAR ₹${todayKPIs.revpar.toLocaleString()} vs CompSet avg ₹${Math.round(compSetHotels.slice(1).reduce((s, h) => s + h.revpar, 0) / (compSetHotels.length - 1)).toLocaleString()}`,
    `${todayKPIs.arrivalsToday} arrivals, ${todayKPIs.departuresToday} departures today`,
  ];

  const alerts: string[] = [];
  if (occ < 60) alerts.push("⚠️ Occupancy below 60% — consider promotional rates");
  if (todayKPIs.outOfOrder > 3) alerts.push(`🔧 ${todayKPIs.outOfOrder} rooms out of order — impacting inventory`);
  if (directPct < 30) alerts.push("📉 Direct bookings below 30% — OTA commission eating margins");

  const upcomingEvents = localEvents.filter((e) => {
    const diff = (new Date(e.date).getTime() - new Date(TODAY).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 5;
  });
  if (upcomingEvents.length > 0) {
    alerts.push(`📅 ${upcomingEvents[0].name} in ${Math.ceil((new Date(upcomingEvents[0].date).getTime() - new Date(TODAY).getTime()) / (1000 * 60 * 60 * 24))} day(s) — ${upcomingEvents[0].demandImpact} demand impact`);
  }

  const opportunities: string[] = [
    `${generateUpsellOpportunities().reduce((s, u) => s + u.potentialRevenue, 0).toLocaleString()} potential upsell revenue today`,
    `Top corporate account TechCorp at ${Math.round(312 / 500 * 100)}% utilization — opportunity for renewal negotiation`,
    directPct < 35 ? "Launch 'Book Direct & Save' campaign to shift OTA traffic" : "Direct booking rate healthy — maintain momentum",
  ];

  return {
    greeting: `Good morning! Here's your revenue pulse for ${new Date(TODAY).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}`,
    highlights,
    alerts,
    opportunities,
  };
}

// === CHANNEL MIX OPTIMIZATION ===
export interface ChannelSuggestion {
  channel: string;
  action: string;
  reason: string;
  expectedImpact: string;
}

export function generateChannelSuggestions(): ChannelSuggestion[] {
  return [
    {
      channel: "Direct",
      action: "Increase direct booking incentives",
      reason: `Only ${todayKPIs.directBookingPercent}% of bookings are direct — industry benchmark is 35-40%`,
      expectedImpact: "+₹2.4L/month saved in OTA commissions",
    },
    {
      channel: "Booking.com",
      action: "Maintain visibility, reduce dependency",
      reason: "Highest volume but 15% commission — ₹2.52L/month in fees",
      expectedImpact: "Shift 20% volume to direct = ₹50K/month savings",
    },
    {
      channel: "Expedia",
      action: "Reduce allocation by 10 rooms",
      reason: "Highest commission (18%) and cancellation rate (14%)",
      expectedImpact: "Reduce commission outflow by ₹1.28L/month",
    },
    {
      channel: "Corporate",
      action: "Expand corporate program",
      reason: "Zero commission, low cancellation — highest net revenue per booking",
      expectedImpact: "+₹3.5L/month with 2 new accounts",
    },
  ];
}
