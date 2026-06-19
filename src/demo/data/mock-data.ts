// Revenue Engine mock data — builds on SynSok Core PMS schema

export type RoomType = "standard" | "deluxe" | "suite" | "premium-suite";
export type ReservationStatus = "confirmed" | "tentative" | "cancelled" | "checked-in" | "checked-out" | "no-show";
export type ChannelSource = "direct" | "booking-com" | "expedia" | "makemytrip" | "goibibo" | "agoda" | "walk-in" | "corporate";
export type MealPlan = "ep" | "cp" | "map" | "ap"; // European, Continental, Modified American, American
export type SeasonType = "peak" | "high" | "shoulder" | "low";

export const TODAY = "2026-03-16";
export const HOTEL_NAME = "The Grand Horizon";
export const TOTAL_ROOMS = 100;

// === ROOM INVENTORY ===
export interface RoomInventory {
  type: RoomType;
  label: string;
  count: number;
  baseRate: number;
  maxOccupancy: number;
}

export const roomInventory: RoomInventory[] = [
  { type: "standard", label: "Standard", count: 40, baseRate: 3500, maxOccupancy: 2 },
  { type: "deluxe", label: "Deluxe", count: 30, baseRate: 5500, maxOccupancy: 3 },
  { type: "suite", label: "Suite", count: 20, baseRate: 9000, maxOccupancy: 4 },
  { type: "premium-suite", label: "Premium Suite", count: 10, baseRate: 15000, maxOccupancy: 4 },
];

// === SEASONAL RATE MODIFIERS ===
export interface SeasonalRate {
  id: string;
  name: string;
  season: SeasonType;
  startDate: string;
  endDate: string;
  modifier: number; // multiplier e.g. 1.2 = +20%
}

export const seasonalRates: SeasonalRate[] = [
  { id: "s1", name: "Winter Peak", season: "peak", startDate: "2025-12-20", endDate: "2026-01-05", modifier: 1.5 },
  { id: "s2", name: "Republic Day", season: "high", startDate: "2026-01-24", endDate: "2026-01-28", modifier: 1.3 },
  { id: "s3", name: "Spring Shoulder", season: "shoulder", startDate: "2026-02-01", endDate: "2026-03-31", modifier: 1.1 },
  { id: "s4", name: "Summer Low", season: "low", startDate: "2026-04-01", endDate: "2026-06-30", modifier: 0.85 },
  { id: "s5", name: "Monsoon Low", season: "low", startDate: "2026-07-01", endDate: "2026-08-31", modifier: 0.75 },
  { id: "s6", name: "Festive Peak", season: "peak", startDate: "2026-10-15", endDate: "2026-11-15", modifier: 1.6 },
];

// === CORPORATE RATE TIERS ===
export interface CorporateRate {
  id: string;
  companyName: string;
  tier: "platinum" | "gold" | "silver";
  discount: number; // percentage off BAR
  roomNights: number; // contracted per year
  usedNights: number;
  validUntil: string;
}

export const corporateRates: CorporateRate[] = [
  { id: "cr1", companyName: "TechCorp India", tier: "platinum", discount: 25, roomNights: 500, usedNights: 312, validUntil: "2026-12-31" },
  { id: "cr2", companyName: "Global Consulting Ltd", tier: "gold", discount: 18, roomNights: 300, usedNights: 178, validUntil: "2026-12-31" },
  { id: "cr3", companyName: "Meridian Pharma", tier: "silver", discount: 12, roomNights: 150, usedNights: 89, validUntil: "2026-12-31" },
  { id: "cr4", companyName: "Skyline Aviation", tier: "gold", discount: 20, roomNights: 200, usedNights: 145, validUntil: "2026-12-31" },
  { id: "cr5", companyName: "Eastern Exports", tier: "silver", discount: 10, roomNights: 100, usedNights: 42, validUntil: "2026-12-31" },
];

