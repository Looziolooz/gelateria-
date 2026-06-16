import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { SOCIAL, COMPANY } from "@/lib/data";
import { NewsletterForm } from "@/components/NewsletterForm";
import { BrandLogo } from "@/components/BrandLogo";

export function SiteFooter() {
  return (
    <footer className="b-secondary c-white">
      {/* Newsletter */}
      <div className="site-wrap py-[70px] md:py-[90px] text-center">
        <BrandLogo tone="light" className="items-center mb-8" />
        <p className="claim core fs-16 fs-m-12 c-white mb-6 t-u" style={{ letterSpacing: "0.14em" }}>
          Iscriviti alla newsletter
        </p>
        <div className="mx-auto max-w-md">
          <NewsletterForm variant="dark" />
        </div>
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
          <span className="caviar text-white/45">Website by {COMPANY.credit}</span>
        </div>
      </div>
    </footer>
  );
}
