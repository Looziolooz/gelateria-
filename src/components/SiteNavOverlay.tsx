"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ArrowUpRight, LayoutDashboard } from "lucide-react";
import { NAV, SOCIAL, COMPANY } from "@/lib/data";
import { BrandLogo } from "@/components/BrandLogo";
import { NewsletterForm } from "@/components/NewsletterForm";

const LINKS = [{ label: "Home", href: "/" }, ...NAV];

/**
 * Full-screen navigation overlay (the "menu a tendina"): petrolio canvas + film
 * grain, oversized Fraunces links that rise in with a stagger, and a left rail
 * with newsletter, social and legal. The admin entry lives discreetly in the
 * legal row (intentionally low-key). Esc closes; links close on navigate.
 */
export function SiteNavOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={`grain fixed inset-0 z-[70] bg-secondary text-cream transition-opacity duration-500 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* warm depth */}
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 85% 15%, rgba(172,123,64,0.18), transparent 60%)" }} />

      {/* top bar */}
      <div className="relative z-10 site-wrap flex items-center justify-between py-5">
        <Link href="/" onClick={onClose} aria-label="Artigiano — Home">
          <BrandLogo tone="light" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-cream/80 hover:text-cream transition-colors"
        >
          <X size={22} />
          <span className="core t-u text-[12px]" style={{ letterSpacing: "0.22em" }}>Chiudi</span>
        </button>
      </div>

      {/* body */}
      <div className="relative z-10 site-wrap h-[calc(100svh-160px)] grid lg:grid-cols-[minmax(0,360px)_1fr] gap-10 items-center overflow-y-auto py-6">
        {/* left rail */}
        <div className="order-2 lg:order-1">
          <p className="cormorant text-[30px] leading-none text-primary mb-2">dal 1978</p>
          <hr className="rule-gold mb-6 max-w-[180px]" />
          <p className="eyebrow !text-gold mb-3">Iscriviti alla newsletter</p>
          <div className="max-w-sm mb-8">
            <NewsletterForm variant="dark" />
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="h-10 w-10 rounded-full ring-1 ring-cream/25 grid place-items-center hover:bg-cream/10 transition-colors">
              <img src="/icons/icon-instagram-w.svg" alt="Instagram" className="h-5 w-5" />
            </a>
            <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="h-10 w-10 rounded-full ring-1 ring-cream/25 grid place-items-center hover:bg-cream/10 transition-colors">
              <img src="/icons/icon-fb-w.svg" alt="Facebook" className="h-5 w-5" />
            </a>
            {/* admin entry — present and findable, but understated (not a loud header CTA) */}
            <Link
              href="/admin"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-4 h-10 text-[12px] uppercase tracking-[0.16em] font-semibold text-cream/85 hover:border-primary hover:text-primary transition-colors"
            >
              <LayoutDashboard size={15} /> Gestionale
            </Link>
          </div>
          <div className="text-[12px] text-cream/55 leading-relaxed space-y-1">
            <p className="flex flex-wrap gap-x-4">
              <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cream transition-colors">Cookie Policy</a>
            </p>
            <p className="pt-2">©{COMPANY.year} — {COMPANY.legalName}</p>
            <p>{COMPANY.address} · {COMPANY.vat}</p>
          </div>
        </div>

        {/* big links */}
        <nav className="order-1 lg:order-2 flex flex-col items-start lg:items-end gap-1 lg:gap-2">
          {LINKS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`caviar t-u leading-[1.05] text-[clamp(40px,8vw,104px)] text-cream/90 hover:text-primary transition-[color,transform,opacity] duration-500 motion-reduce:transition-none ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              } motion-reduce:translate-y-0`}
              style={{ transitionDelay: open ? `${120 + i * 80}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/pickup"
            onClick={onClose}
            className={`btn-pill mt-8 transition-[transform,opacity] duration-500 motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            } motion-reduce:translate-y-0`}
            style={{ transitionDelay: open ? `${120 + LINKS.length * 80}ms` : "0ms" }}
          >
            Prenota il ritiro <ArrowUpRight size={16} />
          </Link>
        </nav>
      </div>
    </div>
  );
}
