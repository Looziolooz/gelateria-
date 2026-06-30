"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HS_TRACK_SELECTOR } from "@/lib/motion";

/* -------------------------------------------------------------------------- */
/*  Gusti dell'hero                                                           */
/*  Foto: cono in mano su fondo a tinta unita (il colore coincide col gusto). */
/*  Il `bg` è campionato dalla foto (scripts/hero-cono.mjs) così il fondo del  */
/*  pannello prolunga la foto bordo-a-bordo senza stacco.                      */
/* -------------------------------------------------------------------------- */

type Flavor = { name: string; blurb: string; bg: string; img: string };

const FLAVORS: Flavor[] = [
  {
    name: "Pistacchio",
    blurb: "Pistacchio di Bronte, tostato lentamente. Intenso, burroso, inconfondibile.",
    bg: "#5f6730",
    img: "/images/hero-cono/pistacchio.webp",
  },
  {
    name: "Fragola",
    blurb: "Fragole di stagione, mantecate fresche. Dolcezza viva, profumo di campo.",
    bg: "#9e4242",
    img: "/images/hero-cono/fragola.webp",
  },
  {
    name: "Zabaione",
    blurb: "Tuorli, zucchero e vino dolce. La ricetta di sempre, vellutata.",
    bg: "#a06410",
    img: "/images/hero-cono/zabaione.webp",
  },
  {
    name: "Stracciatella",
    blurb: "Fiordilatte e scaglie di cioccolato fondente. Il classico, fatto come si deve.",
    bg: "#866343",
    img: "/images/hero-cono/stracciatella.webp",
  },
];

const DURATION = 700; // ms
const AUTOPLAY_MS = 3800;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")";

export function GelatoHero({ orderHref = "/pickup" }: { orderHref?: string }) {
  const count = FLAVORS.length;
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  /* reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const go = useCallback(
    (dir: "next" | "prev") =>
      setIndex((p) => (dir === "next" ? (p + 1) % count : (p + count - 1) % count)),
    [count],
  );

  /* autoplay — i coni scorrono in loop di continuo (off solo con reduced motion) */
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => go("next"), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [go, reduced]);

  /* avanza alla sezione successiva passando per lo STESSO percorso della
     tastiera del binario (onKey → ArrowRight): guida l'animazione eased già
     collaudata e mantiene sincronizzato il suo `target` interno. Fallback a
     scrollBy nativo se il binario non risponde. */
  const nextSection = useCallback(() => {
    const track = document.querySelector<HTMLElement>(HS_TRACK_SELECTOR);
    if (!track) return;
    const before = track.scrollLeft;
    track.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }),
    );
    // Se nulla si è mosso entro un frame, scorri direttamente.
    requestAnimationFrame(() => {
      if (Math.abs(track.scrollLeft - before) < 1) {
        track.scrollBy({ left: track.clientWidth, behavior: reduced ? "auto" : "smooth" });
      }
    });
  }, [reduced]);

  const active = FLAVORS[index];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor: active.bg,
        transition: reduced ? "none" : `background-color ${DURATION}ms ${EASE}`,
      }}
    >
      {/* 1 · Foto (crossfade). Lo sfondo della foto = sfondo del pannello → bordi invisibili. */}
      {FLAVORS.map((f, i) => (
        <div
          key={f.name}
          aria-hidden={i !== index}
          className="absolute inset-0"
          style={{
            opacity: i === index ? 1 : 0,
            transition: reduced ? "none" : `opacity ${DURATION}ms ${EASE}`,
            zIndex: i === index ? 2 : 1,
          }}
        >
          <Image
            src={f.img}
            alt={i === index ? `Cono di gelato al gusto ${f.name}` : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 44%" }}
          />
        </div>
      ))}

      {/* 2 · Scrim per leggibilità (basso + alto) */}
      <div
        aria-hidden
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.12) 28%, transparent 52%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[26%] z-[3] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.20), transparent)" }}
      />

      {/* 3 · Grana */}
      <div
        aria-hidden
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{ opacity: 0.3, backgroundSize: "200px 200px", backgroundRepeat: "repeat", backgroundImage: NOISE }}
      />

      {/* 4 · Nome gusto (ghost) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[14%] z-[2] flex justify-center pointer-events-none select-none"
      >
        <span
          className="caviar"
          style={{
            fontSize: "clamp(60px, 19vw, 250px)",
            lineHeight: 1,
            textTransform: "uppercase",
            color: "#fff",
            opacity: 0.16,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {active.name}
        </span>
      </div>

      {/* 5 · Blocco gusto (basso a sinistra) — nome, descrizione, frecce gusto */}
      <div className="absolute left-[5vw] bottom-[15vh] sm:bottom-[18vh] z-30 max-w-[360px] text-white">
        <p className="label t-u text-[11px] sm:text-[12px] mb-2 text-white/75" style={{ letterSpacing: "0.22em" }}>
          Cambia gusto · {index + 1} / {count}
        </p>
        <h2 className="caviar t-u leading-none mb-3" style={{ fontSize: "clamp(30px, 5vw, 54px)" }}>
          {active.name}
        </h2>
        <p className="core text-[14px] sm:text-[15px] leading-relaxed text-white/85 mb-5 hidden sm:block">
          {active.blurb}
        </p>
        <div className="flex items-center gap-3">
          <NavCircle label="Gusto precedente" onClick={() => go("prev")}>
            <ArrowLeft size={22} strokeWidth={2.25} />
          </NavCircle>
          <NavCircle label="Gusto successivo" onClick={() => go("next")}>
            <ArrowRight size={22} strokeWidth={2.25} />
          </NavCircle>
          <span className="ml-2 flex items-center gap-1.5">
            {FLAVORS.map((f, i) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Vai al gusto ${f.name}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </span>
        </div>
      </div>

      {/* 6 · CTA "Ordina" (basso a destra) */}
      <Link
        href={orderHref}
        className="absolute right-[5vw] bottom-[15vh] sm:bottom-[18vh] z-30 flex items-center gap-1 text-white opacity-95 hover:opacity-100 transition-opacity"
      >
        <span className="caviar t-u" style={{ fontSize: "clamp(26px, 4.4vw, 56px)", lineHeight: 1 }}>
          Ordina
        </span>
        <ArrowRight className="w-6 h-6 sm:w-9 sm:h-9 ml-0.5" strokeWidth={2.25} />
      </Link>

      {/* 7 · Cue "prossima sezione" — indica DOVE cliccare per scorrere a destra */}
      <button
        type="button"
        onClick={nextSection}
        aria-label="Vai alla prossima sezione"
        className="group absolute right-[2.5vw] top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 text-white/85 hover:text-white transition-colors"
      >
        <span
          className="label t-u text-[10px]"
          style={{ letterSpacing: "0.2em", writingMode: "vertical-rl" }}
        >
          Scorri
        </span>
        <span className="grid place-items-center w-11 h-11 rounded-full border border-white/55 group-hover:bg-white/12 transition-colors">
          <ArrowRight
            size={20}
            strokeWidth={2.25}
            style={reduced ? undefined : { animation: "heroNudge 1.6s ease-in-out infinite" }}
          />
        </span>
      </button>

      <style>{`
        @keyframes heroNudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

/* Bottone circolare di navigazione gusto */
function NavCircle({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid place-items-center w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 border-white/70 text-white hover:bg-white/12 hover:scale-105 transition-all duration-200"
    >
      {children}
    </button>
  );
}
