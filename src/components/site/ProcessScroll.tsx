const STEPS = [
  { num: "01", title: "Materie prime", desc: "Ingredienti naturali, freschi e di stagione. Latte, panna, frutta — nient'altro." },
  { num: "02", title: "Lenta mantecazione", desc: "Aria incorporata naturalmente, senza emulsionanti: una consistenza vellutata." },
  { num: "03", title: "Tradizione italiana", desc: "Ricette tramandate, bilanciamento perfetto, rispetto dei tempi di maturazione." },
  { num: "04", title: "Passione artigiana", desc: "Ogni giorno, la stessa dedizione: ingredienti semplici trasformati in emozioni." },
];

/**
 * "Il processo" — a single cinematic panel (not four repetitive slides): the
 * four craft steps laid out as one numbered row, so the homepage stays tight
 * after the four gelato story panels.
 */
export function ProcessScroll() {
  return (
    <section
      className="grain relative w-[100svw] h-[100svh] shrink-0 overflow-y-auto flex items-center"
      style={{ background: "var(--color-bottega-2, #1f4348)" }}
    >
      {/* corner glows */}
      <span className="absolute top-0 right-0 w-80 h-80 opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle at 100% 0%, var(--color-primary, #ac7b40) 0%, transparent 70%)" }} />
      <span className="absolute bottom-0 left-0 w-96 h-96 opacity-[0.05] pointer-events-none" style={{ background: "radial-gradient(circle at 0% 100%, var(--color-cream, #f6efe1) 0%, transparent 70%)" }} />

      <div data-reveal-stagger className="relative z-10 w-full max-w-[1200px] mx-auto px-[6vw] py-24 lg:py-0">
        <p data-reveal className="eyebrow !text-primary mb-3">Dietro a ogni gusto</p>
        <h2 data-reveal className="caviar fs-70 fs-m-36 t-u t-lh-1 text-white mb-5">Il processo</h2>
        <hr data-reveal className="rule-gold w-16 mb-12" />

        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.num} data-reveal className="relative">
              <span className="caviar block text-[44px] leading-none text-primary/90 mb-3">{s.num}</span>
              <span className="block h-px w-10 bg-primary/40 mb-4" />
              <h3 className="caviar t-u text-[19px] md:text-[21px] text-white mb-2 t-lh-12">{s.title}</h3>
              <p className="caviar text-[14px] md:text-[15px] leading-relaxed text-white/70">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
