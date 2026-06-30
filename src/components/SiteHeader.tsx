"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteNavOverlay } from "@/components/SiteNavOverlay";
import { HS_TRACK_SELECTOR } from "@/lib/motion";

/** Perceived luminance (0 dark → 1 light) of a CSS `rgb()/rgba()` string. */
function luminance(color: string): number {
  const m = color.match(/[\d.]+/g);
  if (!m || m.length < 3) return 1;
  const [r, g, b] = m.map(Number);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // `light` → use cream/white header text (the panel under the bar is dark).
  // Seed by route (homepage opens on the dark hero) to avoid a first-paint
  // flash; the sampler below refines it on scroll.
  const [light, setLight] = useState(pathname === "/");

  // The bar is always transparent, so its text tone must follow whatever panel
  // currently sits under it. Sample the first non-transparent background just
  // below the header and flip the tone by its luminance — works on every route
  // and every panel with no per-panel tagging. (`elementsFromPoint` already
  // skips `pointer-events:none` scrims/grain, so we land on the real surface.)
  useEffect(() => {
    const sample = () => {
      const x = Math.round(window.innerWidth / 2);
      const y = 92;
      for (const el of document.elementsFromPoint(x, y)) {
        if (!(el instanceof HTMLElement)) continue;
        if (el.closest("[data-site-header]")) continue; // ignore the bar itself
        const bg = getComputedStyle(el).backgroundColor;
        const parts = bg.match(/[\d.]+/g);
        if (!parts) continue;
        const alpha = parts.length >= 4 ? Number(parts[3]) : 1;
        if (alpha < 0.3) continue; // see-through → keep looking underneath
        setLight(luminance(bg) < 0.5);
        return;
      }
      setLight(false);
    };

    const track = document.querySelector<HTMLElement>(HS_TRACK_SELECTOR);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sample);
    };
    raf = requestAnimationFrame(sample);
    track?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      track?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <>
      <header
        data-site-header
        className="fixed inset-x-0 top-0 z-50 bg-transparent transition-colors duration-300"
      >
        <div className="site-wrap flex items-center justify-between gap-6 py-4 md:py-5">
          <Link href="/" className="shrink-0" aria-label="Artigiano Gelateria — Home">
            <BrandLogo tone={light ? "light" : "dark"} />
          </Link>

          <div className="flex items-center gap-5 md:gap-8">
            <div
              className={`hidden sm:flex items-center gap-1.5 text-[12px] uppercase tracking-[0.12em] font-semibold transition-colors ${
                light ? "text-white" : "text-secondary"
              }`}
            >
              <span className={light ? "text-white" : "text-primary"}>it</span>
              <span className="opacity-40">/</span>
              <span className="opacity-70 hover:opacity-100 cursor-pointer">en</span>
            </div>
            <Link href="/pickup" className="btn-pill hidden sm:inline-flex !py-3 !px-7 !text-[12px] !tracking-[0.14em]">
              Prenota
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Apri il menu"
              className={`inline-flex items-center gap-2.5 transition-colors ${
                light ? "text-white hover:text-white/75" : "text-secondary hover:text-primary"
              }`}
            >
              <Menu size={22} />
              <span className="hidden sm:inline core t-u text-[12px] font-semibold" style={{ letterSpacing: "0.22em" }}>
                Naviga
              </span>
            </button>
          </div>
        </div>
      </header>

      <SiteNavOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
