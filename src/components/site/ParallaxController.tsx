"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Lightweight, axis-correct parallax for the horizontal track. Any element with
 * `data-px="<strength>"` drifts horizontally based on how far its centre sits
 * from the viewport centre, creating cinematic depth as panels cross the screen.
 * Driven by the track's scroll events (the JS-eased engine fires them every
 * frame while scrolling) — no idle rAF, and no ScrollTrigger positioning.
 *
 * Keep `data-px` on a WRAPPER, not on a `data-reveal` element — both write
 * `transform` and would clobber each other.
 */
export function ParallaxController() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const track = document.querySelector<HTMLElement>(".hs-track");
    let raf = 0;

    const update = () => {
      const vw = window.innerWidth || 1;
      document.querySelectorAll<HTMLElement>("[data-px]").forEach((el) => {
        const strength = parseFloat(el.dataset.px || "0");
        if (!strength) return;
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const rel = (center - vw / 2) / vw; // ~ -1 … 1
        el.style.transform = `translate3d(${(-rel * strength).toFixed(2)}px,0,0)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    const scroller: HTMLElement | Window = track ?? window;
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const settle = window.setTimeout(update, 300);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
