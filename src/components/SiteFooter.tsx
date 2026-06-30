import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { SOCIAL, COMPANY } from "@/lib/data";
import { BrandLogo } from "@/components/BrandLogo";

// The newsletter sign-up lives only in the nav overlay (SiteNavOverlay), not in
// the footer — the footer is a brand sign-off.
export function SiteFooter() {
  return (
    <footer className="b-secondary c-white flex flex-col h-full">
      {/* Brand sign-off — grows to push legal+credit down */}
      <div className="site-wrap py-[70px] md:py-[90px] text-center flex-1 flex flex-col justify-center">
        <BrandLogo tone="light" className="items-center mb-4" />
        <div className="artdeco-frame inline-flex flex-col items-center mx-auto px-8 py-4 text-primary/70 mb-4">
          <p className="cormorant text-[28px] md:text-[34px] leading-none">dal 1978</p>
        </div>
        <hr className="rule-artdeco w-24 mx-auto" />
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/15">
        <div className="site-wrap py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[12px] text-white/65">
          <p className="caviar">
            ©{COMPANY.year} — {COMPANY.legalName}. {COMPANY.address}. {COMPANY.vat}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/admin" className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 text-cream/90 hover:bg-cream/20 transition-colors">
              <LayoutDashboard size={14} /> Gestionale
            </Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src="/icons/icon-instagram-w.svg" alt="Instagram" className="h-[18px] w-[18px]" />
            </a>
            <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <img src="/icons/icon-fb-w.svg" alt="Facebook" className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </div>
      {/* Credit bar — pinned to bottom */}
      <div className="border-t border-white/8">
        <div className="site-wrap py-3 text-center">
          <span className="caviar text-[11px] text-white/35">Website by {COMPANY.credit}</span>
        </div>
      </div>
    </footer>
  );
}
