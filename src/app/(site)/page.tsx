import Link from "next/link";
import Image from "next/image";
import { HorizontalScroll } from "@/components/site/HorizontalScroll";
import { HeroSequence } from "@/components/site/HeroSequence";
import { HomeBoutiquesPanel } from "@/components/site/HomeBoutiquesPanel";
import { HomeMapPanel } from "@/components/site/HomeMapPanel";
import { SiteFooter } from "@/components/SiteFooter";

const GELATI = [
  "/images/gusti/pistacchio.png",
  "/images/gusti/nocciola.png",
  "/images/gusti/stracciatella.png",
  "/images/gusti/fragola.png",
  "/images/gusti/zabaione.png",
  "/images/gusti/stracciatella-board.png",
];

const ICONS = [
  { icon: "/icons/icon-gluten.svg", title: "100% Gluten free", body: "Tutti i nostri prodotti sono senza glutine, realizzati con attenzione nei laboratori Artigiano." },
  { icon: "/icons/icon-vegan.svg", title: "Opzioni Lactose-free e vegan", body: "Il gelato è condivisione: abbiamo tantissime opzioni senza lattosio e alternative vegane." },
  { icon: "/icons/icon-natural.svg", title: "Produzione NATURALE", body: "Artigiano è attenzione alla stagionalità e zero coloranti, conservanti e semilavorati industriali." },
];

