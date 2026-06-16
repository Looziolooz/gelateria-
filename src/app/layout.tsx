import type { Metadata } from "next";
import { Fraunces, Pinyon_Script, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// "La Strega Nocciola" type system
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artigianogelateria.it"),
  title: {
    default: "Artigiano Gelateria — Gelato per amore",
    template: "%s | ARTIGIANO",
  },
  description:
    "Artigiano Gelateria — vera gelateria artigianale a Milano e Roma. Oltre 50 stili di gelato, ingredienti di finissima qualità, 100% gluten free, opzioni vegan. Vieni a trovarci nelle nostre boutique.",
  icons: { icon: "/icons/logo_color.svg", shortcut: "/icons/logo_color.svg" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Artigiano Gelateria",
    title: "Artigiano Gelateria — Gelato per amore",
    description:
      "Alta gelateria artigianale a Milano e Roma. Oltre 50 stili di gelato. Ordina e ritira nella tua boutique.",
    url: "https://artigianogelateria.it/",
    images: [{ url: "/images/shop/shop1.webp", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${fraunces.variable} ${pinyon.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
