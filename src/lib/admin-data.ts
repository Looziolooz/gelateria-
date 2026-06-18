// ============================================================
// Admin / CRM — fully hardcoded demo data (no backend)
// Reference "today" for the demo: 2026-06-16
// ============================================================

export const DEMO_CREDENTIALS = {
  email: "demo@artigiano.it",
  password: "artigiano2026",
  name: "Sofia Bianchi",
  role: "Store Manager",
};

// ============================================================
// Per-gelateria scope — every CRM view filters to one boutique or aggregates
// across all three ("Tutte"). Keeping "all" === the sum/union of the three
// avoids cross-shop mix-ups in orders / bookings / stock / revenue.
// ============================================================
export type BoutiqueId = "cosenza" | "catanzaro" | "lamezia";
export type BoutiqueScope = "all" | BoutiqueId;

export const BOUTIQUE_IDS: BoutiqueId[] = ["cosenza", "catanzaro", "lamezia"];

export const BOUTIQUE_META: Record<BoutiqueId, { id: BoutiqueId; city: string; name: string; label: string }> = {
  cosenza: { id: "cosenza", city: "Cosenza", name: "Corso Mazzini 120", label: "Cosenza · Corso Mazzini 120" },
  catanzaro: { id: "catanzaro", city: "Catanzaro", name: "Via Milano 45", label: "Catanzaro · Via Milano 45" },
  lamezia: { id: "lamezia", city: "Lamezia Terme", name: "Via Marconi 28", label: "Lamezia Terme · Via Marconi 28" },
};

/** Short label for the current scope (header, KPI subtitles). */
export function scopeLabel(scope: BoutiqueScope): string {
  return scope === "all" ? "Tutte le botteghe" : BOUTIQUE_META[scope].city;
}

/** Resolve a boutique id from a stored label like "Cosenza · Corso Mazzini 120". */
export function boutiqueIdFromLabel(label: string | undefined): BoutiqueId | undefined {
  if (!label) return undefined;
  const lower = label.toLowerCase();
  return BOUTIQUE_IDS.find((id) => lower.includes(BOUTIQUE_META[id].city.toLowerCase()));
}

export type OrderStatus =
  | "Nuovo"
  | "In preparazione"
  | "Pronto"
  | "Ritirato"
  | "Annullato";

export type OrderChannel = "Pickup" | "Banco" | "Asporto";

export interface OrderItem {
  flavor: string;
  qty: number;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  boutique: string; // boutique id
  boutiqueLabel: string;
  channel: OrderChannel;
  items: OrderItem[];
  total: number; // EUR
  date: string; // YYYY-MM-DD
  time: string; // HH:mm pickup/checkout time
  status: OrderStatus;
}

