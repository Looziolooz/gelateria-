import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Libre_Franklin, Pinyon_Script } from "next/font/google";
import "./globals.css";

// "Good Food" type system — Playfair Display + Source Serif 4 + Libre Franklin
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-fraunces",
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-hanken",
  display: "swap",
});
const libre = Libre_Franklin({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-label",
  display: "swap",
});
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artigianogelateria.it"),
  title: {
    default: "Artigiano Gelateria — Gelato per amore",
    template: "%s | ARTIGIANO",
  },
  description:
    "Artigiano Gelateria — vera gelateria artigianale in Calabria. Oltre 50 stili di gelato, ingredienti di finissima qualità, 100% gluten free, opzioni vegan. Vieni a trovarci nelle nostre boutique a Cosenza, Catanzaro e Lamezia Terme.",
  icons: { icon: "/icons/logo_color.svg", shortcut: "/icons/logo_color.svg" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Artigiano Gelateria",
    title: "Artigiano Gelateria — Gelato per amore",
    description:
      "Alta gelateria artigianale in Calabria. Oltre 50 stili di gelato, boutique a Cosenza, Catanzaro e Lamezia Terme. Ordina e ritira.",
    url: "https://artigianogelateria.it/",
    images: [{ url: "/images/shop/shop1.webp", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${playfair.variable} ${sourceSerif.variable} ${libre.variable} ${pinyon.variable}`}>
      <body>{children}</body>
    </html>
  );
}
