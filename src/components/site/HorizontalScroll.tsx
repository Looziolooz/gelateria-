"use client";

import { useEffect, useRef } from "react";

/**
 * Desktop: lays children out as full-screen panels in a row and maps vertical
 * wheel/trackpad gestures to horizontal movement (a horizontal-scroll
 * locomotive-style homepage). Releases at the ends so the page can still scroll
 * vertically to the footer. Mobile/tablet (<1024px): falls back to a normal
 * vertical stack.
 *
 * Accessibility: the track is a focusable labelled region with keyboard
 * navigation (←/→ and PageUp/PageDown move one panel, Home/End jump to the
 * extremes). When the user prefers reduced motion, the eased scroll is replaced
 * by an instant jump so there is no animated travel across the viewport.
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
    const prefersReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      // Reduced-motion: snap straight to the target, no animated travel.
      if (prefersReduced()) {
        el.scrollLeft = target;
        running = false;
        return;
      }
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

    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop()) return;
      // Don't hijack arrow/Home/End while typing in a form control.
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      )
        return;

      const max = el.scrollWidth - el.clientWidth;
      const page = el.clientWidth; // one panel = one viewport
      let handled = true;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
          target = Math.min(max, target + page);
          break;
        case "ArrowLeft":
        case "PageUp":
          target = Math.max(0, target - page);
          break;
        case "Home":
          target = 0;
          break;
        case "End":
          target = max;
          break;
        default:
          handled = false;
      }
      if (!handled) return;
      e.preventDefault();
      start();
    };

    const onResize = () => {
      const max = el.scrollWidth - el.clientWidth;
      target = Math.max(0, Math.min(max, el.scrollLeft));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Sezioni della pagina — usa le frecce ← → per scorrere in orizzontale"
      tabIndex={0}
      className="hs-track lg:h-[100svh] lg:overflow-x-auto lg:overflow-y-hidden lg:flex lg:flex-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-inset"
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
