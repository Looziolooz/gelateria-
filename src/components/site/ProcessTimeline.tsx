"use client";

import { useEffect, useState } from "react";
import { Figure } from "@/components/site/Figure";
import { cn } from "@/lib/utils";

/**
 * "Il processo" — QUATTRO CARD VERTICALI: le fasi in un solo pannello, quattro
 * card portrait (foto alta + testo sotto) in fila. Un auto-play accende le card
 * una a una: la card attiva si alza con ring saffron, scala la foto e mostra la
 * spiegazione completa crossfade; le altre restano attenuate. Coerente col
 * layout: parchment, espresso, saffron, foto in frame editoriale.
 * Rispetta prefers-reduced-motion.
 */

const STEPS = [
  {
    num: "01",
    title: "Materie prime",
    desc: "Ingredienti naturali, freschi e di stagione. Latte, panna, frutta — nient'altro.",
    explain:
      "Ogni giorno selezioniamo latte, panna e frutta di stagione dai migliori territori. Pochi ingredienti, veri: senza coloranti né semilavorati industriali.",
    img: "/images/gusti/fragola.webp",
  },
  {
    num: "02",
    title: "Lenta mantecazione",
    desc: "Aria incorporata naturalmente, senza emulsionanti: una consistenza vellutata.",
    explain:
      "La mantecazione lenta e costante incorpora aria in modo naturale. Niente emulsionanti né stabilizzanti: solo il tempo giusto per una consistenza vellutata.",
    img: "/images/gusti/pistacchio.webp",
  },
  {
    num: "03",
    title: "Tradizione italiana",
    desc: "Ricette tramandate, bilanciamento perfetto, rispetto dei tempi di maturazione.",
    explain:
      "Ricette tramandate di generazione in generazione, bilanciamenti perfezionati nel tempo e i tempi di maturazione sempre rispettati: la scuola della gelateria italiana.",
    img: "/images/shop/interior.webp",
  },
  {
    num: "04",
    title: "Passione artigiana",
    desc: "Ogni giorno, la stessa dedizione: ingredienti semplici trasformati in emozioni.",
    explain:
      "Ogni giorno la stessa dedizione del maestro gelatiere: ingredienti semplici che, lavorati a mano, diventano piccole emozioni da gustare in bottega.",
    img: "/images/shop/maestro.webp",
  },
];

const COUNT = STEPS.length;
const AUTOPLAY_MS = 3400;