// === MEAL PACKAGES ===
export interface MealPackage {
  id: string;
  plan: MealPlan;
  label: string;
  description: string;
  pricePerPerson: number;
  includesBreakfast: boolean;
  includesLunch: boolean;
  includesDinner: boolean;
}

export const mealPackages: MealPackage[] = [
  { id: "mp1", plan: "ep", label: "Room Only (EP)", description: "European Plan — room only, no meals", pricePerPerson: 0, includesBreakfast: false, includesLunch: false, includesDinner: false },
  { id: "mp2", plan: "cp", label: "Bed & Breakfast (CP)", description: "Continental Plan — includes breakfast", pricePerPerson: 600, includesBreakfast: true, includesLunch: false, includesDinner: false },
  { id: "mp3", plan: "map", label: "Half Board (MAP)", description: "Modified American Plan — breakfast + dinner", pricePerPerson: 1400, includesBreakfast: true, includesLunch: false, includesDinner: true },
  { id: "mp4", plan: "ap", label: "Full Board (AP)", description: "American Plan — all meals included", pricePerPerson: 2200, includesBreakfast: true, includesLunch: true, includesDinner: true },
];

// === CHANNEL PERFORMANCE DATA ===
export interface ChannelPerformance {
  channel: ChannelSource;
  label: string;
  bookings: number;
  revenue: number;
  commission: number; // percentage
  avgRate: number;
  cancelRate: number; // percentage
  color: string;
}

export const channelPerformance: ChannelPerformance[] = [
  { channel: "direct", label: "Direct / Website", bookings: 145, revenue: 1240000, commission: 0, avgRate: 8552, cancelRate: 5, color: "hsl(var(--chart-1))" },
  { channel: "booking-com", label: "Booking.com", bookings: 210, revenue: 1680000, commission: 15, avgRate: 8000, cancelRate: 12, color: "hsl(var(--chart-2))" },
  { channel: "expedia", label: "Expedia", bookings: 95, revenue: 712500, commission: 18, avgRate: 7500, cancelRate: 14, color: "hsl(var(--chart-3))" },
  { channel: "makemytrip", label: "MakeMyTrip", bookings: 130, revenue: 910000, commission: 12, avgRate: 7000, cancelRate: 10, color: "hsl(var(--chart-4))" },
  { channel: "goibibo", label: "Goibibo", bookings: 65, revenue: 422500, commission: 14, avgRate: 6500, cancelRate: 11, color: "hsl(var(--chart-5))" },
  { channel: "agoda", label: "Agoda", bookings: 45, revenue: 337500, commission: 17, avgRate: 7500, cancelRate: 15, color: "hsl(174 62% 45%)" },
  { channel: "walk-in", label: "Walk-in", bookings: 80, revenue: 480000, commission: 0, avgRate: 6000, cancelRate: 2, color: "hsl(38 92% 65%)" },
  { channel: "corporate", label: "Corporate", bookings: 180, revenue: 1260000, commission: 0, avgRate: 7000, cancelRate: 3, color: "hsl(200 50% 40%)" },
];

// === DAILY REVENUE HISTORY (last 30 days) ===
export interface DailyRevenue {
  date: string;
  roomRevenue: number;
  fnbRevenue: number;
  otherRevenue: number;
  occupancyPercent: number;
  adr: number; // avg daily rate
  revpar: number;
}

function generateDailyRevenue(): DailyRevenue[] {
  const data: DailyRevenue[] = [];
  const base = new Date("2026-02-14");
  for (let i = 0; i < 30; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 5 || dow === 6;
    const occ = isWeekend ? 75 + Math.floor(Math.random() * 15) : 55 + Math.floor(Math.random() * 20);
    const occupiedRooms = Math.round(TOTAL_ROOMS * occ / 100);
    const adr = isWeekend ? 7200 + Math.floor(Math.random() * 1500) : 5800 + Math.floor(Math.random() * 1200);
    const roomRev = occupiedRooms * adr;
    const fnbRev = occupiedRooms * (800 + Math.floor(Math.random() * 600));
    const otherRev = occupiedRooms * (200 + Math.floor(Math.random() * 300));
    data.push({
      date: d.toISOString().split("T")[0],
      roomRevenue: roomRev,
      fnbRevenue: fnbRev,
      otherRevenue: otherRev,
      occupancyPercent: occ,
      adr,
      revpar: Math.round(roomRev / TOTAL_ROOMS),
    });
  }
  return data;
}

