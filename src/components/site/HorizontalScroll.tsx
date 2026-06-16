"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop: lays children out as full-screen panels in a row and maps vertical
 * wheel/trackpad gestures to horizontal movement (maps vertical wheel to horizontal
 * locomotive-scroll horizontal homepage). Releases at the ends so the page can
 * still scroll vertically to the footer. Mobile/tablet (<1024px): falls back to
 * a normal vertical stack.
 */
export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let target = el.scrollLeft;
    let raf = 0;
    let running = false;

    const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

    const tick = () => {
      const cur = el.scrollLeft;
      const next = cur + (target - cur) * 0.12;
      if (Math.abs(target - next) < 0.5) {
        el.scrollLeft = target;
        running = false;
        return;
      }
      el.scrollLeft = next;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!isDesktop()) return;
      // Honour real horizontal gestures untouched.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const delta = e.deltaY;

      // Nested horizontal slider under the pointer (e.g. the story gallery):
      // scroll IT first — wheeling moves its scrollbar through every image
      // until the last one, then the page scroll takes over.
      let node = e.target as HTMLElement | null;
      while (node && node !== el) {
        if (node.classList && node.classList.contains("h-scroll")) {
          const nmax = node.scrollWidth - node.clientWidth;
          if (nmax > 4) {
            const natEnd = node.scrollLeft >= nmax - 1;
            const natStart = node.scrollLeft <= 0;
            if ((delta > 0 && !natEnd) || (delta < 0 && !natStart)) {
              e.preventDefault();
              node.scrollLeft = Math.max(0, Math.min(nmax, node.scrollLeft + delta));
              return;
            }
          }
        }
        node = node.parentElement;
      }

      const max = el.scrollWidth - el.clientWidth;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= max - 1;
      // At the extremes, let the wheel scroll the page vertically (to footer / up).
      if ((delta > 0 && atEnd) || (delta < 0 && atStart)) return;
      e.preventDefault();
      target = Math.max(0, Math.min(max, target + delta));
      start();
    };

    const onResize = () => {
      const max = el.scrollWidth - el.clientWidth;
      target = Math.max(0, Math.min(max, el.scrollLeft));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="hs-track lg:h-[100svh] lg:overflow-x-auto lg:overflow-y-hidden lg:flex lg:flex-nowrap"
    >
      {children}
    </div>
  );
}

/** A single full-screen panel. */
export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative w-full lg:w-screen lg:h-[100svh] lg:shrink-0 overflow-hidden ${className}`}>
      {children}
    </section>
  );
}
