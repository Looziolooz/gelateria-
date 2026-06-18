"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { City } from "@/lib/data";
import { EASE, prefersReducedMotion } from "@/lib/motion";

/* ============================================================
   Illustrated city maps — Cosenza · Catanzaro · Lamezia Terme.
   Stylised line-art landmarks (not survey-accurate) so you can see roughly
   where each bottega sits. Palette: cream base, noce/petrolio line-art, a rosso
   gelato cup marking the shop. One hand-placed layout per city.
   ============================================================ */

const INK = "#6e4f33";        // noce — landmark outlines
const INK_SOFT = "#b9a07e";   // faded outlines / blocks
const PETROL = "#2c595e";     // labels
const PARK = "#b9c4a3";       // salvia
const WATER = "#9fc0c4";

type Place = { glyph: GlyphName; x: number; y: number; label: string; scale?: number };
type CityMap = {
  parks: string[];      // path d
  water: string[];      // path d (rivers)
  places: Place[];
  pin: { x: number; y: number; label: string };
};

/* ---------- landmark glyphs (drawn around origin, base at y≈0) ---------- */
type GlyphName =
  | "duomo" | "castle" | "archBridge" | "theatre" | "temple"
  | "tower" | "church" | "spring" | "park" | "villa";

function Glyph({ name }: { name: GlyphName }) {
  const s = { fill: "none", stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (name) {
    case "duomo": // gothic cathedral — three spires + rose window
      return (
        <g {...s}>
          <path d="M-26 0 V-30 H26 V0" />
          <path d="M-26 -30 V-46 L-13 -64 L0 -46 M0 -46 L13 -64 L26 -46 V-30" />
          <path d="M0 -64 V-78 M-13 -64 V-72 M13 -64 V-72" />
          <circle cx="0" cy="-20" r="6" />
          <path d="M-18 0 V-22 M18 0 V-22" />
        </g>
      );
    case "castle": // Svevo / Normanno — keep with battlements + two towers
      return (
        <g {...s}>
          <path d="M-30 0 V-26 H30 V0" />
          <path d="M-30 -26 v-8 h7 v-7 h8 v7 h8 v-7 h8 v7 h7 v8" />
          <path d="M-30 -26 h-8 v-22 l4 -7 l4 7 v22 M30 -26 h8 v-22 l-4 -7 l-4 7 v22" />
          <path d="M-3 0 V-14 h6 V0" />
        </g>
      );
    case "archBridge": // Calatrava / Bisantis — single great arch + deck + stays
      return (
        <g {...s}>
          <path d="M-44 0 H44" strokeWidth="3" />
          <path d="M-40 0 a40 40 0 0 1 80 0" />
          <path d="M0 0 V-40 M0 -38 L-30 0 M0 -38 L30 0 M0 -26 L-18 0 M0 -26 L18 0" strokeWidth="1.6" />
        </g>
      );
    case "theatre": // Politeama / Rendano — columned facade + pediment
      return (
        <g {...s}>
          <path d="M-28 0 V-22 H28 V0" />
          <path d="M-30 -22 L0 -40 L30 -22 Z" />
          <path d="M-20 0 V-22 M-10 0 V-22 M0 0 V-22 M10 0 V-22 M20 0 V-22" strokeWidth="1.6" />
        </g>
      );
    case "temple": // classical temple (piazza monument)
      return (
        <g {...s}>
          <path d="M-24 0 V-20 H24 V0" />
          <path d="M-28 -20 L0 -34 L28 -20 Z" />
          <path d="M-16 0 V-20 M0 0 V-20 M16 0 V-20" strokeWidth="1.6" />
        </g>
      );
    case "tower": // campanile
      return (
        <g {...s}>
          <path d="M-9 0 V-52 H9 V0" />
          <path d="M-9 -52 L0 -64 L9 -52" />
          <path d="M-4 0 V-12 h8 V0 M-6 -24 h12 M-6 -36 h12" strokeWidth="1.6" />
        </g>
      );
    case "church": // small church + cross
      return (
        <g {...s}>
          <path d="M-22 0 V-22 H22 V0" />
          <path d="M-22 -22 L0 -38 L22 -22" />
          <path d="M0 -38 V-50 M-5 -45 H5" strokeWidth="1.6" />
          <path d="M-4 0 V-12 h8 V0" />
        </g>
      );
    case "spring": // Terme di Caronte — fountain / thermal spring
      return (
        <g {...s}>
          <path d="M-22 0 q22 10 44 0" />
          <path d="M0 -2 V-22 M0 -22 q-10 -6 -4 -16 M0 -22 q10 -6 4 -16 M0 -22 q-2 -10 0 -18" strokeWidth="1.8" />
        </g>
      );
    case "villa": // park villa / belvedere
      return (
        <g {...s}>
          <path d="M-20 0 V-18 H20 V0 M-20 -18 L0 -30 L20 -18" />
          <circle cx="0" cy="-9" r="4" />
        </g>
      );
    case "park":
      return (
        <g {...s}>
          <circle cx="-12" cy="-12" r="11" />
          <circle cx="12" cy="-10" r="13" />
          <circle cx="0" cy="-20" r="10" />
          <path d="M-12 0 V-12 M12 0 V-10 M0 0 V-20" strokeWidth="1.6" />
        </g>
      );
  }
}

function ConeCupPin({ label }: { label: string }) {
  const w = label.length * 6.2 + 22;
  return (
    <g data-cone style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}>
      {/* shadow */}
      <ellipse cx="0" cy="2" rx="16" ry="4.5" fill="rgba(42,38,32,0.18)" />
      {/* cup */}
      <path d="M-14 -2 L-11 -30 H11 L14 -2 Z" fill="#b23a2c" stroke="#7d2419" strokeWidth="2" strokeLinejoin="round" />
      <path d="M-12 -22 H12" stroke="#7d2419" strokeWidth="1.4" opacity="0.6" />
      {/* scoops */}
      <circle cx="-5" cy="-34" r="9" fill="#ac7b40" />
      <circle cx="6" cy="-36" r="9" fill="#e4d3b6" />
      <circle cx="0.5" cy="-42" r="8.5" fill="#6e4f33" />
      {/* spoon */}
      <path d="M12 -52 L19 -30" stroke="#ac7b40" strokeWidth="3" strokeLinecap="round" />
      {/* label pill */}
      <g transform="translate(0,-64)">
        <rect x={-w / 2} y="-13" width={w} height="22" rx="11" fill="#2c595e" />
        <text x="0" y="2.5" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#f6efe1" fontFamily="'Hanken Grotesk', sans-serif" letterSpacing="0.02em">
          {label}
        </text>
      </g>
    </g>
  );
}