export const dailyRevenue: DailyRevenue[] = generateDailyRevenue();

// === COMP SET DATA ===
export interface CompSetHotel {
  id: string;
  name: string;
  stars: number;
  standardRate: number;
  deluxeRate: number;
  suiteRate: number;
  occupancy: number;
  revpar: number;
  rating: number;
}

export const compSetHotels: CompSetHotel[] = [
  { id: "cs1", name: "The Grand Horizon (You)", stars: 5, standardRate: 3850, deluxeRate: 6050, suiteRate: 9900, occupancy: 72, revpar: 5200, rating: 4.5 },
  { id: "cs2", name: "Royal Palace Hotel", stars: 5, standardRate: 4200, deluxeRate: 6800, suiteRate: 11000, occupancy: 68, revpar: 5100, rating: 4.3 },
  { id: "cs3", name: "Marriott City Centre", stars: 5, standardRate: 5500, deluxeRate: 7500, suiteRate: 12000, occupancy: 75, revpar: 6200, rating: 4.6 },
  { id: "cs4", name: "Taj Lakefront", stars: 5, standardRate: 6000, deluxeRate: 8500, suiteRate: 14000, occupancy: 80, revpar: 7500, rating: 4.7 },
  { id: "cs5", name: "ITC Gardenia", stars: 5, standardRate: 4800, deluxeRate: 7200, suiteRate: 11500, occupancy: 70, revpar: 5400, rating: 4.4 },
];

// === REVENUE BY SEGMENT ===
export interface RevenueSegment {
  segment: string;
  revenue: number;
  percentage: number;
  color: string;
}

export const revenueBySegment: RevenueSegment[] = [
  { segment: "Rooms", revenue: 5240000, percentage: 62, color: "hsl(var(--chart-1))" },
  { segment: "F&B", revenue: 1680000, percentage: 20, color: "hsl(var(--chart-2))" },
  { segment: "Spa & Wellness", revenue: 504000, percentage: 6, color: "hsl(var(--chart-3))" },
  { segment: "Events & Banquets", revenue: 672000, percentage: 8, color: "hsl(var(--chart-4))" },
  { segment: "Other", revenue: 336000, percentage: 4, color: "hsl(var(--chart-5))" },
];

// === LOCAL EVENTS ===
export interface LocalEvent {
  id: string;
  name: string;
  date: string;
  demandImpact: "low" | "medium" | "high";
}

export const localEvents: LocalEvent[] = [
  { id: "evt1", name: "International Tech Conference", date: "2026-03-20", demandImpact: "high" },
  { id: "evt2", name: "City Marathon", date: "2026-03-18", demandImpact: "medium" },
  { id: "evt3", name: "Holi Festival", date: "2026-03-17", demandImpact: "high" },
  { id: "evt4", name: "Business Expo", date: "2026-03-25", demandImpact: "medium" },
  { id: "evt5", name: "Music Festival", date: "2026-04-02", demandImpact: "low" },
];

// === GUEST REVENUE INSIGHTS ===
export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  totalSpend: number;
  totalStays: number;
  avgNightlySpend: number;
  lastStay: string;
  segment: "platinum" | "gold" | "silver" | "bronze";
  source: ChannelSource;
}

