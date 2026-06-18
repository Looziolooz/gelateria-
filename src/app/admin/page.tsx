"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Banknote, ShoppingBag, Receipt, Boxes, AlertTriangle, ArrowRight, CalendarCheck, IceCream,
} from "lucide-react";
import {
  computeKpis, computeBookingKpis, getOrders, getInventory, getBookings,
  getRevenueMonthly, getChannelSplit, getTopFlavors, scopeLabel, euro, type Booking,
} from "@/lib/admin-data";
import { loadStoredBookings, BOOKINGS_EVENT } from "@/lib/bookings-store";
import { useAdminScope } from "@/components/admin/AdminScope";
import { Card, KpiCard, BarChart, BarList, Donut, StatusBadge } from "@/components/admin/ui";

export default function AdminDashboard() {
  const { scope } = useAdminScope();
  const [live, setLive] = useState<Booking[]>([]);

  useEffect(() => {
    const sync = () => setLive(loadStoredBookings());
    sync();
    window.addEventListener(BOOKINGS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(BOOKINGS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const kpis = computeKpis(scope);
  const bookingKpis = computeBookingKpis(scope, live);
  const recent = getOrders(scope).slice(0, 6);
  const recentBookings = getBookings(scope, live).slice(0, 5);
  const lowStock = getInventory(scope).filter((i) => i.status !== "Disponibile");
  const revenueMonthly = getRevenueMonthly(scope);
  const channelSplit = getChannelSplit(scope);
  const topFlavors = getTopFlavors(scope);

  return (
    <div className="space-y-6">
      {/* scope banner */}
      <p className="text-sm text-secondary/60">
        Stai visualizzando: <span className="font-semibold text-secondary">{scopeLabel(scope)}</span>
        {scope === "all" && " — dati aggregati delle tre botteghe"}
      </p>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Fatturato oggi" value={euro(kpis.fatturatoOggi)} sub="vs ieri" trend="+8%" icon={<Banknote size={18} />} />
        <KpiCard label="Prenotazioni oggi" value={String(bookingKpis.oggi)} sub={`${bookingKpis.pronte} pronte`} icon={<CalendarCheck size={18} />} accent="secondary" />
        <KpiCard label="Ordini oggi" value={String(kpis.ordiniOggi)} sub={`${kpis.pickupOggi} via pickup`} icon={<ShoppingBag size={18} />} accent="secondary" />
        <KpiCard label="Scontrino medio" value={euro(kpis.scontrinoMedio)} sub="oggi" icon={<Receipt size={18} />} accent="green" />
        <KpiCard label="Merce sotto scorta" value={String(kpis.lowStock)} sub="da riordinare" icon={<AlertTriangle size={18} />} accent="primary" />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Fatturato mensile" subtitle={`Ultimi 10 mesi · ${scopeLabel(scope)}`} className="lg:col-span-2"
          action={<span className="text-sm font-semibold text-secondary">{euro(kpis.fatturatoMese)} · giugno</span>}>
          <BarChart data={revenueMonthly.map((m) => ({ label: m.month, value: m.revenue }))} format={(v) => euro(v)} height={220} />
        </Card>
        <Card title="Canali di vendita" subtitle="Distribuzione del mese">
          <Donut data={channelSplit} />
        </Card>
      </div>

      {/* Lists row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <Card title="Ordini recenti" className="lg:col-span-2"
          action={<Link href="/admin/ordini" className="text-sm font-semibold text-primary inline-flex items-center gap-1">Tutti <ArrowRight size={14} /></Link>}>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-b border-secondary/5 last:border-0">
                    <td className="py-2.5 pr-3 font-semibold text-secondary whitespace-nowrap">{o.id}</td>
                    <td className="py-2.5 pr-3 text-secondary">{o.customer}</td>
                    <td className="py-2.5 pr-3 text-secondary/60 hidden sm:table-cell whitespace-nowrap">{o.boutiqueLabel}</td>
                    <td className="py-2.5 pr-3 text-right font-semibold text-secondary whitespace-nowrap">{euro(o.total)}</td>
                    <td className="py-2.5 text-right"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr><td className="py-6 text-center text-secondary/50">Nessun ordine per questa bottega.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top flavors */}
        <Card title="Gusti più venduti" subtitle="Coni serviti questo mese">
          <BarList data={topFlavors.map((f) => ({ label: f.name, value: f.scoops }))} format={(v) => `${v.toLocaleString("it-IT")}`} />
        </Card>
      </div>

      {/* Recent pickup bookings */}
      <Card title="Prenotazioni pickup recenti" subtitle="Ritiri prenotati dal sito"
        action={<Link href="/admin/prenotazioni" className="text-sm font-semibold text-primary inline-flex items-center gap-1">Tutte <ArrowRight size={14} /></Link>}>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-secondary/5 last:border-0">
                  <td className="py-2.5 pr-3 font-semibold text-secondary whitespace-nowrap">{b.id}</td>
                  <td className="py-2.5 pr-3 text-secondary">{b.customer}</td>
                  <td className="py-2.5 pr-3 hidden sm:table-cell whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-secondary/70"><IceCream size={14} className="text-primary" /> {b.format}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-secondary/60 hidden lg:table-cell whitespace-nowrap">{b.boutiqueLabel}</td>
                  <td className="py-2.5 pr-3 text-secondary/60 whitespace-nowrap">{b.date.slice(8)}/{b.date.slice(5, 7)} · {b.time}</td>
                  <td className="py-2.5 text-right"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr><td className="py-6 text-center text-secondary/50">Nessuna prenotazione per questa bottega.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <Card title="Avvisi magazzino" subtitle={`Prodotti da riordinare · ${scopeLabel(scope)}`}
          action={<Link href="/admin/merce" className="text-sm font-semibold text-primary inline-flex items-center gap-1">Magazzino <ArrowRight size={14} /></Link>}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((i) => (
              <li key={i.id} className="flex items-center gap-3 rounded-xl bg-gold-soft/60 px-4 py-3">
                <Boxes size={18} className="text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-secondary truncate">{i.name}</p>
                  <p className="text-xs text-secondary/55">{i.stockKg.toFixed(1)} / {i.parKg} kg</p>
                </div>
                <StatusBadge status={i.status} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
