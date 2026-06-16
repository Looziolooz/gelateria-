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
  { id: "CRM-2418", customer: "Giulia Rossi", phone: "333 1042288", boutique: "fiori-chiari", boutiqueLabel: "Milano · Fiori Chiari", channel: "Pickup", items: [{ flavor: "Pistacchio di Bronte", qty: 2 }, { flavor: "Cioccolato Chuao", qty: 1 }], total: 14.5, date: "2026-06-16", time: "17:30", status: "In preparazione" },
  { id: "CRM-2417", customer: "Marco Verdi", phone: "347 9981120", boutique: "procida", boutiqueLabel: "Milano · Da Procida", channel: "Pickup", items: [{ flavor: "Nocciola Piemonte IGP", qty: 3 }], total: 12.0, date: "2026-06-16", time: "18:00", status: "Nuovo" },
  { id: "CRM-2416", customer: "Elena Conti", phone: "320 5567710", boutique: "via-giulia", boutiqueLabel: "Roma · Via Giulia", channel: "Pickup", items: [{ flavor: "Fragola e Panna", qty: 2 }, { flavor: "Limone di Sicilia", qty: 2 }], total: 18.0, date: "2026-06-16", time: "16:15", status: "Pronto" },
  { id: "CRM-2415", customer: "Davide Ferri", phone: "339 7741203", boutique: "fiori-chiari", boutiqueLabel: "Milano · Fiori Chiari", channel: "Banco", items: [{ flavor: "Stracciatella", qty: 1 }], total: 4.5, date: "2026-06-16", time: "15:40", status: "Ritirato" },
  { id: "CRM-2414", customer: "Chiara Galli", phone: "348 2290871", boutique: "leone-iv", boutiqueLabel: "Roma · Leone IV", channel: "Pickup", items: [{ flavor: "Caffè", qty: 2 }, { flavor: "Vaniglia Bourbon", qty: 1 }], total: 13.5, date: "2026-06-16", time: "19:00", status: "Nuovo" },
  { id: "CRM-2413", customer: "Luca Moretti", phone: "351 6620934", boutique: "piazza-napoli", boutiqueLabel: "Milano · Piazza Napoli", channel: "Asporto", items: [{ flavor: "Mango", qty: 2 }, { flavor: "Lampone", qty: 2 }], total: 16.0, date: "2026-06-15", time: "20:10", status: "Ritirato" },
  { id: "CRM-2412", customer: "Francesca Neri", phone: "333 8845021", boutique: "procida", boutiqueLabel: "Milano · Da Procida", channel: "Pickup", items: [{ flavor: "Pistacchio di Bronte", qty: 4 }], total: 22.0, date: "2026-06-15", time: "17:45", status: "Ritirato" },
  { id: "CRM-2411", customer: "Andrea Costa", phone: "340 1190576", boutique: "via-giulia", boutiqueLabel: "Roma · Via Giulia", channel: "Pickup", items: [{ flavor: "Cioccolato Chuao", qty: 2 }], total: 11.0, date: "2026-06-15", time: "16:00", status: "Annullato" },
  { id: "CRM-2410", customer: "Martina Russo", phone: "329 4471882", boutique: "fiori-chiari", boutiqueLabel: "Milano · Fiori Chiari", channel: "Pickup", items: [{ flavor: "Nocciola Piemonte IGP", qty: 1 }, { flavor: "Stracciatella", qty: 1 }, { flavor: "Caffè", qty: 1 }], total: 15.5, date: "2026-06-15", time: "18:30", status: "Ritirato" },
  { id: "CRM-2409", customer: "Paolo Greco", phone: "338 7712095", boutique: "leone-iv", boutiqueLabel: "Roma · Leone IV", channel: "Banco", items: [{ flavor: "Limone di Sicilia", qty: 2 }], total: 9.0, date: "2026-06-14", time: "21:00", status: "Ritirato" },
  { id: "CRM-2408", customer: "Sara Lombardi", phone: "347 3320148", boutique: "piazza-napoli", boutiqueLabel: "Milano · Piazza Napoli", channel: "Pickup", items: [{ flavor: "Fragola e Panna", qty: 3 }], total: 13.5, date: "2026-06-14", time: "19:20", status: "Ritirato" },
  { id: "CRM-2407", customer: "Matteo Barbieri", phone: "351 9987340", boutique: "procida", boutiqueLabel: "Milano · Da Procida", channel: "Pickup", items: [{ flavor: "Vaniglia Bourbon", qty: 2 }, { flavor: "Mango", qty: 2 }], total: 18.0, date: "2026-06-14", time: "16:50", status: "Ritirato" },
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
  { boutique: "Fiori Chiari", city: "Milano", revenue: 18420, orders: 612 },
  { boutique: "Da Procida", city: "Milano", revenue: 15180, orders: 528 },
  { boutique: "Piazza Napoli", city: "Milano", revenue: 11260, orders: 401 },
  { boutique: "Via Giulia", city: "Roma", revenue: 9740, orders: 342 },
  { boutique: "Leone IV", city: "Roma", revenue: 7500, orders: 268 },
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
