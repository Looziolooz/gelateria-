// ============================================================
// Shared site data — Artigiano Gelateria
// ============================================================

export type City = "Cosenza" | "Catanzaro" | "Lamezia Terme";

export interface Boutique {
  id: string;
  name: string;        // street name (display)
  city: City;
  address: string;     // full address line
  phone: string;
  phoneHref: string;
  /** human-readable opening hours line */
  hoursLabel: string;
  /** opening time HH:mm */
  open: string;
  /** closing time HH:mm */
  close: string;
  /** JS getDay() values on which the boutique is CLOSED (0=Sun … 6=Sat) */
  closedWeekdays: number[];
  image: string;
  mapUrl: string;
}

export const BOUTIQUES: Boutique[] = [
  {
    id: "cosenza",
    name: "Corso Mazzini 120",
    city: "Cosenza",
    address: "Corso Mazzini 120, 87100 Cosenza",
    phone: "(+39) 0984 123 456",
    phoneHref: "+390984123456",
    hoursLabel: "Lunedì – Domenica · 12:00 – 23:30",
    open: "12:00",
    close: "23:30",
    closedWeekdays: [],
    image: "/images/shop/shop1.webp",
    mapUrl: "https://goo.gl/maps/sxsW2Am6EAdm5qRg6",
  },
  {
    id: "catanzaro",
    name: "Via Milano 45",
    city: "Catanzaro",
    address: "Via Milano 45, 88100 Catanzaro",
    phone: "(+39) 0961 789 012",
    phoneHref: "+390961789012",
    hoursLabel: "Martedì – Domenica · 12:00 – 23:30 · Chiuso il Lunedì",
    open: "12:00",
    close: "23:30",
    closedWeekdays: [1],
    image: "/images/shop/shop2.webp",
    mapUrl: "https://goo.gl/maps/XJzFTQLLNAciRwmN6",
  },
  {
    id: "lamezia",
    name: "Via Marconi 28",
    city: "Lamezia Terme",
    address: "Via Marconi 28, 88046 Lamezia Terme",
    phone: "(+39) 0968 345 678",
    phoneHref: "+390968345678",
    hoursLabel: "Lunedì – Domenica · 11:00 – 23:00",
    open: "11:00",
    close: "23:00",
    closedWeekdays: [],
    image: "/images/shop/interior.webp",
    mapUrl: "https://maps.app.goo.gl/NoDUKbfKkY68tNw66",
  },
];

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: "Pickup", href: "/pickup" },
  { label: "Botteghe", href: "/dove-trovarci" },
  { label: "Contatti", href: "/contact" },
];

export const SOCIAL = {
  instagram: "https://www.instagram.com/artigianogelateria/",
  instagramHandle: "@artigianogelateria",
  facebook: "https://www.facebook.com/artigianogelateria",
  facebookHandle: "artigianogelateria",
};

export const COMPANY = {
  legalName: "Artigiano Gelateria S.r.l.",
  address: "Via Nicolò Porpora 12, 00198 Roma",
  vat: "P.IVA 15501451007",
  year: "2026",
  credit: "Demo Studio",
};

export interface FeatureIcon {
  icon: string;
  label: string;
}

export const FEATURES: FeatureIcon[] = [
  { icon: "/icons/icon-gluten.svg", label: "100% Gluten free" },
  { icon: "/icons/icon-vegan.svg", label: "Opzioni vegane e senza lattosio" },
  { icon: "/icons/icon-natural.svg", label: "Ingredienti naturali e di stagione" },
];

export interface Stile {
  number: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
}

