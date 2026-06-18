"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { BOUTIQUES, type City } from "@/lib/data";
import { CartoonMap } from "@/components/site/CartoonMap";
import { cn } from "@/lib/utils";

const CITIES: City[] = ["Cosenza", "Catanzaro", "Lamezia Terme"];

export function HomeMapPanel() {
  const [city, setCity] = useState<City>("Cosenza");
  const list = BOUTIQUES.filter((b) => b.city === city);

  return (
    <div className="b-back-1 c-secondary w-full h-full grid lg:grid-cols-[minmax(0,440px)_1fr] gap-10 pt-28 lg:pt-24 pb-16 px-[5vw] items-center">
      {/* left: list + pickup */}
      <div data-reveal-stagger>
        <p data-reveal className="eyebrow mb-3">Le botteghe</p>
        <h2 data-reveal className="title fs-70 fs-m-40 caviar t-u t-lh-12 mb-6">Vieni a trovarci</h2>
        <div data-reveal className="flex flex-wrap gap-2 mb-7">
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              aria-pressed={city === c}
              className={cn(
                "core t-u text-[13px] px-5 py-2 rounded-full transition-all duration-300",
                city === c ? "b-primary c-white shadow-[0_6px_18px_-8px_rgba(172,123,64,0.8)]" : "ring-1 ring-secondary/30 hover:ring-primary hover:bg-secondary/5"
              )}
              style={{ letterSpacing: "0.1em" }}
            >
              {c}
            </button>
          ))}
        </div>
        <ul className="space-y-3 mb-8">
          {list.map((b, i) => (
            <li
              key={`${city}-${b.id}`}
              className="relative pl-6 fade-rise"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="absolute left-0 top-[0.55em] h-2.5 w-2.5 rounded-full b-primary" />
              <a href={b.mapUrl} target="_blank" rel="noreferrer" className="caviar text-[18px] md:text-[20px] hover:c-primary transition-colors">
                {b.name}
              </a>
            </li>
          ))}
        </ul>
        <div data-reveal className="pt-6 border-t border-secondary/15">
          <p className="lbl core fs-16 fs-m-12 c-primary mb-3 t-u" style={{ letterSpacing: "0.12em" }}>Ordina e ritira</p>
          <div className="flex flex-wrap gap-2">
            {list.map((b, i) => (
              <Link
                key={`${city}-${b.id}`}
                href="/pickup"
                className="caviar b-primary c-white t-u inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-opacity hover:opacity-85 fade-rise"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ShoppingBag size={12} /> {b.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* right: cartoon map */}
      <div data-reveal className="relative h-full min-h-[240px] flex items-center justify-center">
        <CartoonMap city={city} className="w-full h-auto max-h-full rounded-[18px] shadow-md ring-1 ring-secondary/10" />
      </div>
    </div>
  );
}
