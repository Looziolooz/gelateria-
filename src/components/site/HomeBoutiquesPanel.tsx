"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { BOUTIQUES, type City } from "@/lib/data";
import { cn } from "@/lib/utils";

const CITIES: City[] = ["Milano", "Roma"];

export function HomeBoutiquesPanel() {
  const [city, setCity] = useState<City>("Milano");
  const list = BOUTIQUES.filter((b) => b.city === city);

  return (
    <div className="b-back-2 c-secondary w-full lg:h-full flex flex-col pt-28 lg:pt-24 pb-10 px-[5vw]">
      {/* header row */}
      <div className="flex items-center justify-between gap-4 mb-8 shrink-0">
        <h2 className="title caviar fs-70 fs-m-40 t-u t-lh-1">Boutiques</h2>
        <div className="flex gap-2">
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={cn(
                "core t-u text-[13px] px-5 py-2 rounded-full transition-colors",
                city === c ? "b-primary c-white" : "ring-1 ring-secondary/30 hover:ring-primary"
              )}
              style={{ letterSpacing: "0.1em" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* boutiques row */}
      <div className="flex-1 min-h-0 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 content-stretch">
        {list.map((b) => (
          <article key={b.id} className="flex flex-col min-h-0">
            <p className="caviar text-[20px] md:text-[24px] t-u f-w-600 mb-2 leading-tight">{b.name}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 caviar c-primary text-[13px] f-w-600 mb-2">
              <a href={b.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">Come arrivare <ArrowUpRight size={12} /></a>
              <a href={b.menuImage} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">Scopri il Menù <ArrowUpRight size={12} /></a>
            </div>
            <p className="caviar text-[13px] opacity-75">{b.hoursLabel}</p>
            <p className="caviar text-[13px] opacity-75 mb-3">Tel: {b.phone}</p>
            <Link href="/pickup" className="caviar b-primary c-white t-u inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold hover:opacity-90 mb-4">
              <ShoppingBag size={13} /> Ordina e ritira
            </Link>
            <div className="relative flex-1 min-h-[180px] rounded-[12px] overflow-hidden">
              <Image src={b.image} alt={b.name} fill className="object-cover" sizes="(max-width:1024px) 50vw, 30vw" quality={94} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
