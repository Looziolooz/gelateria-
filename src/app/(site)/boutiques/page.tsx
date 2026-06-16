import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Phone, ShoppingBag } from "lucide-react";
import { BOUTIQUES } from "@/lib/data";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { HomeMapPanel } from "@/components/site/HomeMapPanel";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Boutiques",
  description: "Le boutique Artigiano a Milano e Roma: un viaggio tra sapore e tradizione.",
};

export default function BoutiquesPage() {
  return (
    <HorizontalScroll>
      {/* 1 — HERO */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 h-[100svh] overflow-hidden">
        <Image src="/images/shop/shop1.webp" alt="" fill priority className="object-cover" sizes="100vw" quality={94} />
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-[5vw] pb-[16vh]">
          <p className="core c-white t-u fs-16 fs-m-12 mb-4" style={{ letterSpacing: "0.22em" }}>Vieni a scoprire Artigiano</p>
          <h1 className="title caviar fs-120 fs-m-50 t-lh-1 t-u c-white">Le boutique del gusto</h1>
        </div>
        <span className="absolute bottom-0 right-0 h-[120px] w-[120px] md:h-[150px] md:w-[150px] b-primary c-white flex flex-col items-center justify-center gap-1 caviar t-u f-w-600 text-[13px]">
          SCROLL
          <span className="block h-3 w-3 border-b-2 border-r-2 border-white rotate-45 -mt-0.5 animate-bounce" />
        </span>
      </section>

      {/* 2 — INTRO */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 b-back-1 c-secondary overflow-hidden flex items-center">
        <div className="w-full grid lg:grid-cols-2 gap-10 items-center pt-28 lg:pt-24 pb-12 px-[5vw]">
          <div>
            <h2 className="title caviar fs-70 fs-m-40 t-u t-lh-12 mb-7">Un viaggio tra<br />sapore e tradizione</h2>
            <p className="caviar text-[16px] md:text-[18px] leading-relaxed opacity-90 max-w-xl">
              Entra in una boutique Artigiano e lascia che i tuoi sensi ti trasportino in un&apos;altra epoca.
              Il profumo e la bontà dell&apos;alta gelateria di un tempo, il cortese benvenuto del nostro
              staff, i colori e le romantiche suggestioni di una location arricchita da preziosi dettagli.
              Tocca con mano il nostro sogno, vieni ad assaporare il gelato Artigiano lì dove nasce con cura e passione.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-[16px] overflow-hidden shadow-lg mt-8">
              <Image src="/images/shop/interior.webp" alt="Interno boutique Artigiano" fill className="object-cover" sizes="25vw" quality={94} />
            </div>
            <div className="relative aspect-[3/4] rounded-[16px] overflow-hidden shadow-lg">
              <Image src="/images/shop/shop2.webp" alt="Packaging Artigiano" fill className="object-cover" sizes="25vw" quality={94} />
            </div>
          </div>
        </div>
      </section>

      {/* 3..7 — one panel per boutique */}
      {BOUTIQUES.map((b) => (
        <section key={b.id} className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 b-back-1 c-secondary overflow-hidden flex items-stretch">
          <div className="w-full grid lg:grid-cols-[1.25fr_1fr] gap-0 lg:gap-10 items-stretch">
            <div className="relative min-h-[42vh] lg:min-h-0 order-1">
              <Image src={b.image} alt={b.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 55vw" quality={94} />
            </div>
            <div className="order-2 flex flex-col justify-center pt-10 lg:pt-24 pb-12 px-[5vw] lg:pl-0 lg:pr-[5vw]">
              <p className="core c-primary t-u fs-16 mb-3" style={{ letterSpacing: "0.14em" }}>{b.city}</p>
              <h2 className="title caviar fs-60 fs-m-30 t-u t-lh-1 mb-6">{b.name}</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 caviar c-primary fs-16 f-w-600 mb-6">
                <a href={b.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">Come arrivare <ArrowUpRight size={14} /></a>
              </div>
              <p className="flex items-center gap-2 caviar text-[15px] opacity-80 mb-1.5"><Clock size={16} className="c-primary" /> {b.hoursLabel}</p>
              <p className="flex items-center gap-2 caviar text-[15px] opacity-80 mb-8"><Phone size={16} className="c-primary" /> <a href={`tel:${b.phoneHref}`}>{b.phone}</a></p>
              <Link href="/pickup" className="caviar b-primary c-white t-u inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold hover:opacity-90">
                <ShoppingBag size={16} /> Ordina e ritira
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* 8 — VIENI A TROVARCI + map */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 overflow-hidden">
        <HomeMapPanel />
      </section>

      {/* 9 — FOOTER */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 flex items-center b-secondary">
        <div className="w-full"><SiteFooter /></div>
      </section>
    </HorizontalScroll>
  );
}