/* ---------- per-city layouts (viewBox 1000 × 680) ---------- */
const MAPS: Record<City, CityMap> = {
  Cosenza: {
    water: [
      // Crati + Busento meeting near the old town
      "M120 40 C 240 180, 300 300, 430 360 S 720 440, 980 470",
      "M260 660 C 320 540, 360 460, 430 360",
    ],
    parks: ["M70 470 q60 -34 120 -6 q26 64 -16 104 q-78 36 -120 -8 q-26 -60 16 -90Z"],
    places: [
      { glyph: "castle", x: 250, y: 250, label: "Castello Svevo", scale: 1.15 },
      { glyph: "duomo", x: 470, y: 250, label: "Duomo di Cosenza" },
      { glyph: "theatre", x: 660, y: 250, label: "Teatro Rendano" },
      { glyph: "archBridge", x: 800, y: 470, label: "Ponte di Calatrava", scale: 1.1 },
      { glyph: "villa", x: 160, y: 600, label: "Villa Vecchia" },
    ],
    pin: { x: 560, y: 470, label: "Corso Mazzini 120" },
  },
  Catanzaro: {
    water: ["M-20 250 C 160 230, 240 250, 360 360"],
    parks: [
      "M150 430 q70 -30 130 0 q30 70 -20 110 q-86 32 -126 -10 q-30 -64 16 -100Z",
      "M760 120 q60 -22 110 6 q22 56 -20 88 q-72 26 -104 -10 q-22 -50 14 -84Z",
    ],
    places: [
      { glyph: "archBridge", x: 230, y: 380, label: "Ponte Bisantis", scale: 1.25 },
      { glyph: "duomo", x: 540, y: 250, label: "Duomo" },
      { glyph: "theatre", x: 760, y: 250, label: "Teatro Politeama" },
      { glyph: "park", x: 815, y: 175, label: "Parco Biodiversità" },
      { glyph: "temple", x: 470, y: 520, label: "Piazza Matteotti" },
    ],
    pin: { x: 640, y: 470, label: "Via Milano 45" },
  },
  "Lamezia Terme": {
    water: ["M-20 520 C 200 500, 360 470, 560 500 S 860 540, 1020 510"],
    parks: ["M740 180 q66 -28 122 2 q26 62 -18 102 q-80 32 -120 -8 q-26 -58 16 -98Z"],
    places: [
      { glyph: "castle", x: 250, y: 250, label: "Castello Normanno", scale: 1.1 },
      { glyph: "spring", x: 470, y: 250, label: "Terme di Caronte", scale: 1.2 },
      { glyph: "duomo", x: 690, y: 250, label: "Duomo" },
      { glyph: "temple", x: 820, y: 470, label: "Piazza Mazzini" },
      { glyph: "church", x: 180, y: 470, label: "San Domenico" },
    ],
    pin: { x: 560, y: 470, label: "Via Marconi 28" },
  },
};

