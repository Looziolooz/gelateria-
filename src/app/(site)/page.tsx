import Link from "next/link";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { GelatoHero } from "@/components/site/GelatoHero";
import { StiliPanels } from "@/components/site/StiliPanels";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { HomeMapPanel } from "@/components/site/HomeMapPanel";
import { ParallaxController } from "@/components/site/ParallaxController";
import { Figure } from "@/components/site/Figure";
import { SiteFooter } from "@/components/SiteFooter";

const ICONS = [
  { icon: "/icons/icon-gluten.svg", title: "100% Gluten free", body: "Tutti i nostri prodotti sono senza glutine, realizzati con attenzione nei laboratori Artigiano." },
  { icon: "/icons/icon-vegan.svg", title: "Lactose-free e vegan", body: "Il gelato è condivisione: tantissime opzioni senza lattosio e alternative vegane." },
  { icon: "/icons/icon-natural.svg", title: "Produzione naturale", body: "Stagionalità e zero coloranti, conservanti o semilavorati industriali." },
];

export default function HomePage() {
  return (
    <HorizontalScroll>
      <ParallaxController />

      {/* 1 — HERO. Full-screen flavour slider: hand-held cone on a solid
            flavour-coloured field, oversized ghost name, ← → to change gusto,
            and a "Scorri" cue pointing to the next section. One panel. */}
      <section className="relative w-[100svw] h-[100svh] shrink-0 overflow-hidden">
        <GelatoHero />
      </section>

      {/* 2 — STILI DI GELATO (four editorial panels) */}
      <StiliPanels />

      {/* 3 — IL PROCESSO (horizontal photo timeline: .h-scroll gallery + filling rail) */}
      <ProcessTimeline />

      {/* 4 — VALORI + CTA + interior photo */}
      <section className="relative w-[100svw] h-[100svh] shrink-0 b-back-1 c-secondary flex items-center overflow-hidden">
        <div className="w-full px-[5vw] grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-[1280px] mx-auto">
          <div data-reveal-stagger>
            <p data-reveal className="eyebrow mb-3">Una dolce ossessione</p>
            <h2 data-reveal className="title caviar text-[30px] md:text-[42px] t-u t-lh-12 mb-6">
              Buono per davvero
            </h2>
            <ul className="space-y-5 mb-9">
              {ICONS.map((f) => (
                <li key={f.title} data-reveal className="flex items-start gap-4">
                  <img src={f.icon} alt="" aria-hidden className="h-12 w-12 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="core fs-16 t-u c-primary mb-1" style={{ letterSpacing: "0.06em" }}>{f.title}</h3>
                    <p className="caviar text-[15px] leading-relaxed opacity-80 max-w-sm">{f.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div data-reveal className="flex flex-wrap gap-3">
              <Link href="/pickup" className="btn-pill">Prenota il ritiro</Link>
              <a href="#" className="btn-pill btn-pill--brown">Libro degli Ingredienti</a>
            </div>
          </div>

          <div data-reveal className="hidden lg:flex items-center justify-center">
            <div data-px="-30" className="relative w-full max-w-[460px] will-change-transform">
              <Figure
                src="/images/shop/interior.webp"
                alt="L'interno della bottega Artigiano"
                sizes="(max-width: 1024px) 0px, 460px"
                radius="18px"
                className="w-full aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5 — VIENI A TROVARCI + map */}
      <section className="relative w-[100svw] h-[100svh] shrink-0 overflow-hidden">
        <HomeMapPanel />
      </section>

      {/* 6 — FOOTER panel (newsletter lives only in the nav overlay) */}
      <section className="relative w-[100svw] h-[100svh] shrink-0 flex items-center b-secondary">
        <div className="w-full">
          <SiteFooter />
        </div>
      </section>
    </HorizontalScroll>
  );
}