export function ProcessTimeline() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % COUNT), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <section className="relative w-[100svw] h-[100svh] shrink-0 overflow-hidden b-back-1 c-secondary">
      {/* ghost step number — saffron watermark, come le sezioni Stili */}
      <div
        aria-hidden
        data-px="-26"
        className="caviar pointer-events-none select-none absolute top-[3%] right-[2%] leading-none text-primary/10 whitespace-nowrap"
        style={{ fontSize: "clamp(90px, 16vw, 200px)" }}
      >
        {("0" + (active + 1)).slice(-2)}
      </div>

      {/* --------------------------------------------------------------- */}
      {/* CONTENT — header + 4 card verticali + rail                       */}
      {/* --------------------------------------------------------------- */}
      <div className="relative z-10 w-full h-full px-[6vw] overflow-y-auto">
        <div className="max-w-[1200px] mx-auto pt-28 lg:pt-24 pb-12 lg:pb-10 flex flex-col min-h-full">
          {/* header */}
          <div data-reveal-stagger className="mb-8 lg:mb-10">
            <h2 data-reveal className="title caviar fs-70 fs-m-40 t-u t-lh-12 mb-5">
              Il processo
            </h2>
            <hr data-reveal className="rule-gold w-16 mb-6 not-prose" />
            <p data-reveal className="lead max-w-md opacity-90">
              Quattro passaggi, la stessa cura: come nasce ogni gelato Artigiano.
            </p>
          </div>

          {/* 4 CARD VERTICALI — foto alta portrait + testo sotto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
            {STEPS.map((step, i) => {
              const isActive = active === i;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  aria-label={`Passaggio ${step.num} — ${step.title}`}
                  data-reveal
                  style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                  className="group relative text-left"
                >
                  <div
                    className={cn(
                      "flex h-full flex-col transition-all duration-500 will-change-transform",
                      isActive
                        ? "lg:-translate-y-1.5 opacity-100"
                        : "opacity-75 hover:opacity-100",
                    )}
                  >
                    {/* foto portrait */}
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-[18px] transition-all duration-500",
                        "aspect-[4/5]",
                        isActive
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-[#F5EDD8] shadow-[0_18px_40px_-18px_rgba(46,26,14,0.35)]"
                          : "ring-1 ring-secondary/10",
                      )}
                    >
                      <Figure
                        src={step.img}
                        alt={step.title}
                        radius="18px"
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 46vw, 26vw"
                        className="w-full h-full"
                        imgClassName={cn(
                          "object-cover transition-transform duration-700 ease-out",
                          isActive ? "scale-[1.15]" : "scale-100",
                        )}
                      />

                      {/* traccia — fase */}
                      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 label t-u text-[11px] backdrop-blur-sm transition-colors duration-500",
                            isActive
                              ? "bg-[#2E1A0E]/80 text-primary"
                              : "bg-[#F5EDD8]/80 text-secondary/60",
                          )}
                        >
                          <span className="inline-block h-1.5 w-1.5 rotate-45 bg-primary" />
                          {step.num}
                        </span>
                      </div>
                    </div>

                    {/* testo sotto la foto */}
                    <div className="pt-4 flex-1">
                      <h3 className="caviar t-u text-[17px] md:text-[19px] t-lh-12 mb-1.5">
                        {step.title}
                      </h3>
                      <div className="relative grid">
                        <p
                          className="core text-[13px] md:text-[14px] leading-relaxed opacity-80 col-start-1 row-start-1 will-change-[opacity,transform] transition-all duration-500"
                          style={{
                            opacity: isActive ? 0 : 1,
                            transform: isActive ? "translateY(6px)" : "none",
                          }}
                        >
                          <span className="line-clamp-2">{step.desc}</span>
                        </p>
                        <p
                          aria-hidden={!isActive}
                          className="core text-[13px] md:text-[14px] leading-relaxed opacity-90 col-start-1 row-start-1 will-change-[opacity,transform] transition-all duration-500"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? "none" : "translateY(-6px)",
                          }}
                        >
                          <span className="line-clamp-3">{step.explain}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* rail + controlli */}
          <div className="mt-auto pt-8 lg:pt-6 pb-2 flex flex-col gap-5">
            {/* rail */}
            <div className="relative">
              <div className="relative h-[2px] bg-secondary/15" />
              <div className="absolute inset-x-0 top-[5px] h-px bg-primary/40" />
              <div
                className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-primary to-[#D4973A] transition-all duration-500"
                style={{ width: `${(active / (COUNT - 1)) * 100}%` }}
              />
              {/* sweep progress visibile durante l'auto-play */}
              {!reduced && (
                <div
                  key={active}
                  className="prog-fill absolute left-0 top-0 h-[2px] bg-[#C1603A]"
                  style={{
                    width: `${100 / (COUNT - 1)}%`,
                    animationDuration: `${AUTOPLAY_MS}ms`,
                  }}
                />
              )}
              {STEPS.map((step, i) => (
                <button
                  key={step.num}
                  type="button"
                  aria-label={`Vai alla fase ${step.title}`}
                  aria-current={active === i ? "true" : undefined}
                  onClick={() => setActive(i)}
                  className="absolute -top-[5px] grid place-items-center p-2"
                  style={{ left: `${(i / (COUNT - 1)) * 100}%`, transform: "translateX(-50%)" }}
                >
                  <span
                    className={cn(
                      "block h-2.5 w-2.5 rounded-full border transition-colors duration-500",
                      active === i
                        ? "bg-primary border-primary"
                        : "bg-cream border-secondary/30 hover:border-primary",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progFwd { from { width: 0 } to { width: 100% } }
        .prog-fill { animation-name: progFwd; animation-timing-function: linear; animation-fill-mode: forwards; }
      `}</style>
    </section>
  );
}