export const ORDERS: Order[] = [
  { id: "CRM-2418", customer: "Giulia Rossi", phone: "333 1042288", boutique: "cosenza", boutiqueLabel: "Cosenza · Corso Mazzini 120", channel: "Pickup", items: [{ flavor: "Pistacchio di Bronte", qty: 2 }, { flavor: "Cioccolato Chuao", qty: 1 }], total: 14.5, date: "2026-06-16", time: "17:30", status: "In preparazione" },
  { id: "CRM-2417", customer: "Marco Verdi", phone: "347 9981120", boutique: "catanzaro", boutiqueLabel: "Catanzaro · Via Milano 45", channel: "Pickup", items: [{ flavor: "Nocciola Piemonte IGP", qty: 3 }], total: 12.0, date: "2026-06-16", time: "18:00", status: "Nuovo" },
  { id: "CRM-2416", customer: "Elena Conti", phone: "320 5567710", boutique: "cosenza", boutiqueLabel: "Cosenza · Corso Mazzini 120", channel: "Pickup", items: [{ flavor: "Fragola e Panna", qty: 2 }, { flavor: "Limone di Sicilia", qty: 2 }], total: 18.0, date: "2026-06-16", time: "16:15", status: "Pronto" },
  { id: "CRM-2415", customer: "Davide Ferri", phone: "339 7741203", boutique: "cosenza", boutiqueLabel: "Cosenza · Corso Mazzini 120", channel: "Banco", items: [{ flavor: "Stracciatella", qty: 1 }], total: 4.5, date: "2026-06-16", time: "15:40", status: "Ritirato" },
  { id: "CRM-2414", customer: "Chiara Galli", phone: "348 2290871", boutique: "catanzaro", boutiqueLabel: "Catanzaro · Via Milano 45", channel: "Pickup", items: [{ flavor: "Caffè", qty: 2 }, { flavor: "Vaniglia Bourbon", qty: 1 }], total: 13.5, date: "2026-06-16", time: "19:00", status: "Nuovo" },
  { id: "CRM-2413", customer: "Luca Moretti", phone: "351 6620934", boutique: "lamezia", boutiqueLabel: "Lamezia Terme · Via Marconi 28", channel: "Asporto", items: [{ flavor: "Mango", qty: 2 }, { flavor: "Lampone", qty: 2 }], total: 16.0, date: "2026-06-15", time: "20:10", status: "Ritirato" },
  { id: "CRM-2412", customer: "Francesca Neri", phone: "333 8845021", boutique: "catanzaro", boutiqueLabel: "Catanzaro · Via Milano 45", channel: "Pickup", items: [{ flavor: "Pistacchio di Bronte", qty: 4 }], total: 22.0, date: "2026-06-15", time: "17:45", status: "Ritirato" },
  { id: "CRM-2411", customer: "Andrea Costa", phone: "340 1190576", boutique: "cosenza", boutiqueLabel: "Cosenza · Corso Mazzini 120", channel: "Pickup", items: [{ flavor: "Cioccolato Chuao", qty: 2 }], total: 11.0, date: "2026-06-15", time: "16:00", status: "Annullato" },
  { id: "CRM-2410", customer: "Martina Russo", phone: "329 4471882", boutique: "cosenza", boutiqueLabel: "Cosenza · Corso Mazzini 120", channel: "Pickup", items: [{ flavor: "Nocciola Piemonte IGP", qty: 1 }, { flavor: "Stracciatella", qty: 1 }, { flavor: "Caffè", qty: 1 }], total: 15.5, date: "2026-06-15", time: "18:30", status: "Ritirato" },
  { id: "CRM-2409", customer: "Paolo Greco", phone: "338 7712095", boutique: "catanzaro", boutiqueLabel: "Catanzaro · Via Milano 45", channel: "Banco", items: [{ flavor: "Limone di Sicilia", qty: 2 }], total: 9.0, date: "2026-06-14", time: "21:00", status: "Ritirato" },
  { id: "CRM-2408", customer: "Sara Lombardi", phone: "347 3320148", boutique: "lamezia", boutiqueLabel: "Lamezia Terme · Via Marconi 28", channel: "Pickup", items: [{ flavor: "Fragola e Panna", qty: 3 }], total: 13.5, date: "2026-06-14", time: "19:20", status: "Ritirato" },
  { id: "CRM-2407", customer: "Matteo Barbieri", phone: "351 9987340", boutique: "catanzaro", boutiqueLabel: "Catanzaro · Via Milano 45", channel: "Pickup", items: [{ flavor: "Vaniglia Bourbon", qty: 2 }, { flavor: "Mango", qty: 2 }], total: 18.0, date: "2026-06-14", time: "16:50", status: "Ritirato" },
];

export type StockStatus = "Disponibile" | "In esaurimento" | "Esaurito";

export interface InventoryItem {
  id: string;
  name: string;
  category: "Creme" | "Frutta" | "Cioccolato" | "Specialità" | "Ingrediente";
  vegan: boolean;
  glutenFree: boolean;
  stockKg: number;
  parKg: number; // par / reorder level
  pricePerScoop: number;
}

function stockStatus(item: InventoryItem): StockStatus {
  if (item.stockKg <= 0) return "Esaurito";
  if (item.stockKg < item.parKg) return "In esaurimento";
  return "Disponibile";
}

