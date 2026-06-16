"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { BOUTIQUES } from "@/lib/data";

/**
 * crema-boutiques-slider — a one-at-a-time carousel of ARTIGIANO boutiques, faithful
 * to gelatocrema.com. Left/right arrows wrap around; thumbnails jump directly.
 * The original Deliveroo/Glovo/JustEat delivery buttons are replaced by a single
 * "Ordina e ritira" pickup link to /pickup.
 */
export function BoutiquesSlider() {
  const [index, setIndex] = useState(0);
  const count = BOUTIQUES.length;
  const b = BOUTIQUES[index];

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <div className="crema-boutiques-slider mt-14" data-reveal>
      <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Photo */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] ring-1 ring-secondary/10 shadow-md">
          <Image
            src={b.image}
            alt={b.name}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <span
            className="absolute top-4 left-4 core c-white t-u bg-primary/90 px-3 py-1 rounded-full text-[12px]"
            style={{ letterSpacing: "0.1em" }}
          >
            {b.city}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p
            className="lbl core fs-16 fs-m-12 c-primary mb-4 t-u inline-flex items-center gap-2"
            style={{ letterSpacing: "0.14em" }}
          >
            <MapPin size={15} /> {b.city}
          </p>

          <h3 className="caviar fs-40 fs-m-30 t-u t-lh-12 mb-6">{b.name}</h3>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-7 caviar c-primary fs-16 f-w-600">
            <a
              href={b.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              Come arrivare <ArrowUpRight size={15} />
            </a>
            <a
              href={b.menuImage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              Scopri il Menù <ArrowUpRight size={15} />
            </a>
          </div>

          <p className="flex items-center gap-2.5 caviar text-[15px] opacity-85 mb-2.5">
            <Clock size={16} className="c-primary shrink-0" /> {b.hoursLabel}
          </p>
          <p className="flex items-center gap-2.5 caviar text-[15px] opacity-85 mb-8">
            <Phone size={16} className="c-primary shrink-0" />
            <a href={`tel:${b.phoneHref}`} className="hover:c-primary transition-colors">
              {b.phone}
            </a>
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/pickup"
              className="btn small primary boutique d-ib caviar b-primary c-white t-u inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold hover:opacity-90 transition-opacity"
            >
              <ShoppingBag size={16} /> Ordina e ritira
            </Link>

            {/* Arrows */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Boutique precedente"
                className="grid h-11 w-11 place-items-center rounded-full b-primary c-white hover:opacity-90 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Boutique successiva"
                className="grid h-11 w-11 place-items-center rounded-full b-primary c-white hover:opacity-90 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-10 flex flex-wrap gap-3">
        {BOUTIQUES.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Vai a ${item.name}`}
            aria-current={i === index}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-[10px] ring-2 transition-all ${
              i === index ? "ring-primary opacity-100" : "ring-transparent opacity-60 hover:opacity-90"
            }`}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default BoutiquesSlider;
