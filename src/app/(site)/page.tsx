import Link from "next/link";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { HeroSequence } from "@/components/site/HeroSequence";
import { StiliPanels } from "@/components/site/StiliPanels";
import { ProcessScroll } from "@/components/site/ProcessScroll";
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

      {/* 1 — HERO. The section is 2 viewports wide and the visual pins
            (sticky) for one viewport while the chocolate-pour scrubs, then it
            scrolls away to the story panels. */}
      <section className="relative w-[200svw] h-[100svh] shrink-0">
        <div className="grain sticky left-0 top-0 h-[100svh] w-[100svw] overflow-hidden bg-cream">
          <HeroSequence className="absolute inset-0 h-full w-full" />
          {/* Cream feather — the frame's own background is light, so we extend it
              edge-to-edge into the page: the chocolate scene dissolves into panna
              with no visible border, and the periphery (where upscaling shows) is
              hidden in cream. */}
          <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(120% 112% at 54% 42%, transparent 36%, #f6efe1 88%)" }} />
          <div aria-hidden className="absolute inset-x-0 top-0 h-[24%]" style={{ background: "linear-gradient(180deg, #f6efe1, transparent)" }} />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[34%]" style={{ background: "linear-gradient(0deg, #f6efe1 12%, transparent)" }} />
          {/* soft cream scrim behind the lower-left title for legibility */}
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to top right, rgba(246,239,225,0.94) 0%, rgba(246,239,225,0.45) 30%, transparent 56%)" }} />
        </div>
      </section>

      {/* 2 — STILI DI GELATO (four editorial panels) */}
      <StiliPanels />

      {/* 3 — IL PROCESSO (four cinematic dark panels) */}
      <ProcessScroll />

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