function PlaceMark({ p }: { p: Place }) {
  return (
    <g transform={`translate(${p.x},${p.y}) scale(${p.scale ?? 1})`}>
      <Glyph name={p.glyph} />
      <text
        x="0"
        y="20"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill={PETROL}
        fontFamily="'Hanken Grotesk', sans-serif"
        style={{ textTransform: "uppercase", letterSpacing: "0.04em" }}
      >
        {p.label}
      </text>
    </g>
  );
}

export function CartoonMap({ city, className }: { city: City; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const data = MAPS[city];

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const cones = svg.querySelectorAll<SVGGElement>("[data-cone]");
    const marks = svg.querySelectorAll<SVGGElement>("[data-mark]");
    if (prefersReducedMotion()) {
      gsap.set([...cones, ...marks], { opacity: 1, y: 0, scale: 1 });
      return;
    }
    const tl = gsap.timeline();
    tl.fromTo(marks, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: EASE.out });
    tl.fromTo(cones, { y: -28, scale: 0.4, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: EASE.back }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, [city]);

  return (
    <svg ref={svgRef} viewBox="0 0 1000 680" className={className} role="img" aria-label={`Mappa illustrata di ${city} con le botteghe Artigiano`}>
      {/* base */}
      <rect x="0" y="0" width="1000" height="680" rx="22" fill="#f3ead4" />

      {/* faint street grid */}
      <g stroke={INK_SOFT} strokeWidth="2" opacity="0.35" fill="none">
        <path d="M0 150 H1000 M0 300 H1000 M0 450 H1000 M0 600 H1000" />
        <path d="M180 0 V680 M380 0 V680 M560 0 V680 M740 0 V680 M880 0 V680" />
        <path d="M60 40 L 720 600" opacity="0.5" />
      </g>

      {/* parks */}
      {data.parks.map((d, i) => (
        <path key={`p${i}`} d={d} fill={PARK} opacity="0.55" />
      ))}

      {/* water */}
      {data.water.map((d, i) => (
        <path key={`w${i}`} d={d} fill="none" stroke={WATER} strokeWidth="14" strokeLinecap="round" opacity="0.7" />
      ))}

      {/* scattered blocks for texture */}
      <g fill={INK_SOFT} opacity="0.3">
        <rect x="330" y="150" width="22" height="22" rx="3" />
        <rect x="610" y="360" width="26" height="20" rx="3" />
        <rect x="150" y="360" width="22" height="26" rx="3" />
        <rect x="720" y="560" width="24" height="20" rx="3" />
      </g>

      {/* city name */}
      <text x="44" y="60" fontSize="30" fontWeight="500" fill={PETROL} fontFamily="'Fraunces', serif">
        {city}
      </text>

      {/* landmarks */}
      {data.places.map((p) => (
        <g key={p.label} data-mark>
          <PlaceMark p={p} />
        </g>
      ))}

      {/* the bottega */}
      <g transform={`translate(${data.pin.x},${data.pin.y})`}>
        <ConeCupPin label={data.pin.label} />
      </g>
    </svg>
  );
}
