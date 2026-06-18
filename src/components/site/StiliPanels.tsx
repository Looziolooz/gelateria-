import { STILI } from "@/lib/data";
import { Figure } from "@/components/site/Figure";

/**
 * The "stili di gelato" philosophy — each value gets its own full-viewport
 * editorial panel, alternating image side, with a giant Fraunces number, a
 * staggered text reveal and a parallax-drifting arch photo.
 */
export function StiliPanels() {
  return (
    <>
      {STILI.map((s, i) => {
        const imageLeft = i % 2 === 1;
        return (
          <section
            key={s.number}
            className="relative w-[100svw] h-[100svh] shrink-0 overflow-hidden b-back-1 c-secondary flex items-center"
          >
            {/* giant number watermark */}
            <span
              data-px={i % 2 === 0 ? "26" : "-26"}
              className="caviar pointer-events-none select-none absolute -z-0 top-[8%] right-[4%] leading-none text-primary/10 text-[34vw] lg:text-[20vw]"
            >
              {s.number}
            </span>

            <div className="relative z-10 w-full px-[5vw] grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-[1280px] mx-auto">
              {/* text */}
              <div
                data-reveal-stagger
                className={`flex flex-col ${imageLeft ? "lg:order-2" : "lg:order-1"}`}
              >
                <span data-reveal className="caviar fs-70 fs-m-40 c-primary t-lh-1 mb-2">
                  {s.number}
                </span>
                <span
                  data-reveal
                  className="eyebrow mb-4"
                >
                  {s.subtitle}
                </span>
                <h2 data-reveal className="title caviar text-[30px] md:text-[40px] lg:text-[46px] t-u t-lh-12 mb-5">
                  {s.title}
                </h2>
                <hr data-reveal className="rule-gold w-16 mb-5 not-prose" />
                <p data-reveal className="lead max-w-md opacity-90">
                  {s.body}
                </p>
              </div>

              {/* image — arch frame, parallax drift */}
              <div className={`${imageLeft ? "lg:order-1" : "lg:order-2"} flex items-center justify-center`}>
                <div
                  data-px={imageLeft ? "34" : "-34"}
                  className="relative w-[78%] max-w-[360px] will-change-transform"
                >
                  <Figure
                    src={s.image}
                    alt={s.title}
                    sizes="(max-width: 1024px) 78vw, 360px"
                    radius="180px"
                    className="w-full aspect-[3/4]"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
