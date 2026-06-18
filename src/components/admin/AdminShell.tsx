"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ClipboardList, Boxes, TrendingUp, CalendarDays, CalendarCheck,
  LogOut, Menu, X, ExternalLink,
} from "lucide-react";
import { ConeGlyph } from "@/components/icons";
import { logout, getSession } from "@/lib/admin-auth";
import { useAdminScope } from "@/components/admin/AdminScope";
import { BOUTIQUE_IDS, BOUTIQUE_META, type BoutiqueScope } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/prenotazioni", label: "Prenotazioni", icon: CalendarCheck },
  { href: "/admin/ordini", label: "Ordini", icon: ClipboardList },
  { href: "/admin/merce", label: "Merce & Magazzino", icon: Boxes },
  { href: "/admin/fatturato", label: "Fatturato", icon: TrendingUp },
  { href: "/admin/calendario", label: "Calendario", icon: CalendarDays },
];

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/prenotazioni": "Prenotazioni Pickup",
  "/admin/ordini": "Ordini",
  "/admin/merce": "Merce & Magazzino",
  "/admin/fatturato": "Fatturato",
  "/admin/calendario": "Calendario",
};

function ScopeSwitcher() {
  const { scope, setScope } = useAdminScope();
  const opts: { id: BoutiqueScope; label: string }[] = [
    { id: "all", label: "Tutte" },
    ...BOUTIQUE_IDS.map((id) => ({ id, label: BOUTIQUE_META[id].city })),
  ];
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto rounded-full bg-secondary/5 p-1 ring-1 ring-secondary/10">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => setScope(o.id)}
          aria-pressed={scope === o.id}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors",
            scope === o.id ? "bg-primary text-white shadow-sm" : "text-secondary/70 hover:text-secondary hover:bg-secondary/5"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const session = getSession();
  const title = TITLES[pathname] ?? "Dashboard";

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f0e4] text-secondary">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-secondary text-cream flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 px-6 h-20 border-b border-cream/10">
          <ConeGlyph className="h-8 w-8 text-cream shrink-0" />
          <div className="leading-tight">
            <p className="caviar font-medium text-[19px]">Artigiano</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Gelateria · CRM</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-primary text-white" : "text-cream/75 hover:bg-cream/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/70 hover:bg-cream/10 hover:text-white"
          >
            <ExternalLink size={18} /> Vai al sito
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/70 hover:bg-cream/10 hover:text-white"
          >
            <LogOut size={18} /> Esci
          </button>
        </div>
      </aside>

      {/* Backdrop on mobile */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-[#f4f0e4]/90 backdrop-blur border-b border-secondary/10 px-5 md:px-8">
          <div className="h-20 flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Apri menu">
              <Menu size={22} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-semibold text-secondary truncate">{title}</h1>
              <p className="text-xs text-secondary/55">Pannello di controllo · dati dimostrativi</p>
            </div>
            <div className="hidden md:block"><ScopeSwitcher /></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-secondary leading-tight">{session?.name ?? "Demo"}</p>
                <p className="text-[11px] text-secondary/55">{session?.role ?? "Manager"}</p>
              </div>
              <div className="grid place-items-center h-10 w-10 rounded-full bg-primary text-white font-semibold">
                {(session?.name ?? "D").slice(0, 1)}
              </div>
            </div>
          </div>
          {/* scope switcher — own row on small screens */}
          <div className="md:hidden pb-3"><ScopeSwitcher /></div>
        </header>

        <main className="px-5 md:px-8 py-7">{children}</main>
      </div>

      {/* close icon helper for mobile (visual parity) */}
      {open && (
        <button
          className="fixed top-6 right-6 z-50 text-cream lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Chiudi menu"
        >
          <X size={24} />
        </button>
      )}
    </div>
  );
}