export default function HomePage() {
  return (
    <HorizontalScroll>
      {/* 1 — HERO (scroll-driven frame sequence) */}
      <section
        className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 h-[100svh] overflow-hidden bg-[#1c1510] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-frames/ezgif-frame-001.jpg)" }}
      >
        <HeroSequence className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-[5vw] pb-[16vh]">
          <p className="core c-white t-u fs-16 fs-m-12 mb-4" style={{ letterSpacing: "0.22em" }}>Artigiano Gelateria</p>
          <h1 className="title caviar fs-120 fs-m-50 t-lh-1 t-u c-white">Gelato per amore</h1>
        </div>
        <span className="absolute bottom-0 right-0 h-[120px] w-[120px] md:h-[150px] md:w-[150px] b-primary c-white flex flex-col items-center justify-center gap-1 caviar t-u f-w-600 text-[13px]">
          SCROLL
          <span className="block h-3 w-3 border-b-2 border-r-2 border-white rotate-45 -mt-0.5 animate-bounce" />
        </span>
      </section>

      {/* 2 — STORY + gelato gallery (part of the horizontal page scroll) */}
      <section className="relative w-full lg:w-auto lg:h-[100svh] lg:shrink-0 b-back-1 c-secondary pt-28 lg:pt-0 pb-10 lg:pb-0 lg:flex lg:flex-row lg:items-center lg:gap-7">
        <div className="px-[5vw] lg:pl-[5vw] lg:pr-2 lg:w-[420px] lg:shrink-0 flex flex-col lg:justify-center mb-8 lg:mb-0">
          <h2 className="title caviar fs-60 fs-m-30 t-lh-1 t-u mb-6">Il gelato:<br />una storia d&apos;amore</h2>
          <p className="caviar text-[18px] md:text-[20px] leading-relaxed opacity-90 mb-8">
            Amore per la qualità, per la tradizione, per la ricercatezza di ingredienti e lavorazioni.
          </p>
          <div className="flex items-start gap-4">
            <Image src="/images/home/premio_3_coni.png" alt="Tre coni Gambero Rosso" width={120} height={120} className="w-[78px] h-auto shrink-0" />
            <p className="caviar text-[13px] md:text-[14px] leading-relaxed opacity-80">
              L&apos;eccellenza del gelato Artigiano è stata premiata con 3 coni Gambero Rosso, il più
              alto riconoscimento dedicato all&apos;arte della gelateria italiana e alla sua continua innovazione.
            </p>
          </div>
        </div>
        {/* On desktop `lg:contents` dissolves this wrapper so the landscape
            tiles join the panel's flex row and scroll WITH the horizontal page
            scroll. On mobile it stays a touch-scroll strip. */}
        <div className="flex gap-5 overflow-x-auto h-scroll px-[5vw] pb-4 lg:contents">
          {GELATI.map((src, i) => (
            <div key={i} className="relative shrink-0 w-72 sm:w-80 aspect-[4/3] lg:w-[500px] lg:aspect-[3/2] rounded-[16px] overflow-hidden bg-white shadow-md lg:last:mr-[5vw]">
              <Image src={src} alt="Gusto di gelato Artigiano" fill className="object-cover" sizes="(max-width:1024px) 80vw, 500px" quality={92} />
            </div>
          ))}
        </div>
      </section>

      {/* 3 — BOUTIQUES */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 overflow-hidden">
        <HomeBoutiquesPanel />
      </section>

      {/* 4 — STYLES (orange) */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 b-primary c-white overflow-hidden flex items-center">
        <div className="w-full grid lg:grid-cols-2 gap-10 items-center pt-28 lg:pt-24 pb-12 px-[5vw]">
          <div>
            <h2 className="main-title caviar fs-130 fs-m-50 t-u t-lh-1 mb-6">Il gelato Artigiano<br />un&apos;icona italiana</h2>
            <div className="grid grid-cols-2 gap-4 max-w-lg mb-8 caviar text-[16px] md:text-[19px] t-u f-w-600">
              <p>Una storia di bontà e di eccellenza</p>
              <p>Amore… al primo assaggio</p>
            </div>
            <p className="caviar text-[15px] md:text-[17px] leading-relaxed max-w-xl opacity-95 mb-8">
              Oltre 50 gusti, che amiamo definire “stili” di gelato, realizzati ad arte con materie prime
              di altissima qualità, strumenti della tradizione e una minuziosa attenzione verso i
              particolari e le esigenze della clientela.
            </p>
            <Link href="/stili-di-gelato" className="caviar t-u inline-flex items-center gap-2 bg-white c-primary rounded-full px-8 py-3.5 text-[14px] font-semibold hover:bg-cream transition-colors">
              Stili di gelato
            </Link>
          </div>
          <div className="relative hidden lg:block h-[70vh]">
            <Image src="/images/shop/maestro.png" alt="Gelato Artigiano" fill className="object-cover rounded-[18px]" sizes="45vw" />
            <Image src="/images/home/cono.png" alt="" width={260} height={260} className="absolute -bottom-6 -left-10 w-44 h-auto rotate-[8deg] drop-shadow-2xl" />
            <Image src="/images/home/coffee.png" alt="" width={200} height={200} className="absolute -top-6 -right-6 w-28 h-auto -rotate-6 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* 5 — ICONS */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 b-back-1 c-secondary overflow-hidden flex items-center">
        <div className="w-full pt-28 lg:pt-24 pb-12 px-[5vw]">
          <div className="grid gap-10 md:grid-cols-3 mb-12 text-center max-w-5xl mx-auto">
            {ICONS.map((f) => (
              <div key={f.title} className="flex flex-col items-center">
                <img src={f.icon} alt="" className="h-[76px] w-[76px] mb-5" />
                <h3 className="core fs-16 t-u c-primary mb-2.5" style={{ letterSpacing: "0.08em" }}>{f.title}</h3>
                <p className="caviar text-[15px] leading-relaxed opacity-80 max-w-xs">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-8">
            <a href="#" className="caviar b-primary c-white t-u inline-flex items-center rounded-full px-7 py-3 text-[14px] font-semibold hover:opacity-90">Libro degli Ingredienti</a>
            <div className="relative w-full max-w-5xl aspect-[21/7] rounded-[16px] overflow-hidden shadow-lg">
              <Image src="/images/shop/interior.png" alt="Coni di gelato Artigiano" fill className="object-cover" sizes="90vw" />
            </div>
          </div>
        </div>
      </section>

      {/* 6 — VIENI A TROVARCI + map */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 overflow-hidden">
        <HomeMapPanel />
      </section>

      {/* 7 — FOOTER panel */}
      <section className="relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 flex items-center b-secondary">
        <div className="w-full">
          <SiteFooter />
        </div>
      </section>
    </HorizontalScroll>
  );
}
