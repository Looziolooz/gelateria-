"use client";

import { CalendarDays, ShoppingBag, Banknote, Star } from "lucide-react";
import { getCalendar, euro, type CalendarEvent } from "@/lib/admin-data";
import { useAdminScope } from "@/components/admin/AdminScope";
import { Card, KpiCard } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const WEEK = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const TODAY = 16;
const DAYS_IN_MONTH = 30; // June 2026
const LEADING_BLANKS = 0; // June 1, 2026 is a Monday

export default function CalendarioPage() {
  const { scope } = useAdminScope();
  const calendar = getCalendar(scope);

  const byDay = new Map<number, CalendarEvent>();
  for (const ev of calendar) {
    const day = Number(ev.date.slice(8, 10));
    byDay.set(day, ev);
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: LEADING_BLANKS }, () => null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];

  const weekPickups = calendar.filter((e) => {
    const d = Number(e.date.slice(8, 10));
    return d >= 15 && d <= 21;
  }).reduce((s, e) => s + e.pickups, 0);
  const busiest = [...calendar].sort((a, b) => b.pickups - a.pickups)[0];
  const events = calendar.filter((e) => e.note && e.note !== "Oggi");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Pickup questa settimana" value={String(weekPickups)} sub="15 – 21 giugno" icon={<ShoppingBag size={18} />} />
        <KpiCard label="Giorno più affollato" value={`${Number(busiest.date.slice(8, 10))} giu`} sub={`${busiest.pickups} pickup`} icon={<Star size={18} />} accent="secondary" />
        <KpiCard label="Incasso pickup settimana" value={euro(calendar.filter((e) => { const d = Number(e.date.slice(8,10)); return d >= 15 && d <= 21; }).reduce((s, e) => s + e.revenue, 0))} sub="da ritiri" icon={<Banknote size={18} />} accent="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card title="Giugno 2026" subtitle="Ritiri programmati per giorno" className="lg:col-span-2">
          <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
            {WEEK.map((w) => (
              <div key={w} className="text-[11px] font-semibold uppercase tracking-wide text-secondary/45 py-1">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, idx) => {
              if (day === null) return <div key={`b${idx}`} />;
              const ev = byDay.get(day);
              const isToday = day === TODAY;
              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square rounded-xl p-1.5 flex flex-col ring-1 transition-colors",
                    isToday ? "ring-primary bg-primary/5" : "ring-secondary/10",
                    ev && !isToday && "bg-gold-soft/50"
                  )}
                >
                  <span className={cn("text-xs font-semibold", isToday ? "text-primary" : "text-secondary/70")}>{day}</span>
                  {ev && (
                    <div className="mt-auto text-left">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                        <ShoppingBag size={10} /> {ev.pickups}
                      </span>
                      <span className="hidden sm:block text-[9px] text-secondary/50">{euro(ev.revenue)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-[11px] text-secondary/55">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary/20 ring-1 ring-primary" /> Oggi</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gold-soft ring-1 ring-secondary/15" /> Giornata con ritiri</span>
          </div>
        </Card>

        {/* Upcoming events */}
        <Card title="Prossimi eventi" subtitle="Appuntamenti in agenda">
          <ul className="space-y-3">
            {events.map((e) => (
              <li key={e.date} className="flex gap-3 rounded-xl bg-gold-soft/50 p-3">
                <div className="grid place-items-center h-11 w-11 shrink-0 rounded-lg bg-secondary text-cream">
                  <span className="text-sm font-semibold leading-none">{Number(e.date.slice(8, 10))}</span>
                  <span className="text-[9px] uppercase">giu</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-secondary leading-snug">{e.note}</p>
                  <p className="text-xs text-secondary/55 mt-0.5 inline-flex items-center gap-1">
                    <ShoppingBag size={12} /> {e.pickups} pickup · {euro(e.revenue)}
                  </p>
                </div>
              </li>
            ))}
            <li className="flex items-center gap-2 text-sm text-secondary/55 pt-1">
              <CalendarDays size={16} /> Nessun altro evento programmato.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
