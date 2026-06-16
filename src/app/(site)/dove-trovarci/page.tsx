"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Phone, ArrowUpRight, ShoppingBag } from "lucide-react";
import { BOUTIQUES, SOCIAL, type City } from "@/lib/data";
import { CartoonMap } from "@/components/site/CartoonMap";
import { cn } from "@/lib/utils";

const CITIES: City[] = ["Milano", "Roma"];

export default function DoveTrovarciPage() {
  const [city, setCity] = useState<City>("Milano");
  const boutiques = BOUTIQUES.filter((b) => b.city === city);

  return (
    <section className="b-back-1 c-secondary min-h-[100svh] pt-28 lg:pt-24 pb-12 px-[5vw]">
      <div className="max-w-2xl mb-10">
        <p className="eyebrow mb-3">Dove trovarci</p>
        <h1 className="title fs-70 fs-m-40 caviar t-u t-lh-12 mb-5">Siamo qui</h1>
        <p className="caviar text-[16px] md:text-[18px] leading-relaxed opacity-90">
          Le gelaterie Artigiano ti aspettano a Milano e a Roma. Scegli la città, scopri i
          punti vendita e vieni a trovarci dove preferisci. Ti aspettiamo!
        </p>
      </div>

      {/* City toggle */}
      <div className="flex gap-3 mb-10">
        {CITIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(c)}
            aria-pressed={c === city}
            className={cn(
              "core t-u text-[14px] px-6 py-2.5 rounded-full transition-colors",
              c === city ? "b-primary c-white" : "ring-1 ring-secondary/30 hover:ring-primary"
            )}
            style={{ letterSpacing: "0.1em" }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start">
        {/* LEFT — boutique cards */}
        <div>
          <ul className="space-y-4">
            {boutiques.map((b) => (
              <li key={b.id} className="rounded-[16px] bg-white/55 ring-1 ring-secondary/10 p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full b-primary" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <h2 className="caviar text-[20px] md:text-[23px] t-u leading-snug mb-2">{b.name}</h2>
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
          <div className="flex items-center gap-4 mt-8">
            <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="h-10 w-10 rounded-full ring-1 ring-secondary/30 grid place-items-center hover:ring-primary transition-colors">
              <img src="/icons/icon-instagram-b.svg" alt="Instagram" className="h-5 w-5" />
            </a>
            <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="h-10 w-10 rounded-full ring-1 ring-secondary/30 grid place-items-center hover:ring-primary transition-colors">
              <img src="/icons/icon-fb-b.svg" alt="Facebook" className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* RIGHT — cartoon map */}
        <div className="lg:sticky lg:top-28">
          <CartoonMap city={city} className="w-full h-auto rounded-[20px] shadow-lg ring-1 ring-secondary/10" />
          <p className="text-center text-[13px] text-secondary/55 mt-3">
            Mappa illustrata — {boutiques.length} {boutiques.length === 1 ? "punto vendita" : "punti vendita"} a {city}
          </p>
        </div>
      </div>
    </section>
  );
}