export const INVENTORY: InventoryItem[] = [
  { id: "g01", name: "Pistacchio di Bronte", category: "Specialità", vegan: false, glutenFree: true, stockKg: 8.4, parKg: 6, pricePerScoop: 5.0 },
  { id: "g02", name: "Nocciola Piemonte IGP", category: "Specialità", vegan: false, glutenFree: true, stockKg: 5.1, parKg: 6, pricePerScoop: 5.0 },
  { id: "g03", name: "Cioccolato Chuao", category: "Cioccolato", vegan: true, glutenFree: true, stockKg: 9.2, parKg: 5, pricePerScoop: 5.5 },
  { id: "g04", name: "Stracciatella", category: "Creme", vegan: false, glutenFree: true, stockKg: 11.0, parKg: 5, pricePerScoop: 4.5 },
  { id: "g05", name: "Vaniglia Bourbon", category: "Creme", vegan: false, glutenFree: true, stockKg: 7.8, parKg: 5, pricePerScoop: 4.5 },
  { id: "g06", name: "Caffè", category: "Creme", vegan: true, glutenFree: true, stockKg: 4.2, parKg: 5, pricePerScoop: 4.5 },
  { id: "g07", name: "Fragola e Panna", category: "Frutta", vegan: false, glutenFree: true, stockKg: 6.6, parKg: 5, pricePerScoop: 4.5 },
  { id: "g08", name: "Limone di Sicilia", category: "Frutta", vegan: true, glutenFree: true, stockKg: 3.1, parKg: 5, pricePerScoop: 4.5 },
  { id: "g09", name: "Mango", category: "Frutta", vegan: true, glutenFree: true, stockKg: 5.9, parKg: 4, pricePerScoop: 4.5 },
  { id: "g10", name: "Lampone", category: "Frutta", vegan: true, glutenFree: true, stockKg: 2.4, parKg: 4, pricePerScoop: 4.5 },
  { id: "g11", name: "Crema all'uovo", category: "Creme", vegan: false, glutenFree: true, stockKg: 6.0, parKg: 5, pricePerScoop: 4.5 },
  { id: "g12", name: "Zuppa Inglese", category: "Specialità", vegan: false, glutenFree: false, stockKg: 0, parKg: 4, pricePerScoop: 5.0 },
  { id: "i01", name: "Coni cialda artigianale", category: "Ingrediente", vegan: false, glutenFree: false, stockKg: 12.0, parKg: 8, pricePerScoop: 0 },
  { id: "i02", name: "Panna fresca", category: "Ingrediente", vegan: false, glutenFree: true, stockKg: 18.0, parKg: 10, pricePerScoop: 0 },
  { id: "i03", name: "Latte alta qualità", category: "Ingrediente", vegan: false, glutenFree: true, stockKg: 3.5, parKg: 12, pricePerScoop: 0 },
];

export const INVENTORY_WITH_STATUS = INVENTORY.map((i) => ({
  ...i,
  status: stockStatus(i),
}));

// Monthly revenue (last 10 months up to June 2026), EUR
export interface MonthRevenue {
  month: string;
  revenue: number;
}
export const REVENUE_MONTHLY: MonthRevenue[] = [
  { month: "Set", revenue: 41200 },
  { month: "Ott", revenue: 38600 },
  { month: "Nov", revenue: 30100 },
  { month: "Dic", revenue: 34800 },
  { month: "Gen", revenue: 27500 },
  { month: "Feb", revenue: 29900 },
  { month: "Mar", revenue: 36400 },
  { month: "Apr", revenue: 44700 },
  { month: "Mag", revenue: 58300 },
  { month: "Giu", revenue: 62100 },
];

export interface BoutiqueRevenue {
  boutique: string;
  city: string;
  revenue: number;
  orders: number;
}
export const REVENUE_BY_BOUTIQUE: BoutiqueRevenue[] = [
  { boutique: "Corso Mazzini 120", city: "Cosenza", revenue: 22100, orders: 754 },
  { boutique: "Via Milano 45", city: "Catanzaro", revenue: 19800, orders: 683 },
  { boutique: "Via Marconi 28", city: "Lamezia Terme", revenue: 14200, orders: 498 },
];

// Channel split (this month)
export const CHANNEL_SPLIT = [
  { channel: "Banco", value: 54 },
  { channel: "Pickup", value: 31 },
  { channel: "Asporto", value: 15 },
];

// Calendar — pickups scheduled per day (June 2026)
export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  pickups: number;
  revenue: number;
  note?: string;
}
export const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: "2026-06-12", pickups: 14, revenue: 720 },
  { date: "2026-06-13", pickups: 22, revenue: 1180, note: "Sabato — affluenza alta" },
  { date: "2026-06-14", pickups: 19, revenue: 940 },
  { date: "2026-06-15", pickups: 17, revenue: 880 },
  { date: "2026-06-16", pickups: 12, revenue: 610, note: "Oggi" },
  { date: "2026-06-17", pickups: 9, revenue: 430 },
  { date: "2026-06-18", pickups: 11, revenue: 540 },
  { date: "2026-06-20", pickups: 25, revenue: 1320, note: "Evento: Gelato Festival" },
  { date: "2026-06-21", pickups: 21, revenue: 1090 },
];