export const STILI: Stile[] = [
  {
    number: "01",
    title: "Ingredienti di finissima qualità",
    subtitle: "Stagionalità e ricercatezza",
    body: "Selezioniamo materie prime d'eccellenza, frutta di stagione e ingredienti ricercati provenienti dai migliori territori. Niente coloranti né conservanti artificiali: solo bontà autentica.",
    image: "/images/gusti/pistacchio.webp",
  },
  {
    number: "02",
    title: "Lavorazione artigianale",
    subtitle: "Tra innovazione e tradizione",
    body: "Ogni gelato nasce dalle mani dei nostri maestri gelatieri, che uniscono la sapienza della tradizione italiana alle tecniche più innovative dell'alta gelateria.",
    image: "/images/gusti/fragola.webp",
  },
  {
    number: "03",
    title: "Gusti classici e sorprendenti",
    subtitle: "Sapori senza tempo e abbinamenti innovativi",
    body: "Dai grandi classici della gelateria italiana agli abbinamenti più audaci: oltre 50 stili di gusto pensati per emozionare ad ogni assaggio.",
    image: "/images/gusti/stracciatella.webp",
  },
  {
    number: "04",
    title: "Il servizio? Un piacere",
    subtitle: "Disponibilità e cortesia come vocazione",
    body: "Nelle nostre boutique l'accoglienza è parte dell'esperienza: un servizio attento e cortese per farti sentire a casa, ad ogni visita.",
    image: "/images/gusti/zabaione.webp",
  },
];

// ============================================================
// Pickup — flavors, per-boutique availability, formats
// ============================================================
export interface Flavor {
  id: string;
  name: string;
  image?: string;   // circular photo thumbnail
  color: string;    // fallback / accent color
  vegan?: boolean;
}

export const FLAVORS: Flavor[] = [
  { id: "pistacchio", name: "Pistacchio di Bronte", image: "/images/gusti/pistacchio.webp", color: "#9aa86a" },
  { id: "nocciola", name: "Nocciola Piemonte", image: "/images/gusti/nocciola.webp", color: "#b07d4f" },
  { id: "stracciatella", name: "Stracciatella", image: "/images/gusti/stracciatella.webp", color: "#e9e0cd" },
  { id: "fragola", name: "Fragola", image: "/images/gusti/fragola.webp", color: "#d96b7a", vegan: true },
  { id: "zabaione", name: "Zabaione", image: "/images/gusti/zabaione.webp", color: "#e8c87a" },
  { id: "cioccolato", name: "Cioccolato Fondente", image: "/images/gusti/stracciatella-board.webp", color: "#5b3a24", vegan: true },
  { id: "fiordilatte", name: "Fiordilatte", color: "#f4ecd8" },
  { id: "caffe", name: "Caffè", color: "#6f4e37", vegan: true },
  { id: "mango", name: "Mango", color: "#e6a23c", vegan: true },
  { id: "limone", name: "Limone di Sicilia", color: "#e9d96b", vegan: true },
];

/** Each boutique offers a different selection of flavors. */
export const BOUTIQUE_FLAVORS: Record<string, string[]> = {
  "cosenza": ["pistacchio", "nocciola", "stracciatella", "fragola", "cioccolato", "fiordilatte"],
  "catanzaro": ["nocciola", "zabaione", "stracciatella", "cioccolato", "caffe", "pistacchio", "mango"],
  "lamezia": ["fragola", "pistacchio", "cioccolato", "stracciatella", "fiordilatte", "limone", "zabaione"],
};

export interface Format {
  id: string;
  name: string;
  detail: string;
  maxFlavors: number;
  /** indicative price (EUR) — used for the pickup booking total */
  price: number;
}

export const FORMATS: Format[] = [
  { id: "cono", name: "Cono", detail: "Cialda artigianale", maxFlavors: 3, price: 5.0 },
  { id: "coppetta", name: "Coppetta", detail: "Piccola / media / grande", maxFlavors: 3, price: 6.0 },
  { id: "vaschetta2", name: "Vaschetta 2 kg", detail: "Da asporto", maxFlavors: 4, price: 24.0 },
  { id: "vaschetta3", name: "Vaschetta 3 kg", detail: "Da asporto", maxFlavors: 5, price: 33.0 },
  { id: "vaschetta5", name: "Vaschetta 5 kg", detail: "Da asporto", maxFlavors: 6, price: 55.0 },
];

export function flavorById(id: string): Flavor | undefined {
  return FLAVORS.find((f) => f.id === id);
}
