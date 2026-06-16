"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { BOUTIQUES, type City } from "@/lib/data";
import { cn } from "@/lib/utils";

const CITIES: City[] = ["Milano", "Roma"];
const MAPS: Record<City, string> = {
  Milano: "/images/maps/milano.png",
  Roma: "/images/maps/roma.png",
};

/**
 * "VIENI A TROVARCI" section — faithful landscape 2-column layout with a
 * Milano/Roma city selector (like the original). The original "Ordina a
 * domicilio" delivery block is replaced by an "Ordina e ritira" PICKUP block.
 */
export function BoutiquesMapSection({ withMaps = true }: { withMaps?: boolean }) {
  const [city, setCity] = useState<City>("Milano");
  const list = BOUTIQUES.filter((b) => b.city === city);

  return (
    <section className="b-back-1 c-secondary py-[80px] md:py-[110px]">
      <div className="site-wrap">
        <h2 className="title fs-70 fs-m-40 caviar t-u t-lh-12 mb-8" data-reveal>
          Vieni a trovarci
        </h2>

        {/* city selector */}
        <div className="flex gap-2 mb-10" data-reveal>
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={cn(
                "core t-u text-[14px] px-5 py-2 rounded-full transition-colors",
                city === c ? "b-primary c-white" : "ring-1 ring-secondary/25 hover:ring-primary c-secondary"
              )}
              style={{ letterSpacing: "0.1em" }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className={cn("grid gap-12", withMaps && "lg:grid-cols-[minmax(0,540px)_1fr] lg:items-start")}>
          {/* list + pickup */}
          <div data-reveal>
            <ul className="space-y-4 mb-12">
              {list.map((b) => (
                <li key={b.id} className="relative pl-7">
                  <span className="absolute left-0 top-[0.6em] h-2.5 w-2.5 rounded-full b-primary" />
                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="caviar text-[19px] md:text-[22px] hover:c-primary transition-colors"
                  >
                    {b.name}
                  </a>
                  <span className="block caviar text-[13px] opacity-65 mt-0.5">{b.hoursLabel}</span>
                </li>
              ))}
            </ul>

            {/* pickup (replaces the original delivery providers) */}
            <div className="pt-8 border-t border-secondary/15">
              <p className="lbl core fs-16 fs-m-12 c-primary mb-4 t-u" style={{ letterSpacing: "0.12em" }}>
                Ordina e ritira
              </p>
              <div className="flex flex-wrap gap-2.5">
                {list.map((b) => (
                  <Link
                    key={b.id}
                    href="/pickup"
                    className="caviar b-primary c-white t-u inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    <ShoppingBag size={14} /> {b.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* map */}
          {withMaps && (
            <figure className="relative" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
              <Image
                src={MAPS[city]}
                alt={`Mappa boutique Artigiano a ${city}`}
                width={900}
                height={680}
                className="w-full h-auto rounded-[14px]"
              />
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