export const topGuests: GuestProfile[] = [
  { id: "g1", name: "Rajesh Sharma", email: "rajesh@gmail.com", totalSpend: 485000, totalStays: 12, avgNightlySpend: 12500, lastStay: "2026-03-05", segment: "platinum", source: "direct" },
  { id: "g8", name: "Sunita Verma", email: "sunita.v@yahoo.com", totalSpend: 420000, totalStays: 15, avgNightlySpend: 11000, lastStay: "2026-03-05", segment: "platinum", source: "direct" },
  { id: "g4", name: "Aisha Khan", email: "aisha.k@mail.com", totalSpend: 310000, totalStays: 8, avgNightlySpend: 9800, lastStay: "2026-03-05", segment: "gold", source: "corporate" },
  { id: "g5", name: "David Chen", email: "dchen@company.com", totalSpend: 185000, totalStays: 2, avgNightlySpend: 15000, lastStay: "2026-03-05", segment: "gold", source: "booking-com" },
  { id: "g2", name: "Priya Patel", email: "priya.p@outlook.com", totalSpend: 142000, totalStays: 5, avgNightlySpend: 7200, lastStay: "2026-03-05", segment: "silver", source: "makemytrip" },
  { id: "g6", name: "Meera Reddy", email: "meera.r@gmail.com", totalSpend: 98000, totalStays: 3, avgNightlySpend: 6500, lastStay: "2026-03-05", segment: "silver", source: "direct" },
  { id: "g3", name: "James Wilson", email: "jwilson@email.com", totalSpend: 55000, totalStays: 1, avgNightlySpend: 5500, lastStay: "2026-03-05", segment: "bronze", source: "expedia" },
  { id: "g7", name: "Thomas Mueller", email: "tmueller@web.de", totalSpend: 35000, totalStays: 1, avgNightlySpend: 3500, lastStay: "2026-03-05", segment: "bronze", source: "booking-com" },
];

// === PROMOTIONAL CAMPAIGNS ===
export interface Campaign {
  id: string;
  name: string;
  type: "flash-sale" | "early-bird" | "last-minute" | "loyalty" | "weekend";
  status: "active" | "scheduled" | "ended" | "draft";
  startDate: string;
  endDate: string;
  discount: number;
  targetSegment: string;
  bookingsGenerated: number;
  revenueGenerated: number;
}

export const campaigns: Campaign[] = [
  { id: "c1", name: "Spring Flash Sale", type: "flash-sale", status: "active", startDate: "2026-03-10", endDate: "2026-03-20", discount: 20, targetSegment: "All guests", bookingsGenerated: 28, revenueGenerated: 392000 },
  { id: "c2", name: "Early Bird Summer", type: "early-bird", status: "scheduled", startDate: "2026-04-01", endDate: "2026-04-30", discount: 15, targetSegment: "Direct bookers", bookingsGenerated: 0, revenueGenerated: 0 },
  { id: "c3", name: "Loyalty Exclusive Weekend", type: "loyalty", status: "active", startDate: "2026-03-14", endDate: "2026-03-16", discount: 25, targetSegment: "Gold & Platinum members", bookingsGenerated: 12, revenueGenerated: 216000 },
  { id: "c4", name: "Last Minute Tonight", type: "last-minute", status: "active", startDate: "2026-03-01", endDate: "2026-03-31", discount: 30, targetSegment: "Walk-in / same day", bookingsGenerated: 45, revenueGenerated: 315000 },
  { id: "c5", name: "Weekend Getaway Package", type: "weekend", status: "ended", startDate: "2026-02-01", endDate: "2026-02-28", discount: 10, targetSegment: "Families", bookingsGenerated: 65, revenueGenerated: 585000 },
];

// === TODAY'S SNAPSHOT KPIs ===
export const todayKPIs = {
  occupancy: 72,
  occupiedRooms: 72,
  availableRooms: 24,
  outOfOrder: 4,
  adr: 7250,
  revpar: 5220,
  trevpar: 6800,
  goppar: 4100,
  roomRevenue: 522000,
  totalRevenue: 680000,
  arrivalsToday: 8,
  departuresToday: 5,
  inHouse: 72,
  directBookingPercent: 32,
};

// === HELPERS ===
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function getRoomTypeLabel(type: RoomType): string {
  const labels: Record<RoomType, string> = {
    standard: "Standard",
    deluxe: "Deluxe",
    suite: "Suite",
    "premium-suite": "Premium Suite",
  };
  return labels[type];
}
