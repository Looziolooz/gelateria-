"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

/**
 * "Il processo" — a HORIZONTAL timeline inside one panel: a `.h-scroll` gallery
 * of four photo cards (one craft step each) over a horizontal rail that fills
 * with a gold→forest-green gradient as you scroll, dots lighting up step by
 * step. Light parchment theme; consistent with the site's horizontal paradigm
 * (the gallery hands the wheel back to the main track when it bottoms out).
 */

const STEPS = [
  { num: "01", title: "Materie prime", desc: "Ingredienti naturali, freschi e di stagione. Latte, panna, frutta — nient'altro.", img: "/images/gusti/fragola.webp" },
  { num: "02", title: "Lenta mantecazione", desc: "Aria incorporata naturalmente, senza emulsionanti: una consistenza vellutata.", img: "/images/gusti/pistacchio.webp" },
  { num: "03", title: "Tradizione italiana", desc: "Ricette tramandate, bilanciamento perfetto, rispetto dei tempi di maturazione.", img: "/images/shop/interior.webp" },
  { num: "04", title: "Passione artigiana", desc: "Ogni giorno, la stessa dedizione: ingredienti semplici trasformati in emozioni.", img: "/images/shop/maestro.webp" },
];

export function ProcessTimeline() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Horizontal scroll progress of the gallery → fills the rail + lights the dots.
  const { scrollXProgress } = useScroll({ container: galleryRef });
  const fillWidth = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);
  useMotionValueEvent(scrollXProgress, "change", (v) =>
    setActive(Math.round(v * (STEPS.length - 1))),
  );

  return (
    <section className="relative w-[100svw] h-[100svh] shrink-0 overflow-hidden bg-cream c-secondary flex flex-col">
      {/* header */}
      <div className="shrink-0 px-[6vw] pt-24 md:pt-28 pb-4 max-w-[1280px]">
        <p className="eyebrow !text-primary mb-3">Dietro a ogni gusto</p>
        <h2 className="caviar fs-70 fs-m-36 t-u t-lh-1 text-secondary mb-3">Il processo</h2>
        <p className="core text-[15px] md:text-[16px] leading-relaxed text-cocoa max-w-md">
          Dal banco al cono, un passaggio alla volta — scorri in orizzontale per seguire ogni fase.
        </p>
      </div>

      {/* gallery — scrolls horizontally; hands the wheel back to the main track
          when it bottoms out (see HorizontalScroll's `.h-scroll` handling) */}
      <div className="flex-1 min-h-0">
        <div
          ref={galleryRef}
          className="h-scroll flex h-full items-stretch gap-5 md:gap-7 overflow-x-auto overflow-y-hidden px-[6vw] py-2"
        >
          {STEPS.map((step) => (
            <article
              key={step.num}
              className="group relative flex h-full shrink-0 w-[80vw] sm:w-[56vw] md:w-[42vw] lg:w-[32vw] xl:w-[27vw] flex-col"
            >
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[18px] ring-1 ring-[#D8C4B2] shadow-[0_18px_44px_-22px_rgba(46,26,14,0.55)]">
                <Image
                  src={step.img}
                  alt={`${step.title} — Artigiano`}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 42vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {/* scrim for the number */}
                <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
                <span className="absolute left-5 top-3 caviar leading-none text-white/95 text-5xl md:text-6xl" style={{ textShadow: "0 2px 14px rgba(0,0,0,0.35)" }}>
                  {step.num}
                </span>
              </div>
              <div className="shrink-0 pt-4">
                <h3 className="caviar t-u text-[20px] md:text-[24px] text-secondary mb-1.5 t-lh-12">{step.title}</h3>
                <p className="core text-[14px] md:text-[15px] leading-relaxed text-cocoa max-w-sm">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* rail — faint base + gradient fill (grows with scroll) + step dots */}
      <div className="shrink-0 px-[6vw] pb-10 md:pb-12 pt-2">
        <div className="relative mx-auto max-w-[1180px]">
          <div className="relative h-[2px] rounded-full bg-[#D8C4B2]/70">
            <motion.div
              style={{ width: fillWidth }}
              className="absolute left-0 top-0 h-[2px] rounded-full bg-gradient-to-r from-[#D4973A] via-[#7A8C6B] to-[#34502F]"
            />
            {STEPS.map((step, i) => (
              <span
                key={step.num}
                className="absolute -top-[7px] grid place-items-center"
                style={{ left: `${(i / (STEPS.length - 1)) * 100}%`, transform: "translateX(-50%)" }}
              >
                <span
                  className={`h-4 w-4 rounded-full ring-2 transition-colors duration-500 ${
                    i <= active ? "bg-primary ring-[#34502F]/60" : "bg-cream ring-[#D8C4B2]"
                  }`}
                />
              </span>
            ))}
          </div>
          <div className="mt-3 hidden sm:flex justify-between">
            {STEPS.map((step, i) => (
              <span
                key={step.num}
                className={`label t-u text-[11px] transition-colors duration-500 ${
                  i <= active ? "text-secondary" : "text-secondary/40"
                }`}
                style={{ letterSpacing: "0.16em" }}
              >
                {step.num} · {step.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
