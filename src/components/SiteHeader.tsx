"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SiteNavOverlay } from "@/components/SiteNavOverlay";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-sm shadow-[0_1px_0_rgba(106,63,36,0.12)]">
        <div className="site-wrap flex items-center justify-between gap-6 py-4 md:py-5">
          <Link href="/" className="shrink-0" aria-label="Artigiano Gelateria — Home">
            <BrandLogo tone="dark" />
          </Link>

          <div className="flex items-center gap-5 md:gap-8">
            <div className="hidden sm:flex items-center gap-1.5 text-[12px] uppercase tracking-[0.12em] font-semibold text-secondary">
              <span className="text-primary">it</span>
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
              className="inline-flex items-center gap-2.5 text-secondary hover:text-primary transition-colors"
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
