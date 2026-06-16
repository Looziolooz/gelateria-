import type { City } from "@/lib/data";

interface Pin {
  x: number;
  y: number;
  label: string;
}

// Hand-placed pins on a 600×440 stylised map (one layout per city).
const PINS: Record<City, Pin[]> = {
  Milano: [
    { x: 215, y: 150, label: "Fiori Chiari" },
    { x: 140, y: 270, label: "Da Procida" },
    { x: 360, y: 230, label: "Piazza Napoli" },
  ],
  Roma: [
    { x: 250, y: 180, label: "Via Giulia" },
    { x: 380, y: 280, label: "Leone IV" },
  ],
};

function ConePin({ x, y, label }: Pin) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* shadow */}
      <ellipse cx="0" cy="2" rx="13" ry="4" fill="rgba(42,38,32,0.18)" />
      {/* cone */}
      <path d="M0 0 L-9 -22 L9 -22 Z" fill="#c69a5e" stroke="#8a5a36" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M-5 -22 L5 -22 M-2.5 -16 L2.5 -16" stroke="#8a5a36" strokeWidth="1" />
      {/* scoops */}
      <circle cx="-3.5" cy="-27" r="7.5" fill="#ee9bb0" />
      <circle cx="4" cy="-29" r="7.5" fill="#a7b06a" />
      <circle cx="0.5" cy="-34" r="7" fill="#b07d4f" />
      {/* label pill */}
      <g transform="translate(0,-50)">
        <rect x={-label.length * 3.6 - 8} y="-11" width={label.length * 7.2 + 16} height="20" rx="10" fill="#2c595e" />
        <text x="0" y="3.5" textAnchor="middle" fontSize="11" fontWeight="600" fill="#f6efe1" fontFamily="'Hanken Grotesk', sans-serif">
          {label}
        </text>
      </g>
    </g>
  );
}

/** Playful illustrated (cartoon) city map in the bottega palette. */
export function CartoonMap({ city, className }: { city: City; className?: string }) {
  const pins = PINS[city];
  return (
    <svg viewBox="0 0 600 440" className={className} role="img" aria-label={`Mappa illustrata di ${city}`}>
      {/* base */}
      <rect x="0" y="0" width="600" height="440" rx="20" fill="#f3ead4" />
      {/* parks */}
      <path d="M60 60 q40 -20 80 0 q20 40 -10 70 q-50 25 -80 -5 q-20 -40 10 -65Z" fill="#b9c4a3" opacity="0.8" />
      <ellipse cx="470" cy="120" rx="70" ry="48" fill="#b9c4a3" opacity="0.7" />
      <path d="M430 330 q50 -10 90 25 q-10 45 -60 50 q-55 0 -55 -45 q5 -25 25 -30Z" fill="#b9c4a3" opacity="0.7" />
      {/* river */}
      <path d="M-20 100 C 120 160, 180 120, 300 200 S 520 300, 640 280" fill="none" stroke="#9fc0c4" strokeWidth="16" strokeLinecap="round" opacity="0.7" />
      {/* streets */}
      <g stroke="#d8c39c" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M30 200 H 570" />
        <path d="M30 320 H 570" />
        <path d="M180 30 V 410" />
        <path d="M330 30 V 410" />
        <path d="M460 30 V 410" />
        <path d="M60 60 L 540 380" opacity="0.5" />
      </g>
      <g stroke="#e7d6ad" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M30 140 H 570" />
        <path d="M30 260 H 570" />
        <path d="M30 380 H 570" />
        <path d="M110 30 V 410" />
        <path d="M255 30 V 410" />
        <path d="M400 30 V 410" />
        <path d="M520 30 V 410" />
      </g>
      {/* little buildings */}
      <g fill="#e3cfa3" opacity="0.9">
        <rect x="200" y="155" width="26" height="26" rx="4" />
        <rect x="300" y="280" width="30" height="22" rx="4" />
        <rect x="430" y="180" width="24" height="30" rx="4" />
        <rect x="120" y="330" width="28" height="24" rx="4" />
      </g>
      {/* city name */}
      <text x="40" y="420" fontSize="22" fontWeight="500" fill="#2c595e" fontFamily="'Fraunces', serif">
        {city}
      </text>
      {/* pins */}
      {pins.map((p) => (
        <ConePin key={p.label} {...p} />
      ))}
    </svg>
  );
}
