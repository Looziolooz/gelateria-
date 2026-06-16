"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/data";
import { BrandLogo } from "@/components/BrandLogo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Header stays solid everywhere (the homepage scrolls horizontally, so
  // window.scrollY never changes there and a transparent header couldn't recover).
  void isHome;
  const transparent = false;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-cream/95 backdrop-blur-sm",
        scrolled ? "shadow-[0_2px_14px_rgba(106,63,36,0.14)]" : "shadow-[0_1px_0_rgba(106,63,36,0.12)]"
      )}
    >
      <div className="site-wrap flex items-center justify-between gap-6 py-4 md:py-5">
        {/* Logo */}
        <Link href="/" className="shrink-0" aria-label="Artigiano Gelateria — Home">
          <BrandLogo tone="dark" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[13px] uppercase tracking-[0.12em] font-semibold transition-colors",
                  transparent ? "text-white/90 hover:text-white" : "text-secondary hover:text-primary",
                  active && !transparent && "text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Lang toggle + mobile button */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "hidden sm:flex items-center gap-1 text-[12px] uppercase tracking-[0.12em] font-semibold",
              transparent ? "text-white/90" : "text-secondary"
            )}
          >
            <span className="text-primary">it</span>
            <span className="opacity-40">/</span>
            <span className="opacity-70 hover:opacity-100 cursor-pointer">en</span>
          </div>
          <button
            type="button"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "lg:hidden grid place-items-center h-10 w-10 rounded-full transition-colors",
              transparent ? "text-white" : "text-secondary"
            )}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden bg-cream transition-[max-height] duration-300 ease-out",
          open ? "max-h-[80vh] border-t border-secondary/10" : "max-h-0"
        )}
      >
        <nav className="site-wrap flex flex-col py-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base uppercase tracking-[0.1em] font-semibold text-secondary border-b border-secondary/10 last:border-0 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-4 flex items-center gap-2 text-sm uppercase tracking-[0.12em] font-semibold text-secondary">
            <span className="text-primary">it</span>
            <span className="opacity-40">/</span>
            <span className="opacity-70">en</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
