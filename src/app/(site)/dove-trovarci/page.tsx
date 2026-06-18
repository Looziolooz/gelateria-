"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Phone, ArrowUpRight, ShoppingBag } from "lucide-react";
import { BOUTIQUES, SOCIAL, type City } from "@/lib/data";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { PageHero } from "@/components/PageHero";
import { CartoonMap } from "@/components/site/CartoonMap";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";

const CITIES: City[] = ["Cosenza", "Catanzaro", "Lamezia Terme"];

export default function DoveTrovarciPage() {
  const [city, setCity] = useState<City>("Cosenza");
  const boutiques = BOUTIQUES.filter((b) => b.city === city);

  return (
    <HorizontalScroll>
      <PageHero
        panel
        eyebrow="Dove trovarci"
        title="Siamo qui"
        subtitle="Le gelaterie Artigiano ti aspettano in Calabria. Scegli la città e vieni a trovarci dove preferisci."
      />

      <section className="w-[100svw] h-[100svh] shrink-0 overflow-y-auto b-back-1 c-secondary">
        <div className="min-h-full flex items-center px-[5vw] py-28 lg:py-24">
          <div className="w-full max-w-[1280px] mx-auto grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center">
            {/* LEFT — toggle + boutique cards */}
            <div>
              <p data-reveal className="eyebrow mb-3">Le botteghe</p>
              <h2 data-reveal className="title fs-70 fs-m-40 caviar t-u t-lh-12 mb-6">Trova la tua</h2>

              <div data-reveal className="flex flex-wrap gap-3 mb-8">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    aria-pressed={c === city}
                    className={cn(
                      "core t-u text-[14px] px-6 py-2.5 rounded-full transition-all duration-300",
                      c === city
                        ? "b-primary c-white shadow-[0_6px_18px_-8px_rgba(172,123,64,0.8)]"
                        : "ring-1 ring-secondary/30 hover:ring-primary hover:bg-secondary/5"
                    )}
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <ul className="space-y-4">
                {boutiques.map((b, i) => (
                  <li
                    key={`${city}-${b.id}`}
                    className="rounded-[16px] bg-white/55 ring-1 ring-secondary/10 p-5 fade-rise"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full b-primary" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <h3 className="caviar text-[20px] md:text-[23px] t-u leading-snug mb-2">{b.name}</h3>
                        <p className="flex items-center gap-2 caviar text-[14px] opacity-75 mb-1"><Clock size={15} className="c-primary shrink-0" /> {b.hoursLabel}</p>
                        <p className="flex items-center gap-2 caviar text-[14px] opacity-75 mb-3"><Phone size={15} className="c-primary shrink-0" /> <a href={`tel:${b.phoneHref}`}>{b.phone}</a></p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 caviar c-primary text-[14px] f-w-600">
                          <a href={b.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">Come arrivare <ArrowUpRight size={14} /></a>
                          <Link href="/pickup" className="inline-flex items-center gap-1 hover:underline"><ShoppingBag size={14} /> Ordina e ritira</Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Social */}
              <div data-reveal className="flex items-center gap-4 mt-8">
                <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="h-10 w-10 rounded-full ring-1 ring-secondary/30 grid place-items-center hover:ring-primary transition-colors">
                  <img src="/icons/icon-instagram-b.svg" alt="Instagram" className="h-5 w-5" />
                </a>
                <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="h-10 w-10 rounded-full ring-1 ring-secondary/30 grid place-items-center hover:ring-primary transition-colors">
                  <img src="/icons/icon-fb-b.svg" alt="Facebook" className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* RIGHT — cartoon map */}
            <div data-reveal>
              <CartoonMap city={city} className="w-full h-auto rounded-[20px] shadow-lg ring-1 ring-secondary/10" />
              <p className="text-center text-[13px] text-secondary/55 mt-3">
                Mappa illustrata — {boutiques.length} {boutiques.length === 1 ? "punto vendita" : "punti vendita"} a {city}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-[100svw] h-[100svh] shrink-0 flex items-center b-secondary">
        <div className="w-full">
          <SiteFooter />
        </div>
      </section>
    </HorizontalScroll>
  );
}