// Top flavors this month (for dashboard)
export const TOP_FLAVORS = [
  { name: "Pistacchio di Bronte", scoops: 1840 },
  { name: "Cioccolato Chuao", scoops: 1520 },
  { name: "Nocciola Piemonte IGP", scoops: 1310 },
  { name: "Stracciatella", scoops: 1190 },
  { name: "Fragola e Panna", scoops: 980 },
];

// ---------- Derived KPIs ----------
export const KPIS = (() => {
  const today = "2026-06-16";
  const todayOrders = ORDERS.filter((o) => o.date === today && o.status !== "Annullato");
  const fatturatoOggi = todayOrders.reduce((s, o) => s + o.total, 0);
  const ordiniOggi = todayOrders.length;
  const scontrinoMedio = ordiniOggi ? fatturatoOggi / ordiniOggi : 0;
  const fatturatoMese = REVENUE_MONTHLY[REVENUE_MONTHLY.length - 1].revenue;
  const lowStock = INVENTORY_WITH_STATUS.filter((i) => i.status !== "Disponibile").length;
  const gustiAttivi = INVENTORY.filter((i) => i.category !== "Ingrediente" && i.stockKg > 0).length;
  const pickupOggi = todayOrders.filter((o) => o.channel === "Pickup").length;
  return {
    fatturatoOggi,
    ordiniOggi,
    scontrinoMedio,
    fatturatoMese,
    lowStock,
    gustiAttivi,
    pickupOggi,
  };
})();

