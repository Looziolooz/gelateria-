"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Clock, CheckCircle2, Banknote, IceCream, Sparkles } from "lucide-react";
import { BOOKINGS, euro, type Booking } from "@/lib/admin-data";
import { loadStoredBookings, BOOKINGS_EVENT } from "@/lib/bookings-store";
import { Card, KpiCard, StatusBadge } from "@/components/admin/ui";

const DEMO_TODAY = "2026-06-16";

export default function PrenotazioniPage() {
  // Bookings created from the public /pickup flow (localStorage). Loaded after
  // mount so SSR and the first client render agree (avoids hydration mismatch).
  const [live, setLive] = useState<Booking[]>([]);

  useEffect(() => {
    const sync = () => setLive(loadStoredBookings());
    sync();
    window.addEventListener(BOOKINGS_EVENT, sync); // same-tab writes
    window.addEventListener("storage", sync); // other tabs
    return () => {
      window.removeEventListener(BOOKINGS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const liveIds = useMemo(() => new Set(live.map((b) => b.id)), [live]);
  const all = useMemo(() => [...live, ...BOOKINGS], [live]);

  const kpis = useMemo(() => {
    // Count "today" as either the demo anchor or the real current day, so a
    // booking just made from /pickup always lifts the counters on any machine.
    const now = new Date();
    const realToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const isToday = (d: string) => d === DEMO_TODAY || d === realToday;
    const todayB = all.filter((b) => isToday(b.date) && b.status !== "Annullata");
    return {
      oggi: todayB.length,
      inAttesa: all.filter((b) => b.status === "Confermata" || b.status === "In preparazione").length,
      pronte: all.filter((b) => b.status === "Pronta").length,
      valoreOggi: todayB.reduce((s, b) => s + b.total, 0),
    };
  }, [all]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Prenotazioni oggi" value={String(kpis.oggi)} sub="ritiri in programma" icon={<CalendarCheck size={18} />} />
        <KpiCard label="Da preparare" value={String(kpis.inAttesa)} sub="confermate + in preparazione" icon={<Clock size={18} />} accent="secondary" />
        <KpiCard label="Pronte al ritiro" value={String(kpis.pronte)} sub="in attesa del cliente" icon={<CheckCircle2 size={18} />} accent="green" />
        <KpiCard label="Valore oggi" value={euro(kpis.valoreOggi)} sub="ritiri di oggi" icon={<Banknote size={18} />} />
      </div>

      <Card title="Prenotazioni pickup" subtitle="Ordini e ritiri dalla pagina /pickup · dati dimostrativi">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-secondary/50 border-b border-secondary/10">
                <th className="px-2 py-3 font-semibold">Codice</th>
                <th className="px-2 py-3 font-semibold">Cliente</th>
                <th className="px-2 py-3 font-semibold hidden md:table-cell">Gelateria</th>
                <th className="px-2 py-3 font-semibold">Formato</th>
                <th className="px-2 py-3 font-semibold hidden lg:table-cell">Gusti</th>
                <th className="px-2 py-3 font-semibold hidden sm:table-cell">Ritiro</th>
                <th className="px-2 py-3 font-semibold text-right">Totale</th>
                <th className="px-2 py-3 font-semibold">Stato</th>
              </tr>
            </thead>
            <tbody>
              {all.map((b) => {
                const isLive = liveIds.has(b.id);
                return (
                  <tr key={b.id} className={`border-b border-secondary/5 hover:bg-gold-soft/40 align-top ${isLive ? "bg-primary/5" : ""}`}>
                    <td className="px-2 py-3 font-semibold text-secondary whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        {b.id}
                        {isLive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary text-[10px] font-semibold px-1.5 py-0.5" title="Creata dalla pagina Pickup">
                            <Sparkles size={10} /> nuova
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="font-medium text-secondary">{b.customer}</div>
                      <div className="text-xs text-secondary/50">{b.phone}</div>
                    </td>
                    <td className="px-2 py-3 text-secondary/70 hidden md:table-cell whitespace-nowrap">{b.boutiqueLabel}</td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-secondary"><IceCream size={14} className="text-primary" /> {b.format}</span>
                    </td>
                    <td className="px-2 py-3 text-secondary/70 hidden lg:table-cell max-w-[280px]">{b.flavors.join(", ")}</td>
                    <td className="px-2 py-3 text-secondary/70 hidden sm:table-cell whitespace-nowrap">{b.date.slice(8)}/{b.date.slice(5, 7)} · {b.time}</td>
                    <td className="px-2 py-3 text-right font-semibold text-secondary whitespace-nowrap">{euro(b.total)}</td>
                    <td className="px-2 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="px-2 pt-4 text-xs text-secondary/50">
          {all.length} prenotazioni · {live.length} create dalla pagina Pickup in questa sessione
        </p>
      </Card>
    </div>
  );
}
