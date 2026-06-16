import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Full-viewport hero matching gelatocrema.com: a background photo with a 10%
 * black overlay, a giant Caviar uppercase title pinned bottom-left, and a round
 * SCROLL badge in the bottom-right corner.
 */
export function Hero({
  eyebrow,
  title,
  image,
  priority = false,
}: {
  eyebrow: string;
  title: ReactNode;
  image: string;
  priority?: boolean;
}) {
  return (
    <section className="relative w-full h-[100svh] min-h-[600px] overflow-hidden">
      <Image src={image} alt="" fill priority={priority} className="object-cover object-center" sizes="100vw" />
      {/* overlay (original: black @ 10%) */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

      {/* title bottom-left */}
      <div className="absolute inset-0">
        <div className="site-wrap h-full flex flex-col justify-end pb-[14vh] md:pb-[12vh]">
          <p className="core c-white t-u fs-16 fs-m-12 mb-4" style={{ letterSpacing: "0.22em" }} data-reveal>
            {eyebrow}
          </p>
          <h1
            className="title caviar fs-120 fs-m-50 t-lh-1 t-u c-white max-w-[16ch]"
            data-reveal
            style={{ ["--reveal-delay" as string]: "80ms" }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* round SCROLL badge bottom-right */}
      <span className="absolute bottom-0 right-0 h-[120px] w-[120px] md:h-[140px] md:w-[140px] b-primary c-white flex flex-col items-center justify-center gap-1 caviar t-u f-w-600 text-[13px]">
        SCROLL
        <span className="block h-3 w-3 border-b-2 border-r-2 border-white rotate-45 -mt-0.5 animate-bounce" />
      </span>
    </section>
  );
}
