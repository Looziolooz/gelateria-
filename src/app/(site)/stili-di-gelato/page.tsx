import type { Metadata } from "next";
import Image from "next/image";
import { STILI } from "@/lib/data";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { HomeMapPanel } from "@/components/site/HomeMapPanel";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Stili di gelato",
  description: "Più di 50 storie di gusto: gli stili dell'alta gelateria artigianale.",
};

export default function StiliPage() {
  return (
    <HorizontalScroll>
      {/* 1 — HERO */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 h-[100svh] overflow-hidden">
        <Image src="/images/shop/interior.png" alt="" fill priority className="object-cover" sizes="100vw" quality={94} />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-[5vw] pb-[16vh]">
          <p className="core c-white t-u fs-16 fs-m-12 mb-4" style={{ letterSpacing: "0.22em" }}>Più di 50 storie di gusto</p>
          <h1 className="title caviar fs-120 fs-m-50 t-lh-1 t-u c-white">Gli stili di gelato</h1>
        </div>
        <span className="absolute bottom-0 right-0 h-[120px] w-[120px] md:h-[150px] md:w-[150px] b-primary c-white flex flex-col items-center justify-center gap-1 caviar t-u f-w-600 text-[13px]">
          SCROLL
          <span className="block h-3 w-3 border-b-2 border-r-2 border-white rotate-45 -mt-0.5 animate-bounce" />
        </span>
      </section>

      {/* 2 — STYLES (numbered, with oval media, horizontal) */}
      <section className="relative w-full lg:w-auto lg:h-[100svh] lg:shrink-0 b-back-1 c-secondary pt-28 lg:pt-0 pb-12 lg:pb-0 lg:flex lg:flex-row lg:items-center lg:gap-12 px-[5vw] lg:px-0">
        {STILI.map((s, i) => (
          <div key={s.number} className="lg:contents">
            <div className="lg:shrink-0 lg:w-[360px] flex flex-col lg:justify-center lg:pl-[5vw] mb-8 lg:mb-0">
              <span className="caviar fs-70 fs-m-40 c-primary t-lh-1 mb-3 block">{s.number}</span>
              <h2 className="title caviar text-[26px] md:text-[32px] t-u t-lh-12 mb-3">{s.title}</h2>
              <p className="core fs-16 c-primary t-u mb-4" style={{ letterSpacing: "0.08em" }}>{s.subtitle}</p>
              <p className="caviar text-[15px] leading-relaxed opacity-80 max-w-sm">{s.body}</p>
            </div>
            <div className="lg:shrink-0 relative w-full lg:w-[330px] aspect-[3/4] lg:aspect-auto lg:h-[68vh] rounded-[200px] overflow-hidden shadow-xl mb-12 lg:mb-0 lg:last:mr-[5vw]">
              <Image src={s.image} alt={s.title} fill className="object-cover" sizes="330px" quality={94} />
            </div>
          </div>
        ))}
      </section>

      {/* 3 — VIENI A TROVARCI + map */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 overflow-hidden">
        <HomeMapPanel />
      </section>

      {/* 4 — FOOTER */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 flex items-center b-secondary">
        <div className="w-full"><SiteFooter /></div>
      </section>
    </HorizontalScroll>
  );
}