export function euro(n: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

// ============================================================
// Pickup bookings (prenotazioni) — hardcoded, mirror the /pickup flow
// ============================================================
export type BookingStatus = "Confermata" | "In preparazione" | "Pronta" | "Ritirata" | "Annullata";

export interface Booking {
  id: string;
  customer: string;
  phone: string;
  /** boutique id — optional on legacy/live rows; derived from the label when absent */
  boutique?: BoutiqueId;
  boutiqueLabel: string;
  format: string;
  flavors: string[];
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  total: number;
  status: BookingStatus;
}

export const BOOKINGS: Booking[] = [
  { id: "PRE-0142", customer: "Giulia Rossi", phone: "333 1042288", boutiqueLabel: "Cosenza · Corso Mazzini 120", format: "Coppetta", flavors: ["Pistacchio di Bronte", "Stracciatella", "Cioccolato Fondente"], date: "2026-06-16", time: "17:30", total: 6.5, status: "In preparazione" },
  { id: "PRE-0141", customer: "Marco Verdi", phone: "347 9981120", boutiqueLabel: "Catanzaro · Via Milano 45", format: "Cono", flavors: ["Nocciola Piemonte", "Caffè"], date: "2026-06-16", time: "18:00", total: 4.5, status: "Confermata" },
  { id: "PRE-0140", customer: "Elena Conti", phone: "320 5567710", boutiqueLabel: "Cosenza · Corso Mazzini 120", format: "Vaschetta 2 kg", flavors: ["Zabaione", "Fragola", "Fiordilatte", "Nocciola Piemonte"], date: "2026-06-16", time: "16:15", total: 24.0, status: "Pronta" },
  { id: "PRE-0139", customer: "Chiara Galli", phone: "348 2290871", boutiqueLabel: "Catanzaro · Via Milano 45", format: "Coppetta", flavors: ["Cioccolato Fondente", "Stracciatella"], date: "2026-06-16", time: "19:00", total: 5.0, status: "Confermata" },
  { id: "PRE-0138", customer: "Davide Ferri", phone: "339 7741203", boutiqueLabel: "Cosenza · Corso Mazzini 120", format: "Cono", flavors: ["Fragola", "Fiordilatte", "Pistacchio di Bronte"], date: "2026-06-16", time: "20:30", total: 5.0, status: "Confermata" },
  { id: "PRE-0137", customer: "Sara Lombardi", phone: "347 3320148", boutiqueLabel: "Lamezia Terme · Via Marconi 28", format: "Vaschetta 3 kg", flavors: ["Pistacchio di Bronte", "Cioccolato Fondente", "Stracciatella", "Limone di Sicilia", "Fragola"], date: "2026-06-15", time: "19:20", total: 33.0, status: "Ritirata" },
  { id: "PRE-0136", customer: "Andrea Costa", phone: "340 1190576", boutiqueLabel: "Cosenza · Corso Mazzini 120", format: "Coppetta", flavors: ["Zabaione", "Caffè", "Nocciola Piemonte"], date: "2026-06-15", time: "16:00", total: 6.0, status: "Annullata" },
  { id: "PRE-0135", customer: "Martina Russo", phone: "329 4471882", boutiqueLabel: "Catanzaro · Via Milano 45", format: "Vaschetta 5 kg", flavors: ["Nocciola Piemonte", "Zabaione", "Stracciatella", "Cioccolato Fondente", "Mango", "Pistacchio di Bronte"], date: "2026-06-17", time: "11:30", total: 55.0, status: "Confermata" },
  { id: "PRE-0134", customer: "Paolo Greco", phone: "338 7712095", boutiqueLabel: "Lamezia Terme · Via Marconi 28", format: "Cono", flavors: ["Limone di Sicilia", "Fragola"], date: "2026-06-17", time: "18:45", total: 4.0, status: "Confermata" },
];

export const BOOKING_KPIS = (() => {
  const today = "2026-06-16";
  const todayB = BOOKINGS.filter((b) => b.date === today && b.status !== "Annullata");
  return {
    oggi: todayB.length,
    inAttesa: BOOKINGS.filter((b) => b.status === "Confermata" || b.status === "In preparazione").length,
    pronte: BOOKINGS.filter((b) => b.status === "Pronta").length,
    valoreOggi: todayB.reduce((s, b) => s + b.total, 0),
  };
})();

// ============================================================
// Per-boutique scope selectors — pages call these instead of importing the raw
// arrays, so each gelateria sees only its own data and "all" aggregates cleanly.
// ============================================================
const TODAY = "2026-06-16";

/** Each shop's share of total revenue (drives derived monthly / calendar splits). */
const BOUTIQUE_SHARE: Record<BoutiqueId, number> = (() => {
  const total = REVENUE_BY_BOUTIQUE.reduce((s, b) => s + b.revenue, 0) || 1;
  const byCity = Object.fromEntries(REVENUE_BY_BOUTIQUE.map((b) => [b.city, b.revenue]));
  return {
    cosenza: (byCity["Cosenza"] ?? 0) / total,
    catanzaro: (byCity["Catanzaro"] ?? 0) / total,
    lamezia: (byCity["Lamezia Terme"] ?? 0) / total,
  };
})();

/** Per-shop stock multiplier (Cosenza = flagship baseline). */
const STOCK_FACTOR: Record<BoutiqueId, number> = { cosenza: 1, catanzaro: 0.82, lamezia: 0.6 };

// ---------- Orders ----------
export function getOrders(scope: BoutiqueScope): Order[] {
  return scope === "all" ? ORDERS : ORDERS.filter((o) => o.boutique === scope);
}

// ---------- Bookings ----------
export function bookingBoutique(b: Booking): BoutiqueId | undefined {
  return b.boutique ?? boutiqueIdFromLabel(b.boutiqueLabel);
}
export function getBookings(scope: BoutiqueScope, live: Booking[] = []): Booking[] {
  const all = [...live, ...BOOKINGS];
  return scope === "all" ? all : all.filter((b) => bookingBoutique(b) === scope);
}
export function computeBookingKpis(scope: BoutiqueScope, live: Booking[] = []) {
  const list = getBookings(scope, live);
  const todayB = list.filter((b) => b.date === TODAY && b.status !== "Annullata");
  return {
    oggi: todayB.length,
    inAttesa: list.filter((b) => b.status === "Confermata" || b.status === "In preparazione").length,
    pronte: list.filter((b) => b.status === "Pronta").length,
    valoreOggi: todayB.reduce((s, b) => s + b.total, 0),
  };
}

// ---------- Inventory (per-shop stock) ----------
export type InventoryWithStatus = InventoryItem & { status: StockStatus };
export function getInventory(scope: BoutiqueScope): InventoryWithStatus[] {
  if (scope === "all") {
    const f = STOCK_FACTOR.cosenza + STOCK_FACTOR.catanzaro + STOCK_FACTOR.lamezia;
    return INVENTORY.map((i) => {
      const item = { ...i, stockKg: Math.round(i.stockKg * f * 10) / 10, parKg: i.parKg * 3 };
      return { ...item, status: stockStatus(item) };
    });
  }
  const factor = STOCK_FACTOR[scope];
  return INVENTORY.map((i) => {
    const item = { ...i, stockKg: Math.round(i.stockKg * factor * 10) / 10 };
    return { ...item, status: stockStatus(item) };
  });
}

// ---------- Revenue ----------
export function getRevenueMonthly(scope: BoutiqueScope): MonthRevenue[] {
  if (scope === "all") return REVENUE_MONTHLY;
  const share = BOUTIQUE_SHARE[scope];
  return REVENUE_MONTHLY.map((m) => ({ month: m.month, revenue: Math.round(m.revenue * share) }));
}
export function getRevenueByBoutique(scope: BoutiqueScope): BoutiqueRevenue[] {
  if (scope === "all") return REVENUE_BY_BOUTIQUE;
  const city = BOUTIQUE_META[scope].city;
  return REVENUE_BY_BOUTIQUE.filter((b) => b.city === city);
}

// ---------- Calendar (per-shop counts scaled by share) ----------
export function getCalendar(scope: BoutiqueScope): CalendarEvent[] {
  if (scope === "all") return CALENDAR_EVENTS;
  const share = BOUTIQUE_SHARE[scope];
  return CALENDAR_EVENTS.map((e) => ({
    ...e,
    pickups: Math.max(1, Math.round(e.pickups * share)),
    revenue: Math.round(e.revenue * share),
  }));
}

// ---------- Top flavors & channel split (distinct per shop) ----------
const TOP_FLAVORS_BY_BOUTIQUE: Record<BoutiqueId, typeof TOP_FLAVORS> = {
  cosenza: [
    { name: "Pistacchio di Bronte", scoops: 742 },
    { name: "Stracciatella", scoops: 561 },
    { name: "Cioccolato Chuao", scoops: 503 },
    { name: "Nocciola Piemonte IGP", scoops: 448 },
    { name: "Fragola e Panna", scoops: 351 },
  ],
  catanzaro: [
    { name: "Cioccolato Chuao", scoops: 612 },
    { name: "Pistacchio di Bronte", scoops: 534 },
    { name: "Caffè", scoops: 421 },
    { name: "Nocciola Piemonte IGP", scoops: 388 },
    { name: "Vaniglia Bourbon", scoops: 296 },
  ],
  lamezia: [
    { name: "Nocciola Piemonte IGP", scoops: 402 },
    { name: "Limone di Sicilia", scoops: 351 },
    { name: "Mango", scoops: 318 },
    { name: "Fragola e Panna", scoops: 274 },
    { name: "Stracciatella", scoops: 233 },
  ],
};
export function getTopFlavors(scope: BoutiqueScope) {
  return scope === "all" ? TOP_FLAVORS : TOP_FLAVORS_BY_BOUTIQUE[scope];
}

const CHANNEL_SPLIT_BY_BOUTIQUE: Record<BoutiqueId, typeof CHANNEL_SPLIT> = {
  cosenza: [
    { channel: "Banco", value: 58 },
    { channel: "Pickup", value: 30 },
    { channel: "Asporto", value: 12 },
  ],
  catanzaro: [
    { channel: "Banco", value: 49 },
    { channel: "Pickup", value: 36 },
    { channel: "Asporto", value: 15 },
  ],
  lamezia: [
    { channel: "Banco", value: 45 },
    { channel: "Pickup", value: 28 },
    { channel: "Asporto", value: 27 },
  ],
};
export function getChannelSplit(scope: BoutiqueScope) {
  return scope === "all" ? CHANNEL_SPLIT : CHANNEL_SPLIT_BY_BOUTIQUE[scope];
}

// ---------- Dashboard KPIs (scoped) ----------
export function computeKpis(scope: BoutiqueScope) {
  const orders = getOrders(scope);
  const todayOrders = orders.filter((o) => o.date === TODAY && o.status !== "Annullato");
  const fatturatoOggi = todayOrders.reduce((s, o) => s + o.total, 0);
  const ordiniOggi = todayOrders.length;
  const inv = getInventory(scope);
  const revMonthly = getRevenueMonthly(scope);
  return {
    fatturatoOggi,
    ordiniOggi,
    scontrinoMedio: ordiniOggi ? fatturatoOggi / ordiniOggi : 0,
    fatturatoMese: revMonthly[revMonthly.length - 1].revenue,
    lowStock: inv.filter((i) => i.status !== "Disponibile").length,
    gustiAttivi: inv.filter((i) => i.category !== "Ingrediente" && i.stockKg > 0).length,
    pickupOggi: todayOrders.filter((o) => o.channel === "Pickup").length,
  };
}
