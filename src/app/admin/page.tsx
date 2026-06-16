import Link from "next/link";
import {
  Banknote, ShoppingBag, Receipt, Boxes, TrendingUp, AlertTriangle, ArrowRight,
} from "lucide-react";
import {
  KPIS, REVENUE_MONTHLY, CHANNEL_SPLIT, TOP_FLAVORS, ORDERS,
  INVENTORY_WITH_STATUS, euro,
} from "@/lib/admin-data";
import { Card, KpiCard, BarChart, BarList, Donut, StatusBadge } from "@/components/admin/ui";

export default function AdminDashboard() {
  const recent = ORDERS.slice(0, 6);
  const lowStock = INVENTORY_WITH_STATUS.filter((i) => i.status !== "Disponibile");

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Fatturato oggi" value={euro(KPIS.fatturatoOggi)} sub="vs ieri" trend="+8%" icon={<Banknote size={18} />} />
        <KpiCard label="Ordini oggi" value={String(KPIS.ordiniOggi)} sub={`${KPIS.pickupOggi} via pickup`} icon={<ShoppingBag size={18} />} accent="secondary" />
        <KpiCard label="Scontrino medio" value={euro(KPIS.scontrinoMedio)} sub="oggi" icon={<Receipt size={18} />} accent="green" />
        <KpiCard label="Merce sotto scorta" value={String(KPIS.lowStock)} sub="prodotti da riordinare" icon={<AlertTriangle size={18} />} accent="primary" />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Fatturato mensile" subtitle="Ultimi 10 mesi" className="lg:col-span-2"
          action={<span className="text-sm font-semibold text-secondary">{euro(KPIS.fatturatoMese)} · giugno</span>}>
          <BarChart data={REVENUE_MONTHLY.map((m) => ({ label: m.month, value: m.revenue }))} format={(v) => euro(v)} height={220} />
        </Card>
        <Card title="Canali di vendita" subtitle="Distribuzione del mese">
          <Donut data={CHANNEL_SPLIT} />
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
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top flavors */}
        <Card title="Gusti più venduti" subtitle="Coni serviti questo mese">
          <BarList data={TOP_FLAVORS.map((f) => ({ label: f.name, value: f.scoops }))} format={(v) => `${v.toLocaleString("it-IT")}`} />
        </Card>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <Card title="Avvisi magazzino" subtitle="Prodotti da riordinare"
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
