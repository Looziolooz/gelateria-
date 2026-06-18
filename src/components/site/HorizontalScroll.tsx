"use client";

import { useEffect, useRef, useState } from "react";

const EASING = 0.09;

/**
 * Lays children out as full-screen panels in a horizontal row and turns the
 * whole public page into a horizontal-scroll experience on EVERY device:
 *
 * - Pointer / wheel devices: vertical wheel + trackpad gestures are mapped to
 *   eased horizontal movement (locomotive-style), with no CSS snap so the
 *   2-viewport pinned hero can scrub freely.
 * - Touch devices: the track scrolls natively (swipe), with CSS scroll-snap
 *   (see globals.css) so panels settle intentionally.
 *
 * Accessibility: the track is a focusable labelled region with keyboard
 * navigation (←/→ and PageUp/PageDown move one panel, Home/End jump to the
 * extremes). When the user prefers reduced motion, eased travel is replaced by
 * an instant jump.
 */
export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [panelIndex, setPanelIndex] = useState(0);
  const [panelCount, setPanelCount] = useState(0);
  const [progress, setProgress] = useState(0);

  // Direct-child panels, in DOM order. Their offsetLeft drives both the active
  // dot and click-to-navigate, so the 2-viewport hero counts as ONE panel.
  const panels = () =>
    ref.current
      ? (Array.from(ref.current.children).filter(
          (c) => c instanceof HTMLElement && c.tagName === "SECTION"
        ) as HTMLElement[])
      : [];

  const updateIndicator = (el: HTMLElement) => {
    const ps = panels();
    setPanelCount(ps.length);
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0);
    const mid = el.scrollLeft + el.clientWidth / 2;
    let idx = 0;
    for (let i = 0; i < ps.length; i++) {
      if (ps[i].offsetLeft <= mid) idx = i;
    }
    setPanelIndex(idx);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let target = el.scrollLeft;
    let raf = 0;
    let running = false;

    const prefersReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      const cur = el.scrollLeft;
      const next = cur + (target - cur) * EASING;
      if (Math.abs(target - next) < 0.5) {
        el.scrollLeft = target;
        running = false;
      } else {
        el.scrollLeft = next;
      }
      if (running) raf = requestAnimationFrame(tick);
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
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const delta = e.deltaY;

      // Let nested horizontal galleries (.h-scroll) consume the gesture first.
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
      if ((delta > 0 && atEnd) || (delta < 0 && atStart)) return;
      e.preventDefault();
      target = Math.max(0, Math.min(max, target + delta));
      start();
    };

    const onKey = (e: KeyboardEvent) => {
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
      const page = el.clientWidth;
      let handled = true;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          target = Math.min(max, target + page);
          break;
        case "ArrowLeft":
        case "ArrowUp":
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

    const onScroll = () => updateIndicator(el);

    const onResize = () => {
      const max = el.scrollWidth - el.clientWidth;
      target = Math.max(0, Math.min(max, el.scrollLeft));
      updateIndicator(el);
    };

    updateIndicator(el);

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("keydown", onKey);
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    // Recount once layout + fonts settle (panel widths can shift).
    const settle = window.setTimeout(() => onResize(), 250);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(settle);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goToPanel = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const p = panels()[i];
    if (!p) return;
    el.scrollTo({ left: p.offsetLeft, behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={ref}
        role="region"
        aria-label="Sezioni della pagina — usa le frecce ← → per scorrere in orizzontale"
        tabIndex={0}
        className="hs-track h-[100svh] overflow-x-auto overflow-y-hidden flex flex-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-inset"
      >
        {children}
      </div>

      {/* Premium progress rail — gold fill + chapter dots. */}
      {panelCount > 1 && (
        <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none">
          <div className="flex items-center justify-center gap-2.5 pb-5 sm:pb-6">
            {Array.from({ length: panelCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPanel(i)}
                aria-label={`Vai alla sezione ${i + 1}`}
                aria-current={i === panelIndex ? "true" : undefined}
                className={`pointer-events-auto h-1.5 rounded-full cursor-pointer transition-all duration-500 ${
                  i === panelIndex
                    ? "w-8 bg-primary shadow-[0_0_12px_rgba(172,123,64,0.6)]"
                    : "w-1.5 bg-secondary/25 hover:bg-secondary/50"
                }`}
              />
            ))}
          </div>
          {/* hairline scroll-progress fill */}
          <div className="h-[2px] w-full bg-secondary/10">
            <div
              className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 origin-left"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>
      )}
    </>
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
    <section
      className={`relative w-[100svw] h-[100svh] shrink-0 overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}
